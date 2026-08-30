# Parameter Playground — polish round 2

Date: 2026-08-30  
Reviewed release: `fd1c2eb94d477ef1231c1a807335da7314bbdc01`  
Repair commits: `bb9dec15ff752fdbb73a3036ed50add01c48ee91`, `3330e2c`  
Live URL: <https://parameter-playground.sociobot.in/?demo=1#workbench>

Every item in `.factory/review-1.md` and `.factory/review-2.md` is resolved. Live evidence: `/tmp/parameter-playground-polish2-live.jVN6pr/screenshot-mobile.png`; cold-live verifier evidence: `/tmp/parameter-playground-polish2-live.jVN6pr/verify.json`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept focusable route headings and the polite route announcement on demo, Back, legal, and 404 routes. | Live `moves focus to the route heading and announces Demo, Privacy, and Back navigation`; 72/72 live suite passed. |
| F-1-2 | Strengthened the sample claim test; it now checks the authored sample result in the first 390×844 viewport. | `@claim:demo-populated-workbench`, clean-clone and live desktop/mobile pass. |
| F-1-3 | Kept asset provenance only in internal design records; no public Azure-generation claim remains. | `uses the reviewed plain-language labels without decorative or public provenance copy` passed live. |
| F-1-4 | README retains “spoken results, measurements, a table of values, and a CSV download.” | Release-policy test and copy audit pass. |
| F-1-5 | Kept the route limit copy as “This rule is quick, but it may not find the shortest route.” | Live plain-language regression passed. |
| F-1-6 | Kept “Generate new seed.” | Live plain-language regression passed. |
| F-1-7 | Kept “Close share dialog.” | Live fallback-dialog regression passed. |
| F-1-8 | Kept the decorative masthead label removed. | Live plain-language regression passed. |
| F-2-1 | Added a demo-only mobile sample snapshot before model/setup controls: authored title, current parameter, route metric, and cloned live chart preview. | `@claim:demo-populated-workbench` checks all four are in the initial 390×844 viewport; live screenshot and 72/72 live suite pass. |
| F-2-2 | Rewrote the first-screen audience sentence to “predict changes, check the numbers, and share lessons.” | `names the audience and exposes the one-click sample action` and copy audit pass. |
| F-2-3 | Renamed the teaching step from “Vary” to “Change” in the method strip, station label, README, audit, and design notes. | Release-policy copy regression and live plain-language regression pass. |
| F-2-4 | Renamed the user-facing control and feedback to “Repeatable seed.” | Fractional-seed live regression and deterministic-value claim pass. |
| F-2-5 | Rewrote README model copy to use “models” and “fixed input limits”; renamed the claim `three-models-with-limits`. | `@claim:three-models-with-limits` passed separately from clean clone and live. |
| F-2-6 | Added `bounded-educational-scope` with a fixed-model/no-code-surface test, and simplified README/Terms scope copy. | `@claim:bounded-educational-scope` passed separately from clean clone and live. |
| F-2-7 | Removed the unverified Node version promise. | Release-policy test checks its absence; README still gives runnable commands. |
| F-2-8 | Removed the unneeded public Playwright-pin/install promise. | Release-policy test checks its absence. |
| F-2-9 | Removed the unlisted exact build-artifact claim; deploy instructions remain as a command. | README/copy-audit review and production build pass. |
| F-2-10 | Removed the unlisted application-entry claim. | README/copy-audit review pass. |
| F-2-11 | Removed the unlisted deployment-header claim. | Live routes, 404, CSP, nosniff, and referrer behavior are covered by the production suite and verifier. |
| F-2-12 | Removed the public font-provenance claim; the local font/license record remains in the repository and design documentation. | Same-origin privacy claim and release policy pass. |
| F-2-13 | Reduced the README license text to the direct MIT License link. | `LICENSE` remains shipped; no unlisted availability statement remains. |
| F-2-14 | Demo mode now updates description, canonical, Open Graph title/description/URL, and Twitter title/description. | `gives the direct demo route matching social metadata and sitemap coverage` passed locally and live. |
| F-2-15 | Added `/?demo=1` to `sitemap.xml`. | The metadata/sitemap regression passed locally and live. |

## Verification

- Fresh clone of `bb9dec1`: `npm ci`, then every one of the 14 exact commands in `.factory/claims.json` separately. All 28 desktop/mobile executions passed.
- Local: `npm test` (13/13), `npm run build`, `npm run test:claims` (28/28), and `npm run test:e2e` (72/72).
- Live: `PLAYWRIGHT_BASE_URL=https://parameter-playground.sociobot.in npm run test:e2e` passed 72/72 after deployment `93151274-5868-4959-9c46-888af9bcb869`.
- Cold-live verifier: 200, title `Demo — Parameter Playground`, `lang=en`, one h1, main landmark, no missing image alt text, no unlabeled buttons, and no console errors.
- Playwright axe coverage found no serious or critical findings on the workbench, legal pages, and 404 in both projects. The standalone `@axe-core/cli` was attempted but cannot locate a Chrome binary in this container; the project’s pinned Playwright Chromium axe integration is the completed accessibility evidence.
