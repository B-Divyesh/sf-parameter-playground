# Parameter Playground — build handoff

## Independent verification status — FAIL (2026-08-28)

Candidate: `20a9e97670288bcb40b477390bd3f5134765fa3b`
Live URL: <https://parameter-playground.sociobot.in>

The live deployment now matches the candidate byte-for-byte for the HTML, JS, CSS, service worker, and legal pages; the earlier deployment-only lag is resolved. Clean install, all unit/release-policy tests, exact production build, all 16 project Playwright tests, independent live axe, desktop/mobile/keyboard/reduced-motion/offline checks, privacy/network review, response headers, and static bundle budgets passed.

**Release verdict: FAIL.** The documented **Export CSV** control announces a successful export but triggers no browser download in independent live Chromium testing (30-second download-event timeout). This medium-severity defect must be repaired and covered by an end-to-end download test before release. A low-severity hardening gap also remains: live responses lack a Content-Security-Policy header. Full evidence is in [`.factory/verification-2.md`](verification-2.md).

## Repair verification status — PASS locally (2026-08-28)

Work order: `parameter-playground-repair-2`  
Repair commits: `d9da3f4` and `1bd0b9c`

All release-blocking findings in the independent report for candidate `4cb098a8c96be17bb9c8ac60db36f5af9bca2a8f` are repaired without changing the researched brief or the passed simulation behavior:

- **Offline mobile quality gate:** the service worker now reads and writes only the current release cache, preventing a cached navigation from being paired with an arbitrary cache entry. The HTML shell also initializes the connection indicator synchronously, before the cached module bundle starts. This removes the observed `Checking connection…` race on an offline reload.
- **Exact numeric validation:** blank/non-numeric exact values retain the previous valid value and provide a visible polite inline error associated with the field.
- **Immutable static assets:** `public/staticwebapp.config.json` sets `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`; the navigation fallback explicitly excludes those assets. This is covered by the release-policy unit test and ships in `dist/staticwebapp.config.json`.

### Exact regression coverage

- The Playwright offline case now reloads at `domcontentloaded`, asserts that the cached shell immediately says `Offline`, then asserts all six parameter inputs render and the workbench heading is visible at the 390×844 mobile profile.
- The numeric-control browser regression verifies a blank Cities exact input restores `12` and exposes the complete inline error sentence.
- The release-policy unit test asserts both the immutable `/assets/*` header and the fallback exclusion.

### Verification evidence

- Clean install: `npm ci` on Node/npm supplied by the worker; audit reported **0 vulnerabilities**.
- Aggregate gate: `npm run check` passed — Vitest **6/6**, TypeScript production build, and Playwright **16/16** across desktop and 390px mobile (including axe serious/critical scan, keyboard-operable controls, share/recovery, invalid-number, and offline shell).
- Production build: `dist/` created with `index.html` at its root. Initial JS is **19,960 B** and CSS **18,481 B** uncompressed; self-hosted fonts total **109,604 B**; mobile/desktop hero assets are **55,878 B / 149,478 B**.
- Browser smoke check against Vite preview at desktop 1440×900 and mobile 390×844: title and `lang=en` present, one `h1`, one `main`, every image has `alt`, zero horizontal overflow, and no console/page errors.
- Privacy/network source audit: only same-origin service-worker requests and the documented `parameter-playground-draft` local-storage key; no analytics, trackers, external fonts, scripts, or APIs.
- Response policy: built configuration contains the immutable asset rule plus `nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation permissions.

The independent verification report remains at [.factory/verification.md](verification.md) as the original finding record.

### Deployment handoff

`main` was pushed to `origin` at commit `23d314f063fc8b5f32ee6e82512cd05080f7823f`. The configured factory-managed Azure Static Web App had not consumed that commit at the final rollout check (2026-08-28 07:33 UTC): its HTML still referenced the previous `main-25wyagYh.js` / `style-vARdyVTF.css`, while the repaired `main-BqQRPIBG.js` correctly returned 404 because it had not yet been deployed. GitHub reports no repository deployment or Actions run for this SHA. No infrastructure, DNS, or billing settings were changed, per repository policy. The committed `dist/`-producing static artifact is ready for the factory deployment worker; after rollout, recheck the live asset header for `public, max-age=31536000, immutable` and rerun the mobile offline reload.

Work order: `parameter-playground-build-1`  
Completed: 2026-08-28

## What shipped

- A complete static lesson builder around the pedagogical sequence predict → vary → inspect → explain.
- Three vetted, deterministic, bounded model templates:
  - nearest-neighbor travelling-salesperson heuristic with seeded city layouts, clustering, route length, crossings, and full visit data;
  - discrete logistic population growth with rate, carrying capacity, duration, and full step data;
  - ideal projectile motion with angle, speed, gravity, range, peak, flight time, and sampled trajectory data.
- Teacher editing for lesson title, prediction prompt, and required visual description. Drafts persist only in local storage.
- Shareable presets encoded completely in the URL; malformed and out-of-range presets recover safely.
- Keyboard-operable range and exact-number inputs, prediction commitment, structured explanation completion, CSV export, live status narration, SVG chart descriptions, and accessible data tables.
- Responsive blueprint-drafting visual system, including a reviewed original Azure AI illustration, self-hosted Atkinson Hyperlegible fonts, designed focus states, and reduced-motion handling.
- Offline shell with a build-time manifest of the exact hashed assets, plus online/offline feedback.
- `/privacy/`, `/terms/`, robots, sitemap, Azure Static Web Apps configuration, MIT license, and updated README.

## Run and verify

```sh
npm install
npm test
npm run build
npm run test:e2e
```

The exact deploy command is `npm run build`. It creates `dist/index.html` at the required static deployment root.

Final verification:

- `npm test`: 5/5 deterministic model tests passed.
- `npm run test:e2e`: 14 browser tests cover desktop and 390px mobile flows, template switching, prediction/explanation, axe, responsive overflow, share round-trip, corrupt URL recovery, and an offline reload.
- Factory `verify-url.sh`: HTTP 200; no console/page errors; title, `lang`, one `h1`, `main`, image alt text, and button names confirmed.
- `npm audit`: 0 vulnerabilities.
- Production budgets: 19.65 KB uncompressed JS, 18.36 KB CSS, 109.6 KB total fonts, 55.9 KB mobile hero WebP (149.5 KB desktop hero).
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.8 s, CLS 0, total blocking time 0 ms, total transfer 180 KiB. INP is not available in a synthetic no-interaction Lighthouse run; the measured blocking-time proxy is 0 ms.

## Known limits

- The three templates are intentionally simplified teaching models, not optimization, population-forecasting, engineering, or safety tools. Assumptions and numeric bounds are shown in-product.
- Shared links are transparent URL payloads rather than private records. Teachers should not put student or confidential data in lesson fields.
- Learner answers are intentionally ephemeral and are not submitted or graded; this preserves the no-account, local-first scope.

## Sensible next steps

- Classroom-test whether learners can correctly name a parameter and observed effect; the product goal is at least 80% after a session.
- Add more vetted templates only when each can supply bounded controls, deterministic output, a meaningful data table, assumptions, and an authored text alternative.
- If private class libraries become valuable, design them as an optional authenticated product rather than weakening public-link privacy.
