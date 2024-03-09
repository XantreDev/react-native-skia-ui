// @ts-check
/** @type {import('@babel/core').ConfigFunction} */
module.exports = (api) => {
  if (api.env() === 'test') {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
      ],
      // include: [
      //   'src/**/*',
      //   'node_modules/react-native-reanimated',
      //   'node_modules/react-native',
      //   'node_modules/@react-native',
      // ],
      plugins: ['@babel/plugin-transform-flow-strip-types'],
    };
  }
  return {
    presets: ['module:@react-native/babel-preset'],
  };
};
