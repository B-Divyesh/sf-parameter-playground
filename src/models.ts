export type TemplateId = 'tour' | 'growth' | 'projectile';

export interface ParameterDefinition {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  hint: string;
}

export interface DataColumn {
  key: string;
  label: string;
  unit?: string;
}

export interface PlotPoint {
  x: number;
  y: number;
  label: string;
}

export interface SimulationResult {
  points: PlotPoint[];
  route?: number[];
  columns: DataColumn[];
  rows: Record<string, string | number>[];
  metrics: { label: string; value: string }[];
  narration: string;
  status: string;
  xLabel: string;
  yLabel: string;
}

export interface ModelTemplate {
  id: TemplateId;
  shortName: string;
  name: string;
  lesson: string;
  assumption: string;
  limits: string;
  predictionPrompt: string;
  description: string;
  parameters: ParameterDefinition[];
  calculate: (params: Record<string, number>, seed: number) => SimulationResult;
}

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distance(a: PlotPoint, b: PlotPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function orientation(a: PlotPoint, b: PlotPoint, c: PlotPoint): number {
  return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
}

function routeCrossings(points: PlotPoint[], route: number[]): number {
  let total = 0;
  for (let i = 0; i < route.length - 1; i += 1) {
    for (let j = i + 2; j < route.length - 1; j += 1) {
      if (i === 0 && j === route.length - 2) continue;
      const a = points[route[i] ?? 0]!;
      const b = points[route[i + 1] ?? 0]!;
      const c = points[route[j] ?? 0]!;
      const d = points[route[j + 1] ?? 0]!;
      if (orientation(a, b, c) * orientation(a, b, d) < 0 && orientation(c, d, a) * orientation(c, d, b) < 0) total += 1;
    }
  }
  return total;
}

export function calculateTour(params: Record<string, number>, seed: number): SimulationResult {
  const count = Math.round(params.cities ?? 8);
  const cluster = (params.cluster ?? 30) / 100;
  const random = mulberry32(seed);
  const centers = [
    { x: 27, y: 33 },
    { x: 73, y: 67 }
  ];
  const points: PlotPoint[] = Array.from({ length: count }, (_, index) => {
    const baseX = 8 + random() * 84;
    const baseY = 9 + random() * 82;
    const center = centers[index % 2]!;
    return {
      x: baseX * (1 - cluster) + (center.x + (random() - 0.5) * 28) * cluster,
      y: baseY * (1 - cluster) + (center.y + (random() - 0.5) * 28) * cluster,
      label: String.fromCharCode(65 + index)
    };
  });
  const start = Math.min(count - 1, Math.max(0, Math.round(params.start ?? 1) - 1));
  const unvisited = new Set(points.map((_, index) => index));
  const route = [start];
  unvisited.delete(start);
  while (unvisited.size) {
    const current = points[route.at(-1)!]!;
    const next = [...unvisited].sort((a, b) => distance(current, points[a]!) - distance(current, points[b]!))[0]!;
    route.push(next);
    unvisited.delete(next);
  }
  route.push(start);
  const routeLength = route.slice(0, -1).reduce((sum, pointIndex, index) => sum + distance(points[pointIndex]!, points[route[index + 1]!]!), 0);
  const crossings = routeCrossings(points, route);
  const rows = route.slice(0, -1).map((pointIndex, index) => ({
    order: index + 1,
    city: points[pointIndex]!.label,
    x: points[pointIndex]!.x.toFixed(1),
    y: points[pointIndex]!.y.toFixed(1),
    next: points[route[index + 1]!]!.label,
    leg: distance(points[pointIndex]!, points[route[index + 1]!]!).toFixed(1)
  }));
  return {
    points,
    route,
    columns: [
      { key: 'order', label: 'Visit' }, { key: 'city', label: 'City' },
      { key: 'x', label: 'X', unit: 'units' }, { key: 'y', label: 'Y', unit: 'units' },
      { key: 'next', label: 'Next city' }, { key: 'leg', label: 'Leg', unit: 'units' }
    ],
    rows,
    metrics: [{ label: 'Route length', value: `${routeLength.toFixed(1)} units` }, { label: 'Crossings', value: String(crossings) }, { label: 'Start', value: points[start]!.label }],
    narration: `The nearest-neighbor route visits ${count} cities, starts at ${points[start]!.label}, measures ${routeLength.toFixed(1)} units, and has ${crossings} crossing${crossings === 1 ? '' : 's'}.`,
    status: `Route recalculated: ${routeLength.toFixed(1)} units with ${crossings} crossing${crossings === 1 ? '' : 's'}.`,
    xLabel: 'Horizontal position', yLabel: 'Vertical position'
  };
}

export function calculateGrowth(params: Record<string, number>): SimulationResult {
  const start = params.initial ?? 20;
  const rate = params.rate ?? 0.35;
  const capacity = params.capacity ?? 500;
  const steps = Math.round(params.steps ?? 16);
  let population = start;
  const rows: Record<string, string | number>[] = [{ step: 0, population: population.toFixed(1), change: '—' }];
  const points: PlotPoint[] = [{ x: 0, y: population, label: 'Step 0' }];
  let largestChange = 0;
  for (let step = 1; step <= steps; step += 1) {
    const change = rate * population * (1 - population / capacity);
    largestChange = Math.max(largestChange, change);
    population += change;
    rows.push({ step, population: population.toFixed(1), change: change.toFixed(1) });
    points.push({ x: step, y: population, label: `Step ${step}` });
  }
  const percent = (population / capacity) * 100;
  return {
    points,
    columns: [{ key: 'step', label: 'Step' }, { key: 'population', label: 'Population' }, { key: 'change', label: 'Change' }],
    rows,
    metrics: [{ label: 'Final population', value: population.toFixed(1) }, { label: 'Of capacity', value: `${percent.toFixed(1)}%` }, { label: 'Largest change', value: largestChange.toFixed(1) }],
    narration: `Population rises from ${start.toFixed(0)} to ${population.toFixed(1)} over ${steps} steps, reaching ${percent.toFixed(1)}% of the carrying capacity. Growth slows as it approaches the limit.`,
    status: `Curve recalculated: final population ${population.toFixed(1)}, ${percent.toFixed(1)}% of capacity.`,
    xLabel: 'Time step', yLabel: 'Population'
  };
}

export function calculateProjectile(params: Record<string, number>): SimulationResult {
  const angle = (params.angle ?? 45) * Math.PI / 180;
  const speed = params.speed ?? 22;
  const gravity = params.gravity ?? 9.8;
  const flight = (2 * speed * Math.sin(angle)) / gravity;
  const range = speed * Math.cos(angle) * flight;
  const height = Math.pow(speed * Math.sin(angle), 2) / (2 * gravity);
  const samples = 16;
  const points: PlotPoint[] = [];
  const rows: Record<string, string | number>[] = [];
  for (let index = 0; index <= samples; index += 1) {
    const time = (flight * index) / samples;
    const x = speed * Math.cos(angle) * time;
    const y = Math.max(0, speed * Math.sin(angle) * time - 0.5 * gravity * time * time);
    points.push({ x, y, label: `${time.toFixed(2)} seconds` });
    rows.push({ time: time.toFixed(2), x: x.toFixed(1), y: y.toFixed(1) });
  }
  return {
    points,
    columns: [{ key: 'time', label: 'Time', unit: 's' }, { key: 'x', label: 'Horizontal', unit: 'm' }, { key: 'y', label: 'Height', unit: 'm' }],
    rows,
    metrics: [{ label: 'Range', value: `${range.toFixed(1)} m` }, { label: 'Peak height', value: `${height.toFixed(1)} m` }, { label: 'Flight time', value: `${flight.toFixed(2)} s` }],
    narration: `The projectile travels ${range.toFixed(1)} meters in ${flight.toFixed(2)} seconds and reaches a peak height of ${height.toFixed(1)} meters. The path is symmetric because air resistance is excluded.`,
    status: `Arc recalculated: ${range.toFixed(1)} meters of range and ${height.toFixed(1)} meters high.`,
    xLabel: 'Horizontal distance', yLabel: 'Height'
  };
}

export const templates: Record<TemplateId, ModelTemplate> = {
  tour: {
    id: 'tour', shortName: 'Route', name: 'Nearest-neighbor tour', lesson: 'How local choices shape a route',
    assumption: 'Every city can connect to every other city. The route always chooses the nearest unvisited city, then returns to its start.',
    limits: '5–16 cities; coordinates are synthetic 0–100 units. This heuristic is fast, but it does not guarantee the shortest possible tour.',
    predictionPrompt: 'If the cities form tighter clusters, what will happen to route length and crossings?',
    description: 'A coordinate plane of labeled cities joined by a red nearest-neighbor route; pale dashed lines show all possible city pairs.',
    parameters: [
      { key: 'cities', label: 'Cities', unit: '', min: 5, max: 16, step: 1, initial: 9, hint: 'How many locations the route must visit.' },
      { key: 'cluster', label: 'Clustering', unit: '%', min: 0, max: 85, step: 5, initial: 30, hint: 'Pulls alternating cities toward two centers.' },
      { key: 'start', label: 'Starting city', unit: '', min: 1, max: 16, step: 1, initial: 1, hint: '1 means city A, 2 means B, and so on.' }
    ], calculate: calculateTour
  },
  growth: {
    id: 'growth', shortName: 'Growth', name: 'Logistic population growth', lesson: 'Why growth slows near a limit',
    assumption: 'Growth is proportional to both the current population and the unused capacity. Rate and capacity stay fixed.',
    limits: '5–30 discrete steps; population is a unitless classroom model. It omits age, migration, randomness, and delays.',
    predictionPrompt: 'Will doubling the growth rate double the final population? Write your prediction before moving it.',
    description: 'A line chart rising from the initial population and flattening as it approaches a dashed carrying-capacity line.',
    parameters: [
      { key: 'initial', label: 'Initial population', unit: '', min: 5, max: 100, step: 5, initial: 20, hint: 'Population at step zero.' },
      { key: 'rate', label: 'Growth rate', unit: '', min: 0.05, max: 0.8, step: 0.05, initial: 0.35, hint: 'Fractional growth per time step.' },
      { key: 'capacity', label: 'Carrying capacity', unit: '', min: 100, max: 1000, step: 50, initial: 500, hint: 'The stable upper limit in this model.' },
      { key: 'steps', label: 'Time steps', unit: '', min: 5, max: 30, step: 1, initial: 16, hint: 'How long to run the model.' }
    ], calculate: calculateGrowth
  },
  projectile: {
    id: 'projectile', shortName: 'Arc', name: 'Projectile motion', lesson: 'Angle, speed, and a curved path',
    assumption: 'Launch and landing heights match. Gravity is constant; air resistance and spin are ignored.',
    limits: 'Angle 10–80°, speed 5–40 m/s, gravity 1–20 m/s². This is a two-dimensional idealized model, not a safety calculator.',
    predictionPrompt: 'At the same speed, which launch angle gives the longest range? Explain before you test.',
    description: 'A side-view line chart of a projectile leaving ground level, tracing a blue arc, and returning to ground.',
    parameters: [
      { key: 'angle', label: 'Launch angle', unit: '°', min: 10, max: 80, step: 1, initial: 45, hint: 'Direction above the horizontal.' },
      { key: 'speed', label: 'Launch speed', unit: 'm/s', min: 5, max: 40, step: 1, initial: 22, hint: 'Initial velocity magnitude.' },
      { key: 'gravity', label: 'Gravity', unit: 'm/s²', min: 1, max: 20, step: 0.1, initial: 9.8, hint: 'Downward acceleration.' }
    ], calculate: calculateProjectile
  }
};

export function initialParameters(template: ModelTemplate): Record<string, number> {
  return Object.fromEntries(template.parameters.map((parameter) => [parameter.key, parameter.initial]));
}
