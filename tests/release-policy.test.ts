import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

interface StaticWebAppConfig {
  routes: { route: string; headers?: Record<string, string> }[];
  navigationFallback: { exclude: string[] };
  globalHeaders: Record<string, string>;
}

function readConfig(): StaticWebAppConfig {
  return JSON.parse(readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as StaticWebAppConfig;
}

describe('static release policy', () => {
  it('gives hashed production assets a long-lived immutable cache policy', () => {
    const config = readConfig();
    const assets = config.routes.find((route) => route.route === '/assets/*');
    expect(assets?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(config.navigationFallback.exclude).toContain('/assets/*');
  });

  it('ships a restrictive CSP that permits only the hashed connection bootstrap', () => {
    const config = readConfig();
    const document = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    const inlineScripts = [...document.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]!);
    expect(inlineScripts).toHaveLength(1);
    const bootstrapHash = `sha256-${createHash('sha256').update(inlineScripts[0]!).digest('base64')}`;
    const csp = config.globalHeaders['Content-Security-Policy'];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain(`script-src 'self' '${bootstrapHash}'`);
    expect(csp).not.toContain("'unsafe-inline'");
    expect(csp).not.toContain("'unsafe-eval'");
  });
});
