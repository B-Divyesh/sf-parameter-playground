# Parameter Playground

Build replayable parameter model lessons for teachers and self-learners. Each lesson follows four steps: predict, vary, inspect, and explain.

Live site: <https://parameter-playground.sociobot.in>

Sample demo: <https://parameter-playground.sociobot.in/?demo=1#workbench>

## What it includes

- Three bounded templates cover nearest-neighbor tours, logistic growth, and ideal projectile motion.
- The same seed and parameters reproduce the same displayed values.
- Teachers can edit the title, prediction prompt, and required visual description.
- Each model provides narrated results, metrics, a semantic data table, and CSV export.
- A copied link restores the lesson settings without a server account.
- Learners can complete the prediction and explanation flow without an account or payment.
- Regular drafts stay in browser local storage and survive a refresh.
- The app works offline after the first successful visit.

Each model shows its assumptions and numeric limits. This is an explanatory classroom instrument, not a general code runner, computer algebra system, or real-world safety calculator.

## Try the isolated demo

Open the sample demo in one click. It loads a complete route lesson and labels the page as a demo.

Demo changes use the separate `demo:parameter-playground-draft` key. They never read or write your regular draft.

Use **Reset demo** to restore the sample. Use **Start for real** to discard demo changes and return to your regular draft.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Then open the local URL printed by Vite.

## Verify

```sh
npm test          # deterministic model tests
npm run build     # production output in dist/
npm run test:claims # one observable browser test per product claim
npm run test:e2e  # desktop + 390px flows, axe, privacy, and offline shell
```

Run all gates in sequence with `npm run check`. Playwright is pinned to 1.58.2; install its Chromium build with `npx playwright install chromium` if it is not already available.

## Deploy

The deploy artifact is the static `dist/` directory created by exactly:

```sh
npm run build
```

`dist/index.html` is the application entry point. `public/staticwebapp.config.json` supplies Azure Static Web Apps routing and security headers.

## Privacy and assets

Draft lesson settings stay in browser local storage. Shared lesson settings live in the URL.

The app adds no accounts, analytics, ads, tracking pixels, or third-party runtime requests. See the [privacy page](https://parameter-playground.sociobot.in/privacy/) for details.

The opening blueprint illustration was generated specifically for this project using the factory Azure AI image model. Its source, prompt sidecar, and provenance are in `assets/src/` and `.factory/design.md`. Atkinson Hyperlegible is self-hosted from the SIL Open Font License release distributed by Google Fonts.

## License

Application code is available under the [MIT License](LICENSE).
