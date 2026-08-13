import { STEP_INFORMATIONS } from "../constants/StepInformations";
import { HINTS, STEPS } from "../models/Steps";

export function checkForFaceCount(metrics, stepCount) {
  const checks = [];
  const faceCount = metrics.faceCount;
  const faceBound = checkForFaceInBounds(metrics);

  if (faceCount === 0) checks.push(STEP_INFORMATIONS.no_face);
  if (faceCount > 1) checks.push(STEP_INFORMATIONS.multiple_faces);
  if (stepCount < 3 && faceBound) checks.push(faceBound);
  if (checks.length === 0) {
    checks.push(STEP_INFORMATIONS.face_detected);
  }
  return checks;
}

export function getFaceCenter(metrics) {
  return {
    x: metrics.eyeMidX,
    y: metrics.eyeMidY,
  };
}

export function getFaceCenteringScore(metrics) {
  const { eyeMidX, eyeMidY, imageHeight, imageWidth } = metrics;

  const ellipseCenterX = imageWidth / 2;
  const ellipseCenterY = imageHeight * 0.4;

  const radiusX = imageWidth * 0.35;
  const radiusY = imageHeight * 0.4;

  const dx = eyeMidX - ellipseCenterX;
  const dy = eyeMidY - ellipseCenterY;

  const ellipseValue =
    (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY);

  const score = 1 - ellipseValue * 0.6;

  return Math.max(0, Math.min(1, score));
}

export function checkForFaceInBounds(metrics) {
  const { eyeMidX, eyeMidY, imageHeight, imageWidth } = metrics;

  const ellipseCenterX = imageWidth / 2;
  const ellipseCenterY = imageHeight * 0.38;

  // stricter bounds
  const radiusX = imageWidth * 0.25;
  const radiusY = imageHeight * 0.32;

  const dx = eyeMidX - ellipseCenterX;
  const dy = eyeMidY - ellipseCenterY;

  const ellipseValue =
    (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY);

  if (ellipseValue > 1) {
    return STEP_INFORMATIONS.face_not_in_bounds;
  }

  if (ellipseValue > 0.35) {
    return STEP_INFORMATIONS.adjust_face_bounds;
  }

  return null;
}

export function checkForLightning(metrics) {
  const checks = [];
  const faceBrightness = metrics.faceBrightness;
  const backgroundBrightness = metrics.backgroundBrightness;

  if (faceBrightness < 95) {
    checks.push(STEP_INFORMATIONS.lighting_too_dark);
  }
  if (faceBrightness > 205) {
    checks.push(STEP_INFORMATIONS.lighting_too_bright);
  }
  if (backgroundBrightness - faceBrightness > 45) {
    checks.push(STEP_INFORMATIONS.lighting_backlight);
  }
  if (backgroundBrightness < 75) {
    checks.push(STEP_INFORMATIONS.background_too_dark);
  }
  if (checks.length === 0) {
    checks.push(STEP_INFORMATIONS.lighting_good);
  }

  return checks;
}

export function checkForBackground(metrics) {
  const checks = [];
  if (!metrics.backgroundOk) {
    checks.push(STEP_INFORMATIONS.background_not_plain);
  }
  if (checks.length === 0) {
    checks.push(STEP_INFORMATIONS.background_ok);
  }

  return checks;
}

function getPositionGuidance(metrics) {
  const faceCenterX = metrics.eyeMidX;
  const faceCenterY = metrics.eyeMidY;

  const imageCenterX = metrics.imageWidth / 2;
  const imageCenterY = metrics.imageHeight * 0.4;

  const dx = faceCenterX - imageCenterX;
  const dy = faceCenterY - imageCenterY;

  const warnHorizontal = metrics.imageWidth * 0.08;
  const warnVertical = metrics.imageHeight * 0.1;

  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (absDx < warnHorizontal && absDy < warnVertical) {
    return null;
  }

  const diagonalThresholdX = warnHorizontal * 1.5;
  const diagonalThresholdY = warnVertical * 1.5;

  if (absDx > diagonalThresholdX && absDy > diagonalThresholdY) {
    return {
      x: dx > 0 ? "left" : "right",
      y: dy > 0 ? "up" : "down",
    };
  }

  if (absDx > absDy) {
    return {
      x: dx > 0 ? "left" : "right",
    };
  }

  return {
    y: dy > 0 ? "up" : "down",
  };
}

function getDistanceGuidance(metrics) {
  const ratio = metrics.headHeightRatio;

  if (ratio < 0.5) {
    return "closer";
  }

  if (ratio > 0.6) {
    return "farther";
  }

  return null;
}

function getRotationGuidance(metrics) {
  const yaw = metrics.yaw;
  const roll = metrics.roll;

  if (Math.abs(yaw) > 8) {
    return yaw > 0 ? "turn_left" : "turn_right";
  }

  if (Math.abs(roll) > 4) {
    return roll > 0 ? "tilt_left" : "tilt_right";
  }

  return null;
}

export function getGuidance(metrics) {
  return {
    position: getPositionGuidance(metrics),
    distance: getDistanceGuidance(metrics),
    rotation: getRotationGuidance(metrics),
  };
}

export function getModeFromHint(hint) {
  if (!hint) return null;

  switch (hint.icon) {
    case "face_not_centered":
    case "face_adjust_position":
      return "position";

    case "face_size_small":
    case "face_size_big":
      return "distance";

    case "face_rotated":
    case "face_rotate_adjust":
      return "rotation";

    default:
      return null;
  }
}

function checkForHeadRotation(metrics) {
  const yaw = Math.abs(metrics.yaw);
  const roll = Math.abs(metrics.roll);

  if (yaw > 15 || roll > 8) {
    return STEP_INFORMATIONS.face_rotated;
  }

  if (yaw > 8 || roll > 4) {
    return STEP_INFORMATIONS.face_rotate_adjust;
  }

  return null;
}

export function checkForFacePosition(metrics) {
  if (metrics.faceCount === 0) {
    return [STEP_INFORMATIONS.no_face_position];
  }

  const checks = [];
  const ratioCheck = checkForHeadRatio(metrics.headHeightRatio);
  const positionCheck = checkForHeadPosition(metrics);
  const rotationCheck = checkForHeadRotation(metrics);

  if (rotationCheck) checks.push(rotationCheck);
  if (positionCheck) checks.push(positionCheck);
  if (ratioCheck) checks.push(ratioCheck);

  if (checks.length === 0) {
    checks.push(STEP_INFORMATIONS.face_position_ok);
  }

  return checks;
}

function checkForHeadPosition(metrics) {
  const faceCenterX = metrics.eyeMidX;
  const faceCenterY = metrics.eyeMidY;

  const imageCenterX = metrics.imageWidth / 2;
  const imageCenterY = metrics.imageHeight * 0.4;

  const horizontalOffset = Math.abs(faceCenterX - imageCenterX);
  const verticalOffset = Math.abs(faceCenterY - imageCenterY);

  const warnHorizontal = metrics.imageWidth * 0.08;
  const warnVertical = metrics.imageHeight * 0.1;

  const errorHorizontal = metrics.imageWidth * 0.15;
  const errorVertical = metrics.imageHeight * 0.18;

  if (horizontalOffset > errorHorizontal || verticalOffset > errorVertical) {
    return STEP_INFORMATIONS.face_not_centered;
  }

  if (horizontalOffset > warnHorizontal || verticalOffset > warnVertical) {
    return STEP_INFORMATIONS.face_adjust_position;
  }

  return null;
}

function checkForHeadRatio(headRatio) {
  if (headRatio < 0.5) {
    return STEP_INFORMATIONS.head_to_small;
  }
  if (headRatio > 0.6) {
    return STEP_INFORMATIONS.head_to_big;
  }
  return null;
}

export function checkForFaceExpression(metrics) {
  const checks = [];
  if (!metrics.leftEyeOpen || !metrics.rightEyeOpen) {
    checks.push(STEP_INFORMATIONS.open_eyes);
  }
  if (metrics.mouthOpen) {
    checks.push(STEP_INFORMATIONS.close_mouth);
  }
  if (checks.length === 0) {
    checks.push(STEP_INFORMATIONS.valid_expression);
  }

  return checks;
}

export function runFinalComplianceChecks(metrics) {
  const complianceChecks = [];

  complianceChecks.push(...checkForFaceCount(metrics));
  complianceChecks.push(...checkForLightning(metrics));
  complianceChecks.push(...checkForBackground(metrics));
  complianceChecks.push(...checkForFacePosition(metrics));
  complianceChecks.push(...checkForFaceExpression(metrics));

  const hasError = complianceChecks.some((check) => check.hint === HINTS.ERROR);
  const hasWarning = complianceChecks.some(
    (check) => check.hint === HINTS.WARNING,
  );
  const isCompliant = !hasError;
  const errors = complianceChecks.filter((check) => check.hint === HINTS.ERROR);
  const warnings = complianceChecks.filter(
    (check) => check.hint === HINTS.WARNING,
  );
  const successes = complianceChecks.filter(
    (check) => check.hint === HINTS.SUCCESS,
  );

  return {
    isCompliant,
    hasError,
    hasWarning,
    errorCount: errors.length,
    warningCount: warnings.length,
    successesCount: successes.length,
    errors: errors ?? [],
    warnings: warnings ?? [],
    successes: successes ?? [],
    complianceChecks,
  };
}

export function getChecksForStep(currentStep, metrics, stepCount) {
  let checks = [];
  switch (currentStep) {
    case STEPS.FIND_FACE:
      checks = checkForFaceCount(metrics, stepCount);
      break;
    case STEPS.ADJUST_LIGHTNING:
      checks = checkForLightning(metrics);
      break;

    case STEPS.ADJUST_BACKGROUND:
      checks = checkForBackground(metrics);
      break;

    case STEPS.ADJUST_FACE_POSITION:
      checks = checkForFacePosition(metrics);
      break;

    case STEPS.ADJUST_FACE_EXPRESSION:
      checks = checkForFaceExpression(metrics);
      break;
  }
  return checks;
}
