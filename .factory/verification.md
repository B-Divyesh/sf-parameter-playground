# Parameter Playground — independent verification

**Result: FAIL**  
Verified 2026-08-28 against candidate `4cb098a8c96be17bb9c8ac60db36f5af9bca2a8f` and production `https://parameter-playground.sociobot.in/`.

This is an independent clean-checkout verification. Product source was not changed. The live `index.html` and `/assets/main-25wyagYh.js` have the exact same SHA-256 values as the candidate build, so the checked deployment is the candidate.

## Release blockers and defects

### High — required local browser quality gate fails

`npm run test:e2e` and the aggregate `npm run check` both fail under the repository's own exact-production-build Playwright configuration. Of 14 tests, the only failed test is the mobile project’s `precaches the shell and reopens it in mobile offline emulation` (`tests/e2e/playground.spec.ts:62`): after `context.setOffline(true)` and reload it expects `#connection-status` to contain `Offline`, but receives `Checking connection…` after the five-second assertion timeout. The trace records the failure at line 83. This was reproduced twice from the clean candidate.

The deployed site itself passed a separately fresh mobile offline reload: after an online visit, service-worker activation, and offline reload, it reported `Offline — saved shell ready`, rendered six parameter inputs, and logged no browser errors. That rules out the reported deployment-only failure, but does not satisfy the required local test gate. The test/preview mismatch must be resolved or the test made reliable before release approval.

### Medium — hashed production assets are not immutably cached

Production `HEAD` responses for the hashed JS `/assets/main-25wyagYh.js` and CSS `/assets/style-vARdyVTF.css` return `cache-control: public, must-revalidate, max-age=30`, not a long-lived immutable policy. This misses the static-web caching requirement for hashed assets and causes needless revalidation. The same 30-second policy applies to HTML, legal pages, and `sw.js`.

### Low — invalid exact-number input is silently changed, not announced

In the exact-number Cities field, entering a blank value and firing `change` silently changes it to the minimum (`5`) and leaves the field valid with no validation/live error. The visual thesis requires invalid numeric input to be constrained **and announced inline**. Bounds otherwise work: `99` becomes `16`; model slider min/max values are respected.

## What passed

- Clean install: `npm ci` on Node `v22.23.2` / npm `10.9.8`; audit reported 0 vulnerabilities.
- Unit/model tests: `npm test` passed, 5/5.
- Type check and production build: `npm run build` passed (`tsc --noEmit && vite build`); `dist/` was produced. No separate lint script is configured.
- Brief-critical browser flow: prediction → parameter variation → live narration/data table → explanation; all three vetted models; normal and boundary parameter values; CSV export; deterministic seed; share preset and corrupt-link recovery (repository coverage); teacher-required visual description; local draft storage only.
- Desktop and 390×844 mobile: no page-level horizontal overflow; no visible interactive target below 44×44 px; visual inspection matched the documented blueprint system.
- Keyboard: Skip link and button focus have a 3 px outline; a focused Clustering slider changed from 30 to 35 with ArrowRight and announced the recalculation. Native controls and buttons were reachable in the smoke test.
- Accessibility: production mobile axe-core scan had 0 violations (51 passing rules; `color-contrast` was an automatic-check incomplete, manually checked core token pairs were 4.98:1–12.52:1). `lang=en`, one `h1`, one `main`, labelled controls, chart text alternative/table, and reduced-motion transition duration `0.00001s` were confirmed.
- Privacy/network: runtime requests from both local and production pages were same-origin only. Source scan found no analytics, tracking, third-party runtime fonts/scripts, or server APIs; the only persisted application key is `parameter-playground-draft` in localStorage. Privacy and terms pages return 200.
- Live PWA: service worker is active/controller-owned; `registration.update()` resolves with no waiting worker; offline mobile reload works on the actual deployment.
- Live headers: HTTPS, HSTS, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation Permissions-Policy are present. No Content-Security-Policy header was sent (hardening observation, not counted as a release blocker).
- Budgets from `dist/`: JS 19,654 B, CSS 18,363 B, fonts 109,604 B, mobile hero 55,878 B, desktop hero 149,478 B — within the stated static-product component budgets.

## Tooling note

An independent Lighthouse CLI run could not be completed in this container: with the preinstalled Playwright Chromium it first could not connect, then crashed the tab even with `--no-sandbox`. This is not presented as a product result. The browser/axe, bundle, responsiveness, console, and header checks above were completed instead.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run test:e2e       # reproducibly fails the one mobile offline assertion
npm run check          # same failure after unit test and build
```

