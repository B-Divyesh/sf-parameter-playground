import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

interface StaticWebAppConfig {
  routes: { route: string; headers?: Record<string, string> }[];
  responseOverrides: Record<string, { rewrite: string }>;
  globalHeaders: Record<string, string>;
}

interface ClaimEntry {
  id: string;
  claim: string;
  where: string;
  test: string;
  sandbox: string;
}

function readConfig(): StaticWebAppConfig {
  return JSON.parse(readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as StaticWebAppConfig;
}

describe('static release policy', () => {
  it('gives hashed production assets a long-lived immutable cache policy', () => {
    const config = readConfig();
    const assets = config.routes.find((route) => route.route === '/assets/*');
    expect(assets?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
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

  it('uses the designed document for genuine 404 responses', () => {
    const config = readConfig();
    expect(config.responseOverrides['404']?.rewrite).toBe('/404.html');
    expect(readFileSync(new URL('../404.html', import.meta.url), 'utf8')).toContain('<h1 tabindex="-1">This page does not exist</h1>');
  });

  it('ships complete route metadata and correctly sized touch art', () => {
    const pages = ['../index.html', '../privacy/index.html', '../terms/index.html', '../404.html'];
    pages.forEach((path) => {
      const document = readFileSync(new URL(path, import.meta.url), 'utf8');
      expect(document).toContain('<html lang="en">');
      expect(document.match(/<h1(?:\s|>)/g)).toHaveLength(1);
      expect(document.match(/<main(?:\s|>)/g)).toHaveLength(1);
      expect(document).toMatch(/<title>[^<]+<\/title>/);
      expect(document).toContain('rel="canonical"');
      expect(document).toContain('property="og:title"');
      expect(document).toContain('name="twitter:card"');
      expect(document).toContain('rel="apple-touch-icon"');
    });
    const appleIcon = readFileSync(new URL('../public/apple-touch-icon.png', import.meta.url));
    expect(appleIcon.readUInt32BE(16)).toBe(180);
    expect(appleIcon.readUInt32BE(20)).toBe(180);
    expect(existsSync(new URL('../public/assets/social-preview.jpg', import.meta.url))).toBe(true);
  });

  it('lists every claim once with one executable tagged regression', () => {
    const claims = JSON.parse(readFileSync(new URL('../.factory/claims.json', import.meta.url), 'utf8')) as ClaimEntry[];
    expect(claims.length).toBeGreaterThan(0);
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);
    const claimTests = readFileSync(new URL('./e2e/claims.spec.ts', import.meta.url), 'utf8');
    claims.forEach(({ id, claim, where, test, sandbox }) => {
      expect(claim).not.toBe('');
      expect(where).not.toBe('');
      expect(sandbox).not.toBe('');
      expect(test).toBe(`npm run test:claims -- --grep @claim:${id}`);
      expect(claimTests.match(new RegExp(`@claim:${id}(?![a-z0-9-])`, 'g'))).toHaveLength(1);
    });
  });

  it('documents the demo sandbox and a clean plain-words copy audit', () => {
    const demo = readFileSync(new URL('../.factory/demo.md', import.meta.url), 'utf8');
    const audit = readFileSync(new URL('../.factory/copy-audit.md', import.meta.url), 'utf8');
    expect(demo).toContain('/?demo=1#workbench');
    expect(demo).toContain('demo:parameter-playground-draft');
    expect(audit).toContain('Flagged lines: 0');
  });

  it('keeps review-required labels concrete and removes public asset claims', () => {
    const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    const models = readFileSync(new URL('../src/models.ts', import.meta.url), 'utf8');
    const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
    expect(home).toContain('Generate new seed');
    expect(home).toContain('Close share dialog');
    expect(home).not.toContain('SHEET 01 / REV A');
    expect(home).not.toContain('generated for this project');
    expect(models).toContain('This rule is quick, but it may not find the shortest route.');
    expect(models).not.toContain('heuristic');
    expect(readme).toContain('spoken results, measurements, a table of values, and a CSV download');
    expect(readme).not.toContain('semantic data table');
    expect(readme).not.toContain('generated specifically for this project');
  });
});
