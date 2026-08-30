# Parameter Playground — repair 5 handoff

- Result: **PASS — all findings in `.factory/verification-4.md` repaired**
- Repaired candidate: `64e9e3bea3c0cbdae096be89092e6efe1173f212`
- Verification report commit: `4d04664cd970193039048e619d2d8c8fd236cb0f`
- Repair commit: `658f666f91fa6741245da775d2c6c0453b8ee39b`
- Live URL: <https://parameter-playground.sociobot.in/>
- Deployment ID: `1baa939a-1657-4ccb-a35a-05ed8fbe8733`
- Verified: 2026-08-30

## What changed

1. Added the exact visitor statement “Arrow keys work on every slider” to `.factory/claims.json`. Its unique `@claim:slider-arrow-keys` regression opens all three models and changes all 10 current sliders with an arrow key.
2. Centralized parameter normalization and contextual bounds. Starting city now has a maximum equal to the current city count on first render, demo reset, template load, saved-draft restore, and shared-link restore. Fractional and out-of-range values are normalized before calculation, so the inputs, output, metric, narration, stored state, and model always agree.
3. Exact-value recovery now leaves a visible polite status explaining the accepted range or step and the replacement value. Reducing the city count also announces an automatic starting-city change.
4. Replaced the model-count hero fact with the privacy fact “Drafts are stored in this browser.” The fact remains visible in the first 1440×900 and 390×844 viewports and is covered by the existing local-draft claim.
5. Updated the copy audit and added unit and browser regressions for all repaired paths.

## Exact regression evidence

- A 9-city demo now renders `max="9"` on both Starting city controls. Entering `16` displays and calculates `9`, reports Start `I`, and announces: “Starting city accepts 1 to 9. 16 was changed to 9.”
- Entering `2.5` for Starting city displays and calculates `3`, reports Start `C`, and explains the step correction.
- Reducing Cities from 9 to 5 while the start is 9 changes the start to 5, reports Start `E`, and announces why.
- A crafted shared lesson with 7 cities and start 16 restores as start 7, reports Start `G`, and displays a correction notice.
- Demo reset restores 9 cities/start 2; switching away and back restores 9 cities/start 1.
- Entering Cities `99` produces `16` plus “Cities accepts 5 to 16. 99 was changed to 16.” Entering Gravity `999` produces `20 m/s²` with the matching message.
- The Arrow-key claim test changed every rendered slider across nearest-neighbor tour, logistic growth, and projectile motion: 10/10 on desktop and 10/10 at 390px.

## Clean local verification

Run from the repository root:

```sh
npm ci
npm test
npx tsc --noEmit
npm run build
npm run test:claims
npm run test:e2e
```

Results:

- Clean install: 61 packages, 0 audit vulnerabilities.
- Unit and release-policy suite: 12/12 passed.
- Type check: passed. The inherited project has no separate lint configuration; `tsc --noEmit`, release-policy tests, and `git diff --check` passed.
- Claim suite: 24/24 passed, covering all 12 manifest claims in desktop Chromium and the 390×844 mobile project.
- Full browser suite: 60/60 passed across desktop and mobile. This includes the complete learner flow, all boundaries above, keyboard use, 44px targets, axe, demo isolation, sharing, CSV bytes, privacy requests, service-worker cache, offline reload, routes, metadata, and 404 behavior.
- Visual inspection: 1440×900 and 390×844 passed with 0px page overflow. The mobile correction state remains readable and keeps its visible focus outline.
- Keyboard smoke test: first Tab reaches the skip link; activating it makes the next Tab reach “Try it with sample data.” Every slider responds to arrow keys.
- 200% page scale: headline and sample action remain visible with 0px horizontal overflow.
- Reduced motion: the live simulation transition resolves to `0.00001s`.
- Copy audit: 0 flagged lines.

## Build and performance

- `dist/` contains `index.html` at its root.
- Initial JS: 23,364 B; CSS: 20,663 B; fonts: 109,604 B; mobile hero: 55,878 B. All static-product budgets pass.
- Live mobile Lighthouse 13.0.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9s, LCP 1.7s, TBT 0ms, CLS 0, interactive 1.8s, total transfer 182 KiB.

## Deployment and live verification

- The work-order command `npm ci && npm test && npm run build` passed immediately before deployment.
- `/opt/fleet/lib/deploy-static.sh parameter-playground /work/repo/dist` deployed successfully to the existing Azure Static Web App in `eastus2`; the custom domain returned HTTPS 200.
- `/opt/fleet/lib/verify-url.sh` passed: load 764ms, no console errors, title and `lang=en` present, one `<h1>`, one `<main>`, 0 missing image alternatives, and 0 unnamed buttons.
- 17/17 public build files matched the live deployment byte-for-byte. Key SHA-256 values: `index.html` `0b73be1b9a26…`; JS `25c4903c6248…`; CSS `36ab8c9a1adf…`; `sw.js` `313f992594c9…`.
- Live boundary checks reproduced the corrected start value, metric, and status. All 10 sliders changed by keyboard.
- Live axe checks found 0 serious/critical issues on the demo, Privacy, Terms, direct 404 page, and an unknown route. The unknown route returned HTTP 404.
- A live multi-route flow issued 28 same-origin GET requests and no cross-origin or non-GET requests. Root/demo loads produced no uncaused console or page errors.
- The service worker updated with no waiting worker. Cache `parameter-playground-221352d3fd0a` became active, and a fresh 390px context reloaded the demo offline with the banner, status, and all six route controls.
- Root and `sw.js` use `public, must-revalidate, max-age=30`; hashed JS/CSS use one-year immutable caching. Conditional requests returned 304.
- Live responses include HSTS, restrictive CSP with header-only `frame-ancestors 'none'`, `nosniff`, strict-origin referrer policy, and disabled camera, microphone, and geolocation permissions.

## Scope and remaining gaps

No release-blocking gaps remain. This remains the original static, free, local-first PWA. It has no package consumer surface, backend, account, payment, runtime AI, unlock endpoint, or external API, so package-consumer, server concurrency/429, billing, AI gateway, and identity-authority checks do not apply.
