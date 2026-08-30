# Adversarial first-read review 2 — Parameter Playground

**Verdict: FAIL**

Reviewed 2026-08-30 against the live site at <https://parameter-playground.sociobot.in/> and a clean clone of commit `0532ef4f3721306f1bb571bff7aaf18d749c8584`.

The cold landing screen is clear, every declared claim test passes, the demo is isolated, and all round-one findings remain fixed. The review still fails because the 390 px demo does not show realistic sample content in its first post-click viewport. Four copy issues, eight unlisted README claims, and two route-metadata issues also remain.

## First read

Fresh 390×844 and 1440×900 browser contexts opened `/` with no storage and without scrolling.

| Required question | First-screen answer | Result |
| --- | --- | --- |
| What does this do? | It lets someone change one parameter in a model and inspect the result: “Test how one parameter changes a model.” | PASS |
| For whom? | Teachers and self-learners who make replayable model lessons. | PASS |
| What should I click first? | “Try it with sample data”; the adjacent note says it opens a complete route lesson. | PASS |

The three facts about browser storage, account/payment, and offline use are visible in both viewports. The home page produced no console or page errors.

## Findings

### F-2-1 — BLOCKING — the mobile demo does not show the populated sample in its first screen

**Location / evidence:** At 390×844, one click on **Try it with sample data** opens `/?demo=1#workbench` at `scrollY = 1180`. The first viewport contains the 157 px demo banner, “Build a model lesson,” the share button, the three model choices, and the top of “Teacher setup.” The first populated field, **Lesson title: How clustering changes a delivery route**, begins at y=863, below the 844 px viewport. The active lesson title begins at y=1369, parameters at y=2464, chart at y=3827, and data table at y=4454. No sample value, model output, chart, table row, or completed learner state is visible.

**Why this fails the first-time visit:** The attached demo contract requires the first screen after the click to show the product being used with realistic sample data. On a phone, this screen looks like setup navigation rather than a completed sample. The current `demo-populated-workbench` test only requires the generic “Build a model lesson” heading to be in the viewport; it confirms that sample elements exist elsewhere in the document, not that the visitor sees them.

**Concrete fix:** For the mobile demo entry, put a compact populated result directly below the demo banner: the sample lesson title, at least one sample parameter, the current route metric, and the chart or a useful chart preview. Collapse or move model selection and teacher setup below that result. Extend `@claim:demo-populated-workbench` to assert that sample-specific content and output intersect the initial 390×844 viewport.

### F-2-2 — Low — “inspectable numbers” is jargon

**Location / quote:** Landing hero: “For teachers and self-learners who need predictions, **inspectable numbers**, and lessons others can replay.”

**Why:** “Inspectable” is an implementation-flavored adjective. A first-time teacher should not need to interpret it.

**Rewrite:** “For teachers and self-learners who want to predict changes, check the numbers, and share lessons.”

### F-2-3 — Low — the same step is called both “Vary” and “change”

**Location / quotes:** Method step “Vary”; section heading “Change one parameter”; README “Each lesson follows four steps: predict, vary, inspect, and explain.”; hero headline “changes a model.”

**Why:** The plain-words rule requires one term for one concept. “Change” is already the clearer and more common term.

**Rewrite:** Rename the method step to “Change” and write: “Each lesson follows four steps: predict, change, inspect, and explain.”

### F-2-4 — Low — “Deterministic seed” is unexplained jargon at the label

**Location / quote:** Workbench label: “Deterministic seed.”

**Why:** The help text explains the behavior, but the label itself uses a specialist term before the explanation.

**Rewrite:** “Repeatable seed”; keep “Same seed + parameters = same result.” immediately below it.

### F-2-5 — Low — the README uses “bounded templates” and changes the product term

**Location / quote:** README: “Three bounded templates cover nearest-neighbor tours, logistic growth, and ideal projectile motion.” The interface says “Choose a model.”

**Why:** “Bounded” is technical, and “templates” competes with the interface term “models.”

**Rewrite:** “Three models cover nearest-neighbor routes, logistic growth, and ideal projectile motion. Each model has fixed input limits.”

### F-2-6 — Low — the product-scope promise is not in the claims manifest

**Location / quote:** README: “This is an explanatory classroom instrument, not a general code runner, computer algebra system, or real-world safety calculator.”

**Why:** This is a safety and scope promise a teacher can rely on. No `.factory/claims.json` entry asserts the absence of arbitrary code execution or safety-calculator positioning.

**Concrete fix:** Add a `bounded-educational-scope` claim and tagged test that confirms only the three vetted models are exposed and no code-entry surface exists, or shorten this to non-claiming documentation of intended use.

### F-2-7 — Low — the Node.js compatibility statement is an unlisted claim

**Location / quote:** README: “Requires Node.js 20 or newer.”

**Why:** No claim entry runs the build and tests on Node.js 20, and `package.json` has no `engines` declaration.

**Concrete fix:** Add an exact Node 20 CI/claim test and `engines.node`, or state only the version actually verified in release automation.

### F-2-8 — Low — the Playwright pin statement is an unlisted claim

**Location / quote:** README: “Playwright is pinned to 1.58.2; install its Chromium build with `npx playwright install chromium` if it is not already available.”

**Why:** `package.json` currently supports the statement, but no claims entry guarantees the pin or documented install command.

**Concrete fix:** Add a tagged release claim that checks the exact package version and command, or remove the version promise from reader-facing copy.

### F-2-9 — Low — the exact build-artifact statement is an unlisted claim

**Location / quote:** README: “The deploy artifact is the static `dist/` directory created by exactly: `npm run build`.”

**Why:** The build passed, but the public claim has no `.factory/claims.json` entry with an observable assertion about `dist/`.

**Concrete fix:** Add a `static-build-artifact` claim whose test runs the command and verifies the expected deploy files under `dist/`.

### F-2-10 — Low — the application-entry statement is an unlisted claim

**Location / quote:** README: “`dist/index.html` is the application entry point.”

**Why:** This is independently testable release behavior but is absent from the claims manifest.

**Concrete fix:** Cover it in `static-build-artifact` and assert that `dist/index.html` exists and loads the built application.

### F-2-11 — Low — the routing and security-header statement is an unlisted claim

**Location / quote:** README: “`public/staticwebapp.config.json` supplies Azure Static Web Apps routing and security headers.”

**Why:** A repository file cannot prove what the deployed response sends. The live response does send the expected headers, but no listed claim checks the deployed or emulated response.

**Concrete fix:** Add a `deployment-routing-headers` claim with an HTTP-level test for the 404 rewrite, CSP, `X-Content-Type-Options`, and `Referrer-Policy`, or remove the promise from the README.

### F-2-12 — Low — the font provenance statement is an unlisted claim

**Location / quote:** README: “Atkinson Hyperlegible is self-hosted from the SIL Open Font License release distributed by Google Fonts.”

**Why:** This is a provenance and licensing statement with no claim entry or tagged asset test.

**Concrete fix:** Add a `font-provenance` claim that verifies the local font files, license text, hashes/source record, and absence of font CDN requests, or keep provenance only in internal design documentation.

### F-2-13 — Low — the MIT availability statement is an unlisted claim

**Location / quote:** README: “Application code is available under the MIT License.”

**Why:** `LICENSE` exists, but the statement is still a public claim without a manifest entry.

**Concrete fix:** Add an `mit-license` release claim that checks the shipped license text and repository link, or remove the sentence while retaining the license file.

### F-2-14 — Low — demo Open Graph metadata still identifies the home route

**Location / evidence:** On `/?demo=1#workbench`, `document.title` and the canonical URL change to “Demo — Parameter Playground” and `/?demo=1`, but `og:title`, `twitter:title`, and `og:url` remain “Parameter Playground — test model changes” and `/`.

**Why:** The demo is a real shareable route. Its social metadata describes a different route and weakens route identity.

**Concrete fix:** When demo mode is selected, update `og:title`, `twitter:title`, `og:url`, and the descriptions to the demo route. Add a direct-demo metadata test.

### F-2-15 — Low — the sitemap omits the demo route

**Location / evidence:** `public/sitemap.xml` lists `/`, `/privacy/`, and `/terms/`, but not `/?demo=1`.

**Why:** The site-structure contract requires the sitemap to list every real route, and the demo is a documented direct entry point with its own title and canonical URL.

**Concrete fix:** Add `https://parameter-playground.sociobot.in/?demo=1` to the sitemap and test that every canonical, indexable route is listed.

## Copy audit

Method: each visible copy unit on the landing/default workbench and isolated sample, plus each README heading or sentence, is counted. Whitespace-separated words and numeric values count; standalone symbols, decorative arrows, and step numbers do not; hyphenated terms count as one. No unit exceeds 22 words and no banned marketing word appears. Flags refer to the findings above.

### Landing page and workbench

| Copy unit | Words | Flag |
| --- | ---: | --- |
| Parameter Playground | 2 | — |
| Skip to playground | 3 | — |
| Demo | 1 | — |
| Workbench | 1 | — |
| Privacy | 1 | — |
| Demo — sample data, nothing is saved | 6 | — |
| Your regular draft stays untouched. | 5 | — |
| Reset demo | 2 | — |
| Start for real | 3 | — |
| Parameter simulations for lessons | 4 | — |
| Test how one parameter changes a model | 7 | — |
| For teachers and self-learners who need predictions, inspectable numbers, and lessons others can replay. | 14 | F-2-2 |
| Try it with sample data | 5 | — |
| Start with your own lesson | 5 | — |
| The sample opens as a complete route lesson. | 8 | — |
| Drafts are stored in this browser | 6 | — |
| No account or payment | 4 | — |
| Works offline after first visit | 5 | — |
| Route study / nearest-neighbor sketch | 4 | — |
| How it works | 3 | — |
| Predict, change, inspect, explain | 4 | F-2-3 |
| Predict | 1 | — |
| Commit before changing | 3 | — |
| Vary | 1 | F-2-3 |
| Move one parameter | 3 | F-2-3 |
| Inspect | 1 | — |
| Read chart and data | 4 | — |
| Explain | 1 | — |
| Name cause and effect | 5 | — |
| Lesson builder | 2 | — |
| Build a model lesson | 4 | — |
| Checking connection… | 2 | — |
| Ready online | 2 | — |
| Offline — saved shell ready | 4 | — |
| Copy lesson link | 3 | — |
| Setup | 1 | — |
| Choose a model | 3 | — |
| Choose a model template | 4 | F-2-5 |
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
| How clustering changes a delivery route | 6 | — |
| Nine labeled cities joined by a red nearest-neighbor route. | 9 | — |
| Pale dashed lines show every possible city pair. | 8 | — |
| Every city can connect to every other city. | 8 | — |
| The route always chooses the nearest unvisited city, then returns to its start. | 13 | — |
| Assumptions & numeric limits | 3 | — |
| 5–16 cities; coordinates are synthetic 0–100 units. | 7 | — |
| This rule is quick, but it may not find the shortest route. | 12 | — |
| Seed: 41723. | 2 | — |
| Commit before you move a control | 6 | — |
| If the cities form tighter clusters, what will happen to route length and crossings? | 14 | — |
| If city clusters tighten, what happens to route length and crossings? | 11 | — |
| My prediction | 2 | — |
| I predict… because… | 3 | — |
| Commit prediction | 2 | — |
| Not committed yet | 3 | — |
| Change one parameter | 3 | F-2-3 |
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
| Deterministic seed | 2 | F-2-4 |
| Same seed + parameters = same result. | 5 | — |
| Generate new seed | 3 | — |
| Route recalculated: 176.3 units with 0 crossings. | 8 | — |
| A coordinate plane of labeled cities joined by a red nearest-neighbor route; pale dashed lines show all possible city pairs. | 20 | — |
| The nearest-neighbor route visits 9 cities, starts at A, measures 205.6 units, and has 0 crossings. | 16 | — |
| The nearest-neighbor route visits 9 cities, starts at B, measures 176.3 units, and has 0 crossings. | 16 | — |
| Compare the picture with the values | 6 | — |
| Simulation plot | 2 | — |
| Nearest-neighbor tour plot | 3 | — |
| Updates with parameters | 3 | — |
| Underlying values | 2 | — |
| Values behind the chart | 4 | — |
| Nearest-neighbor tour values. | 3 | — |
| Scroll sideways to inspect all columns on a small screen. | 10 | — |
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
| New deterministic seed 41723 applied. | 5 | F-2-4 |
| Deterministic seed needs a whole number from 1 to 999999. | 10 | F-2-4 |
| The previous value was kept. | 6 | — |
| Deterministic seed uses whole numbers. | 5 | F-2-4 |
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
| Each lesson follows four steps: predict, vary, inspect, and explain. | 9 | F-2-3 |
| Live site | 2 | — |
| Sample demo | 2 | — |
| What it includes | 3 | — |
| Three bounded templates cover nearest-neighbor tours, logistic growth, and ideal projectile motion. | 11 | F-2-5 |
| The same seed and parameters reproduce the same displayed values. | 9 | — |
| Teachers can edit the title, prediction prompt, and required visual description. | 11 | — |
| Each model provides spoken results, measurements, a table of values, and a CSV download. | 14 | — |
| A copied link restores the lesson settings without a server account. | 11 | — |
| Learners can complete the prediction and explanation flow without an account or payment. | 13 | — |
| Regular drafts stay in browser local storage and survive a refresh. | 10 | — |
| The app works offline after the first successful visit. | 9 | — |
| Each model shows its assumptions and numeric limits. | 8 | — |
| This is an explanatory classroom instrument, not a general code runner, computer algebra system, or real-world safety calculator. | 17 | F-2-6 |
| Try the isolated demo | 4 | — |
| Open the sample demo in one click. | 8 | — |
| It loads a complete route lesson and labels the page as a demo. | 13 | — |
| Demo changes use the separate `demo:parameter-playground-draft` key. | 7 | — |
| They never read or write your regular draft. | 8 | — |
| Use Reset demo to restore the sample. | 7 | — |
| Use Start for real to discard demo changes and return to your regular draft. | 14 | — |
| Run locally | 2 | — |
| Requires Node.js 20 or newer. | 5 | F-2-7 |
| Then open the local URL printed by Vite. | 9 | — |
| Verify | 1 | — |
| Run all gates in sequence with `npm run check`. | 9 | — |
| Playwright is pinned to 1.58.2; install its Chromium build with `npx playwright install chromium` if it is not already available. | 20 | F-2-8 |
| Deploy | 1 | — |
| The deploy artifact is the static `dist/` directory created by exactly: | 11 | F-2-9 |
| `dist/index.html` is the application entry point. | 6 | F-2-10 |
| `public/staticwebapp.config.json` supplies Azure Static Web Apps routing and security headers. | 10 | F-2-11 |
| Privacy and assets | 3 | — |
| Draft lesson settings stay in browser local storage. | 8 | — |
| Shared lesson settings live in the URL. | 8 | — |
| The app adds no accounts, analytics, ads, tracking pixels, or third-party runtime requests. | 12 | — |
| See the privacy page for details. | 7 | — |
| Atkinson Hyperlegible is self-hosted from the SIL Open Font License release distributed by Google Fonts. | 15 | F-2-12 |
| License | 1 | — |
| Application code is available under the MIT License. | 9 | F-2-13 |

### Terminology check

| Concept | Terms found | Result |
| --- | --- | --- |
| Parameter adjustment step | “Vary”, “change” | FAIL — F-2-3 |
| Selectable simulation | “model”, “model template”, “template” | FAIL — F-2-5 |
| Saved teacher state | “lesson draft”, “regular draft”, “demo draft” | PASS — qualifiers distinguish storage namespaces |
| Shared encoded state | “lesson link”, “shared lesson” | PASS |
| Reproducibility value | “deterministic seed”, “seed” | Copy issue — F-2-4 |

All visible button labels name an action or result. No slogan, mood heading, or marketing adjective was found.

## Demo and sandbox verification

- One-click entry: PASS from the landing action to `/?demo=1#workbench`.
- Realistic seeded state: PASS in the document. It contains “How clustering changes a delivery route,” nine cities, 65% clustering, starting city B, seed 41723, authored prompt/description, chart, metrics, and nine table rows.
- First post-click mobile viewport: **FAIL / BLOCKING** as F-2-1.
- Persistent banner: PASS — “Demo — sample data, nothing is saved,” **Reset demo**, and **Start for real** remain present.
- Reset: PASS — editing created only `demo:parameter-playground-draft`; Reset removed it and restored the sample.
- Real-data isolation: PASS — a sentinel `parameter-playground-draft` value was unchanged after editing, resetting, and leaving the demo.
- Requests: PASS — the complete observed live flow contacted only `https://parameter-playground.sociobot.in`.
- Offline: PASS — after the first visit, a fresh dedicated context reloaded the demo offline with the banner, six parameter inputs, and sample title intact.

## Claims verification

Each exact command in `.factory/claims.json` ran separately from clean clone `/tmp/parameter-playground-review2.PFpY69/repo`. Each command ran the desktop and 390 px projects. All 26 executions passed.

| Claim id | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `demo-populated-workbench` | PASS, but its viewport assertion is too weak for the demo contract; see F-2-1 |
| `three-bounded-models` | PASS |
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

The manifest has exactly one tagged test for every listed id. F-2-6 through F-2-13 identify claim-like README sentences with no manifest entry; therefore the claim inventory is incomplete even though every listed test passes.

## Earlier-findings audit

Every finding from `.factory/review-1.md` was checked against the live site and repository code, not accepted from `.factory/polish-1.md` alone.

| Earlier id | Live and code verification | Result |
| --- | --- | --- |
| F-1-1 | Demo, Privacy, Terms, 404, and browser Back focus the `<h1>` and update the polite route announcer; live regression passed in both projects. | FIXED |
| F-1-2 | `demo-populated-workbench` exists once in the manifest and once in the tagged suite; its exact command passed twice. | FIXED, with new viewport issue F-2-1 |
| F-1-3 | Public Azure-generation copy is absent from live UI and README; provenance remains internal in `.factory/design.md`. | FIXED |
| F-1-4 | README now says “spoken results, measurements, a table of values, and a CSV download.” | FIXED |
| F-1-5 | The route limit now says, “This rule is quick, but it may not find the shortest route.” | FIXED |
| F-1-6 | The live action is “Generate new seed.” | FIXED |
| F-1-7 | Forced clipboard failure opens a dialog with “Close share dialog.” | FIXED |
| F-1-8 | “SHEET 01 / REV A” is absent from live UI and source. | FIXED |

No earlier finding is reopened under its old id.

## Structure, accessibility, privacy, and quality gates

- Titles: PASS for home, demo, Privacy, Terms, and 404. Home uses “Parameter Playground — test model changes”; route titles use the route-first pattern.
- Semantics: PASS — each checked route has `lang="en"`, one `<h1>`, `<main>`, a skip link, header, and footer.
- Metadata: PASS for required description, canonical, favicon, apple-touch icon, and base OG/Twitter tags; demo-specific social values fail F-2-14.
- Social artwork: PASS — the live image is 1200×630; the touch icon is 180×180.
- 404: PASS — an unknown URL returns HTTP 404 with the designed “This page does not exist” page and working exits.
- Links: PASS — home, demo, Workbench, Privacy, Terms, Source, favicon, touch icon, robots, and sitemap all resolve; the external Source URL returns 200.
- Routing: PASS — direct links, Demo, Privacy, Back, and focus announcements work. The sitemap inventory fails F-2-15.
- Accessibility: PASS for automated checks — the live verifier reported no console errors, missing alt text, or unlabeled buttons; the 22-test live regression suite passed in desktop/mobile, including axe, keyboard, 44 px targets, focus, and 404/legal routes.
- Security/privacy: PASS — live CSP, HSTS, nosniff, referrer, and permissions headers are present; observed runtime requests were same-origin only.
- Asset budget: PASS — initial JS is 24,178 bytes raw and 9,136 bytes gzip across two bundles; CSS is 20,526 bytes raw and 5,445 bytes gzip.
- Visual identity: PASS — the drafting-paper grid, square outlined controls, technical labels, correction-pencil accent, self-hosted Atkinson type, and original workbench art are distinct from a generic SaaS template and match `.factory/design.md`.

## Missed leverage

No missing AI feature is justified. The job is deterministic inspection, and generated explanations would weaken the learner’s required reasoning step. The brief’s obvious sharing/export needs are covered by encoded lesson links and CSV export. Account sync would conflict with the local-first, no-account scope. No leverage finding is raised.

## What would make this perfect

Put meaningful sample data and an output in the first 390 px demo viewport, adopt one plain term for changing a parameter and one for models, replace the two jargon phrases, inventory or remove every README claim, and complete the demo’s social metadata and sitemap entry. The review can pass only after all 15 findings are closed and the full checklist is rerun.
