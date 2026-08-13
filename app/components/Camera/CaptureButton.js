import { Pressable, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

function CaptureButton({
  onPress,
  style,
  ready = true,
  displayReadyAnimation = false,
}) {
  const outerScale = useRef(new Animated.Value(1)).current;
  const innerScale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [ready]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(outerScale, {
        toValue: 0.95,
        useNativeDriver: true,
        friction: 6,
      }),
      Animated.spring(innerScale, {
        toValue: 0.85,
        useNativeDriver: true,
        friction: 6,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(outerScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }),
      Animated.spring(innerScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View
        style={[
          styles.outerCircle,
          {
            transform: [{ scale: displayReadyAnimation ? pulse : outerScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.innerCircle,
            { transform: [{ scale: innerScale }], opacity: ready ? 1 : 0.4 },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

export default CaptureButton;

const styles = StyleSheet.create({
  outerCircle: {
    height: 85,
    width: 85,
    borderRadius: 42.5,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "white",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  innerCircle: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: "white",
  },
});
