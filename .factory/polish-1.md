# Parameter Playground — polish round 1

Date: 2026-08-30  
Base review commit: `375ae08da9e3feffa99689bb9210afc38b48ccfa`  
Implementation commit: `fa9da29`  
Live URL: <https://parameter-playground.sociobot.in/>

Every finding in `.factory/review-1.md` is resolved. No earlier `.factory/review-*.md` or `.factory/polish-*.md` existed at the start of this round.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added focusable route headings and polite route announcements. Demo/hash navigation, `popstate`, bfcache return, Privacy, Terms, and 404 all focus the page `<h1>` without changing scroll position. | `moves focus to the route heading and announces Demo, Privacy, and Back navigation` passed desktop/mobile locally and live. Live screenshot: `.factory/polish-1-artifacts/live/screenshot-desktop.png`. Live checks: `/?demo=1#workbench`, `/privacy/`, `/terms/`, `/404.html`. |
| F-1-2 | Added `demo-populated-workbench` to `.factory/claims.json` and one unique tagged observable test. It asserts the banner, Reset/Start controls, authored sample title, six parameter inputs, chart, nine-row table, and visible workbench. | `npm run test:claims -- --grep @claim:demo-populated-workbench` passed from a clean clone in desktop and mobile. Live demo: <https://parameter-playground.sociobot.in/?demo=1#workbench>. Mobile screenshot: `.factory/polish-1-artifacts/live/screenshot-mobile.png`. |
| F-1-3 | Removed the public Azure-generation statements from the footer and README. Required internal provenance remains in `.factory/design.md` and `assets/src/`. | `keeps review-required labels concrete and removes public asset claims` in `tests/release-policy.test.ts`; live `uses the reviewed plain-language labels without decorative or public provenance copy` passed desktop/mobile. |
| F-1-4 | Replaced “semantic data table” in README with “spoken results, measurements, a table of values, and a CSV download.” | `keeps review-required labels concrete and removes public asset claims`; `.factory/copy-audit.md` has zero flags. |
| F-1-5 | Replaced “heuristic” with “This rule is quick, but it may not find the shortest route.” | Release-policy copy regression plus the live plain-language regression passed desktop/mobile. |
| F-1-6 | Renamed “New seed” to “Generate new seed.” | Release-policy copy regression plus the live plain-language regression passed desktop/mobile. |
| F-1-7 | Renamed the fallback dialog action to “Close share dialog.” | The live plain-language regression forces clipboard failure, opens the dialog, and asserts the new action in desktop/mobile. |
| F-1-8 | Removed “SHEET 01 / REV A” and its unused CSS while retaining the blueprint grid, drafting marks, palette, typography, and artwork. | Release-policy copy regression plus live absence check. First-screen screenshot: `.factory/polish-1-artifacts/live-home/screenshot-desktop.png`. |

## Cumulative acceptance evidence

- Clean clone: `npm ci` completed with zero vulnerabilities. Every one of the 13 exact claim commands passed separately in both browser projects: 26/26 executions.
- Full local gate: `npm run check` passed — 13/13 Vitest tests, production build, and 68/68 Playwright desktop/mobile tests.
- Accessibility: axe found zero serious or critical issues on the workbench, Privacy, Terms, direct 404, and unknown-route 404 in both local projects and in 8/8 selected live runs.
- Privacy: `@claim:same-origin-privacy` passed locally and live; the full demo flow made only same-origin static requests.
- Offline: `@claim:offline-reload` passed in dedicated fresh contexts for both configured projects.
- Performance: live Lighthouse scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; LCP 1.7 s, CLS 0, TBT 0 ms. Raw report: `.factory/polish-1-artifacts/live/lighthouse.json`.
- Budgets: initial application JS is 24.50 kB raw total, CSS is 20.53 kB raw, fonts are 109.60 kB raw total, and the mobile hero is 55.88 kB.
- Factory verifier: live home and demo each returned 200 with zero console errors, one `<h1>`, `lang="en"`, `<main>`, complete image alt text, and labeled buttons. Reports: `.factory/polish-1-artifacts/live-home/verify.json` and `.factory/polish-1-artifacts/live/verify.json`.
- Routing: `/`, `/?demo=1#workbench`, `/privacy/`, and `/terms/` return 200; an unknown route returns the designed page with HTTP 404. Live responses carry CSP, HSTS, nosniff, referrer, and permissions headers.
- Deployment: Azure Static Web Apps production deployment `0cac824c-7d26-4897-aa41-b06dddc69cff` succeeded for `sf-parameter-playground`; the custom domain returned 200 over HTTPS.

## Result

PASS. All eight review findings and all previously repaired regressions are covered and passing locally and on the deployed site. No known gaps remain.
