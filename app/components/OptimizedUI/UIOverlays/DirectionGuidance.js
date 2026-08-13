import React from "react";
import { G, Circle, Ellipse, Path } from "react-native-svg";
import { getGuidance, getModeFromHint } from "../../../util/ComplianceCheck";

function getArrowAngle(position) {
  const x = position?.x;
  const y = position?.y;

  if (!x && !y) return 0;

  if (x === "left" && y === "up") return -45;
  if (x === "right" && y === "up") return 45;
  if (x === "left" && y === "down") return -135;
  if (x === "right" && y === "down") return 135;

  if (x === "left") return -90;
  if (x === "right") return 90;

  if (y === "up") return 0;
  if (y === "down") return -180;

  return 0;
}

function DirectionGuidance({
  color = "yellow",
  metrics,
  overlayWidth,
  overlayHeight,
  hint,
}) {
  if (!metrics || !overlayWidth || !overlayHeight) return null;

  const guide = getGuidance(metrics);

  let mode = getModeFromHint(hint);

  if (!mode) {
    if (guide.rotation) mode = "rotation";
    else if (guide.position) mode = "position";
    else if (guide.distance) mode = "distance";
  }

  if (!mode) return null;

  const centerX = overlayWidth / 2;
  const centerY = overlayHeight / 2;

  const scaleX = overlayWidth / metrics.imageWidth;
  const scaleY = overlayHeight / metrics.imageHeight;

  const faceX = metrics.eyeMidX * scaleX;
  const faceY = metrics.eyeMidY * scaleY;

  const angle = guide.position ? getArrowAngle(guide.position) : 0;

  const positionIndicator = (
    <G transform={`translate(${faceX},${faceY}) rotate(${angle})`}>
      <Circle r={28} stroke={color} strokeWidth={3} fill="none" />
      <Path
        d="M 0 14 L 0 -10"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path d="M 0 -18 L -6 -10 L 6 -10 Z" fill={color} />
    </G>
  );

  const IDEAL_RATIO = 0.55;
  let ratioScale = metrics.headHeightRatio / IDEAL_RATIO;
  ratioScale = Math.max(0.7, Math.min(1.3, ratioScale));
  const rx =
    overlayWidth * (0.25 + (ratioScale - 0.7) * ((0.4 - 0.25) / (1.3 - 0.7)));
  const ry =
    overlayHeight * (0.3 + (ratioScale - 0.7) * ((0.45 - 0.3) / (1.3 - 0.7)));
  const distanceIndicator = (
    <Ellipse
      cx={centerX}
      cy={centerY}
      rx={rx}
      ry={ry}
      stroke={color}
      strokeWidth={2}
      fill="none"
      opacity={0.7}
    />
  );

  let rotationIndicator = null;

  if (guide.rotation) {
    const dir =
      guide.rotation === "tilt_left" || guide.rotation === "turn_left" ? 1 : -1;

    const r = 40;
    const arcCenterX = faceX;
    const arcCenterY = faceY + 50;
    const startAngle = dir === 1 ? Math.PI * 0.8 : Math.PI * 0.2;
    const endAngle = dir === 1 ? Math.PI * 0.2 : Math.PI * 0.8;
    const startX = arcCenterX + r * Math.cos(startAngle);
    const startY = arcCenterY + r * Math.sin(startAngle);
    const endX = arcCenterX + r * Math.cos(endAngle);
    const endY = arcCenterY + r * Math.sin(endAngle);
    const sweep = dir === 1 ? 0 : 1;

    rotationIndicator = (
      <G>
        <Path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 ${sweep} ${endX} ${endY}`}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />

        <G
          transform={`translate(${endX},${endY}) rotate(${dir === 1 ? -40 : 220})`}
        >
          <Path d="M 0 0 L -8 -6 L -8 6 Z" fill={color} />
        </G>
      </G>
    );
  }
  return (
    <G>
      {mode === "position" && positionIndicator}
      {mode === "distance" && distanceIndicator}
      {mode === "rotation" && rotationIndicator}
    </G>
  );
}

export default DirectionGuidance;
