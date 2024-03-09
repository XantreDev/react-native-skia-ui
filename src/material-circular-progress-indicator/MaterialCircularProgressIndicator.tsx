/**
 * Port of Flutter Material Progress Indicator https://github.com/flutter/flutter/blob/74e054f04ae59cd9e721710f183f53897b3c9ded/packages/flutter/lib/src/material/progress_indicator.dart#L411
 */

import {
  Canvas,
  createPicture,
  PaintStyle,
  Picture,
  type Size,
  type SkCanvas,
  Skia,
  StrokeCap,
} from '@shopify/react-native-skia';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  clamp,
  Easing,
  isSharedValue,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { SetOptional } from 'type-fest';
import {
  K_INTERMEDIATE_CIRCULAR_DURATION,
  offsetTween,
  rotationTween,
  strokeHeadTween,
  strokeTailTween,
} from './constants';
import { rad2deg } from '../utils';

type RenderCircularProgressProps = {
  backgroundColor: string | null;
  valueColor: string;

  value: number | null;

  headValue: number;
  tailValue: number;
  offsetValue: number;
  rotationValue: number;
  strokeWidth: number;
  strokeAlign: number;

  strokeCap: StrokeCap;
};

const renderCircularProgressIndicator = (
  canvas: SkCanvas,
  size: Size,
  props: RenderCircularProgressProps
) => {
  'worklet';

  const _twoPi = Math.PI * 2.0;
  const _epsilon = 0.001;
  const _sweep = _twoPi - _epsilon;
  const _startAngle = -Math.PI / 2.0;

  let arcStart: number | null = null;
  let arcSweep: number | null = null;
  if (props.value === null) {
    arcStart =
      _startAngle +
      ((props.tailValue * 3) / 2) * Math.PI +
      props.rotationValue * Math.PI * 2.0 +
      props.offsetValue * 0.5 * Math.PI;
    arcSweep = Math.max(
      ((props.headValue * 3) / 2) * Math.PI -
        ((props.tailValue * 3) / 2) * Math.PI,
      _epsilon
    );
  } else {
    arcStart = _startAngle;
    arcSweep = clamp(props.value, 0.0, 1.0) * _sweep;
  }

  // painting
  const paint = Skia.Paint();
  paint.setColor(Skia.Color(props.valueColor));
  paint.setStrokeWidth(props.strokeWidth);
  paint.setStyle(PaintStyle.Stroke);
  const strokeOffset = (props.strokeWidth / 2) * -props.strokeAlign;

  const arcRect = Skia.XYWHRect(
    strokeOffset,
    strokeOffset,
    size.width - strokeOffset * 2,
    size.height - strokeOffset * 2
  );

  paint.setStrokeCap(props.strokeCap ?? StrokeCap.Square);
  if (props.backgroundColor) {
    const bgPaint = paint.copy();
    bgPaint.setColor(Skia.Color(props.backgroundColor));

    canvas.drawArc(arcRect, rad2deg(0), rad2deg(_twoPi), false, bgPaint);
  }

  canvas.drawArc(arcRect, rad2deg(arcStart), rad2deg(arcSweep), false, paint);
};

type OrPlainValueProp<
  T extends Record<string, unknown>,
  TKeys extends keyof T,
> = {
  [K in keyof T]: K extends TKeys
    ? T[K] extends SharedValue<infer V>
      ? V | SharedValue<Exclude<V, undefined>>
      : T[K]
    : T[K];
};
type InternalProps = {
  size: SharedValue<number>;
  /**
   * Value between 0 and 1
   * If undefined, the progress indicator will be indeterminate
   */
  value: SharedValue<number | undefined>;
  stopped: SharedValue<boolean>;

  backgroundColor: SharedValue<string | undefined>;
  valueColor: SharedValue<string>;

  strokeCap?: 'round' | 'square' | 'butt';
  strokeWidth: SharedValue<number>;
  strokeAlign?: number;
};

const Content_ = ({
  size: _size,
  strokeWidth,
  value,
  strokeCap = 'square',
  backgroundColor,
  valueColor,
  stopped,
  strokeAlign,
}: InternalProps) => {
  const animationValue = useSharedValue(0);
  const size = useDerivedValue(() => ({
    width: _size.value,
    height: _size.value,
  }));

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
            duration: K_INTERMEDIATE_CIRCULAR_DURATION,
            easing: Easing.linear,
          }),
          -1
        );
        return;
      }

      const remainingTime =
        K_INTERMEDIATE_CIRCULAR_DURATION * (1 - animationValue.value);

      animationValue.value = withSequence(
        withTiming(1, {
          duration: remainingTime,
          easing: Easing.linear,
        }),
        0,
        withRepeat(
          withTiming(1, {
            duration: K_INTERMEDIATE_CIRCULAR_DURATION,
            easing: Easing.linear,
          }),
          -1
        )
      );
    },
    [stopped]
  );

  const headValue = useDerivedValue(() =>
    strokeHeadTween(animationValue.value)
  );
  const tailValue = useDerivedValue(() =>
    strokeTailTween(animationValue.value)
  );
  const offsetValue = useDerivedValue(() => offsetTween(animationValue.value));
  const rotationValue = useDerivedValue(() =>
    rotationTween(animationValue.value)
  );

  return (
    <Animated.View style={useAnimatedStyle(() => size.value)}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Picture
          picture={useDerivedValue(() => {
            const sizeValue = size.value;
            const params: RenderCircularProgressProps = {
              value: value.value ?? null,
              headValue: headValue.value,
              offsetValue: offsetValue.value,
              rotationValue: rotationValue.value,
              tailValue: tailValue.value,

              valueColor: valueColor.value,
              backgroundColor: backgroundColor.value ?? null,

              strokeAlign: strokeAlign ?? -1.0,
              strokeWidth: strokeWidth.value,
              strokeCap:
                strokeCap === 'butt'
                  ? StrokeCap.Butt
                  : strokeCap === 'round'
                    ? StrokeCap.Round
                    : StrokeCap.Square,
            };

            return createPicture((canvas) => {
              renderCircularProgressIndicator(canvas, sizeValue, params);
            }, sizeValue);
          })}
        />
      </Canvas>
    </Animated.View>
  );
};

export type MaterialCircularProgressIndicatorProps = SetOptional<
  OrPlainValueProp<
    InternalProps,
    | 'size'
    | 'value'
    | 'strokeWidth'
    | 'backgroundColor'
    | 'valueColor'
    | 'stopped'
  >,
  'strokeWidth' | 'stopped' | 'value' | 'backgroundColor'
>;

const useToSharedValueOptional = <T,>(
  value: T | SharedValue<T> | undefined,
  defaultValue: T
) =>
  useDerivedValue(() => {
    if (isSharedValue(value)) {
      return value.value;
    }
    return value ?? defaultValue;
  }, [value, defaultValue]);

const useToSharedValue = <T,>(value: T | SharedValue<T>) =>
  useDerivedValue(() => {
    if (isSharedValue(value)) {
      return value.value;
    }
    return value;
  }, [value]);

export const MaterialCircularProgressIndicator = (
  props: MaterialCircularProgressIndicatorProps
) => (
  <Content_
    {...props}
    size={useToSharedValue(props.size)}
    value={useToSharedValue(props.value)}
    stopped={useToSharedValueOptional(props.stopped, false)}
    strokeWidth={useToSharedValueOptional(props.strokeWidth, 4)}
    backgroundColor={useToSharedValue(props.backgroundColor)}
    valueColor={useToSharedValue(props.valueColor)}
  />
);
