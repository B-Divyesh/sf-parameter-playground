# Adversarial first-read review 3 — Parameter Playground

**Verdict: PASS**

Reviewed 2026-09-01 against the live site at <https://parameter-playground.sociobot.in/> and a clean clone of commit `985e633720e8753faa923133f4a262f15384af38`.

No blocking or minor finding remains. The cold first screen is clear at 390×844 and 1440×900, the one-click demo immediately shows a realistic result, all 14 declared claims pass from a clean clone, every earlier finding is fixed on the live site and in code, and the route, privacy, accessibility, copy, and visual-identity checks pass.

## First read

Fresh contexts opened `/` with empty browser state, no scrolling, and no prior product context.

| Required question | Answer visible before scrolling | Result |
| --- | --- | --- |
| What does this do? | “Test how one parameter changes a model.” | PASS |
| For whom? | “For teachers and self-learners who want to predict changes, check the numbers, and share lessons.” | PASS |
| What should I click first? | “Try it with sample data”; the adjacent line says, “The sample opens as a complete route lesson.” | PASS |

At 390×844, the headline, audience sentence, primary action, outcome note, and all three facts end at y=680 in an 844 px viewport. At 1440×900 they end at y=708. Neither viewport has page-level horizontal overflow. The home page produced no console or page errors.

## Findings

None.

## Copy audit

Method: every reader-facing sentence, heading, label, link, button, status, and conditional message on the landing page/default workbench and sample state is listed. README headings and sentences are also listed. Hyphenated compounds count as one word; symbols and numeric-only step labels are omitted. No unit exceeds 22 words, no banned marketing word appears, headings identify their sections, and every button names its action or result.

### First screen

| Copy unit | Words | Flag |
| --- | ---: | --- |
| Parameter Playground | 2 | — |
| Skip to playground | 3 | — |
| Demo | 1 | — |
| Workbench | 1 | — |
| Privacy | 1 | — |
| Parameter simulations for lessons | 4 | — |
| Test how one parameter changes a model | 7 | — |
| For teachers and self-learners who want to predict changes, check the numbers, and share lessons. | 14 | — |
| Try it with sample data | 5 | — |
| Start with your own lesson | 5 | — |
| The sample opens as a complete route lesson. | 8 | — |
| Drafts are stored in this browser | 6 | — |
| No account or payment | 4 | — |
| Works offline after first visit | 5 | — |
| Route study / nearest-neighbor sketch | 4 | — |

### Landing page and sample workbench

| Copy unit | Words | Flag |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 6 | — |
| Your regular draft stays untouched. | 5 | — |
| Reset demo | 2 | — |
| Start for real | 3 | — |
| How it works | 3 | — |
| Predict, change, inspect, explain | 4 | — |
| Predict | 1 | — |
| Commit before changing | 3 | — |
| Change | 1 | — |
| Move one parameter | 3 | — |
| Inspect | 1 | — |
| Read chart and data | 4 | — |
| Explain | 1 | — |
| Name cause and effect | 5 | — |
| Lesson builder | 2 | — |
| Build a model lesson | 4 | — |
| Sample lesson | 2 | — |
| How clustering changes a delivery route | 6 | — |
| Cities: 9 | 2 | — |
| Route length: 176.3 units | 4 | — |
| Ready online | 2 | — |
| Offline — saved shell ready | 4 | — |
| Copy lesson link | 3 | — |
| Setup | 1 | — |
| Choose a model | 3 | — |
| Nearest-neighbor tour | 2 | — |
| How local choices shape a route | 6 | — |
| Logistic population growth | 3 | — |
| Why growth slows near a limit | 6 | — |
| Projectile motion | 2 | — |
| Angle, speed, and a curved path | 6 | — |
| Teacher setup | 2 | — |
| Lesson copy and required text alternative | 6 | — |
| Lesson title | 2 | — |
| Prediction prompt | 2 | — |
| Ask about a visible effect that the model can answer. | 10 | — |
| Visual description required for sharing | 5 | — |
| Describe the marks and axes, not the conclusion. | 8 | — |
| Live results are narrated separately. | 5 | — |
| Model: Route · Seed: 41723 | 4 | — |
| Every city can connect to every other city. | 8 | — |
| The route always chooses the nearest unvisited city, then returns to its start. | 13 | — |
| Assumptions & numeric limits | 3 | — |
| 5–16 cities; coordinates are synthetic 0–100 units. | 7 | — |
| This rule is quick, but it may not find the shortest route. | 12 | — |
| Seed: 41723. | 2 | — |
| Commit before you move a control | 6 | — |
| If city clusters tighten, what happens to route length and crossings? | 11 | — |
| My prediction | 2 | — |
| I predict… because… | 3 | — |
| Commit prediction | 2 | — |
| Not committed yet | 3 | — |
| Change one parameter | 3 | — |
| Use a slider or its exact value. | 7 | — |
| Arrow keys work on every slider. | 6 | — |
| Reset parameters | 2 | — |
| Cities | 1 | — |
| How many locations the route must visit. | 7 | — |
| Range 5–16. | 2 | — |
| Clustering | 1 | — |
| Pulls alternating cities toward two centers. | 6 | — |
| Range 0–85%. | 2 | — |
| Starting city | 2 | — |
| 1 means city A, 2 means B, and so on. | 10 | — |
| Range 1–9. | 2 | — |
| Repeatable seed | 2 | — |
| Same seed + parameters = same result. | 5 | — |
| Generate new seed | 3 | — |
| Route recalculated: 176.3 units with 0 crossings. | 8 | — |
| Compare the picture with the values | 6 | — |
| Simulation plot | 2 | — |
| Nearest-neighbor tour plot | 3 | — |
| Updates with parameters | 3 | — |
| A coordinate plane of labeled cities joined by a red nearest-neighbor route; pale dashed lines show all possible city pairs. | 20 | — |
| Current result: The nearest-neighbor route visits 9 cities, starts at B, measures 176.3 units, and has 0 crossings. | 18 | — |
| Underlying values | 2 | — |
| Values behind the chart | 4 | — |
| Scroll sideways to inspect all columns on a small screen. | 10 | — |
| Nearest-neighbor tour values. | 3 | — |
| Export data as CSV | 4 | — |
| Name what changed and what followed | 6 | — |
| I changed | 2 | — |
| and observed | 2 | — |
| Describe a measurable effect in your own words. | 8 | — |
| Complete explanation | 2 | — |
| Explanation not complete | 3 | — |
| Copy the lesson link | 4 | — |
| Clipboard access is unavailable. | 4 | — |
| Select and copy this URL manually. | 6 | — |
| Shareable URL | 2 | — |
| Close share dialog | 3 | — |
| Parameter Playground keeps lesson drafts in this browser. | 8 | — |
| Terms | 1 | — |
| Source (external) | 2 | — |
| Built by Param Factory · Version 1.0.0 | 6 | — |

### Conditional and feedback copy

| Copy unit | Words | Flag |
| --- | ---: | --- |
| Saved demo values outside this model’s limits were replaced. | 9 | — |
| Shared lesson loaded. | 3 | — |
| Values outside this model’s limits were replaced. | 7 | — |
| Nothing was fetched from a server. | 6 | — |
| Every value is encoded in this link. | 7 | — |
| That lesson link was damaged, so a safe starter lesson was opened instead. | 13 | — |
| Saved values outside this model’s limits were replaced. | 8 | — |
| Draft could not be saved in this browser. | 8 | — |
| The playground still works. | 4 | — |
| Add the lesson title, prediction prompt, and visual description before sharing. | 11 | — |
| Lesson link copied. | 3 | — |
| It includes the model, prompt, description, seed, and current parameters. | 10 | — |
| Clipboard access was unavailable. | 4 | — |
| The link is ready for manual copy. | 7 | — |
| Parameters returned to this model’s starter values. | 7 | — |
| The sample lesson returned to its starting values. | 8 | — |
| CSV exported with the values currently shown. | 7 | — |
| New repeatable seed 41723 applied. | 5 | — |
| Repeatable seed needs a whole number from 1 to 999999. | 10 | — |
| The previous value was kept. | 6 | — |
| Repeatable seed uses whole numbers. | 5 | — |
| 2.5 was changed to 3. | 5 | — |
| Write a prediction before committing it. | 6 | — |
| Prediction committed — now test it. | 5 | — |
| Prediction committed | 2 | — |
| Describe an observed effect to finish. | 6 | — |
| Complete: you changed clustering and named an effect. | 8 | — |
| Offline setup was unavailable. | 4 | — |
| The live playground still works. | 5 | — |
| Demo sample lesson loaded. | 4 | — |
| Lesson builder loaded. | 3 | — |
| Parameter Playground home loaded. | 4 | — |

### README

| Copy unit | Words | Flag |
| --- | ---: | --- |
| Parameter Playground | 2 | — |
| Build replayable parameter model lessons for teachers and self-learners. | 9 | — |
| Each lesson follows four steps: predict, change, inspect, and explain. | 9 | — |
| Live site | 2 | — |
| Sample demo | 2 | — |
| What it includes | 3 | — |
| Three models cover nearest-neighbor routes, logistic growth, and ideal projectile motion. | 10 | — |
| Each model has fixed input limits. | 6 | — |
| The same seed and parameters reproduce the same displayed values. | 9 | — |
| Teachers can edit the title, prediction prompt, and required visual description. | 11 | — |
| Each model provides spoken results, measurements, a table of values, and a CSV download. | 14 | — |
| A copied link restores the lesson settings without a server account. | 11 | — |
| Learners can complete the prediction and explanation flow without an account or payment. | 13 | — |
| Regular drafts stay in browser local storage and survive a refresh. | 10 | — |
| The app works offline after the first successful visit. | 9 | — |
| Each model shows its assumptions and numeric limits. | 8 | — |
| The models are for classroom explanation, not custom code or real-world decisions. | 11 | — |
| Try the isolated demo | 4 | — |
| Open the sample demo in one click. | 8 | — |
| It loads a complete route lesson and labels the page as a demo. | 13 | — |
| Demo changes use the separate demo storage key. | 7 | — |
| They never read or write your regular draft. | 8 | — |
| Use Reset demo to restore the sample. | 7 | — |
| Use Start for real to discard demo changes and return to your regular draft. | 14 | — |
| Run locally | 2 | — |
| Then open the local URL printed by Vite. | 9 | — |
| Verify | 1 | — |
| Run all gates in sequence with npm run check. | 9 | — |
| Deploy | 1 | — |
| Privacy and assets | 3 | — |
| Draft lesson settings stay in browser local storage. | 8 | — |
| Shared lesson settings live in the URL. | 8 | — |
| The app adds no accounts, analytics, ads, tracking pixels, or third-party runtime requests. | 12 | — |
| See the privacy page for details. | 7 | — |
| License | 1 | — |
| MIT License | 2 | — |

### Terminology and claims check

| Concept | One term used |
| --- | --- |
| Selectable simulation | model |
| Parameter adjustment step | change |
| Saved teacher configuration | lesson draft |
| Shareable encoded configuration | lesson link |
| Bundled isolated example | sample demo |
| Adjustable model value | parameter |
| Reproducibility value | seed |
| Regular browser workspace | regular draft |
| Isolated browser workspace | demo draft |

The landing page and README contain no unlisted product claim. Functional statements map to the 14 entries in `.factory/claims.json`; local run, verification, and deploy lines are commands that were executed successfully during this review.

## Demo and sandbox

- One click on **Try it with sample data** opens `/?demo=1#workbench`.
- At 390×844, the first post-click viewport contains the persistent demo banner and a populated snapshot: “How clustering changes a delivery route,” “Cities: 9,” “Route length: 176.3 units,” and the route chart. At desktop size, the first viewport contains the populated lesson title, prompt, and required chart description.
- The banner says “Demo — sample data, nothing is saved” and includes **Reset demo** and **Start for real**.
- With a sentinel regular draft present, editing the sample created only `demo:parameter-playground-draft`; `parameter-playground-draft` remained byte-for-byte unchanged. Reset removed the demo key and restored the sample. Start for real removed the demo key and loaded the untouched regular draft.
- The full observed demo flow requested only `https://parameter-playground.sociobot.in` resources. The dedicated offline claim context cached the shell, disconnected, reloaded, and kept the sample usable.

## Claims

The clean clone was `/tmp/parameter-playground-review3.a1KDfc/repo`. `npm ci` completed with no vulnerabilities. Every exact `test` command in `.factory/claims.json` ran separately; each ran both configured projects.

| Claim id | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `demo-populated-workbench` | PASS |
| `three-models-with-limits` | PASS |
| `slider-arrow-keys` | PASS |
| `deterministic-seed` | PASS |
| `lesson-editing` | PASS |
| `shareable-preset` | PASS |
| `csv-export` | PASS |
| `local-draft` | PASS |
| `no-account-payment` | PASS |
| `same-origin-privacy` | PASS |
| `offline-reload` | PASS |
| `accessible-inspection` | PASS |
| `bounded-educational-scope` | PASS |

Result: 28/28 claim executions passed. Each manifest id has exactly one matching `@claim:<id>` test. No claim is untested.

## Earlier findings

Every item in `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`, `.factory/polish-2.md`, and the current handoff was checked against both the deployed page and repository source.

| Earlier id | Independent confirmation | Result |
| --- | --- | --- |
| F-1-1 | Demo, Privacy, Terms, 404, and browser Back focus the route `<h1>` and update the polite announcer. | FIXED |
| F-1-2 | The populated-demo claim and unique tagged test exist and pass in both projects. | FIXED |
| F-1-3 | Public Azure asset-provenance copy is absent; provenance remains in `.factory/design.md`. | FIXED |
| F-1-4 | README uses “spoken results, measurements, a table of values, and a CSV download.” | FIXED |
| F-1-5 | The route limit says, “This rule is quick, but it may not find the shortest route.” | FIXED |
| F-1-6 | The seed action says “Generate new seed.” | FIXED |
| F-1-7 | The fallback action says “Close share dialog.” | FIXED |
| F-1-8 | “SHEET 01 / REV A” is absent from live copy and source. | FIXED |
| F-2-1 | The 390 px demo’s initial viewport contains sample title, parameter, metric, and chart. | FIXED |
| F-2-2 | The audience sentence now says “predict changes, check the numbers, and share lessons.” | FIXED |
| F-2-3 | “Change” is used consistently for the parameter-adjustment step. | FIXED |
| F-2-4 | User-facing copy uses “Repeatable seed.” | FIXED |
| F-2-5 | README and the interface use “models”; README states fixed input limits plainly. | FIXED |
| F-2-6 | `bounded-educational-scope` is listed and its fixed-model/no-code test passes. | FIXED |
| F-2-7 | The untested Node version promise is absent. | FIXED |
| F-2-8 | The unneeded Playwright-version promise is absent. | FIXED |
| F-2-9 | The unlisted deploy-artifact sentence is absent; the documented build command succeeds. | FIXED |
| F-2-10 | The unlisted application-entry sentence is absent. | FIXED |
| F-2-11 | The unlisted hosting-header sentence is absent; live headers and routing were checked directly. | FIXED |
| F-2-12 | The public font-provenance claim is absent; required internal records remain. | FIXED |
| F-2-13 | README now links directly to the shipped MIT license without the unlisted availability sentence. | FIXED |
| F-2-14 | Demo title, description, canonical, Open Graph, and Twitter metadata identify the demo route. | FIXED |
| F-2-15 | `sitemap.xml` includes `/?demo=1`. | FIXED |

No earlier id is reopened.

## Structure, accessibility, privacy, and quality gates

- `/`, `/?demo=1#workbench`, `/privacy/`, `/terms/`, `/404.html`, and an unknown route each have `lang="en"`, one `<h1>`, one `<main>`, complete title/description/canonical/OG/favicon metadata, a consistent header, and the required footer content. Home and demo titles follow the product-purpose and route patterns.
- The direct unknown URL returns HTTP 404 with the designed blueprint-style page and working exits. The explicit `/404.html` asset returns 200 as expected.
- The crawl confirmed 200 responses for every in-scope link: Home, Demo, Workbench, Privacy, Terms, Source, skip links, favicon, apple-touch icon, social image, robots, and sitemap. The only crawled 404 was the intentionally unknown review URL.
- Deep links, browser Back, route focus, polite announcements, keyboard navigation, slider arrows, 44 px mobile targets, 390 px layout, and reduced-motion behavior pass. Axe found no serious or critical issue on the workbench, legal pages, or 404.
- The live response includes a matching self-only CSP, `frame-ancestors 'none'`, HSTS, nosniff, strict-origin referrer policy, and permissions policy. No external runtime request or console error appeared.
- The blueprint drafting-sheet identity matches `.factory/design.md`: paper grid, ink/cyan/correction-pencil palette, square construction-line controls, self-hosted Atkinson Hyperlegible, original workbench art, and restrained explanatory motion. It is not a generic SaaS template.
- `npm test` passed 13/13. `npm run build` produced `dist/`. Initial application JavaScript is 25,563 bytes raw across the three built modules and remains well below the static-product budget. The full live Playwright suite passed 72/72.

## Missed leverage

No missing high-value feature is implied by the brief. Shareable encoded lesson links cover reuse, CSV covers export, and browser-local drafts cover continuity. An AI-generated prediction or explanation would replace the learner reasoning the product is designed to elicit; no AI feature is warranted. Account sync would conflict with the local-first, no-account scope.

## What would make this perfect

Nothing remains to fix within the researched scope and review contract. Adding AI, accounts, or general code execution would weaken the bounded, inspectable teaching job rather than complete it.
