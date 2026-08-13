import { View, StyleSheet } from "react-native";
import Svg, { Ellipse, Rect, Defs, Mask } from "react-native-svg";
import { STEPS } from "../../models/Steps";
import BackgroundScan from "./UIOverlays/BackgroundScan";
import FaceOval from "./UIOverlays/FaceOval";
import LightingScan from "./UIOverlays/LightingScan";
import { useState } from "react";
import DirectionGuidance from "./UIOverlays/DirectionGuidance";
import FindFace from "./UIOverlays/FindFace";

function OverlayDrawer({
  activeStep,
  color,
  overrideStep = null,
  metrics,
  stepCount,
}) {
  const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });
  if (overrideStep) {
    activeStep = overrideStep;
  }
  return (
    <View
      style={styles.overlay}
      pointerEvents="none"
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setOverlaySize({ width, height });
      }}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <Mask id="backgroundMask">
            <Rect width="100%" height="100%" fill="white" />
            <Ellipse cx="50%" cy="50%" rx="35%" ry="40%" fill="black" />
          </Mask>
          <Mask id="faceMask">
            <Rect width="100%" height="100%" fill="black" />
            <Ellipse cx="50%" cy="50%" rx="35%" ry="40%" fill="white" />
          </Mask>
        </Defs>
        <FaceOval color={color} />
        {activeStep === STEPS.FIND_FACE && stepCount < 3 && (
          <FindFace
            metrics={metrics}
            color={color}
            overlayWidth={overlaySize.width}
            overlayHeight={overlaySize.height}
          />
        )}
        {activeStep === STEPS.ADJUST_LIGHTNING && (
          <LightingScan color={color} />
        )}
        {activeStep === STEPS.ADJUST_BACKGROUND && (
          <BackgroundScan
            color={color}
            active={true}
            height={overlaySize.height}
          />
        )}
        {activeStep === STEPS.ADJUST_FACE_POSITION && (
          <DirectionGuidance
            metrics={metrics}
            color={color}
            overlayWidth={overlaySize.width}
            overlayHeight={overlaySize.height}
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

export default OverlayDrawer;
