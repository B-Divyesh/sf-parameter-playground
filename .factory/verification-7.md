# Verification 7 — Parameter Playground

## Result: PASS

Verified candidate commit `fd1c2eb94d477ef1231c1a807335da7314bbdc01` at <https://parameter-playground.sociobot.in/> on 2026-08-30. The deployed `index.html`, application bundle, CSS, service worker, Privacy, Terms, and 404 files had SHA-256 values identical to a fresh `npm run build` from this commit.

## First-read check

Cold desktop and 390 px sessions both answered the three required questions in the first screen:

- Does: “Test how one parameter changes a model.”
- For whom: “For teachers and self-learners …”
- First action: one visible **Try it with sample data** link; its adjacent note says it opens a complete route lesson.

The hero also shows the required three plain facts: browser-local drafts, no account/payment, and offline after the first visit. This check passed.

## Claim gate

`.factory/claims.json` exists and contains 13 claims. Every manifest command was run separately from the demo entry point against a fresh production build; all 26 desktop/mobile claim executions passed:

`demo-isolation`, `demo-populated-workbench`, `three-bounded-models`, `slider-arrow-keys`, `deterministic-seed`, `lesson-editing`, `shareable-preset`, `csv-export`, `local-draft`, `no-account-payment`, `same-origin-privacy`, `offline-reload`, and `accessible-inspection`.

The clean default gate was also rerun with no existing preview server:

```text
npm run check
13 unit/release tests passed; build passed; 68/68 Playwright tests passed.
```

The same 68-test Playwright suite passed against the live URL, covering desktop and 390 px mobile. It exercised the normal prediction → vary → inspect → explain loop, all three bounded models, slider keys, invalid/blank/out-of-range seed recovery, deterministic values, edit/share/CSV flows, demo isolation/reset/exit, offline reload, routing/404, keyboard use, and axe checks.

## Privacy, accessibility, and delivery

- Cold live desktop and 390 px request logs contained only same-origin document, script, CSS, self-hosted font, and image resources. The full demo privacy claim also passed live. No analytics, ad, pixel, or other third-party runtime request was observed.
- No page errors or console errors were observed on cold live loads. Axe reported zero serious/critical findings in cold desktop and mobile checks; the complete live suite additionally checked app/demo/legal/404 views.
- Keyboard smoke test passed in the live suite. At 390 px, a focused “Start for real” link had the designed `3px` `#b63d27` outline and `3px` offset; no horizontal page overflow was present. Reduced-motion media emulation reduced transition/animation durations to `0.01ms`.
- Live headers: HTTPS/HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, permissions policy, and a self-only CSP with `frame-ancestors 'none'`. Hashed JS/CSS use `Cache-Control: public, max-age=31536000, immutable`; HTML and service worker are short-revalidated. Unknown paths return the designed page with HTTP 404.
- No server-side endpoint, authentication, payment, or rate-limited API exists in this static product; API allowance and Entra checks are not applicable.

## Performance

Fresh production build: main JS `23.47 kB` raw / `8.71 kB` gzip; CSS `20.53 kB` raw / `5.43 kB` gzip. Both are far below the 200 kB JS and 50 kB CSS budgets. The live mobile Lighthouse report recorded Performance **99**, Accessibility **100**, FCP **1.0 s**, LCP **1.7 s**, CLS **0**, TBT **120 ms**, total transfer **186,246 B**, and zero third-party bytes. Lighthouse generated its JSON report, then its Chromium tab crashed during post-audit screenshot/BFCache collection; the recorded category and metric results were present and are corroborated by the passing browser suite.

## Defects

None found. No release-blocking, high, medium, or low defects remain.
