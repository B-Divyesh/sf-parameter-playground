# Parameter Playground — independent verification 4 handoff

- Verdict: **FAIL**
- Candidate: `64e9e3bea3c0cbdae096be89092e6efe1173f212`
- Live URL: <https://parameter-playground.sociobot.in/>
- Verified: 2026-08-30
- Full evidence: `.factory/verification-4.md`

## What was done

Independent QA ran from the clean candidate without changing product code. All 11 commands in `.factory/claims.json` were executed first and passed in desktop and 390px mobile projects. The live cold first-read and one-click sample demo also passed.

Clean gates passed: `npm ci`, `npm test` (11/11), `npm run build`, and `npm run test:e2e` (54/54). Fresh live testing covered normal, boundary, invalid, and recovery paths; demo isolation; sharing and CSV; desktop/mobile; keyboard and focus; 200% text; reduced motion; axe; console/page errors; request privacy; headers and caching; links/routes/metadata; service-worker update and offline reload; bundle budgets; and mobile Lighthouse.

The live deployment matches the candidate build byte-for-byte across 16 checked files. The previously reported deployment-only concern is resolved.

## Why this candidate fails

1. **Blocker:** the live statement “Arrow keys work on every slider” is absent from `.factory/claims.json`. A separate regression checks only one slider and does not satisfy the attached claims contract.
2. **High:** with 9 cities, Starting city accepts/displays 16 while the simulation silently calculates from city I (9). The visible parameter and result disagree.
3. **Medium:** out-of-range exact values are silently clamped without an announced explanation.
4. **Medium:** the mandatory first-screen facts cover model count, price/account, and offline use, but omit privacy.

## Verification summary

- Declared claims: 22/22 project executions passed (11 claims × desktop/mobile).
- Unit/release policy: 11/11 passed.
- Full Playwright: 54/54 passed.
- Independent live axe: 0 serious/critical findings on demo, Privacy, Terms, and 404 routes.
- Privacy: 0 cross-origin and 0 non-GET requests during the complete demo flow; 0 console/page errors.
- PWA: active cache `parameter-playground-8bb2fe24ebbd`; update succeeded; offline demo reload succeeded.
- Lighthouse mobile: 99 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP 1.75s, CLS 0, TBT 127ms.
- Bundles: JS 21,720 B; CSS 20,663 B; fonts 109,604 B; mobile hero 55,878 B.

## How to reproduce

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

For the calculation defect, open `https://parameter-playground.sociobot.in/?demo=1#workbench`, reset the demo, set **Starting city exact value** to 16, then compare the displayed input with the **Start: I** metric.

## Scope notes

No product code was modified. This is a static, free, no-account PWA with no backend/product-unlock endpoint, package API, payment flow, or sign-in; 429 allowance, backend concurrency/health, consumer install, and Entra checks do not apply.
