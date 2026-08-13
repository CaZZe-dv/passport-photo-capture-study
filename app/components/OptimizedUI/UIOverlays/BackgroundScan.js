import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Rect, G } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

function BackgroundScan({ color = "red", active = true, height = 0 }) {
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active || height === 0) return;

    scanAnim.setValue(0);

    const animation = Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [active, height]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, height + 20],
  });

  return (
    <G mask={"url(#backgroundMask)"}>
      <AnimatedRect
        x={0}
        y={0}
        width="100%"
        height={8}
        fill={color}
        opacity={0.6}
        transform={[{ translateY }]}
      />
    </G>
  );
}

export default BackgroundScan;
