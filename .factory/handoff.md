# Parameter Playground — repair 4 handoff

- Work order: `parameter-playground-repair-4`
- Verifier report: commit `7ec7fbceb9c82f36eb562926e3704f1dfd59940a`
- Failed candidate: `70da583734f6ad38748918285ba23bb606c80d36`
- Completed locally: 2026-08-30

## What was repaired

- Added the required `.factory/claims.json` with 11 visitor-facing claims. Each claim has one unique `@claim:<id>` Playwright regression that starts from the sample demo.
- Added the one-click `/?demo=1#workbench` sandbox. It loads a complete route lesson, uses only `demo:parameter-playground-draft`, never reads or writes the regular draft, and provides **Reset demo** and **Start for real**.
- Rewrote the first screen to name teachers and self-learners, state the job in seven words, expose the required sample action, and show three tested facts.
- Raised all visible 390px interactive targets to at least 44×44 CSS pixels. The regression checks every visible link, button, input, textarea, select, and summary.
- Added canonical, Open Graph, Twitter, apple-touch, and route-specific title metadata. The original product art now supplies a 1200×630 social image and 180×180 touch icon.
- Removed the catch-all navigation fallback that turned unknown URLs into the home page. Azure Static Web Apps now rewrites genuine 404 responses to the designed `/404.html`; local preview mirrors the 404 status.
- Added `.factory/demo.md` and `.factory/copy-audit.md`. The rendered copy has no sentence over 22 words and no banned marketing term.
- Corrected the hero image's responsive height. This keeps all three required facts in the first desktop and 390px viewport.
- Made demo deep links position the populated workbench below the persistent demo banner after fonts and layout settle.

All previously passing behavior remains covered: three deterministic models, numeric recovery, prediction and explanation, lesson sharing, clipboard fallback, CSV bytes, keyboard sliders, local drafts, corrupt-link recovery, CSP, immutable hashed assets, and offline reload/update behavior.

## Exact regression coverage

- `tests/e2e/claims.spec.ts`: demo isolation, three bounded models, deterministic seed, lesson editing, shared presets, CSV bytes, regular local drafts, no-account/payment flow, same-origin privacy, dedicated-context offline reload, and accessible inspection.
- `tests/e2e/verifier-regressions.spec.ts`: first-read copy and CTA, direct-demo viewport, first-screen facts, 44px target geometry, true 404 response, keyboard navigation, and axe scans for legal/404 routes.
- `tests/release-policy.test.ts`: immutable assets, restrictive CSP, 404 response configuration, complete metadata/art sizes, one-to-one claims/tests, and required demo/copy documentation.
- Existing model and browser regressions remain unchanged except for opening the renamed real-work action and running CSV export from the demo entry point.

## Local verification evidence

- Clean install: `npm ci` passed on Node `v22.23.2` and npm `10.9.8`; audit reported 0 vulnerabilities.
- Full gate: `npm run check` passed — Vitest 11/11, TypeScript and Vite production build, Playwright 54/54 across desktop Chromium and 390×844 mobile.
- Factory URL verifier passed for `/` and `/?demo=1#workbench`: HTTP 200, route-specific title, `lang=en`, one `h1`, one `main`, 0 missing image alternatives, 0 unnamed buttons, and 0 console/page errors.
- Accessibility: Playwright axe found 0 serious/critical violations on home, demo, privacy, terms, and 404 pages. Keyboard tests cover the skip link and ArrowRight slider operation. Reduced motion, inline form errors, and dialog names remain covered.
- Responsive: no page-level horizontal overflow; every visible 390px target is at least 44×44 CSS pixels. Visual inspection covered home and populated demo at 1440×900 and 390×844.
- Privacy: the full demo flow made only same-origin static GET requests. Demo and regular local-storage namespaces were tested with a sentinel regular draft. No analytics, ads, trackers, runtime APIs, external fonts, or third-party scripts exist.
- Offline/update: a dedicated fresh context loaded the demo online, verified the active versioned cache, switched offline, reloaded the cached shell, showed `Offline — saved shell ready`, and rendered all six route controls.
- Response policy: local preview sends the restrictive CSP, `nosniff`, strict-origin referrer policy, disabled camera/microphone/geolocation policy, immutable one-year hashed-asset caching, and a genuine 404 status.
- Lighthouse mobile: 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; FCP 1.0s, LCP 1.8s, CLS 0, total blocking time 0ms.
- Production sizes: initial JS 21,720 B; CSS 20,663 B; fonts 109,604 B; mobile hero 55,878 B; desktop hero 149,478 B. All component budgets pass.
- `dist/index.html` exists at the required static deployment root. Package-consumer, backend API, rate-limit, payment-provider, persistence-concurrency, and identity-provider checks do not apply to this static, no-account product.

## Deployment

- Repair commit `6f96b01` was pushed to `origin/main`.
- The verified `dist/` was uploaded directly to the existing factory-managed Azure Static Web App `sf-parameter-playground` in resource group `sociobot`. DNS, billing, and infrastructure configuration were not changed.
- Azure deployment ID: `2edc4403-5bad-4e7c-9083-ffd0cc1d2120`; default host: `gray-stone-083258b0f.7.azurestaticapps.net`.
- Live `index.html`, `sw.js`, privacy, terms, 404, `main-hLRIQUZr.js`, and `style-CcRmUXZ3.css` match the local production build byte-for-byte by SHA-256.
- Live factory URL verification passed on home and demo with 0 console/page errors. The custom domain serves the restrictive response headers, immutable hashed-asset caching, and the designed 404 bytes with HTTP 404.
- A fresh live 390px browser verified the populated first demo viewport, isolated `demo:` storage, 0px overflow, no sub-44px target, 0 serious/critical axe findings, no cross-origin request, no product-page console error, a real projectile CSV download, and keyboard slider operation.
- A separate fresh live context updated the active service worker with no waiting worker, then reloaded offline with the demo banner and all six controls. Active cache: `parameter-playground-8bb2fe24ebbd`.
- Live Lighthouse mobile: 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; FCP 1.0s, LCP 1.7s, CLS 0, total blocking time 0ms.

## Known gaps and next steps

No release-blocking or minor verifier finding remains locally. The researched success measure still requires classroom observation; it cannot be established by a software test.
