import { Animatable } from './animatable';

const evaluateCubic = (a: number, b: number, m: number): number => {
  'worklet';

  return 3 * a * (1 - m) * (1 - m) * m + 3 * b * (1 - m) * m * m + m * m * m;
};

const createCubic = (x1: number, y1: number, x2: number, y2: number) => {
  'worklet';

  const _cubicErrorBound = 0.001;

  return Animatable.fromFunction((t: number): number => {
    'worklet';

    let start = 0.0;
    let end = 1.0;

    while (true) {
      const midpoint = (start + end) / 2;
      const estimate = evaluateCubic(x1, x2, midpoint);
      if (Math.abs(t - estimate) < _cubicErrorBound) {
        return evaluateCubic(y1, y2, midpoint);
      }
      if (estimate < t) {
        start = midpoint;
      } else {
        end = midpoint;
      }
    }
  });
};

export const sawTooth = (count: number) => {
  'worklet';

  return Animatable.fromFunction((_t: number) => {
    'worklet';
    const t = _t * count;

    return t - (t | 0);
  });
};

export const Curves = {
  createCubic,
  sawTooth,
  fastOutSlowIn: createCubic(0.4, 0, 0.2, 1),
};
