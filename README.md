# `react-native-skia-ui`

https://github.com/XantreGodlike/react-native-skia-ui/assets/57757211/3df2a22a-4dc0-4282-8f04-e3a16d361184

Cross platform UI primitives implemented with `@shopify/react-native-skia`.
This library provides functionality of system UI components like `ActivityIndicator` for Android, IOS and Web.

### Why not use `ActivityIndicator` from `react-native`?

- `react-native-skia-ui` components are highly customizable, you can change the color, size, stroke width, stroke cap, etc.
- `react-native-skia-ui` allows you to animate the progress of the `ActivityIndicator` (for example, you can animate the progress of `MaterialCircularProgressIndicator.Determinate`). It's powered by `react-native-reanimated`.
- `react-native-skia-ui` components are consistent across platforms. For example, `MaterialCircularProgressIndicator` looks the same on Android, IOS and Web (unlike `ActivityIndicator` from `react-native`).

### Cases when you should use `ActivityIndicator` from `react-native`:

- You don't need to customize the `ActivityIndicator` and you don't need to animate it.
- You need native look and feel of the `ActivityIndicator` on Android and IOS (for most cases, it's what you need).

Components are ported from flutter and are implemented using `@shopify/react-native-skia` and `react-native-reanimated`.

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

### `react-native-skia-ui/material-circular-progress-indicator`

- `MaterialCircularProgressIndicator.Determinate`
- `MaterialCircularProgressIndicator.Indeterminate`
- `MaterialCircularProgressIndicator` (blend of the two above)

### `react-native-skia-ui/cupertino-activity-indicator`

- `CupertinoActivityIndicator`
- `CupertinoActivityIndicator.PartiallyRevealed`

[Example](./example/src//App.tsx)

```tsx
import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { MaterialCircularProgressIndicator } from 'react-native-skia-ui/material-circular-progress-indicator';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { CupertinoActivityIndicator } from 'react-native-skia-ui/cupertino-activity-indicator';
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
      <Text>Determinate progress indicators</Text>
      <MaterialCircularProgressIndicator.Determinate
        size={56}
        valueColor="green"
        strokeWidth={5}
        strokeCap="round"
        value={progress}
      />
      <MaterialCircularProgressIndicator.Determinate
        size={100}
        valueColor="blue"
        strokeWidth={4}
        strokeCap="round"
        value={progress}
      />
      <CupertinoActivityIndicator.PartiallyRevealed
        color="black"
        progress={progress}
        radius={50}
      />

      <Text>Indeterminate progress indicators</Text>
      <MaterialCircularProgressIndicator.Indeterminate
        size={40}
        valueColor="black"
      />
      <MaterialCircularProgressIndicator.Indeterminate
        size={100}
        valueColor="red"
        backgroundColor={'#f0f0f0'}
        strokeWidth={8}
        strokeCap="round"
      />
      <CupertinoActivityIndicator color="black" radius={50} />
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
