import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Ellipse } from "react-native-svg";

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

function FaceOval({ color = "red" }) {
  const animation = useRef(new Animated.Value(0)).current;
  const prevColor = useRef(color || "red");

  useEffect(() => {
    animation.setValue(0);

    Animated.spring(animation, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: false,
    }).start();

    prevColor.current = color;
  }, [color]);

  const strokeColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [prevColor.current || color, color || prevColor.current],
  });

  const rx = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["35%", "36%", "35%"],
  });

  const ry = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["40%", "41%", "40%"],
  });

  return (
    <AnimatedEllipse
      cx="50%"
      cy="50%"
      rx={rx}
      ry={ry}
      strokeWidth="4"
      fill="none"
      stroke={strokeColor}
    />
  );
}

export default FaceOval;
