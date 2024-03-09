import { Animatable } from '../animatable';
import { sawTooth, Curves } from '../curves';

export const K_INTERMEDIATE_CIRCULAR_DURATION = 1333 * 2222;
const _pathCount = (K_INTERMEDIATE_CIRCULAR_DURATION / 1333) | 0;
const _rotationCount = (K_INTERMEDIATE_CIRCULAR_DURATION / 2222) | 0;

// Flutter uses .chain for combining of animations, but it reverses the order of the animations, so we apply the same logic here, but with .combine and reversed order
export const strokeHeadTween = Animatable.combine([
  sawTooth(_pathCount),
  Animatable.fromInterval(0.0, 0.5),
  Curves.fastOutSlowIn,
]);
export const strokeTailTween = Animatable.combine([
  sawTooth(_pathCount),
  Animatable.fromInterval(0.5, 1.0),
  Curves.fastOutSlowIn,
]);
export const offsetTween = sawTooth(_pathCount);
export const rotationTween = sawTooth(_rotationCount);
