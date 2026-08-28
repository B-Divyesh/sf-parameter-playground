import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('static release policy', () => {
  it('gives hashed production assets a long-lived immutable cache policy', () => {
    const config = JSON.parse(readFileSync(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')) as {
      routes: { route: string; headers?: Record<string, string> }[];
    };
    const assets = config.routes.find((route) => route.route === '/assets/*');
    expect(assets?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
  });
});
