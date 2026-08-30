# Parameter Playground — independent verification 5 handoff

- Result: **FAIL**
- Candidate: `26d44c20cc4ce053aa5c8c0cc225d0dad84e970e`
- Live URL: <https://parameter-playground.sociobot.in/>
- Verified: 2026-08-30
- Full report: [`.factory/verification-5.md`](verification-5.md)

## Defects by severity

### High — displayed seed differs from calculated, stored, and shared seed

Entering `2.5` in **Deterministic seed** leaves `2.5` visible and invalid while the model labels, calculates, and stores seed `3`. No app message explains the change. Copying the lesson encodes `3`, and opening it changes the field to `3`.

This blocks release because deterministic, reproducible settings are part of the researched core job. Evidence is in `verification-artifacts/seed-mismatch-desktop.png` and `verification-artifacts/seed-mismatch-mobile.png`.

Expected repair: reject the fraction and retain the prior integer with an announced error, or normalize the input itself to `3` and announce the correction before calculation, persistence, or sharing. Add a regression comparing the input, model label, results, storage, and restored lesson.

### Medium

None.

### Low

None.

## What passed

- Mandatory cold first-read and one-click populated demo.
- All 12 exact claim commands: 24/24 project executions.
- `npm ci`, 12/12 unit/release-policy tests, TypeScript, exact production build, 60/60 Playwright tests, and the aggregate `npm run check`.
- Normal learner loop, all three models, representative bounds, prior starting-city repairs, invalid-input recovery, CSV bytes, sharing/fallback, damaged links, and demo isolation.
- Desktop and 390 px mobile, 200% text, 44 px touch targets, keyboard/focus, reduced motion, and axe.
- Privacy request log: six same-origin GETs, no cross-origin/non-GET requests, no runtime errors.
- Security headers, immutable hashed-asset caching, 304 revalidation, service-worker update, and offline reload.
- 17/17 public build files match the deployment byte-for-byte.
- Lighthouse: 100/100/100/100; LCP 1.7 s, TBT 0 ms, CLS 0, total transfer 182 KiB. Static bundle budgets pass.

No product source was changed during verification. Only this handoff, the verification report, and QA evidence artifacts were added or updated.

## Reproduce

```sh
npm ci
npm test
npx tsc --noEmit
npm run build
npm run test:e2e
npm run check
```

Then open `https://parameter-playground.sociobot.in/?demo=1#workbench`, enter seed `2.5`, and compare the field with the `Seed: 3` model label and a copied/restored lesson.
