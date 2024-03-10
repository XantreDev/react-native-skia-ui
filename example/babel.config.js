const path = require('path');
const pak = require('../package.json');

module.exports = function (api) {
  api.cache(true);

  const exports = pak.exports;
  if (!exports) {
    throw new Error('The package.json must have a "exports" field');
  }

  const aliases = Object.entries(exports).reduce((acc, [_key, value]) => {
    const key = _key.startsWith('.') ? _key.slice(1) : _key;
    // We only care about the "source" field
    if (value.source) {
      const aliasName = pak.name + key;
      acc[`^${aliasName}$`] = path.join(__dirname, '..', value.source);
    }
    return acc;
  }, {});

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: aliases,
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
