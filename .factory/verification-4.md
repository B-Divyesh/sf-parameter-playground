# Independent verification 4 — FAIL

Verified 2026-08-30 against candidate commit `64e9e3bea3c0cbdae096be89092e6efe1173f212` and <https://parameter-playground.sociobot.in/>.

## Verdict

**FAIL.** The live deployment is this candidate, the mandatory first-read and all 11 declared claim commands pass, and the previous deployment-only concern is not present. Release is still blocked by an unlisted visitor-facing claim. Independent boundary testing also found that the route model can display one starting city while calculating with another.

## Release-blocking findings

### Blocker — the claims manifest omits a visitor-facing product claim

The live workbench and `index.html` say **“Arrow keys work on every slider.”** `.factory/claims.json` has no entry for this claim and therefore no unique `@claim:<id>` test invoked by the manifest. `tests/e2e/verifier-regressions.spec.ts` checks one slider outside the claims manifest, but it neither inventories the claim nor proves the word “every.”

Independent live testing confirmed ArrowRight changes all 10 current sliders, but the claims contract requires the page statement itself to be listed and connected to exactly one tagged observable test. An unlisted claim fails the review even when the behavior happens to work today.

### High — “Starting city” can disagree with the route actually calculated

Fresh live reproduction from `/?demo=1#workbench`:

1. Reset the demo. It shows 9 cities and starting city 2.
2. The **Starting city exact value** input still has `max="16"`.
3. Enter `16` and leave the field.
4. The input and adjacent output display `16`, but the Start metric and narration report `I`, city 9.

`calculateTour` silently clamps the selected start to the last existing city, while the UI and saved lesson retain 16. This contradicts the product's core promise that learners can inspect how parameters affect a deterministic model and violates the brief's requirement for honest numeric limits. The allowed starting-city maximum must track the current city count on initial render, reset, template load, and shared-link restore, with invalid state explained or rejected.

## Other findings

### Medium — out-of-range exact values are silently changed

Entering Cities `99` changes the field to `16`; entering Gravity `999` changes it to `20`. In both cases the field's `role=status` error remains hidden, so keyboard and screen-reader users receive no explanation that their value was rejected and replaced. Blank input recovery is good and announces the valid range. Out-of-range recovery should provide the same explicit feedback.

### Medium — the mandatory first-screen facts omit privacy

The three visible facts are **Three bounded models**, **No account or payment**, and **Works offline after first visit**. They cover product count, price/account, and offline use, but not the required privacy fact. Replace or supplement the model-count fact with a short local-storage/privacy statement.

## Mandatory first-read

**PASS.** In a fresh 1440×900 browser context with no stored state:

- What it does: **“Test how one parameter changes a model.”**
- For whom: **“For teachers and self-learners…”**
- First action: **“Try it with sample data.”** The adjacent note says it opens a complete route lesson.
- One click opens `/?demo=1#workbench`, titled **Demo — Parameter Playground**, with the populated workbench in view and the persistent **Demo — sample data, nothing is saved** banner.

## Declared claims — 11/11 commands passed

Each command from `.factory/claims.json` was run separately after `npm ci`; each executed once in desktop Chromium and once in the 390px mobile project.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolation` | PASS, 2/2 | Sentinel regular draft survived edit/reset/exit; `demo:` key removed |
| `three-bounded-models` | PASS, 2/2 | Three templates opened with min/max controls, assumptions, limits, and rows |
| `deterministic-seed` | PASS, 2/2 | Restoring seed 12345 restored every displayed table value |
| `lesson-editing` | PASS, 2/2 | Title, learner prompt, and chart alternative updated |
| `shareable-preset` | PASS, 2/2 | Copied URL restored title and clustering value in a new page |
| `csv-export` | PASS, 2/2 | Filename and downloaded bytes matched displayed headings and rows |
| `local-draft` | PASS, 2/2 | Regular namespaced draft survived reload |
| `no-account-payment` | PASS, 2/2 | Learner loop and all models worked without gates |
| `same-origin-privacy` | PASS, 2/2 | Demo flow sent only same-origin static requests |
| `offline-reload` | PASS, 2/2 | Dedicated context reloaded cached demo offline |
| `accessible-inspection` | PASS, 2/2 | All models exposed narration/table semantics; no serious/critical axe findings |

The exact command pattern was `npm run test:claims -- --grep @claim:<id>`. Total declared-claim executions: 22 passed, 0 failed.

## Clean-clone quality gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — clean tree at `64e9e3bea3c0cbdae096be89092e6efe1173f212` |
| Install | `npm ci` PASS; 61 packages, 0 audit vulnerabilities |
| Unit/release policy | `npm test` PASS — 11/11 |
| Type check and exact build | `npm run build` PASS — `tsc --noEmit && vite build`; `dist/` produced |
| Full browser suite | `npm run test:e2e` PASS — 54/54 across desktop and 390px mobile |
| Lint | No lint command or configuration is present |

## Independent live functional evidence

- Normal loop: empty prediction focused the field and announced recovery; a committed prediction became read-only and moved focus to the first slider; explanation, model switching, share validation, clipboard fallback dialog, reset, and Start for real worked.
- Route boundaries: 5 cities, 85% clustering produced 5 rows; blank Cities restored the prior value with an announced error. The contextual start defect above remains.
- Growth boundaries: initial 100, rate 0.8, capacity 1000, and 30 steps produced 31 finite rows and narrated 100% of capacity.
- Projectile boundaries: 80°, 40 m/s, and 1 m/s² produced 17 rows and finite metrics. CSV was `projectile-seed-41723.csv`, 18 lines, with bytes matching the displayed table.
- Damaged `?lesson=broken` recovered to the safe starter and announced the damaged link.
- Demo reset removed `demo:parameter-playground-draft`; Start for real removed it and restored an untouched regular-draft sentinel.

## Accessibility, responsive behavior, and motion

- Independent axe scans found 0 serious/critical findings on the live demo, Privacy, Terms, designed 404, and an unknown 404 route.
- Desktop and 390×844 mobile screenshots were visually inspected. Mobile had 0px page overflow, hid the nonessential hero art, kept all first-screen facts in view, and had no visible target below 44×44 CSS px.
- At 200% root text size, the page retained the headline and sample action with no horizontal overflow.
- First Tab focused **Skip to playground**. Activating it bypassed header navigation; the next Tab reached the primary sample action. The focus ring was a visible 3px accent outline with 3px offset.
- Keyboard activation switched models; ArrowRight changed all 10 current sliders. Reduced-motion emulation changed relevant UI durations to `0.00001s` and scroll behavior to `auto`.
- Live pages had `lang=en`, one `h1`, one `main`, alt text on every image, and no unnamed buttons. No uncaused console errors or page errors occurred.

## Privacy, network, PWA, and headers

- A full live demo flow made six same-origin GETs: document, two local fonts, hashed JS, hashed CSS, and the local hero image. It made 0 cross-origin requests, 0 non-GET requests, and emitted 0 console/page errors.
- The browser stored only the regular and demo namespaced drafts used by the test. No analytics, ads, tracking, runtime AI, account, payment, product-unlock call, or server API was observed.
- Service-worker update completed with no waiting worker. Active cache: `parameter-playground-8bb2fe24ebbd`. Hashed JS and CSS were present with nonzero bytes. A fresh 390px context then reloaded offline with the demo banner, offline status, and all six route controls.
- Root responses send HSTS, restrictive CSP including header-only `frame-ancestors 'none'`, `nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation permissions.
- Documents and `sw.js` use `public, must-revalidate, max-age=30`; hashed JS/CSS/images use `public, max-age=31536000, immutable`; conditional ETag requests returned 304.
- This static, no-account product has no server-side endpoint or unlock call, so request allowance/429, backend health/concurrency/persistence, package-consumer, and Entra authority checks are not applicable.

## Deployment identity, routes, and performance

- Sixteen live files matched the fresh `dist/` byte-for-byte, including HTML routes, `sw.js`, fonts, images, JS, and CSS. Key SHA-256 values: `index.html` `3476e639…35a1`; JS `43eac5b1…a194`; CSS `36ab8c9a…c25d`; `sw.js` `a8560d2d…83d`.
- All links crawled from home, demo, Privacy, Terms, and 404 returned 200. Unknown routes return the designed page with HTTP 404.
- Route titles, descriptions, canonicals, Open Graph/Twitter metadata, favicon, touch icon, robots, and sitemap are present.
- Built sizes: JS 21,720 B; CSS 20,663 B; fonts 109,604 B; mobile hero 55,878 B; desktop hero 149,478 B. All component budgets pass.
- Live mobile Lighthouse 13.4.1: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 922 ms, LCP 1,747 ms, TBT 127 ms, CLS 0, total transfer 185,389 B.

## Required remediation

1. Add the keyboard-every-slider statement to `.factory/claims.json` and give it one unique `@claim:` test that exercises every current slider from the demo, or remove/narrow the statement.
2. Keep Starting city bounded to the current city count everywhere and ensure the displayed parameter is exactly the value used by the model.
3. Announce out-of-range exact-value recovery instead of silently clamping.
4. Put a plain privacy fact in the first-screen facts.
