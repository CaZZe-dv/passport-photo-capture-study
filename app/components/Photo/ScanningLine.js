import { View, Animated, StyleSheet, Easing } from "react-native";
import { useEffect, useRef } from "react";

function ScanningLine({ height }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateY, {
        toValue: height,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.scanLine,
        {
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "red",
    shadowColor: "red",
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});

export default ScanningLine;
