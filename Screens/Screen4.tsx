import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Screen4 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>It is Screen 4</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252525'
  },
  text: {
    fontSize: 24,
    color: 'white'
  },
});

export default Screen4;
