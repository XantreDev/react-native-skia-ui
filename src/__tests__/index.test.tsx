import { strokeHeadTween } from '../material-circular-progress-indicator/constants';
import { Curves, sawTooth } from '../curves';

const NUMBER_OF_DIGITS = 10;

describe('curves', () => {
  it('fastOutSlowIn', () => {
    const inputOutput = [
      [0, 0],
      [0.3, 0.36668479442596436],
      [0.6, 0.8753712326288223],
      [0.9, 0.9943761620670557],
      [1, 1],
    ] as const;

    for (const [input, output] of inputOutput) {
      expect(Curves.fastOutSlowIn(input)).toBeCloseTo(output, NUMBER_OF_DIGITS);
    }
  });
});

it('sawTooth', () => {
  const inputOutput = [
    [3, 0, 0],
    [3, 0.39, 0.16999999999999993],
    [3, 0.61, 0.8300000000000001],
    [3, 0.95, 0.8499999999999996],
    [3, 1, 1],
  ] as const;

  for (const [coefficient, input, output] of inputOutput) {
    expect(sawTooth(coefficient)(input)).toBeCloseTo(output, NUMBER_OF_DIGITS);
  }
});

it('strokeHeadTween', () => {
  const inputOutput = [
    [0, 0],
    [1, 1],
    [0.01, 0.6890753507614136],
    [0.05, 0.1348644495010376],
    [0.19, 0.5234298706054688],
    [0.35, 1],
    [0.91, 0.0036209821701049805],
  ] as const;

  for (const [input, output] of inputOutput) {
    expect(strokeHeadTween(input)).toBeCloseTo(output, NUMBER_OF_DIGITS);
  }
});
