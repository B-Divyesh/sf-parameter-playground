# Parameter Playground copy audit

Audited 2026-08-30 against the rendered home page and sample workbench. Word counts treat hyphenated terms as one word and omit decorative symbols.

Flagged lines: 0

## First screen

| Copy | Words |
| --- | ---: |
| Parameter simulations for lessons | 4 |
| Test how one parameter changes a model | 7 |
| For teachers and self-learners who need predictions, inspectable numbers, and lessons others can replay. | 14 |
| Try it with sample data | 5 |
| Start with your own lesson | 5 |
| The sample opens as a complete route lesson. | 8 |
| Drafts are stored in this browser | 6 |
| No account or payment | 4 |
| Works offline after first visit | 5 |
| Route study / nearest-neighbor sketch | 4 |

The headline states the job in seven words. The next sentence names teachers and self-learners. The sample action states the first step.

## Rendered landing and sample sentences

| Sentence | Words |
| --- | ---: |
| Your regular draft stays untouched. | 5 |
| Ask about a visible effect that the model can answer. | 10 |
| Describe the marks and axes, not the conclusion. | 8 |
| Live results are narrated separately. | 5 |
| Every city can connect to every other city. | 8 |
| The route always chooses the nearest unvisited city, then returns to its start. | 13 |
| If city clusters tighten, what happens to route length and crossings? | 11 |
| Use a slider or its exact value. | 7 |
| Arrow keys work on every slider. | 6 |
| How many locations the route must visit. | 7 |
| Range 5–16. | 3 |
| Pulls alternating cities toward two centers. | 6 |
| Range 0–85%. | 3 |
| 1 means city A, 2 means B, and so on. | 10 |
| Range 1–9. | 3 |
| Same seed + parameters = same result. | 5 |
| Deterministic seed uses whole numbers. | 5 |
| 2.5 was changed to 3. | 5 |
| Deterministic seed needs a whole number from 1 to 999999. | 10 |
| The previous value was kept. | 6 |
| Route recalculated: 176.3 units with 0 crossings. | 8 |
| Nine labeled cities joined by a red nearest-neighbor route. | 9 |
| Pale dashed lines show every possible city pair. | 8 |
| The nearest-neighbor route visits 9 cities, starts at B, measures 176.3 units, and has 0 crossings. | 17 |
| Scroll sideways to inspect all columns on a small screen. | 10 |
| Parameter Playground keeps lesson drafts in this browser. | 8 |
| The opening illustration was generated for this project with Azure AI. | 11 |

All conditional errors, empty states, status messages, dialog instructions, and toast messages in `src/app.ts` were also checked. Each uses one action or idea, stays at or below 22 words per sentence, and contains no banned term.

## Banned-word scan

The product UI and README contain none of: leverage, seamless, effortless, robust, powerful, intuitive, reimagine, supercharge, unlock, delightful, journey, ecosystem, or AI-powered.

## Terminology

| Concept | One term used |
| --- | --- |
| Saved teacher configuration | lesson draft |
| Shareable encoded configuration | lesson link |
| Bundled isolated example | sample demo |
| Adjustable model value | parameter |
| Reproducibility value | seed |
| Regular browser workspace | regular draft |
| Isolated browser workspace | demo draft |
