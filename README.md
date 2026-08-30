# Parameter Playground

Build replayable parameter model lessons for teachers and self-learners. Each lesson follows four steps: predict, change, inspect, and explain.

Live site: <https://parameter-playground.sociobot.in>

Sample demo: <https://parameter-playground.sociobot.in/?demo=1#workbench>

## What it includes

- Three models cover nearest-neighbor routes, logistic growth, and ideal projectile motion. Each model has fixed input limits.
- The same seed and parameters reproduce the same displayed values.
- Teachers can edit the title, prediction prompt, and required visual description.
- Each model provides spoken results, measurements, a table of values, and a CSV download.
- A copied link restores the lesson settings without a server account.
- Learners can complete the prediction and explanation flow without an account or payment.
- Regular drafts stay in browser local storage and survive a refresh.
- The app works offline after the first successful visit.

Each model shows its assumptions and numeric limits. The models are for classroom explanation, not custom code or real-world decisions.

## Try the isolated demo

Open the sample demo in one click. It loads a complete route lesson and labels the page as a demo.

Demo changes use the separate `demo:parameter-playground-draft` key. They never read or write your regular draft.

Use **Reset demo** to restore the sample. Use **Start for real** to discard demo changes and return to your regular draft.

## Run locally

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

Run all gates in sequence with `npm run check`.

## Deploy

```sh
npm run build
```

## Privacy and assets

Draft lesson settings stay in browser local storage. Shared lesson settings live in the URL.

The app adds no accounts, analytics, ads, tracking pixels, or third-party runtime requests. See the [privacy page](https://parameter-playground.sociobot.in/privacy/) for details.

## License

[MIT License](LICENSE)
