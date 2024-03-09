export function assertWorklet(value: unknown): asserts value {
  'worklet';

  if (!value) {
    throw new Error('invariant');
  }
}

export const rad2deg = (rad: number) => {
  'worklet';

  return (rad * 180) / Math.PI;
};
