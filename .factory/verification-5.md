# Independent verification 5 — FAIL

Verified 2026-08-30 against candidate `26d44c20cc4ce053aa5c8c0cc225d0dad84e970e` and <https://parameter-playground.sociobot.in/>.

## Verdict

**FAIL.** The live deployment exactly matches this candidate, the mandatory first-read passes, all 12 declared claim commands pass, and the earlier deployment-only concern is not present. Release is blocked by a newly reproduced high-severity mismatch between the seed shown to the user and the seed actually calculated, stored, and shared.

## Release-blocking finding

### High — a fractional seed displays one value while the model uses another

Fresh reproduction on desktop and 390 px mobile:

1. Open `/?demo=1#workbench`.
2. Enter `2.5` in **Deterministic seed** and leave the field.
3. Observe the seed field, model label, recalculated output, stored draft, and a copied lesson link.

Actual result:

- The input continues to display `2.5` and remains invalid with `stepMismatch=true`.
- No application status or error explains a correction.
- The model label changes to `Seed: 3`, and the route recalculates from seed `3`.
- The demo draft stores seed `3`.
- **Copy lesson link** encodes seed `3`; opening it changes the field to `3` while claiming every value is encoded in the link.

This violates the researched brief's deterministic-seed requirement and the product's statement, **“Same seed + parameters = same result.”** The editable value, displayed model state, persisted value, and shared value must agree. It is the same honesty class as the previously repaired contextual starting-city mismatch.

Expected result: reject `2.5` and retain the prior integer with an announced error, or normalize it to `3`, update the input to `3`, and announce the correction before calculating, storing, or sharing.

Evidence: [desktop screenshot](verification-artifacts/seed-mismatch-desktop.png) and [390 px screenshot](verification-artifacts/seed-mismatch-mobile.png).

## Mandatory first-read

**PASS.** A cold 1440×900 context with no stored state answers all three required questions in its first screen:

- What it does: **“Test how one parameter changes a model.”**
- For whom: **“For teachers and self-learners…”**
- What to click: **“Try it with sample data.”** The adjacent line says the sample opens as a complete route lesson.

One click opens `/?demo=1#workbench`, changes the title to **Demo — Parameter Playground**, places the populated workbench in view, and shows the sticky **Demo — sample data, nothing is saved** banner with **Reset demo** and **Start for real**.

Evidence: [cold desktop](verification-artifacts/first-read-desktop.png) and [mobile first screen](verification-artifacts/live-mobile-first-screen.png).

## Declared claims — 12/12 commands passed

After the lockfile install, every `test` entry from `.factory/claims.json` was run separately. Each command ran once in desktop Chromium and once in the 390 px mobile project: 24 passed, 0 failed.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS, 2/2 | Demo edit/reset/exit removed only the `demo:` key and preserved a regular sentinel draft |
| `three-bounded-models` | PASS, 2/2 | All three templates exposed controls, bounds, assumptions, and output rows |
| `slider-arrow-keys` | PASS, 2/2 | Arrow keys changed all 10 sliders across the three models |
| `deterministic-seed` | PASS, 2/2 | Restoring tested integer seed `12345` restored every table cell; the fractional-seed gap above is outside this test |
| `lesson-editing` | PASS, 2/2 | Title, learner prompt, and chart alternative updated |
| `shareable-preset` | PASS, 2/2 | Copied URL restored the tested title and parameter |
| `csv-export` | PASS, 2/2 | Filename and downloaded bytes matched every displayed heading and row |
| `local-draft` | PASS, 2/2 | The regular namespaced draft survived reload |
| `no-account-payment` | PASS, 2/2 | Learner loop and every model worked without gates |
| `same-origin-privacy` | PASS, 2/2 | Full demo flow issued only same-origin static GETs |
| `offline-reload` | PASS, 2/2 | A dedicated context reloaded the cached demo offline |
| `accessible-inspection` | PASS, 2/2 | Every model exposed narration and table semantics with no serious/critical axe findings |

The exact command for each row was `npm run test:claims -- --grep @claim:<id>`. Manifest/test uniqueness is also enforced by the release-policy suite. A landing-page and README cross-check found no other unlisted visitor-facing product claim.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — clean checkout started at `26d44c20cc4ce053aa5c8c0cc225d0dad84e970e` |
| Install | `npm ci` PASS — 61 packages, 0 audit vulnerabilities |
| Unit/release policy | `npm test` PASS — 12/12 |
| Type check | `npx tsc --noEmit` PASS |
| Exact production build | `npm run build` PASS — `dist/` produced |
| Full browser suite | `npm run test:e2e` PASS — 60/60 across desktop and mobile |
| Aggregate gate | `npm run check` PASS — unit, build, and 60 browser tests reran successfully |
| Lint | No lint script or lint configuration exists in this candidate |

## Independent functional coverage

Apart from the seed defect, the smallest useful product worked end to end on the live deployment:

- Prediction and explanation empty states focused the missing field and recovered after valid text.
- The full predict → vary → inspect → explain loop completed without an account or payment.
- Tour boundaries and repair regressions passed: start `16` with nine cities became displayed/calculated `9` with an announced correction; `2.5` became `3`; reducing cities to five kept the start at five; blank Cities retained its previous value; Cities `99` became `16` with an explanation.
- Logistic maxima `100`, `0.8`, `1000`, and `30` produced 31 finite rows and narration.
- Projectile boundaries `80°`, `40 m/s`, and `1 m/s²` produced 17 rows. The downloaded CSV filename and bytes exactly matched the visible table.
- Missing lesson description blocked sharing and focused the field. Clipboard success restored the edited lesson in a clean page. Injected clipboard denial opened the fallback dialog, focused its URL, and Escape closed it.
- A damaged lesson URL recovered to the safe starter with a visible notice.
- Demo reset and **Start for real** removed demo storage without reading or changing a regular-draft sentinel.

## Accessibility, responsive behavior, and motion

- Independent axe scans found **0 violations of any impact** on the live demo, Privacy, Terms, direct 404, and an unknown 404 route.
- Each route had `lang=en`, one `h1`, one `main`, complete image alternatives, and no unnamed buttons. Heading outlines did not skip levels.
- The factory `verify-url.sh` passed: HTTP 200, 777 ms load, title, language, one `h1`, main landmark, 0 missing image alternatives, 0 unnamed buttons, and 0 console/page errors.
- First Tab reached **Skip to playground** with a visible `3px` accent outline and `3px` offset. Activating it bypassed navigation; all 10 current sliders changed with ArrowRight.
- At 390×844 there was 0 px page overflow and no visible target below 44×44 CSS px. At 200% root text size there was still 0 px overflow.
- Reduced-motion emulation set relevant transitions to `0.00001s` and scroll behavior to `auto`.
- Normal home, demo, legal, and direct-404 loads emitted no console or page errors. Navigating to an intentionally missing URL produced only Chromium's expected failed-document 404 message while rendering the designed 404 at HTTP 404.

Evidence: [full mobile demo](verification-artifacts/live-mobile-demo.png) and [factory verifier output](verification-artifacts/verify-url/verify.json).

## Privacy, network, headers, and PWA

- A full live demo flow made six requests: document, two self-hosted fonts, hashed JS, hashed CSS, and the local hero image. All were same-origin GETs; there were 0 cross-origin requests, 0 non-GET requests, and 0 runtime errors.
- No analytics, ads, tracking, external runtime script/font, account, payment, AI call, product-unlock call, or server API was observed. Demo reset left local storage empty in the clean context.
- Root responses send HSTS, restrictive CSP with header-only `frame-ancestors 'none'`, `nosniff`, `strict-origin-when-cross-origin`, and disabled camera, microphone, and geolocation permissions.
- HTML and `sw.js` use `public, must-revalidate, max-age=30`. Hashed JS/CSS use `public, max-age=31536000, immutable`. Conditional root and JS requests returned 304.
- Service-worker update completed with an activated controller, no waiting/installing worker, and one versioned cache: `parameter-playground-221352d3fd0a`. Cached JS and CSS had nonzero bytes.
- A fresh 390 px context reloaded offline with **Offline — saved shell ready**, the demo banner, the headline, and all six route inputs.

This is a static, local-first product with no server-side endpoint or unlock call. API allowance/429, backend health/concurrency/persistence, package-consumer, and Microsoft Entra authority checks are not applicable.

## Deployment identity, routes, and performance

- **17/17 public files** from the fresh `dist/` matched production byte-for-byte, including all HTML routes, service worker, fonts, images, JS, and CSS. Key SHA-256 values: `index.html` `0b73be1b9a26…`; JS `25c4903c6248…`; CSS `36ab8c9a1adf…`; `sw.js` `313f992594c9…`.
- Home, demo, Privacy, Terms, direct 404, and the external source link returned 200. An unknown route returned the designed page with HTTP 404. Titles, metadata, canonical links, social image, favicon, robots, and sitemap passed repository policy checks.
- Built sizes: JS 23,364 B raw / 8.76 kB gzip; CSS 20,663 B raw / 5.46 kB gzip; fonts 109,604 B; mobile hero 55,878 B; desktop hero 149,478 B. All component budgets pass.
- Fresh live mobile Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.2 s, LCP 1.7 s, TBT 0 ms, CLS 0, interactive 1.7 s, total transfer 182 KiB.

Evidence: [Lighthouse JSON](verification-artifacts/lighthouse-live.json).

## Required remediation

Make the seed field and model state atomic: accept only integers from 1 to 999999, and either reject fractional input while retaining the prior value or visibly normalize the field and announce the new value. Add desktop and mobile regressions that assert the seed input, drawing label, displayed values, local draft, and copied/restored link all use the same seed.
