import type { SharedValue } from 'react-native-reanimated';

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

export type OrPlainValueProp<
  T extends Record<string, unknown>,
  TKeys extends keyof T,
> = {
  [K in keyof T]: K extends TKeys
    ? T[K] extends SharedValue<infer V>
      ? V | SharedValue<Exclude<V, undefined>>
      : T[K]
    : T[K];
};

export type PlainValueOrAnimatedValue<T> = T | SharedValue<T>;
