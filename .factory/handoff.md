# Parameter Playground — repair 6 handoff

- Result: **READY**
- Work order: `parameter-playground-repair-6`
- Report commit: `59e6bfbc9079e151e5ef1918ab99adfdb55d902b`
- Repaired candidate: `26d44c20cc4ce053aa5c8c0cc225d0dad84e970e`
- Implementation commit: `375178be42b1031a4e8395b1a45f45585dbfc984`
- Live URL: <https://parameter-playground.sociobot.in/>
- Deployed: 2026-08-30 through the work order's Azure Static Web Apps configuration
- Azure deployment ID: `83e89987-be47-41f0-af50-4d1a21d8bd07`

## Release-blocking finding repaired

The verifier found that entering fractional seed `2.5` left the invalid text visible while calculation, storage, and sharing silently used seed `3`.

The root cause was the seed change handler rounding the model value without writing the accepted value back to the input. It also had no persistent, programmatic correction message.

The repair now:

- declares the seed input's integer step and associates its hint and status message;
- writes normalized seed `3` to the field before calculating or persisting;
- clears native invalid state and announces `2.5 was changed to 3` in an adjacent polite live region;
- rejects blank, non-finite, and out-of-range seeds while restoring the previous integer;
- marks repaired seeds from stored or shared payloads as corrected, so those entry paths cannot change silently.

No researched scope, model behavior, demo isolation, visual identity, privacy behavior, route, or deployment class changed.

## Exact regression coverage

`tests/e2e/verifier-regressions.spec.ts` includes **normalizes a fractional seed atomically across the lesson, draft, and shared link**. Playwright runs it in desktop Chromium and a 390×844 mobile project.

The regression enters `2.5`, then asserts:

- the field displays `3` and has `valid=true` with `stepMismatch=false`;
- the live correction message names both `2.5` and `3`;
- the model label and limits use seed `3`;
- the rendered data rows are the rows restored by the shared seed-3 lesson;
- the isolated demo draft stores numeric seed `3`;
- the copied URL restores field, model label, and displayed values with seed `3`.

The test was run before the repair and failed in both projects with the field still displaying `2.5`. It passes after the repair in both projects.

## Clean local verification

- `npm ci` — PASS; 61 packages installed, 0 audit vulnerabilities.
- `npm test` — PASS; 12/12 model and release-policy tests.
- `npx tsc --noEmit` — PASS.
- Lint — not applicable; this candidate has no lint script or lint configuration.
- `npm run build` — PASS; `dist/` contains `index.html` at its root.
- `npm run test:e2e` — PASS; 62/62 across desktop Chromium and 390×844 mobile.
- `npm run check` — PASS; unit/policy tests, type-checked production build, and all 62 browser runs.
- Every command in `.factory/claims.json` was also run separately — PASS; 12 claims × 2 projects = 24/24.
- Package/consumer verification — not applicable to this `static-web` artifact.

Production sizes remain within budget:

- JavaScript: 23,692 B raw / 8.85 kB gzip.
- CSS: 20,742 B raw / 5.48 kB gzip.
- Fonts: 109,604 B total.
- Mobile hero: 55,878 B; desktop hero: 149,478 B.

## Browser, accessibility, privacy, and offline evidence

- Factory `verify-url.sh` against the live demo: HTTP 200 in 564 ms; title `Demo — Parameter Playground`; `lang=en`; one `h1`; one `main`; 0 images missing alt text; 0 unnamed buttons; 0 console/page errors.
- Axe Playwright integration: 0 serious or critical findings on the workbench, Privacy, Terms, direct 404, and unknown-route 404 paths.
- Keyboard regression: first Tab reaches the visible skip link; every current slider responds to arrow keys; no trap.
- Mobile regression: 0 px page overflow at 390×844; all visible interactive targets are at least 44×44 CSS px.
- Reduced-motion, 200% text, form error recovery, clipboard fallback focus, CSV bytes, and designed 404 behavior remain covered and pass.
- Same-origin privacy claim: the complete demo flow makes only same-origin static GET requests, with no analytics, tracker, ad, account, payment, AI, or server API call.
- Live repair smoke test in fresh desktop and mobile contexts: HTTP 200, seed `3`, valid input, correction announced, stored seed `3`, copied/restored seed `3`, 0 overflow, 0 console errors, and 0 cross-origin requests.
- Live service worker: active `/sw.js`, no waiting or installing worker, one cache (`parameter-playground-e5eb809bce7f`), and non-empty cached JS/CSS (23,692 B / 20,742 B).
- Fresh 390×844 live context reloaded offline with `Offline — saved shell ready`, the demo banner, title, and all six route inputs.

## Response policy, deployment identity, and performance

- Routes `/`, `/?demo=1#workbench`, `/privacy/`, `/terms/`, `/404.html`, `/robots.txt`, and `/sitemap.xml` return 200; an unknown route returns the designed HTML at HTTP 404.
- Root responses send HSTS, restrictive CSP with header-only `frame-ancestors 'none'`, `nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation permissions.
- HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS use `public, max-age=31536000, immutable`; conditional root and JS requests return 304.
- All 17 public files in `dist/` match the live deployment byte-for-byte.
- SHA-256: `index.html` `327c29e535c1034a319e8567edfc04d7d3243841f1dc23e753cb98628cd4da0b`; JavaScript `febfc492ab2267a4e70e5d74a06296d57c888eae2e0fa9056453f24efc36695c`; `sw.js` `2e9def66e9686d400eb4a992d2ce7575a2a477971fa532c71315ee5f02434e7e`.
- Fresh live mobile Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.7 s, TBT 20 ms, CLS 0, total transfer 182 KiB.

## Run and verify

```sh
npm ci
npm test
npx tsc --noEmit
npm run build
npm run test:e2e
npm run check
```

To rerun the repaired verifier scenario only:

```sh
npm run test:e2e -- --grep "normalizes a fractional seed"
```

## Known gaps and next steps

No release-blocking gaps remain. Independent verification should rerun against the pushed `main` commit and the live URL.
