# Independent verification 6 — PASS

Verified 2026-08-30 from clean candidate `82296a430d2e0e718f594afd36b68732c33e3e8f` against <https://parameter-playground.sociobot.in/>.

## Verdict

**PASS.** The live static site matches the tested candidate byte-for-byte. The previously reported deployment-only concern is not present, and the former fractional-seed release blocker is repaired in production. No release-blocking defects remain.

## Mandatory first-read

**PASS.** A cold 1440×900 live visit answers the required questions in plain words in its first screen:

- **What it does:** “Test how one parameter changes a model.”
- **For whom:** “For teachers and self-learners who need predictions, inspectable numbers, and lessons others can replay.”
- **What to click:** **Try it with sample data**, with the adjacent explanation “The sample opens as a complete route lesson.”

The one-click action targets `/?demo=1#workbench`; it opens the populated, isolated demo workbench. The visible first screen is recorded in [verification-6-live-first-read.png](verification-artifacts/verification-6-live-first-read.png).

## Required declared claims — PASS

`.factory/claims.json` exists and declares 12 claims. After a clean `npm ci`, I ran every manifest `test` command separately through the production-build demo entry point. Every command passed in both configured projects (desktop Chromium and 390×844 mobile): **24/24 passed, 0 failed**.

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS — demo edits/reset/exit altered only the `demo:` draft and retained a regular sentinel draft |
| `three-bounded-models` | PASS — all three templates expose bounded controls, assumptions, limits, and output |
| `slider-arrow-keys` | PASS — all 10 sliders across templates change with arrow keys |
| `deterministic-seed` | PASS — restoring a seed restored every displayed table value |
| `lesson-editing` | PASS — title, prediction prompt, and visual text alternative update |
| `shareable-preset` | PASS — copied preset restores lesson text and parameter state |
| `csv-export` | PASS — downloaded filename and bytes match the displayed table |
| `local-draft` | PASS — normal-mode draft survives reload in local storage |
| `no-account-payment` | PASS — all model and learner flows complete without account/payment UI |
| `same-origin-privacy` | PASS — demo flow has only same-origin static requests |
| `offline-reload` | PASS — a fresh context reloads the demo offline after its first visit |
| `accessible-inspection` | PASS — narration, chart alternative, and semantic table are exposed; no serious/critical axe findings |

Each command was exactly `npm run test:claims -- --grep @claim:<id>`.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — started clean at `82296a430d2e0e718f594afd36b68732c33e3e8f` |
| Install | PASS — `npm ci`; 61 packages, 0 audit vulnerabilities |
| Unit and release-policy suite | PASS — `npm test`; 12/12 tests |
| Strict type check | PASS — `npx tsc --noEmit` |
| Lint | Not applicable — no lint script/configuration is present |
| Exact production build | PASS — `npm run build`; `dist/` created |
| Full browser suite | PASS — `npm run test:e2e`; Playwright last-run status `passed`, 62 configured desktop/mobile tests |

Built assets meet the static-product budgets: JavaScript 23,692 B raw / 8.85 kB gzip; CSS 20,742 B raw / 5.48 kB gzip; self-hosted fonts 109,604 B total; mobile hero 55,878 B; desktop hero 149,478 B. There are no third-party runtime scripts or fonts.

## Independent product and regression exercise

- Completed the teaching loop: predict → vary a parameter → inspect chart/data → explain; all three bounded model templates are usable without an account.
- Live invalid-input recovery: a fractional deterministic seed `2.5` is normalized visibly to `3`, the field is valid, the live error says it was changed, the drawing says `Seed: 3`, and the isolated draft stores numeric `3`. This confirms the defect reported in verification 5 is repaired atomically.
- Live recovery: blank prediction and explanation each announce the missing work and focus the matching input; a blank required visual description blocks sharing and focuses that field.
- Automated full-suite coverage also passed the normal case, damaged share URL recovery, blank/out-of-range numeric recovery, contextual start/city bounds, CSV bytes, and shareable-preset flows.
- Desktop keyboard smoke test: first Tab focuses **Skip to playground** with a visible `rgb(182, 61, 39) solid 3px` outline; ArrowRight changed Clustering from 30 to 35.
- Live 390×844: 0 px horizontal overflow, 0 visible targets smaller than 44×44 CSS px, and still 0 px overflow at 200% root text size. With reduced motion, simulation transition duration is `0.00001s`.
- Fresh live axe scans had zero violations at every impact on demo, Privacy, Terms, direct 404, and unknown-route 404. The 404 route returns HTTP 404 and a designed recovery page.

Live screenshots: [desktop demo](verification-artifacts/verification-6-live-demo-desktop.png), [390 px demo](verification-artifacts/verification-6-live-demo-mobile.png).

## Privacy, headers, caching, offline, and deployment identity

- A complete live demo flow (template change, parameter change, lesson edit, CSV download) issued six GETs only: document, two self-hosted fonts, hashed JavaScript, hashed CSS, and local hero image. Every request was same-origin; there were no POSTs, cross-origin calls, analytics, ads, trackers, accounts, payments, AI calls, or console/page errors.
- Root headers include restrictive CSP (`default-src 'self'`, header-only `frame-ancestors 'none'`), HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, disabled camera/microphone/geolocation permissions, and `Cache-Control: public, must-revalidate, max-age=30`. Hashed assets use `public, max-age=31536000, immutable`; a conditional root request returned 304.
- A fresh mobile context registered active `/sw.js`, had no waiting/installing worker, used cache `parameter-playground-e5eb809bce7f`, and reloaded the demo offline with “Offline — saved shell ready” and all six route controls.
- Fresh `dist/` output was compared to production file-for-file: **17/17 public files matched byte-for-byte**. Live hashed JS `main-C61ehzNJ.js` and CSS `style-BBOGr8dT.css` therefore match the tested candidate.

This is a static local-first web product with no server-side product API or unlock endpoint, sign-in, library/CLI package, or backend. API allowance/429, Microsoft Entra authority, consumer-install, health/concurrency, and persistence-boundary checks are not applicable.

## Defects by severity

No open defects found.
