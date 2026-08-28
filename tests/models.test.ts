import { describe, expect, it } from 'vitest';
import { calculateGrowth, calculateProjectile, calculateTour, initialParameters, templates } from '../src/models';

describe('deterministic model templates', () => {
  it('produces the same route for the same seed and parameters', () => {
    const params = initialParameters(templates.tour);
    expect(calculateTour(params, 41723)).toEqual(calculateTour(params, 41723));
    expect(calculateTour(params, 41723).rows).not.toEqual(calculateTour(params, 41724).rows);
  });

  it('visits every city once before returning to the start', () => {
    const result = calculateTour({ cities: 12, cluster: 40, start: 3 }, 99);
    expect(result.rows).toHaveLength(12);
    expect(new Set(result.rows.map((row) => row.city)).size).toBe(12);
    expect(result.route?.at(0)).toBe(result.route?.at(-1));
  });

  it('logistic growth stays below capacity for the starter lesson', () => {
    const result = calculateGrowth(initialParameters(templates.growth));
    const last = Number(result.rows.at(-1)?.population);
    expect(last).toBeGreaterThan(20);
    expect(last).toBeLessThan(500);
  });

  it('a 45 degree ideal projectile has the expected range', () => {
    const result = calculateProjectile({ angle: 45, speed: 10, gravity: 10 });
    expect(result.metrics[0]?.value).toBe('10.0 m');
    expect(Number(result.rows.at(-1)?.y)).toBe(0);
  });

  it('declares bounded inputs for every model', () => {
    Object.values(templates).forEach((template) => template.parameters.forEach((parameter) => {
      expect(parameter.min).toBeLessThan(parameter.max);
      expect(parameter.initial).toBeGreaterThanOrEqual(parameter.min);
      expect(parameter.initial).toBeLessThanOrEqual(parameter.max);
    }));
  });
});
