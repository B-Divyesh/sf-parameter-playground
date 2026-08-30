# Parameter Playground demo sandbox

## Entry point

Open `https://parameter-playground.sociobot.in/?demo=1#workbench` in production or `http://127.0.0.1:4173/?demo=1#workbench` during local verification.

The home page exposes this in one click as **Try it with sample data**. The page title changes to **Demo — Parameter Playground**, and a persistent demo banner identifies the sandbox.

## Sample data

The demo opens **How clustering changes a delivery route**. It uses nine synthetic cities, 65% clustering, starting city B, and deterministic seed 41723. It includes an authored prediction prompt, chart description, route metrics, narrated result, and complete values table.

## Storage isolation

Demo edits use only `demo:parameter-playground-draft`. Demo mode never reads or writes the regular `parameter-playground-draft` key. Learner prediction and explanation text stays in memory in both modes.

**Reset demo** deletes the demo key, clears learner answers, and restores the bundled sample. **Start for real** deletes the demo key before navigating to the regular workbench. A regular draft remains untouched throughout.

The Playwright claim `@claim:demo-isolation` verifies the separation with a sentinel regular draft in a fresh browser context.
