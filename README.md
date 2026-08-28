# Parameter Playground

Parameter Playground is a free, accessible simulation builder for teachers and self-learners. It turns a model lesson into a repeatable four-part activity: predict, vary a parameter, inspect both the visual and its values, then explain the observed effect.

Live site: <https://parameter-playground.sociobot.in>

## What it includes

- Three vetted, bounded templates: nearest-neighbor tours, logistic population growth, and ideal projectile motion
- Deterministic seeds and exact numeric controls
- Teacher-editable lesson title, prediction prompt, and required visual description
- Live result narration, summary metrics, an accessible data table, and CSV export
- Shareable lesson presets encoded entirely in the URL
- A no-account learner flow with prediction and explanation checkpoints
- Local draft saving and offline use after the first successful visit

Each model shows its assumptions and numeric limits. This is an explanatory classroom instrument, not a general code runner, computer algebra system, or real-world safety calculator.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Verify

```sh
npm test          # deterministic model tests
npm run build     # production output in dist/
npm run test:e2e  # desktop + 390px flows, axe, share links, offline shell
```

Run all gates in sequence with `npm run check`. Playwright is pinned to 1.58.2; install its Chromium build with `npx playwright install chromium` if it is not already available.

## Deploy

The deploy artifact is the static `dist/` directory created by exactly:

```sh
npm run build
```

`dist/index.html` is the application entry point. `public/staticwebapp.config.json` supplies Azure Static Web Apps routing and security headers. No runtime environment variables or external services are required.

## Privacy and assets

Draft lesson settings are stored only in browser local storage. Shared lesson data lives in the URL itself. There are no accounts, analytics, ads, or third-party runtime requests. See [/privacy](https://parameter-playground.sociobot.in/privacy/) for details.

The opening blueprint illustration was generated specifically for this project using the factory Azure AI image model. Its source, prompt sidecar, and provenance are in `assets/src/` and `.factory/design.md`. Atkinson Hyperlegible is self-hosted from the SIL Open Font License release distributed by Google Fonts.

## License

Application code is available under the [MIT License](LICENSE).
