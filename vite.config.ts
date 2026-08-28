import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

function offlineShell(): Plugin {
  return {
    name: 'offline-shell-manifest',
    apply: 'build',
    generateBundle(_options, bundle) {
      const generated = Object.entries(bundle)
        .filter(([, output]) => output.type === 'asset' || (output.type === 'chunk' && output.name === 'main'))
        .map(([file]) => `/${file}`);
      const shell = [
        '/', '/index.html', '/privacy/', '/terms/', '/favicon.svg', '/robots.txt',
        '/fonts/AtkinsonHyperlegible-Regular.ttf', '/fonts/AtkinsonHyperlegible-Bold.ttf',
        '/assets/blueprint-workbench-960.webp', '/assets/blueprint-workbench-1536.webp',
        ...generated
      ];
      // A cache name derived from this release prevents a cache-first reload from
      // mixing an older HTML shell with this release's hashed entry modules.
      const cacheName = `parameter-playground-${createHash('sha256').update(JSON.stringify(shell)).digest('hex').slice(0, 12)}`;
      const template = readFileSync(resolve(__dirname, 'src/sw-template.js'), 'utf8');
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: template.replace('__CACHE__', cacheName).replace('__SHELL__', JSON.stringify([...new Set(shell)]))
      });
    }
  };
}

export default defineConfig({
  plugins: [offlineShell()],
  build: {
    target: 'es2022',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html')
      }
    }
  }
});
