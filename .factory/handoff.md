# Parameter Playground — polish round 1 handoff

## Result

PASS. Every finding in `.factory/review-1.md` is fixed, tested, committed, pushed, deployed, and rechecked at <https://parameter-playground.sociobot.in/>. No earlier review or polish report existed, and no known gap remains.

## What changed

- Route changes now focus the destination `<h1>` and announce Demo, Privacy, Terms, 404, hash, Back, and bfcache navigation.
- The one-click `?demo=1#workbench` path remains isolated under `demo:parameter-playground-draft`; it has a persistent banner, Reset demo, and Start for real.
- Added the `demo-populated-workbench` claim and its unique browser test. `.factory/claims.json` now has 13 claims.
- Rewrote the reviewed jargon and action labels, removed the decorative revision label, and removed unlisted public image-provenance claims.
- Added live-target support to Playwright so the same regression checks can run against production.
- Updated the zero-flag copy audit and the verb-first, 95-character catalog description.
- Preserved the original blueprint/drafting visual system and static-web deployment class.

The finding-by-finding record is in `.factory/polish-1.md`.

## Verification

- Clean-clone claims: all 13 manifest commands run separately; 26/26 desktop/mobile executions passed.
- `npm run check`: 13/13 unit/release tests, successful `dist/` build, 68/68 browser tests.
- Axe: zero serious or critical issues on the app, demo, Privacy, Terms, direct 404, and unknown 404.
- Privacy: same-origin-only demo requests passed locally and live.
- Offline: fresh dedicated contexts reloaded and used the cached sample in both projects.
- Live focused regression subset: 14/14 passed in desktop/mobile.
- Live accessibility/privacy subset: 8/8 passed in desktop/mobile.
- Live verifier: home and demo returned 200 with zero console errors and complete structural checks.
- Live routing: home/demo/privacy/terms return 200; unknown paths return the designed 404 with status 404.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7 s, CLS 0, TBT 0 ms.
- Production budgets: JS 24.50 kB raw, CSS 20.53 kB raw, fonts 109.60 kB raw, mobile hero 55.88 kB.

Evidence is under `.factory/polish-1-artifacts/`. Implementation commit: `fa9da29`. Deployment ID: `0cac824c-7d26-4897-aa41-b06dddc69cff`.

## Run and verify

```sh
npm ci
npm run check
PLAYWRIGHT_BASE_URL=https://parameter-playground.sociobot.in npx playwright test
```

Deployable output is `dist/`. The app remains a static Vite + TypeScript site with no backend, payment flow, analytics, or runtime third-party dependency.
