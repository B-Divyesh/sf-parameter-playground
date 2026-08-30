# Parameter Playground — visual thesis

## Direction: a working blueprint, not a polished black box

The product looks like a drafting sheet on a teacher's desk: blue-black ink, cyan construction lines, ruled measurements, paper grain, and one warm correction-pencil accent. This fits the job because every simulation is presented as something a learner can check and revise. The construction marks make inputs and consequences feel connected; the warm annotations make the teaching loop—predict, change, inspect, explain—easy to scan. It is intentionally single-mode: the pale drafting paper is part of the product metaphor and avoids turning a lesson into generic dashboard chrome.

## Tokens

- Paper/background: `#f3f0df`; raised sheet: `#fbf9ed`; deep ink: `#102d3d`; muted ink: `#47616a`.
- Blueprint: `#087b93`; blueprint-dark/link: `#005f73`; fine grid: `rgba(8,123,147,.11)`.
- Correction pencil/accent: `#b63d27`; dark accent: `#8f2718`; success: `#28775a`; warning: `#8a5a00`; danger: `#a6302a`.
- Text and essential outlines meet 4.5:1 on paper; color is always paired with shape or copy.
- Type: self-hosted Atkinson Hyperlegible (regular/bold) for teaching copy and labels; system monospace for values, seed codes, measurements, and drafting notes. The high-legibility face supports learners with low vision while the mono detail voice evokes technical plans.
- Type scale: 14 / 16 / 20 / 28 / clamp(38–64) px. Body is never below 16px; utility notes may be 14px.
- Spacing follows an 8px rhythm with 4px only for tight label/value relationships. Content measure is 72ch.

## Layout and interaction grammar

- A slim masthead and wide opening sheet state the job immediately. The original illustration is a contextual margin artifact, not a decorative hero billboard.
- The workspace follows the teaching sequence in four numbered drafting stations. Station 2 is the active control surface; the canvas and data sheet sit side by side on wide screens and stack at 900px.
- Rules, ticks, cross-hairs, leader lines, and clipped corners replace generic rounded-card UI. Controls use square-ish 2–6px radii.
- Parameter changes update immediately. The changed value briefly receives an ink wash; the route redraw uses a 220ms stroke/fade. A live status sentence confirms the measurable effect.
- Buttons depress by 1px. Focus uses a 3px warm pencil outline with a 3px offset. Touch targets are at least 44px.
- On a 390px phone: the illustration and secondary masthead note drop, controls stack, the chart gets horizontal breathing room without page overflow, and the data table becomes a scroll region with an explicit hint.

## Motion policy

Motion is sparse and explanatory: 180ms control feedback and a 240ms opacity/stroke reveal when the route changes. Nothing loops. With `prefers-reduced-motion: reduce`, transitions and canvas animation are disabled and updates are instantaneous; state and hierarchy remain unchanged.

## Original asset plan and provenance

- `public/assets/blueprint-workbench-960.webp` and `public/assets/blueprint-workbench-1536.webp`: responsive crops of a wide, text-free editorial still-life of drafting tools and a route sketch. It clarifies the product metaphor but never substitutes for the live simulation.
- `public/assets/social-preview.jpg`: a 1200×630 center crop derived from the same original illustration. `public/apple-touch-icon.png` is a 180×180 crop from that original art. Neither derivative introduces third-party material.
- Generation prompt (use case `scientific-educational`): “Website hero margin illustration for an accessible algorithm simulation builder. Overhead view of a cream drafting sheet on a deep navy architect desk, precise cyan graph nodes connected by one red-orange route, brass compass, transparent ruler, graphite pencil, subtle measurement ticks and paper fibers. Calm editorial gouache with crisp technical ink, flat perspective, restrained blueprint palette (#f3f0df, #102d3d, #087b93, #c84b31), directional desk light, generous negative space, no people. No text, no letters, no numerals, no watermark, no logos, no UI screenshot, no gradients.”
- Generator: Azure AI Foundry `factory-image` via `/opt/fleet/lib/gen-image.sh`; generated 2026-08-28. Original project asset, no third-party source material. The source PNG and prompt sidecar are retained under `assets/src/`; the optimized WebP ships.
- Interface icons are small, hand-authored inline SVG marks (share, reset, link) using the same stroke grammar.
- Demo mode uses a pale cyan drafting notice with the same square controls and ink outlines. It stays visually distinct without adding a second product theme.

## State design

- Empty prediction/explanation fields have useful prompts and visible “not saved yet” state, but never invent learner answers.
- Invalid numeric input is constrained at the control and announced inline; corrupted or out-of-range URL settings are safely replaced and explained in a status note.
- Offline use is an explicit success state after the first visit: the local service worker caches the shell; sharing copies an encoded URL and explains that the recipient needs the app once if offline.
- Clipboard failure falls back to a selected share URL field and a plain-language instruction.
