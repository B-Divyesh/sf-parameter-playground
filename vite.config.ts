import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const staticWebAppConfig = JSON.parse(readFileSync(resolve(__dirname, 'public/staticwebapp.config.json'), 'utf8')) as {
  globalHeaders: Record<string, string>;
};
function offlineShell(): Plugin {
  return {
    name: 'offline-shell-manifest',
    apply: 'build',
    generateBundle(_options, bundle) {
      const generated = Object.entries(bundle)
        .filter(([, output]) => output.type === 'asset' || (output.type === 'chunk' && output.name === 'main'))
        .map(([file]) => `/${file}`);
      const shell = [
        '/', '/index.html', '/privacy/', '/terms/', '/404.html', '/favicon.svg', '/robots.txt',
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

function previewNotFound(): Plugin {
  return {
    name: 'preview-designed-404',
    apply: 'serve',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.method !== 'GET' && request.method !== 'HEAD') return next();
        const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
        if (pathname.startsWith('/assets/')) response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        const knownDocument = ['/', '/index.html', '/privacy', '/privacy/', '/terms', '/terms/', '/404.html'].includes(pathname);
        const knownFile = pathname.includes('.') || pathname.startsWith('/assets/') || pathname.startsWith('/fonts/');
        if (knownDocument || knownFile) return next();
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(readFileSync(resolve(__dirname, 'dist/404.html')));
      });
    }
  };
}

export default defineConfig({
  plugins: [offlineShell(), previewNotFound()],
  preview: { headers: staticWebAppConfig.globalHeaders },
  build: {
    target: 'es2022',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notFound: resolve(__dirname, '404.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html')
      }
    }
  }
});
