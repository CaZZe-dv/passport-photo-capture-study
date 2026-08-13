import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { G, Rect } from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);

function LightingScan({ color }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const faceOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  const backgroundOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  return (
    <>
      <AnimatedG opacity={faceOpacity} mask="url(#faceMask)">
        <Rect width="100%" height="100%" fill={color} />
      </AnimatedG>
      <AnimatedG opacity={backgroundOpacity} mask={`url(#backgroundMask)`}>
        <Rect width="100%" height="100%" fill={color} />
      </AnimatedG>
    </>
  );
}

export default LightingScan;
