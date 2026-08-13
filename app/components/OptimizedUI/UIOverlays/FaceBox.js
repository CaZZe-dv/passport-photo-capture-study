import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Circle } from "react-native-svg";
import {
  getFaceCenter,
  getFaceCenteringScore,
} from "../../../util/ComplianceCheck";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function FaceBox({ color = "yellow", metrics, overlayWidth, overlayHeight }) {
  const posX = useRef(new Animated.Value(0)).current;
  const posY = useRef(new Animated.Value(0)).current;
  const radius = useRef(new Animated.Value(20)).current;
  const initialized = useRef(false);

  useEffect(() => {
    if (!metrics || !overlayWidth || !overlayHeight) return;

    if (metrics.eyeMidX === undefined || metrics.eyeMidY === undefined) return;

    const { x, y } = getFaceCenter(metrics);

    const scaleX = overlayWidth / metrics.imageWidth;
    const scaleY = overlayHeight / metrics.imageHeight;

    const screenX = x * scaleX;
    const screenY = y * scaleY;
    const score = getFaceCenteringScore(metrics);

    const ellipseRadius = Math.min(overlayWidth * 0.35, overlayHeight * 0.4);

    const targetRadius = ellipseRadius * (0.55 + score * 0.45);

    if (!initialized.current) {
      posX.setValue(screenX);
      posY.setValue(screenY);
      radius.setValue(targetRadius);
      initialized.current = true;
      return;
    }

    Animated.parallel([
      Animated.timing(posX, {
        toValue: screenX,
        duration: 250,
        useNativeDriver: false,
      }),

      Animated.timing(posY, {
        toValue: screenY,
        duration: 250,
        useNativeDriver: false,
      }),

      Animated.spring(radius, {
        toValue: targetRadius,
        friction: 6,
        tension: 80,
        useNativeDriver: false,
      }),
    ]).start();
  }, [metrics, overlayWidth, overlayHeight]);

  if (!metrics) return null;

  return (
    <AnimatedCircle
      cx={posX}
      cy={posY}
      r={radius}
      stroke={color}
      strokeWidth={3}
      fill="none"
    />
  );
}

export default FaceBox;
