import './style.css';
import { initialParameters, templates, type ModelTemplate, type SimulationResult, type TemplateId } from './models';

interface LessonState {
  template: TemplateId;
  title: string;
  prompt: string;
  description: string;
  seed: number;
  params: Record<string, number>;
}

const svgNS = 'http://www.w3.org/2000/svg';
const $ = <T extends HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element ${selector}`);
  return element;
};

const defaultState = (templateId: TemplateId = 'tour'): LessonState => {
  const template = templates[templateId];
  return {
    template: templateId,
    title: template.lesson,
    prompt: template.predictionPrompt,
    description: template.description,
    seed: 41723,
    params: initialParameters(template)
  };
};

function safeText(value: unknown, fallback: string, max: number): string {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : fallback;
}

export function encodeLesson(state: LessonState): string {
  const bytes = new TextEncoder().encode(JSON.stringify(state));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export function decodeLesson(encoded: string): LessonState {
  const padded = encoded.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - encoded.length % 4) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const raw = JSON.parse(new TextDecoder().decode(bytes)) as Partial<LessonState>;
  const templateId: TemplateId = raw.template && raw.template in templates ? raw.template : 'tour';
  const base = defaultState(templateId);
  const template = templates[templateId];
  const incoming = raw.params && typeof raw.params === 'object' ? raw.params : {};
  const params = Object.fromEntries(template.parameters.map((definition) => {
    const candidate = Number(incoming[definition.key]);
    const value = Number.isFinite(candidate) ? Math.min(definition.max, Math.max(definition.min, candidate)) : definition.initial;
    return [definition.key, Math.round(value / definition.step) * definition.step];
  }));
  const seed = Number.isFinite(Number(raw.seed)) ? Math.min(999999, Math.max(1, Math.round(Number(raw.seed)))) : base.seed;
  return {
    template: templateId,
    title: safeText(raw.title, base.title, 80),
    prompt: safeText(raw.prompt, base.prompt, 240),
    description: safeText(raw.description, base.description, 300),
    seed,
    params
  };
}

let state = defaultState();
let result: SimulationResult;
let lastParameter = 'cities';
let renderTimer = 0;

function loadInitialState(): void {
  const encoded = new URLSearchParams(location.search).get('lesson');
  const notice = $('#url-notice');
  if (encoded) {
    try {
      state = decodeLesson(encoded);
      $('#teacher-setup').removeAttribute('open');
      notice.textContent = 'Shared lesson loaded. Every value is encoded in this link; nothing was fetched from a server.';
      notice.hidden = false;
    } catch {
      state = defaultState();
      notice.textContent = 'That lesson link was damaged, so a safe starter lesson was opened instead.';
      notice.classList.add('notice-warning');
      notice.hidden = false;
    }
    return;
  }
  try {
    const draft = localStorage.getItem('parameter-playground-draft');
    if (draft) state = decodeLesson(draft);
  } catch {
    // Storage may be unavailable; the live page remains fully usable.
  }
}

function persistDraft(): void {
  try {
    localStorage.setItem('parameter-playground-draft', encodeLesson(state));
  } catch {
    showToast('Draft could not be saved in this browser. The playground still works.');
  }
}

function currentTemplate(): ModelTemplate {
  return templates[state.template];
}

function el<K extends keyof HTMLElementTagNameMap>(name: K, className?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(name);
  if (className) element.className = className;
  return element;
}

function svgEl(name: string, attributes: Record<string, string | number> = {}): SVGElement {
  const element = document.createElementNS(svgNS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
  return element;
}

function renderModelOptions(): void {
  const container = $('#model-options');
  container.replaceChildren();
  Object.values(templates).forEach((template, index) => {
    const button = el('button', 'model-option');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(template.id === state.template));
    button.dataset.template = template.id;
    const count = el('span', 'model-count');
    count.textContent = `0${index + 1}`;
    const copy = el('span');
    const strong = el('strong');
    strong.textContent = template.name;
    const small = el('small');
    small.textContent = template.lesson;
    copy.append(strong, small);
    button.append(count, copy);
    button.addEventListener('click', () => selectTemplate(template.id));
    container.append(button);
  });
}

function selectTemplate(templateId: TemplateId): void {
  if (templateId === state.template) return;
  state = defaultState(templateId);
  lastParameter = currentTemplate().parameters[0]?.key ?? '';
  syncSetupFields();
  renderModelOptions();
  renderControls();
  renderLesson();
  persistDraft();
  showToast(`${currentTemplate().name} loaded with its starter values.`);
}

function syncSetupFields(): void {
  ($('#lesson-title') as HTMLInputElement).value = state.title;
  ($('#prediction-prompt') as HTMLTextAreaElement).value = state.prompt;
  ($('#visual-description') as HTMLTextAreaElement).value = state.description;
  ($('#seed-input') as HTMLInputElement).value = String(state.seed);
}

function renderControls(): void {
  const template = currentTemplate();
  const container = $('#parameter-controls');
  const changed = $('#changed-parameter') as HTMLSelectElement;
  container.replaceChildren();
  changed.replaceChildren();

  template.parameters.forEach((definition) => {
    const group = el('div', 'parameter');
    const heading = el('div', 'parameter-heading');
    const label = el('label');
    label.htmlFor = `range-${definition.key}`;
    label.textContent = definition.label;
    const output = el('output');
    output.id = `output-${definition.key}`;
    output.htmlFor = `range-${definition.key} number-${definition.key}`;
    output.textContent = `${state.params[definition.key]}${definition.unit ? ` ${definition.unit}` : ''}`;
    heading.append(label, output);

    const controls = el('div', 'paired-inputs');
    const range = el('input') as HTMLInputElement;
    range.type = 'range'; range.id = `range-${definition.key}`;
    range.min = String(definition.min); range.max = String(definition.max); range.step = String(definition.step); range.value = String(state.params[definition.key]);
    range.setAttribute('aria-describedby', `hint-${definition.key}`);
    const number = el('input') as HTMLInputElement;
    number.type = 'number'; number.id = `number-${definition.key}`;
    number.min = String(definition.min); number.max = String(definition.max); number.step = String(definition.step); number.value = String(state.params[definition.key]);
    number.setAttribute('aria-label', `${definition.label} exact value`);
    number.setAttribute('aria-describedby', `hint-${definition.key} error-${definition.key}`);
    const update = (raw: string, source: HTMLInputElement) => {
      const value = Number(raw);
      const error = document.querySelector<HTMLElement>(`#error-${definition.key}`)!;
      if (!raw.trim() || !Number.isFinite(value)) {
        source.value = String(state.params[definition.key]);
        error.textContent = `${definition.label} needs a number from ${definition.min} to ${definition.max}${definition.unit ? ` ${definition.unit}` : ''}. The previous value was kept.`;
        error.hidden = false;
        return;
      }
      error.hidden = true;
      const bounded = Math.min(definition.max, Math.max(definition.min, value));
      state.params[definition.key] = bounded;
      if (definition.key === 'cities') {
        state.params.start = Math.min(state.params.start ?? 1, bounded);
        const startRange = document.querySelector<HTMLInputElement>('#range-start');
        const startNumber = document.querySelector<HTMLInputElement>('#number-start');
        const startOutput = document.querySelector<HTMLOutputElement>('#output-start');
        if (startRange && startNumber && startOutput) {
          startRange.max = String(bounded); startNumber.max = String(bounded);
          startRange.value = String(state.params.start); startNumber.value = String(state.params.start);
          startOutput.textContent = String(state.params.start);
        }
      }
      range.value = String(bounded); number.value = String(bounded);
      output.textContent = `${bounded}${definition.unit ? ` ${definition.unit}` : ''}`;
      lastParameter = definition.key;
      changed.value = definition.key;
      renderLesson(true);
      persistDraft();
    };
    range.addEventListener('input', () => update(range.value, range));
    number.addEventListener('change', () => update(number.value, number));
    controls.append(range, number);
    const hint = el('small');
    hint.id = `hint-${definition.key}`;
    hint.textContent = `${definition.hint} Range ${definition.min}–${definition.max}${definition.unit ? ` ${definition.unit}` : ''}.`;
    const error = el('p', 'parameter-error');
    error.id = `error-${definition.key}`;
    error.setAttribute('role', 'status');
    error.setAttribute('aria-live', 'polite');
    error.hidden = true;
    group.append(heading, controls, hint, error);
    container.append(group);

    const option = el('option');
    option.value = definition.key;
    option.textContent = definition.label;
    changed.append(option);
  });
  changed.value = lastParameter;
}

function scaledPoints(points: SimulationResult['points']): { x: number; y: number; label: string }[] {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs, 0); const maxX = Math.max(...xs, 1);
  const minY = Math.min(...ys, 0); const maxY = Math.max(...ys, 1);
  const xSpan = maxX - minX || 1; const ySpan = maxY - minY || 1;
  return points.map((point) => ({
    x: 76 + ((point.x - minX) / xSpan) * 586,
    y: 368 - ((point.y - minY) / ySpan) * 300,
    label: point.label
  }));
}

function renderChart(): void {
  const svg = document.querySelector<SVGSVGElement>('#simulation-svg')!;
  svg.replaceChildren();
  const title = svgEl('title');
  title.textContent = `${currentTemplate().name} plot`;
  svg.append(title);

  const grid = svgEl('g', { class: 'chart-grid', 'aria-hidden': 'true' });
  for (let x = 76; x <= 662; x += 97.67) grid.append(svgEl('line', { x1: x, y1: 52, x2: x, y2: 368 }));
  for (let y = 68; y <= 368; y += 60) grid.append(svgEl('line', { x1: 76, y1: y, x2: 662, y2: y }));
  svg.append(grid);
  svg.append(svgEl('line', { class: 'axis', x1: 76, y1: 368, x2: 672, y2: 368 }));
  svg.append(svgEl('line', { class: 'axis', x1: 76, y1: 44, x2: 76, y2: 368 }));
  const xLabel = svgEl('text', { class: 'axis-label', x: 370, y: 414, 'text-anchor': 'middle' });
  xLabel.textContent = result.xLabel;
  const yLabel = svgEl('text', { class: 'axis-label', x: 22, y: 210, transform: 'rotate(-90 22 210)', 'text-anchor': 'middle' });
  yLabel.textContent = result.yLabel;
  svg.append(xLabel, yLabel);

  const plotted = scaledPoints(result.points);
  if (state.template === 'tour' && result.route) {
    const web = svgEl('g', { class: 'network-web', 'aria-hidden': 'true' });
    for (let i = 0; i < plotted.length; i += 1) {
      for (let j = i + 1; j < plotted.length; j += 1) web.append(svgEl('line', { x1: plotted[i]!.x, y1: plotted[i]!.y, x2: plotted[j]!.x, y2: plotted[j]!.y }));
    }
    svg.append(web);
    const routePath = result.route.map((index, order) => `${order ? 'L' : 'M'} ${plotted[index]!.x} ${plotted[index]!.y}`).join(' ');
    svg.append(svgEl('path', { class: 'route-line', d: routePath, 'aria-hidden': 'true' }));
    plotted.forEach((point, index) => {
      const group = svgEl('g', { class: 'node' });
      group.append(svgEl('circle', { cx: point.x, cy: point.y, r: 13 }));
      const text = svgEl('text', { x: point.x, y: point.y + 5, 'text-anchor': 'middle' });
      text.textContent = result.points[index]!.label;
      group.append(text); svg.append(group);
    });
  } else {
    const path = plotted.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
    svg.append(svgEl('path', { class: 'series-area', d: `${path} L ${plotted.at(-1)!.x} 368 L ${plotted[0]!.x} 368 Z`, 'aria-hidden': 'true' }));
    svg.append(svgEl('path', { class: 'series-line', d: path, 'aria-hidden': 'true' }));
    plotted.forEach((point, index) => {
      if (index % 2 === 0 || index === plotted.length - 1) svg.append(svgEl('circle', { class: 'series-point', cx: point.x, cy: point.y, r: 4, 'aria-hidden': 'true' }));
    });
  }
}

function renderTable(): void {
  const table = document.querySelector<HTMLTableElement>('#data-table')!;
  table.replaceChildren();
  const caption = el('caption');
  caption.textContent = `${currentTemplate().name} values. ${result.narration}`;
  const head = el('thead'); const headerRow = el('tr');
  result.columns.forEach((column) => {
    const th = el('th'); th.scope = 'col';
    th.textContent = `${column.label}${column.unit ? ` (${column.unit})` : ''}`;
    headerRow.append(th);
  });
  head.append(headerRow);
  const body = el('tbody');
  result.rows.forEach((row) => {
    const tr = el('tr');
    result.columns.forEach((column) => { const td = el('td'); td.textContent = String(row[column.key] ?? ''); tr.append(td); });
    body.append(tr);
  });
  table.append(caption, head, body);
}

function renderMetrics(): void {
  const container = $('#metrics');
  container.replaceChildren();
  result.metrics.forEach((metric) => {
    const item = el('div'); const label = el('span'); const value = el('strong');
    label.textContent = metric.label; value.textContent = metric.value;
    item.append(label, value); container.append(item);
  });
}

function renderLesson(announce = false): void {
  const template = currentTemplate();
  result = template.calculate(state.params, state.seed);
  $('#active-lesson-title').textContent = state.title;
  $('#drawing-number').textContent = `MODEL / ${template.shortName.toUpperCase()} / ${String(state.seed).slice(-3).padStart(3, '0')}`;
  $('#active-assumption').textContent = template.assumption;
  $('#active-limits').textContent = `${template.limits} Seed: ${state.seed}. ${template.assumption}`;
  $('#learner-prompt').textContent = state.prompt;
  $('#chart-caption').textContent = `${state.description} Current result: ${result.narration}`;
  renderMetrics(); renderChart(); renderTable();
  if (announce) {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(() => { $('#live-update').textContent = result.status; }, 80);
    document.querySelector('.simulation-figure')?.classList.add('updated');
    window.setTimeout(() => document.querySelector('.simulation-figure')?.classList.remove('updated'), 260);
  } else $('#live-update').textContent = result.status;
}

function updateSetupState(): void {
  state.title = ($('#lesson-title') as HTMLInputElement).value.slice(0, 80);
  state.prompt = ($('#prediction-prompt') as HTMLTextAreaElement).value.slice(0, 240);
  state.description = ($('#visual-description') as HTMLTextAreaElement).value.slice(0, 300);
  renderLesson(); persistDraft();
}

function validateSetup(): boolean {
  const fields = [$('#lesson-title') as HTMLInputElement, $('#prediction-prompt') as HTMLTextAreaElement, $('#visual-description') as HTMLTextAreaElement];
  const missing = fields.find((field) => !field.value.trim());
  const error = $('#setup-error');
  if (missing) {
    error.textContent = 'Add the lesson title, prediction prompt, and visual description before sharing.';
    error.hidden = false; $('#teacher-setup').setAttribute('open', ''); missing.focus(); return false;
  }
  error.hidden = true; return true;
}

function lessonUrl(): string {
  const url = new URL(location.href);
  url.search = '';
  url.hash = 'workbench';
  url.searchParams.set('lesson', encodeLesson(state));
  return url.toString();
}

async function shareLesson(): Promise<void> {
  updateSetupState();
  if (!validateSetup()) return;
  const url = lessonUrl();
  try {
    await navigator.clipboard.writeText(url);
    showToast('Lesson link copied. It includes the model, prompt, description, seed, and current parameters.');
  } catch {
    const dialog = $('#share-dialog') as HTMLDialogElement;
    const field = $('#share-url') as HTMLInputElement;
    field.value = url; dialog.showModal(); field.focus(); field.select();
    showToast('Clipboard access was unavailable. The link is ready for manual copy.');
  }
}

function showToast(message: string): void {
  const toast = $('#toast');
  toast.textContent = message; toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, 5000);
}

function resetParameters(): void {
  state.params = initialParameters(currentTemplate());
  lastParameter = currentTemplate().parameters[0]?.key ?? '';
  renderControls(); renderLesson(true); persistDraft();
  showToast('Parameters returned to this model’s starter values.');
}

function exportCsv(): void {
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const lines = [result.columns.map((column) => quote(`${column.label}${column.unit ? ` (${column.unit})` : ''}`)).join(',')];
  result.rows.forEach((row) => lines.push(result.columns.map((column) => quote(String(row[column.key] ?? ''))).join(',')));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  const downloadUrl = URL.createObjectURL(blob);
  link.href = downloadUrl;
  link.download = `${state.template}-seed-${state.seed}.csv`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  showToast('CSV exported with the values currently shown.');

  // WebKit and some hosted Chromium configurations cancel downloads when a
  // detached anchor's object URL is revoked during the initiating click task.
  window.setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  }, 1000);
}

function updateConnection(): void {
  const status = $('#connection-status');
  const text = $('#connection-status-text');
  const online = navigator.onLine;
  status.classList.toggle('is-offline', !online);
  text.textContent = online ? ' Ready online' : ' Offline — saved shell ready';
}

function bindEvents(): void {
  ['#lesson-title', '#prediction-prompt', '#visual-description'].forEach((selector) => $(selector).addEventListener('input', updateSetupState));
  $('#share-button').addEventListener('click', shareLesson);
  $('#reset-parameters').addEventListener('click', resetParameters);
  $('#new-seed').addEventListener('click', () => {
    state.seed = Math.floor(Math.random() * 999999) + 1;
    ($('#seed-input') as HTMLInputElement).value = String(state.seed);
    renderLesson(true); persistDraft(); showToast(`New deterministic seed ${state.seed} applied.`);
  });
  $('#seed-input').addEventListener('change', (event) => {
    const input = event.currentTarget as HTMLInputElement;
    const candidate = Math.round(Number(input.value));
    if (!Number.isFinite(candidate) || candidate < 1 || candidate > 999999) {
      input.setCustomValidity('Use a whole number from 1 to 999999.'); input.reportValidity(); input.value = String(state.seed); return;
    }
    input.setCustomValidity(''); state.seed = candidate; renderLesson(true); persistDraft();
  });
  $('#lock-prediction').addEventListener('click', () => {
    const answer = ($('#prediction-answer') as HTMLTextAreaElement).value.trim();
    const status = $('#prediction-state');
    if (!answer) { status.textContent = 'Write a prediction before committing it.'; $('#prediction-answer').focus(); return; }
    ($('#prediction-answer') as HTMLTextAreaElement).readOnly = true;
    status.textContent = 'Prediction committed — now test it.';
    $('#lock-prediction').textContent = 'Prediction committed';
    $('#parameter-controls input').focus();
  });
  $('#complete-explanation').addEventListener('click', () => {
    const answer = ($('#observed-effect') as HTMLTextAreaElement).value.trim();
    if (!answer) { $('#explanation-state').textContent = 'Describe an observed effect to finish.'; $('#observed-effect').focus(); return; }
    const parameter = currentTemplate().parameters.find((item) => item.key === ($('#changed-parameter') as HTMLSelectElement).value)?.label;
    $('#explanation-state').textContent = `Complete: you changed ${parameter?.toLowerCase()} and named an effect.`;
  });
  $('#export-csv').addEventListener('click', exportCsv);
  window.addEventListener('online', updateConnection); window.addEventListener('offline', updateConnection);
}

function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js').catch(() => showToast('Offline setup was unavailable; the live playground still works.'));
}

loadInitialState();
renderModelOptions(); syncSetupFields(); renderControls(); renderLesson(); bindEvents(); updateConnection(); registerServiceWorker();
