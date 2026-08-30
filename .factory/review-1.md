# Adversarial first-read review 1 — Parameter Playground

**Verdict: FAIL**

Reviewed 2026-08-30 against the live site at <https://parameter-playground.sociobot.in/> and clean local checkout `545630e9ebc155aaf53e05f0297a60eacd2722df`.

The job, audience, sample flow, and core teaching loop are clear and working. This is a FAIL because route changes leave focus on `<body>`, two public claims are not listed in the claims manifest, and several plain-language/action-label requirements remain open.

## First read — PASS

Fresh 1440×900 and 390×844 contexts opened `/` without storage or scrolling.

| Required question | Answer visible in first viewport |
| --- | --- |
| What does it do? | “Test how one parameter changes a model.” |
| For whom? | “For teachers and self-learners who need predictions, inspectable numbers, and lessons others can replay.” |
| What should I click? | “Try it with sample data”; “The sample opens as a complete route lesson.” |

The three facts (browser-local draft, no account/payment, offline after first visit) were visible at both sizes. There was no page-level horizontal overflow and no console/page error on normal home/demo loads.

## Findings

### F-1-1 — Medium — route changes do not move focus to the destination heading

**Location / evidence:** Click **Demo** on the live home page. It opens `/?demo=1#workbench` and scrolls correctly, but `document.activeElement` is `BODY`; `<h1 id="page-title">` is not focused. Directly opening `/privacy/` produces the same `BODY` focus state.

**Why this matters:** A keyboard or screen-reader visitor reaches a new route/state with no programmatic focus destination or route announcement.

**Fix:** Give route headings `tabindex="-1"`; on demo/hash navigation, `popstate`, and static legal/404 page load, focus the route `<h1>` and update an `aria-live="polite"` route announcement. Add a Playwright test for Demo, Privacy, and browser Back that asserts heading focus and announcement.

### F-1-2 — Low — the populated-demo promise is an unlisted claim

**Location / quote:** Hero action note, `index.html`: “The sample opens as a complete route lesson.”

**Why this matters:** This is an observable promise. The `demo-isolation` manifest entry promises only that the sample never reads/writes a regular draft; its `where` omits the hero action and no claim says the one-click action opens a populated lesson.

**Fix:** Add `demo-populated-workbench` to `.factory/claims.json`; its unique tagged test must open fresh `?demo=1#workbench` and assert the banner, sample title, controls, chart/table, and workbench visibility.

### F-1-3 — Low — public asset-provenance claims are unlisted and untested

**Location / quotes:** Footer: “The opening illustration was generated for this project with Azure AI.” README: “The opening blueprint illustration was generated specifically for this project using the factory Azure AI image model.”

**Why this matters:** These are factual provenance claims visitors can rely on, but they have no `.factory/claims.json` entry or tagged test.

**Fix:** Either remove the public claims while retaining required provenance in `.factory/design.md`, or add a `generated-asset-provenance` claim plus a tagged release-policy test that checks shipped-asset hashes, source-prompt record, generator, and provenance fields.

### F-1-4 — Low — README uses implementation jargon

**Location / quote:** README, “What it includes”: “Each model provides narrated results, metrics, a semantic data table, and CSV export.”

**Why this matters:** “Semantic data table” is implementation jargon, not a useful description for teachers or self-learners.

**Fix:** “Each model provides spoken results, measurements, a table of values, and a CSV download.”

### F-1-5 — Low — model-limit copy uses unexplained jargon

**Location / quote:** Initial route model, “Assumptions & numeric limits”: “This heuristic is fast, but it does not guarantee the shortest possible tour.”

**Why this matters:** “Heuristic” is specialist language in a lesson aimed at teachers and self-learners.

**Fix:** “This rule is quick, but it may not find the shortest route.”

### F-1-6 — Low — seed action does not name a result with a verb

**Location / quote:** Workbench seed button: “New seed”.

**Why this matters:** It is a noun phrase, rather than an action that says what will happen.

**Fix:** “Generate new seed”.

### F-1-7 — Low — share-dialog completion button is ambiguous

**Location / quote:** Clipboard fallback dialog button: “Done”.

**Why this matters:** It does not say whether it copies, saves, or closes.

**Fix:** “Close share dialog”.

### F-1-8 — Low — decorative masthead label carries no product information

**Location / quote:** Desktop masthead: “SHEET 01 / REV A”.

**Why this matters:** It is decorative drafting lore, not useful product/state/action information for a first-time visitor.

**Fix:** Remove it. The blueprint visual system already comes through in the artwork and interface.

## Copy audit

Counting method: every reader-facing sentence, heading, caption, label, link, and button on the landing page/default rendered route lesson and README is listed below. Hyphenated compounds count as one word; numbers/symbols are omitted. Dynamic table values are data rather than sentences. No unit is over 22 words. Flags are F-1-4 through F-1-8.

### Landing page and default route lesson

| Copy unit | Words |
| --- | ---: |
| Parameter Playground | 2 |
| Demo | 1 |
| Workbench | 1 |
| Privacy | 1 |
| SHEET 01 / REV A | 3 |
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
| How it works | 3 |
| Predict, change, inspect, explain | 4 |
| Commit before changing | 3 |
| Move one parameter | 3 |
| Read chart and data | 4 |
| Name cause and effect | 5 |
| Lesson builder | 2 |
| Build a model lesson | 4 |
| Ready online | 2 |
| Copy lesson link | 3 |
| Setup | 1 |
| Choose a model | 3 |
| Nearest-neighbor tour | 2 |
| How local choices shape a route | 6 |
| Logistic population growth | 3 |
| Why growth slows near a limit | 6 |
| Projectile motion | 2 |
| Angle, speed, and a curved path | 6 |
| Teacher setup | 2 |
| Lesson copy and required text alternative | 6 |
| Lesson title | 2 |
| Prediction prompt | 2 |
| Ask about a visible effect that the model can answer. | 10 |
| Visual description required for sharing | 5 |
| Describe the marks and axes, not the conclusion. | 8 |
| Live results are narrated separately. | 5 |
| Model: Route · Seed: 41723 | 3 |
| How clustering changes a delivery route | 6 |
| Every city can connect to every other city. | 8 |
| The route always chooses the nearest unvisited city, then returns to its start. | 13 |
| Assumptions & numeric limits | 3 |
| 5–16 cities; coordinates are synthetic 0–100 units. | 7 |
| This heuristic is fast, but it does not guarantee the shortest possible tour. | 13 |
| Seed: 41723. | 2 |
| Predict | 1 |
| Commit before you move a control | 6 |
| If city clusters tighten, what happens to route length and crossings? | 11 |
| My prediction | 2 |
| Commit prediction | 2 |
| Not committed yet | 3 |
| Vary | 1 |
| Change one parameter | 3 |
| Use a slider or its exact value. | 7 |
| Arrow keys work on every slider. | 6 |
| Reset parameters | 2 |
| Cities | 1 |
| How many locations the route must visit. | 7 |
| Range 5–16. | 3 |
| Clustering | 1 |
| Pulls alternating cities toward two centers. | 6 |
| Range 0–85%. | 3 |
| Starting city | 2 |
| 1 means city A, 2 means B, and so on. | 10 |
| Range 1–9. | 3 |
| Deterministic seed | 2 |
| Same seed + parameters = same result. | 5 |
| New seed | 2 |
| Route recalculated: 176.3 units with 0 crossings. | 8 |
| Inspect | 1 |
| Compare the picture with the values | 6 |
| Simulation plot | 2 |
| Updates with parameters | 3 |
| Underlying values | 2 |
| Values behind the chart | 4 |
| Scroll sideways to inspect all columns on a small screen. | 10 |
| Export data as CSV | 4 |
| Explain | 1 |
| Name what changed and what followed | 6 |
| I changed | 2 |
| and observed | 2 |
| Complete explanation | 2 |
| Explanation not complete | 3 |
| Parameter Playground keeps lesson drafts in this browser. | 8 |
| Terms | 1 |
| Source (external) | 2 |
| Built by Param Factory · Version 1.0.0 | 6 |
| The opening illustration was generated for this project with Azure AI. | 11 |

### README

| Sentence or heading | Words |
| --- | ---: |
| Parameter Playground | 2 |
| Build replayable parameter model lessons for teachers and self-learners. | 9 |
| Each lesson follows four steps: predict, vary, inspect, and explain. | 9 |
| Live site | 2 |
| Sample demo | 2 |
| What it includes | 4 |
| Three bounded templates cover nearest-neighbor tours, logistic growth, and ideal projectile motion. | 11 |
| The same seed and parameters reproduce the same displayed values. | 9 |
| Teachers can edit the title, prediction prompt, and required visual description. | 11 |
| Each model provides narrated results, metrics, a semantic data table, and CSV export. | 12 |
| A copied link restores the lesson settings without a server account. | 11 |
| Learners can complete the prediction and explanation flow without an account or payment. | 13 |
| Regular drafts stay in browser local storage and survive a refresh. | 10 |
| The app works offline after the first successful visit. | 9 |
| Each model shows its assumptions and numeric limits. | 8 |
| This is an explanatory classroom instrument, not a general code runner, computer algebra system, or real-world safety calculator. | 17 |
| Try the isolated demo | 4 |
| Open the sample demo in one click. | 8 |
| It loads a complete route lesson and labels the page as a demo. | 13 |
| Demo changes use the separate demo:parameter-playground-draft key. | 6 |
| They never read or write your regular draft. | 8 |
| Use Reset demo to restore the sample. | 7 |
| Use Start for real to discard demo changes and return to your regular draft. | 14 |
| Run locally | 2 |
| Requires Node.js 20 or newer. | 5 |
| Then open the local URL printed by Vite. | 9 |
| Verify | 1 |
| Run all gates in sequence with npm run check. | 9 |
| Playwright is pinned to 1.58.2; install its Chromium build with npx playwright install chromium if it is not already available. | 18 |
| Deploy | 1 |
| The deploy artifact is the static dist/ directory created by exactly: | 11 |
| dist/index.html is the application entry point. | 5 |
| public/staticwebapp.config.json supplies Azure Static Web Apps routing and security headers. | 9 |
| Privacy and assets | 3 |
| Draft lesson settings stay in browser local storage. | 8 |
| Shared lesson settings live in the URL. | 8 |
| The app adds no accounts, analytics, ads, tracking pixels, or third-party runtime requests. | 12 |
| See the privacy page for details. | 7 |
| The opening blueprint illustration was generated specifically for this project using the factory Azure AI image model. | 16 |
| Its source, prompt sidecar, and provenance are in assets/src/ and .factory/design.md. | 10 |
| Atkinson Hyperlegible is self-hosted from the SIL Open Font License release distributed by Google Fonts. | 15 |
| License | 1 |
| Application code is available under the MIT License. | 9 |

## Demo and sandbox — PASS

- The hero **Try it with sample data** action reaches `/?demo=1#workbench` in one click.
- The initial demo viewport already shows the populated **How clustering changes a delivery route** workbench; the home `<h1>` is out of view.
- A persistent **“Demo — sample data, nothing is saved”** banner includes **Reset demo** and **Start for real**.
- In a fresh 390px live context seeded with a regular-draft sentinel, editing changed only `demo:parameter-playground-draft`; Reset removed that key and retained the regular sentinel.
- The demo request log recorded only `https://parameter-playground.sociobot.in`.

## Claims — PASS for the 12 listed entries

After `npm ci`, every exact command in `.factory/claims.json` passed in both configured Playwright projects (24 executions): `demo-isolation`, `three-bounded-models`, `slider-arrow-keys`, `deterministic-seed`, `lesson-editing`, `shareable-preset`, `csv-export`, `local-draft`, `no-account-payment`, `same-origin-privacy`, `offline-reload`, and `accessible-inspection`.

`npm test` passed (12/12); `npm run build` produced `dist/`; and `npm run test:e2e` passed (62/62 configured desktop/mobile tests).

## Structure, history, and leverage checks

- All crawled links returned expected results: home, demo, Privacy, Terms, 404 asset, robots, sitemap, favicon, apple-touch icon, and external Source returned 200; an unknown path returned the designed page with HTTP 404.
- Home, demo, Privacy, Terms, and 404 have the required title pattern, one `<h1>`, description, canonical, favicon/social metadata, and no normal-load console errors. Live headers include restrictive CSP, HSTS, nosniff, and referrer policy.
- The blueprint/drafting visual identity matches `.factory/design.md` and is not a generic SaaS template. An AI runtime feature would be decorative here; CSV export and shareable URLs cover the brief’s obvious export/share leverage.
- No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. Earlier verification findings (CSV download; claims/demo; first-screen audience; touch targets; metadata/404; slider keys; contextual city bounds; invalid-value announcements; privacy fact; fractional seed) were independently confirmed fixed in live code and the passing suite.

## What would make this perfect

Implement route focus/announcement, inventory or remove the two public claims, and apply the five concrete plain-language/action-label edits. The first-read, demo, core flow, privacy, visual identity, and declared claims are otherwise in good shape.
