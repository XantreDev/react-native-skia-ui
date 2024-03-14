import {
  Easing,
  isSharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

export const useDuration = ({
  stopped,
  timing,
}: {
  stopped: SharedValue<boolean>;
  timing: number;
}) => {
  const animationValue = useSharedValue(0);

  useAnimatedReaction(
    () => stopped.value,
    (shouldStop) => {
      if (shouldStop) {
        // stopping the animation
        animationValue.value = animationValue.value;
        return;
      }
      if (animationValue.value === 0) {
        animationValue.value = withRepeat(
          withTiming(1, {
            duration: timing,
            easing: Easing.linear,
          }),
          -1
        );
        return;
      }

      const remainingTime = timing * (1 - animationValue.value);

      animationValue.value = withSequence(
        withTiming(1, {
          duration: remainingTime,
          easing: Easing.linear,
        }),
        0,
        withRepeat(
          withTiming(1, {
            duration: timing,
            easing: Easing.linear,
          }),
          -1
        )
      );
    },
    [stopped]
  );

  return animationValue;
};

export const useToSharedValueOptional = <T>(
  value: T | SharedValue<T> | undefined,
  defaultValue: T
) =>
  useDerivedValue(() => {
    if (isSharedValue(value)) {
      return value.value;
    }
    return value ?? defaultValue;
  }, [value, defaultValue]);

export const useToSharedValue = <T>(value: T | SharedValue<T>) =>
  useDerivedValue(() => {
    if (isSharedValue(value)) {
      return value.value;
    }
    return value;
  }, [value]);
