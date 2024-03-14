import React from 'react';
import type { Size, SkCanvas } from '@shopify/react-native-skia';
import {
  Canvas,
  Picture,
  Skia,
  createPicture,
} from '@shopify/react-native-skia';
import {
  assertWorklet,
  rad2deg,
  type PlainValueOrAnimatedValue,
} from '../utils';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import {
  useDuration,
  useToSharedValue,
  useToSharedValueOptional,
} from '../hooks';
import { StyleSheet } from 'react-native';

const _kDefaultIndicatorRadius = 10.0;

type DrawProps = {
  position: number;
  color: string;
  radius: number;
  progress: number;
};

const _kAlphaValues = [47, 47, 47, 47, 72, 97, 122, 147];
const _partiallyRevealedAlpha = 147;

const twoPi = Math.PI * 2;

/**
 *
 * @param color
 * @param alpha {number} 0-255
 * @returns
 */
const colorWithAlpha = (_color: string, alpha: number) => {
  'worklet';
  const color = Skia.Color(_color);
  color[3] *= alpha / 255;

  return color;
};

const draw = (canvas: SkCanvas, size: Size, props: DrawProps) => {
  'worklet';

  const radius = props.radius ?? _kDefaultIndicatorRadius;
  const progress = props.progress ?? 1;
  const r = radius / _kDefaultIndicatorRadius;
  const width = r * 2;
  const _rect = {
    x: -width / 2,
    y: -radius,
    width,
    height: (radius / 3.0) * 2.0,
    rx: r,
    ry: r,
  };
  // logic is altered from flutter because it uses rect with negative height, which is not supported with react-native-skia
  const tickFundamentalRRect = Skia.RRectXY(
    Skia.XYWHRect(_rect.x, _rect.y, _rect.width, _rect.height),
    _rect.rx,
    _rect.ry
  );

  const tickCount = _kAlphaValues.length;

  const activeTick = Math.min((props.position * tickCount) | 0, tickCount - 1);
  const paint = Skia.Paint();

  canvas.save();
  const centerSize = size.width / 2;
  canvas.translate(centerSize, centerSize);
  for (let i = 0; i < tickCount * progress; ++i) {
    const t = (i - activeTick) % tickCount;

    let alpha = _partiallyRevealedAlpha;
    if (progress === 1) {
      const _ = _kAlphaValues[t >= 0 ? t : t + tickCount];
      assertWorklet(_ !== undefined);
      alpha = _;
    }
    const color = colorWithAlpha(props.color, alpha);
    paint.setColor(color);
    canvas.drawRRect(tickFundamentalRRect, paint);
    canvas.rotate(rad2deg(twoPi / tickCount), 0, 0);
  }

  canvas.restore();
};

type InternalProps = {
  color: SharedValue<string>;
  animating: SharedValue<boolean>;
  radius: SharedValue<number>;
  progress: SharedValue<number>;
};

export type CupertinoActivityIndicatorProps = {
  color: string;
  /**
   * Whether to show the indicator (true, the default) or hide it (false).
   * @default true
   */
  animating?: PlainValueOrAnimatedValue<boolean>;
  /**
   * Radius of the spinner.
   *
   * Defaults to 10 pixels.
   */
  radius?: PlainValueOrAnimatedValue<number>;
  /**
   * Determines the percentage of spinner ticks that will be shown. Typical usage would
   * display all ticks, however, this allows for more fine-grained control such as
   * during pull-to-refresh when the drag-down action shows one tick at a time as
   * the user continues to drag down.
   *
   * Defaults to one. Must be between zero and one, inclusive.
   */
  progress?: PlainValueOrAnimatedValue<number>;
};

const _Content = (props: InternalProps) => {
  const animationValue = useDuration({
    stopped: useSharedValue(false),
    timing: 1_000,
  });
  const size = useDerivedValue(() => ({
    width: props.radius.value * 2,
    height: props.radius.value * 2,
  }));

  return (
    <Animated.View style={useAnimatedStyle(() => size.value)}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Picture
          picture={useDerivedValue(() => {
            const drawProps: DrawProps = {
              color: props.color.value,
              position: animationValue.value,
              progress: props.progress.value,
              radius: props.radius.value,
            };
            assertWorklet(drawProps.progress >= 0.0);
            assertWorklet(drawProps.progress <= 1.0);
            assertWorklet(drawProps.radius >= 0.0);

            const _size = size.value;
            return createPicture((canvas) => {
              draw(canvas, _size, drawProps);
            }, _size);
          })}
        />
      </Canvas>
    </Animated.View>
  );
};

export const CupertinoActivityIndicator = (
  props: CupertinoActivityIndicatorProps
) => {
  const { color, animating, radius, progress } = props;
  return (
    <_Content
      color={useToSharedValue(color)}
      animating={useToSharedValueOptional(animating, true)}
      radius={useToSharedValueOptional(radius, _kDefaultIndicatorRadius)}
      progress={useToSharedValueOptional(progress, 1)}
    />
  );
};
