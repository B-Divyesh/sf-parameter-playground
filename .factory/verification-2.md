# Independent verification — FAIL

Verified 2026-08-28 against candidate commit `20a9e97670288bcb40b477390bd3f5134765fa3b` and <https://parameter-playground.sociobot.in>.

## Verdict

**FAIL.** The deployed site is the specified candidate and the core teaching flow is sound, but the user-visible **Export CSV** action does not deliver a CSV file. It instead shows a false success message. This is a medium-severity functional defect in a documented inspection/export capability, so the candidate does not meet the end-to-end quality bar.

## Environment and release identity

- Clean checkout was already exactly `20a9e97670288bcb40b477390bd3f5134765fa3b`; it was clean before verification.
- Node `v22.23.2`, npm `10.9.8`; clean dependency install: `npm ci`, 0 audit vulnerabilities.
- Exact release command `npm run build` passed and produced `dist/`.
- Live-versus-built SHA-256 comparisons matched for `index.html`, `assets/main-BqQRPIBG.js`, `assets/style-Ef9YcjUI.css`, `sw.js`, `privacy/index.html`, and `terms/index.html`. The previous deployment-lag report is no longer current.

## Automated gates

| Check | Result |
| --- | --- |
| `npm test` | PASS — 6/6 Vitest model and release-policy tests |
| Type check and exact production build | PASS — `tsc --noEmit && vite build` |
| `npm run test:e2e` | PASS — 16/16 Playwright tests, desktop and 390px mobile |
| Aggregate `npm run check` | PASS |
| Independent axe scan of live workbench | PASS — 0 total violations; 0 serious/critical |
| Factory `verify-url.sh` (local preview and live URL) | PASS — HTTP 200, title, `lang=en`, one `h1`, `main`, image alt text, labelled buttons, and 0 console/page errors |

Lighthouse could not be collected in this container: Lighthouse crashed its tab using the supplied Chromium even with `--no-sandbox`/`--disable-dev-shm-usage`. This is an environment/tooling limitation, not a product result. The relevant static budgets and browser smoke checks below passed.

## Independent functional coverage

On the live deployment, Chrome desktop coverage passed for the full predict → vary → inspect → explain flow; the tour's 5- and 16-city bounds (matching table row counts); blank exact-number recovery (previous value kept plus polite inline error); logistic rate maximum; all projectile control minima/maxima; damaged-link recovery; and both clipboard sharing round trip and denied-clipboard dialog fallback.

At 390×844, page overflow was `0px`; `prefers-reduced-motion: reduce` reduced UI transition duration to `0.00001s`; and a fully cached offline reload showed `Offline — saved shell ready` with all six parameter inputs available. The active release cache was `parameter-playground-2ed801acecbe`; `registration.update()` completed and the shell, HTML, JS, and CSS all had cache matches. The source's versioned cache, `skipWaiting`, and stale-cache deletion provide the corresponding update behavior.

Keyboard-only smoke coverage reached the skip link first and found its designed `solid 3px` focus outline. The live browser run recorded no console/page errors. No HTTP(S) request left `parameter-playground.sociobot.in`: requests were only the document, self-hosted fonts, hashed JS/CSS, and same-origin WebP image.

## Defects

### Medium — Export CSV is non-functional and falsely confirms success

Reproduction on the live candidate:

1. Open the workbench and choose **Projectile motion** (or keep any template).
2. Click **Export CSV**.
3. Wait for the browser download event.

Expected: a file such as `projectile-seed-41723.csv` downloads with the displayed table values.

Actual: no download begins within Playwright's 30-second download-event timeout, while the interface announces `CSV exported with the values currently shown.`

Evidence: the application clicks a detached object-URL anchor and immediately revokes its URL in `src/app.ts`'s `exportCsv`; live Chromium reproduced this reliably. This was independent of the repository suite, which does not test CSV download.

Suggested repair: retain the object URL through the download initiation (and add an end-to-end download assertion), then only announce success once the download has been started.

### Low — no Content-Security-Policy response header

The live home, asset, service-worker, privacy, and terms responses do send HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`. They do not send a `Content-Security-Policy` header. No injection was observed and dynamic lesson text is inserted with `textContent`, but a restrictive static-site CSP would provide defense in depth.

## Privacy, security, and policies

- No accounts or backend/API endpoints exist; rate limiting and Entra tenant checks are therefore not applicable.
- Static source and live request inspection found no analytics, trackers, third-party runtime scripts, fonts, or APIs. The only persistent product data is the documented `parameter-playground-draft` local-storage key; share payloads are URL-encoded and the privacy page warns against personal data.
- Live assets have `Cache-Control: public, max-age=31536000, immutable`; documents and `sw.js` have short revalidation caching (`max-age=30`).
- Bundle budgets pass: initial JS 19,960 B (<200 KB), CSS 18,481 B (<50 KB), self-hosted fonts 109,604 B (<120 KB), and mobile hero WebP 55,878 B (<300 KB). The desktop hero is 149,478 B.

## Scope notes

This is a static-web/PWA, not a library, CLI, backend, or sign-in product. No package-consumer, API burst/rate-limit, persistence-concurrency, health endpoint, or identity-provider test applies.

