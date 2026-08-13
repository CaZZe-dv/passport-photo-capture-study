import { COLORS } from "../constants/Colors";

export const STEPS = Object.freeze({
  FIND_FACE: "Find Face",
  ADJUST_LIGHTNING: "Adjust Lightning",
  ADJUST_BACKGROUND: "Adjust Background",
  ADJUST_FACE_POSITION: "Adjust Face Position",
  ADJUST_FACE_EXPRESSION: "Adjust Face Expression",
  CAPTURE_PHOTO: "Capture Photo",
});

export const HINTS = Object.freeze({
  SUCCESS: "Success",
  WARNING: "Warning",
  ERROR: "Error",
  INFO: "Info",
});

export function getHintIcon(hint) {
  let icon;
  if (hint === HINTS.INFO) {
    icon = "info";
  }
  if (hint === HINTS.SUCCESS) {
    icon = "success";
  }
  if (hint === HINTS.ERROR) {
    icon = "error";
  }
  if (hint === HINTS.WARNING) {
    icon = "warning";
  }
  return icon;
}

export function getHintColor(hint) {
  let color;
  if (hint === HINTS.INFO) {
    color = COLORS.info;
  }
  if (hint === HINTS.SUCCESS) {
    color = COLORS.success;
  }
  if (hint === HINTS.ERROR) {
    color = COLORS.error;
  }
  if (hint === HINTS.WARNING) {
    color = COLORS.warning;
  }
  return color;
}
