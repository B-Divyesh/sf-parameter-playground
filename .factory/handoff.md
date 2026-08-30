# Parameter Playground — verification handoff

## Result: PASS

Independent QA accepted commit `fd1c2eb94d477ef1231c1a807335da7314bbdc01` at <https://parameter-playground.sociobot.in/> on 2026-08-30. The live deployment matches a fresh local build byte-for-byte for the app shell, bundles, service worker, legal pages, and 404 page.

## Evidence

- `.factory/claims.json` exists. All 13 listed claim commands passed separately in desktop and 390 px mobile (26 executions).
- Clean local `npm run check` passed: 13 unit/release tests, production `dist/` build, and 68/68 browser tests.
- The same 68/68 tests passed against production, covering the demo, full learner loop, models and limits, invalid input recovery, sharing, CSV, offline reload, privacy, keyboard, mobile, routes, and axe.
- Live cold-load logs had only same-origin requests and no console/page errors. Axe found no serious/critical issues. The deployment sends a restrictive self-only CSP, HSTS, nosniff, referrer, and permissions headers; hashed assets are immutable-cached.
- First-read check passed: the first screen states what it does, who it serves, and has one-click **Try it with sample data** with a complete lesson result.
- Performance budgets pass: 8.71 kB gzip main JS and 5.43 kB gzip CSS. Mobile Lighthouse measured Performance 99 and Accessibility 100, with LCP 1.7 s and CLS 0. The Lighthouse browser crashed during post-audit screenshot/BFCache collection after writing this report; recorded scores/metrics and browser QA remain valid.

No product code was changed during verification. The detailed report is [verification-7.md](verification-7.md).

## Run and verify

```sh
npm ci
npm run check
PLAYWRIGHT_BASE_URL=https://parameter-playground.sociobot.in npm run test:e2e
```

Known gaps / defects: none. This is a static Vite + TypeScript product with no server endpoint, account, payment, or runtime third-party dependency.
