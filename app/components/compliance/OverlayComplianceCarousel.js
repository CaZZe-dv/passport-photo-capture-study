import { StyleSheet, View } from "react-native";
import { useState } from "react";
import Svg, { Defs, Ellipse, G, Mask, Rect } from "react-native-svg";
import FaceOval from "../OptimizedUI/UIOverlays/FaceOval";
import { getHintColor, STEPS } from "../../models/Steps";
import FindFace from "../OptimizedUI/UIOverlays/FindFace";
import LightingScan from "../OptimizedUI/UIOverlays/LightingScan";
import BackgroundScan from "../OptimizedUI/UIOverlays/BackgroundScan";
import DirectionGuidance from "../OptimizedUI/UIOverlays/DirectionGuidance";

function OverlayComplianceCarousel({ metrics, check, index }) {
  const color = getHintColor(check?.hint);

  const [overlayDimensions, setOverlayDimensions] = useState({
    width: 0,
    height: 0,
  });

  return (
    <View
      pointerEvents="none"
      style={styles.container}
      onLayout={(e) => {
        setOverlayDimensions({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        });
      }}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <Mask id={`backgroundMask`}>
            <Rect width="100%" height="100%" fill="white" />
            <Ellipse cx="50%" cy="50%" rx="35%" ry="40%" fill="black" />
          </Mask>
          <Mask id="faceMask">
            <Rect width="100%" height="100%" fill="black" />
            <Ellipse cx="50%" cy="50%" rx="35%" ry="40%" fill="white" />
          </Mask>
        </Defs>
        <G mask={`url(#backgroundMask)`}>
          <Rect width="100%" height="100%" fill="transparent" />
        </G>
        <FaceOval color={color} />
        {check?.step === STEPS.FIND_FACE && (
          <FindFace
            color={color}
            metrics={metrics}
            overlayHeight={overlayDimensions.height}
            overlayWidth={overlayDimensions.width}
          />
        )}

        {check?.step === STEPS.ADJUST_LIGHTNING && (
          <LightingScan color={color} />
        )}

        {check?.step === STEPS.ADJUST_BACKGROUND && (
          <BackgroundScan
            color={color}
            active={true}
            height={overlayDimensions.height}
          />
        )}

        {check?.step === STEPS.ADJUST_FACE_POSITION && (
          <DirectionGuidance
            color={color}
            metrics={metrics}
            overlayHeight={overlayDimensions.height}
            overlayWidth={overlayDimensions.width}
            hint={check}
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
});

export default OverlayComplianceCarousel;
