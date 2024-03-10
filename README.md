# react-native-skia-ui

Cross platform UI primitives implemented with `@shopify/react-native-skia`.
This library provides functionality of system UI components like `ActivityIndicator` for Android, IOS and Web.
Components are ported from flutter and are implemented using `@shopify/react-native-skia` and `react-native-reanimated`.


https://github.com/XantreGodlike/react-native-skia-ui/assets/57757211/3df2a22a-4dc0-4282-8f04-e3a16d361184


## Installation

```sh
npm install react-native-skia-ui
```

### Peer Dependencies

This library has the following peer dependencies:

- `@shopify/react-native-skia`
- `react-native-reanimated`

If you don't have them installed, you can install them with:

```sh
npm install @shopify/react-native-skia react-native-reanimated
```

## Usage

For now, the library only provides a few components:

- `DeterminateMaterialCircularProgressIndicator`
- `IndeterminateMaterialCircularProgressIndicator`
- `MaterialCircularProgressIndicator` (blend of the two above)

```js
import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import {
  DeterminateMaterialCircularProgressIndicator,
  IndeterminateMaterialCircularProgressIndicator,
} from 'react-native-skia-ui/material-circular-progress-indicator';
import { useSharedValue, withTiming } from 'react-native-reanimated';

export default function App() {
  const progress = useSharedValue(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      progress.value = withTiming(Math.random(), { duration: 1000 });
    }, 1000);

    return () => clearInterval(id);
  });
  return (
    <View style={styles.container}>
      <Text>DeterminateMaterialCircularProgressIndicator</Text>
      <DeterminateMaterialCircularProgressIndicator
        size={56}
        valueColor="green"
        strokeWidth={5}
        strokeCap="round"
        value={progress}
      />
      <DeterminateMaterialCircularProgressIndicator
        size={100}
        valueColor="blue"
        strokeWidth={4}
        strokeCap="round"
        value={progress}
      />
      <Text>IndeterminateMaterialCircularProgressIndicator</Text>
      <IndeterminateMaterialCircularProgressIndicator
        size={40}
        valueColor="black"
      />

      <IndeterminateMaterialCircularProgressIndicator
        size={100}
        valueColor="red"
        backgroundColor={'#f0f0f0'}
        strokeWidth={8}
        strokeCap="round"
      />
    </View>
  );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
