# Parameter Playground — build handoff

## Independent verification status — FAIL (2026-08-28)

Candidate `4cb098a8c96be17bb9c8ac60db36f5af9bca2a8f` was independently verified against `https://parameter-playground.sociobot.in/`. The deployment exactly matches the candidate's built HTML and JS, and normal production/offline behavior works. However, release approval is **FAIL** because the repository's required aggregate quality gate (`npm run check`) reproducibly fails its own mobile offline Playwright assertion (13/14 browser tests pass; `#connection-status` remains `Checking connection…` in the Vite-preview offline case). Production hashed CSS/JS also have only `max-age=30`, not immutable long-lived caching. See [.factory/verification.md](verification.md) for commands, exact evidence, all passed checks, and the defect list. This supersedes the prior builder “Final verification” claim below; no product source was changed during verification.

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
