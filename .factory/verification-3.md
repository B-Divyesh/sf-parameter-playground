# Independent verification — FAIL

Verified 2026-08-28 against candidate commit `70da583734f6ad38748918285ba23bb606c80d36` and [https://parameter-playground.sociobot.in](https://parameter-playground.sociobot.in).

## Verdict

**FAIL.** The previously reported CSV-download defect is fixed and the deployed files are this candidate, but this release fails the required factory acceptance contract before ordinary product QA: it has neither `.factory/claims.json` nor the required one-click isolated sample-data demo. The live first screen also does not say who the product is for in plain words.

## Release-blocking findings

### Blocker — no claims manifest or executable claim tests

`.factory/claims.json` does not exist in the clean candidate. Therefore there were no declared test commands to run before QA, which is itself an automatic release block under the claims contract.

The landing page and README nevertheless make testable claims, including “works offline after first visit,” “no account,” CSV export, local-first storage, no analytics/tracking/third-party runtime requests, and free use. None is listed and tested through a demo entry point as required.

### Blocker — no isolated “Try it with sample data” demo

The cold live first screen displays **Open the workbench**, not the required visible **Try it with sample data** action. It has no persistent “Demo — sample data, nothing is saved” banner, Reset demo, or Start for real action.

Both `/demo` and `/?demo=1` return the normal 12,345-byte app shell. They contain no demo markers. In a fresh context, changing Clustering at `?demo=1` creates the ordinary `parameter-playground-draft` local-storage key, proving it is not an isolated `demo:` namespace. `.factory/demo.md` is absent.

### Blocker — first-read requirement fails

Cold-page evidence: headline **“Change one thing. See what follows.”** and lede **“Build a deterministic model lesson…”** communicate a rough purpose, and **Open the workbench** says what to click. They do not say that it is for teachers and self-learners (or any audience) in plain words. Coupled with the missing one-click sample demo, this is a mandatory FAIL.

## Other defects

### Medium — some 390px touch targets are below 44 CSS px

At the required 390×844 mobile viewport, each exact-number input is 80×42 px; footer Privacy, Terms, and Source links have 26 px heights. The contract requires 44×44 px touch targets. (Hidden navigation/dialog elements were excluded from this finding.)

### Low — required site metadata and a real 404 page are absent

`index.html` lacks canonical, Open Graph, Twitter card, and apple-touch-icon metadata. `/this-route-does-not-exist` returns HTTP 200 and renders the normal landing page rather than a designed 404. `.factory/copy-audit.md` is also absent.

## Fresh test evidence

| Check | Result |
| --- | --- |
| Clean install | `npm ci` PASS; 0 audit vulnerabilities |
| Unit/release-policy suite | `npm test` PASS — 7/7 |
| Exact production build | `npm run build` PASS — `tsc --noEmit && vite build`; `dist/` produced |
| Browser suite | `npm run test:e2e` PASS — 18/18 desktop and 390px Playwright tests |
| Aggregate command | `npm run check` completed its unit/build/browser gates successfully |
| Independent live axe | PASS — 0 serious/critical violations |
| Lighthouse mobile (live) | Performance 96; Accessibility 100; LCP 1,811 ms; CLS 0; TBT 219 ms |

Independent live functional coverage passed for the normal teaching loop; blank prediction and explanation recovery; city maximum (16 displayed rows); blank exact-number recovery; projectile angle maximum (80°); share validation, copy/reload round trip, and damaged-link recovery. The fixed CSV flow produced `projectile-seed-41723.csv` with the displayed header and 17 data rows (18 lines total).

Keyboard-only smoke testing reached the skip link first with a designed `solid 3px` focus outline and `3px` offset. At 390px there was 0 page-level horizontal overflow; with reduced motion, the route transition was `0.00001s`.

The versioned service worker controlled a mobile page after reload; `registration.update()` completed; an offline reload displayed `Offline — saved shell ready` and rendered all six parameter inputs.

## Deployment, privacy, and policies

The live HTML, hashed JS, hashed CSS, `sw.js`, Privacy page, and Terms page SHA-256 values all exactly match the fresh `dist/` built from `70da583`. The prior deployment-only concern is therefore resolved.

Fresh browser request capture during the full live interaction found zero cross-origin runtime requests and zero console/page errors. The product uses the documented `parameter-playground-draft` local-storage key; there is no account, backend/API endpoint, payment flow, or sign-in. Rate-limit, package-consumer, persistence-concurrency, health endpoint, and Entra checks are not applicable.

Live responses send HSTS, CSP, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a disabled camera/microphone/geolocation Permissions-Policy. Hashed assets use `Cache-Control: public, max-age=31536000, immutable`; documents and service worker use `max-age=30` revalidation. Built sizes: JS 20,035 B, CSS 18,481 B, self-hosted fonts 109,604 B, mobile hero 55,878 B, desktop hero 149,478 B.

## Required remediation before a new candidate

1. Add `.factory/claims.json` covering every visitor-facing claim and a unique tagged observable test for each, runnable from the demo entry point.
2. Add `/demo` or `?demo=1` with a first-screen **Try it with sample data** action, persistent demo banner, reset/start-real actions, documented `.factory/demo.md`, and an isolated `demo:` storage namespace that never reads/writes real data.
3. Rewrite the first screen to name teachers and self-learners and the result in plain words.
4. Make all actual mobile controls/links at least 44×44 px; then complete the metadata, 404, and copy-audit requirements.
