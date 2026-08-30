# Parameter Playground — verification 8 handoff

## Result: PASS

Independent verification of candidate commit `7e77efc5d25bbab6c9341267a26ac9ef92d173de` completed on 2026-08-30 against <https://parameter-playground.sociobot.in/>. The live HTML references the same hashed application assets as a fresh local production build (`main-5KdcPbdQ.js`, `style-BHOwsWoV.css`, and `style-ZOr1aU46.js`).

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run test:claims
npm run test:e2e
PLAYWRIGHT_BASE_URL=https://parameter-playground.sociobot.in npm run test:e2e
```

`npm run build` writes the static artifact to `dist/`.

## Evidence

- Fresh `npm ci` completed with no vulnerabilities. Every one of the 14 commands declared in `.factory/claims.json` was then run separately from the demo entry point; all passed on both desktop and mobile (28 executions).
- Local: `npm test` passed 13/13 tests; the exact production build passed; the complete `npm run test:e2e` suite passed 72/72.
- Live: `PLAYWRIGHT_BASE_URL=https://parameter-playground.sociobot.in npm run test:e2e` passed 72/72. It covered all claims, normal prediction/change/inspect/explain use, bounded models, blank/fractional/out-of-range recovery, share URLs, CSV bytes, local drafts, demo isolation/reset/exit, desktop and 390 px mobile, offline reload, routing/404, keyboard use, and axe.
- Cold first read passed: the initial page says it tests how a parameter changes a model, names teachers and self-learners, and exposes one-click **Try it with sample data** with the result explained next to it.
- Factory URL verifier evidence is in `.factory/verification-8-artifacts/verify-url/`: HTTP 200; no console errors; title, `lang=en`, one h1, main landmark, image alt text, and labeled buttons all passed.
- Live browser request log used only `https://parameter-playground.sociobot.in`; the no-third-party privacy claim passed live. No console/page errors were observed.
- Response headers include self-only CSP with `frame-ancestors 'none'`, HSTS, nosniff, strict-origin referrer policy, and permissions policy. Hashed assets are immutable for one year; HTML and service worker revalidate in 30 seconds. Unknown paths return the designed HTTP 404.
- Build budget: main JS is 24,528 B raw / 9.01 kB gzip; total initial JS is well below 200 kB. CSS is 21,304 B raw / 5.59 kB gzip. The mobile hero asset is 55,878 B. The live 390 px page had no horizontal overflow; focused controls had a visible 3 px outline. In reduced-motion emulation there were no active animations.

## Known gaps

None found. There are no server-side API endpoints, authentication, payment flow, or rate-limited API in this static product, so API allowance and Entra checks do not apply.
