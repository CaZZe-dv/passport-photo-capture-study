import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { G, Path } from "react-native-svg";
import { COLORS } from "../../../constants/Colors";

const AnimatedG = Animated.createAnimatedComponent(G);

function CornerBox({ size = 100, corner = 26, color = "yellow" }) {
  return (
    <G stroke={color} strokeWidth={3} fill="none">
      <Path
        vectorEffect="non-scaling-stroke"
        d={`M 0 ${corner} L 0 0 L ${corner} 0`}
      />
      <Path
        vectorEffect="non-scaling-stroke"
        d={`M ${size - corner} 0 L ${size} 0 L ${size} ${corner}`}
      />
      <Path
        vectorEffect="non-scaling-stroke"
        d={`M 0 ${size - corner} L 0 ${size} L ${corner} ${size}`}
      />
      <Path
        vectorEffect="non-scaling-stroke"
        d={`M ${size - corner} ${size} L ${size} ${size} L ${size} ${size - corner}`}
      />
    </G>
  );
}

function FindFace({ color = "yellow", metrics, overlayWidth, overlayHeight }) {
  const posX = useRef(new Animated.Value(0)).current;
  const posY = useRef(new Animated.Value(0)).current;

  const scaleX = useRef(new Animated.Value(1)).current;
  const scaleY = useRef(new Animated.Value(1)).current;

  const initialized = useRef(false);
  const baseSize = 200;

  const centerX = overlayWidth / 2;
  const centerY = overlayHeight * 0.5;

  const rx = overlayWidth * 0.38;
  const ry = overlayHeight * 0.43;

  const guideX = centerX - rx;
  const guideY = centerY - ry;

  const guideScaleX = (rx * 2) / baseSize;
  const guideScaleY = (ry * 2) / baseSize;

  const faceDetected =
    metrics &&
    metrics.boxX !== undefined &&
    metrics.boxY !== undefined &&
    metrics.boxWidth &&
    metrics.boxHeight;

  useEffect(() => {
    if (!overlayWidth || !overlayHeight || !faceDetected) return;

    const sX = overlayWidth / metrics.imageWidth;
    const sY = overlayHeight / metrics.imageHeight;

    const targetX = metrics.boxX * sX;
    const targetY = metrics.boxY * sY;

    const targetScaleX = (metrics.boxWidth * sX) / baseSize;
    const targetScaleY = (metrics.boxHeight * sY) / baseSize;

    if (!initialized.current) {
      posX.setValue(targetX);
      posY.setValue(targetY);
      scaleX.setValue(targetScaleX);
      scaleY.setValue(targetScaleY);
      initialized.current = true;
      return;
    }

    Animated.parallel([
      Animated.spring(posX, {
        toValue: targetX,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(posY, {
        toValue: targetY,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleX, {
        toValue: targetScaleX,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleY, {
        toValue: targetScaleY,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [metrics, overlayWidth, overlayHeight]);

  return (
    <>
      <G
        transform={[
          { translateX: guideX },
          { translateY: guideY },
          { scaleX: guideScaleX },
          { scaleY: guideScaleY },
        ]}
      >
        <CornerBox size={baseSize} color={color} />
      </G>
      {faceDetected && (
        <AnimatedG
          transform={[
            { translateX: posX },
            { translateY: posY },
            { scaleX: scaleX },
            { scaleY: scaleY },
          ]}
        >
          <CornerBox size={baseSize} color={COLORS.success} />
        </AnimatedG>
      )}
    </>
  );
}

export default FindFace;
