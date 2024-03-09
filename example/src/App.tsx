import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { MaterialCircularProgressIndicator } from '../../src/material-circular-progress-indicator';
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
      <MaterialCircularProgressIndicator
        size={56}
        valueColor="green"
        strokeWidth={5}
        strokeCap="round"
        value={progress}
      />
      <MaterialCircularProgressIndicator size={40} valueColor="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    backgroundColor: 'blue',
    marginVertical: 20,
  },
});
