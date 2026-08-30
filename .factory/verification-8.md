# Verification 8 — Parameter Playground

## Result: PASS

Verified candidate commit `7e77efc5d25bbab6c9341267a26ac9ef92d173de` at <https://parameter-playground.sociobot.in/> on 2026-08-30. The deployment is current: its document references `main-5KdcPbdQ.js`, `style-BHOwsWoV.css`, and `style-ZOr1aU46.js`, exactly matching a fresh `npm run build` from the candidate.

## Mandatory first checks

`.factory/claims.json` exists and declares 14 claims. After a fresh `npm ci`, I ran every declared command separately, using its specified `@claim:` selector and the demo entry point. All 14 commands passed, on both desktop and mobile (28 executions):

`demo-isolation`, `demo-populated-workbench`, `three-models-with-limits`, `slider-arrow-keys`, `deterministic-seed`, `lesson-editing`, `shareable-preset`, `csv-export`, `local-draft`, `no-account-payment`, `same-origin-privacy`, `offline-reload`, `accessible-inspection`, and `bounded-educational-scope`.

Cold first read also passed. On the first desktop screen, the h1 says “Test how one parameter changes a model”; the next sentence names teachers and self-learners; and the visible **Try it with sample data** action says that it opens a complete route lesson. The page plainly answers what it does, who it is for, and what to click first. It provides the required one-click isolated demo.

## Local quality gates

- `npm ci`: passed; 0 reported vulnerabilities.
- `npm test`: passed, 13/13 (model and release-policy tests).
- `npm run build`: passed. Output is `dist/`.
- `npm run test:e2e`: passed, 72/72, covering desktop and 390 px mobile.
- `git diff --check`: passed before report artifacts were added.

Fresh build sizes: main JS `24,528 B` raw / `9.01 kB` gzip; auxiliary JS `1,035 B` raw; CSS `21,304 B` raw / `5.59 kB` gzip; mobile hero `55,878 B`. These are within the 200 kB initial-JS, 50 kB CSS, and 300 kB mobile-hero budgets.

## Live end-to-end QA

`PLAYWRIGHT_BASE_URL=https://parameter-playground.sociobot.in npm run test:e2e` passed 72/72 in 2.3 minutes. It independently exercised the live normal learner loop; all three fixed models and assumptions/limits; all sliders with arrow keys; deterministic seed restore; editing, share and CSV export; blank, fractional, and out-of-range input recovery; corrupted preset recovery; regular local draft; demo isolation, reset, and exit; service-worker offline reload; 404/routing/back focus; and 390 px layout.

The live suite’s axe checks found zero serious or critical findings on the app/demo workbench and privacy, terms, and 404 pages. It also verified the skip link, keyboard slider interaction, route focus/announcement, 44 px mobile target minimums, and no page-level horizontal overflow. A direct 390 px reduced-motion check found `prefers-reduced-motion: reduce` active and zero active animations; the focused slider had the designed visible `rgb(182, 61, 39)` 3 px solid outline. No console or page errors occurred.

The factory `verify-url.sh` check also passed. Evidence is at `.factory/verification-8-artifacts/verify-url/verify.json` with desktop and mobile screenshots. It recorded HTTP 200, load time 797 ms, no console errors, title present, `lang="en"`, one h1, main landmark, no images missing alt text, and no unlabeled buttons.

## Privacy and delivery

The live Playwright request log during the demo contained only the application origin, `https://parameter-playground.sociobot.in` (seven same-origin static requests in the manual mobile sample; the full live privacy claim passed too). No analytics, ads, tracking pixels, or third-party runtime request was observed.

Live headers were inspected on `/`, `/assets/main-5KdcPbdQ.js`, `/sw.js`, and an unknown route. The site sends HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive permissions policy, and a self-only CSP including `frame-ancestors 'none'`. The hashed JS has `Cache-Control: public, max-age=31536000, immutable`; HTML and the service worker short-revalidate at 30 seconds. The unknown route returns HTTP 404 and the designed not-found page.

This is a static product with no server-side endpoints, sign-in, payment, or runtime API. Rate-limit/429 and Entra-tenant checks are therefore not applicable.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
