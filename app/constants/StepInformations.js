import { STEPS, HINTS } from "../models/Steps";

export function getStepInformation(currentStep) {
  let info;
  switch (currentStep) {
    case STEPS.FIND_FACE:
      info = STEP_INFORMATIONS.find_face_info;
      break;
    case STEPS.ADJUST_LIGHTNING:
      info = STEP_INFORMATIONS.lighting_checking;
      break;
    case STEPS.ADJUST_BACKGROUND:
      info = STEP_INFORMATIONS.background_checking;
      break;
    case STEPS.ADJUST_FACE_POSITION:
      info = STEP_INFORMATIONS.position_checking;
      break;
    case STEPS.ADJUST_FACE_EXPRESSION:
      info = STEP_INFORMATIONS.expression_checking;
      break;
  }
  return info;
}

export function getStepOrderIcons(step) {
  let iconName;
  switch (step) {
    case STEPS.FIND_FACE:
      iconName = "face";
      break;
    case STEPS.ADJUST_LIGHTNING:
      iconName = "lighting";
      break;
    case STEPS.ADJUST_BACKGROUND:
      iconName = "background";
      break;
    case STEPS.ADJUST_FACE_POSITION:
      iconName = "face_position";
      break;
    case STEPS.ADJUST_FACE_EXPRESSION:
      iconName = "expression";
      break;
  }
  return iconName;
}

export const STEP_ORDER = [
  STEPS.FIND_FACE,
  STEPS.ADJUST_LIGHTNING,
  STEPS.ADJUST_BACKGROUND,
  STEPS.ADJUST_FACE_POSITION,
  STEPS.ADJUST_FACE_EXPRESSION,
];

export const STEP_INFORMATIONS = {
  //------------------------------------------------------
  //FACE DETECTION
  //FACE DETECTION INFO

  find_face_info: {
    step: STEPS.FIND_FACE,
    id: 1,
    hint: HINTS.INFO,
    message: "Position your face inside the oval.",
    icon: "info",
  },

  //FACE DETECTION ERRORS

  no_face: {
    step: STEPS.FIND_FACE,
    id: 2,
    hint: HINTS.ERROR,
    message: "No face detected. Position your face inside the frame.",
    icon: "no_face",
  },

  multiple_faces: {
    step: STEPS.FIND_FACE,
    id: 3,
    hint: HINTS.ERROR,
    message: "Multiple faces detected. Only one person is allowed.",
    icon: "multiple_faces",
  },

  adjust_face_bounds: {
    step: STEPS.FIND_FACE,
    id: 4,
    hint: HINTS.WARNING,
    message: "Adjust your face to be inside the the oval.",
    icon: "adjust_face_bounds",
  },

  face_not_in_bounds: {
    step: STEPS.FIND_FACE,
    id: 5,
    hint: HINTS.ERROR,
    message: "Face is not in bounds, position it inside the oval",
    icon: "face_not_in_bounds",
  },

  //FACE DETECTION SUCCESS

  face_detected: {
    step: STEPS.FIND_FACE,
    id: 6,
    hint: HINTS.SUCCESS,
    message: "Face detected. Keep looking straight at the camera.",
    icon: "face",
  },

  //------------------------------------------------------

  //LIGHTING
  //LIGHTING INFO

  lighting_checking: {
    step: STEPS.ADJUST_LIGHTNING,
    id: 1,
    hint: HINTS.INFO,
    message: "Checking lighting conditions on your face and background.",
    icon: "info",
  },

  //LIGHTING ERRORS AND WARNINGS

  lighting_too_dark: {
    step: STEPS.ADJUST_LIGHTNING,
    id: 2,
    hint: HINTS.ERROR,
    message: "Lighting is too dark. Move to a brighter place.",
    icon: "lighting_dark",
  },

  lighting_too_bright: {
    step: STEPS.ADJUST_LIGHTNING,
    id: 3,
    hint: HINTS.WARNING,
    message: "Lighting is too bright. Reduce exposure or avoid strong light.",
    icon: "lighting_bright",
  },

  background_too_dark: {
    step: STEPS.ADJUST_LIGHTNING,
    id: 4,
    hint: HINTS.WARNING,
    message: "Background is too dark. Use a lighter background.",
    icon: "lighting_dark",
  },

  background_too_bright: {
    step: STEPS.ADJUST_LIGHTNING,
    id: 5,
    hint: HINTS.WARNING,
    message: "Background is too bright. Use a darker background.",
    icon: "lighting_bright",
  },

  lighting_backlight: {
    step: STEPS.ADJUST_LIGHTNING,
    id: 6,
    hint: HINTS.WARNING,
    message:
      "Strong light behind you detected. Avoid windows or bright backgrounds.",
    icon: "backlight",
  },

  //LIGHTING SUCCESS

  lighting_good: {
    step: STEPS.ADJUST_LIGHTNING,
    id: 7,
    hint: HINTS.SUCCESS,
    message: "Lighting looks good.",
    icon: "lighting",
  },

  //------------------------------------------------------

  //BACKGROUND
  //BACKGROUND INFO

  background_checking: {
    step: STEPS.ADJUST_BACKGROUND,
    id: 1,
    hint: HINTS.INFO,
    message: "Checking if your background is plain and uniform.",
    icon: "info",
  },

  //BACKGROUND ERROR

  background_not_plain: {
    step: STEPS.ADJUST_BACKGROUND,
    id: 2,
    hint: HINTS.ERROR,
    message: "Background is not plain, change background.",
    icon: "background_error",
  },

  //BACKGROUND SUCCESS

  background_ok: {
    step: STEPS.ADJUST_BACKGROUND,
    id: 3,
    hint: HINTS.SUCCESS,
    message: "Background looks good.",
    icon: "background",
  },

  //------------------------------------------------------

  //POSTION CHECK
  //POSITION CHECK INFO

  position_checking: {
    step: STEPS.ADJUST_FACE_POSITION,
    id: 1,
    hint: HINTS.INFO,
    message:
      "Adjust your face so it is centered inside the oval frame and no rotation.",
    icon: "info",
  },

  //------------------------------------------------------

  //POSITION CHECK ERRORS AND WARNINGS
  //NO FACE
  no_face_position: {
    step: STEPS.ADJUST_FACE_POSITION,
    id: 2,
    hint: HINTS.ERROR,
    message: "Position cannot be evaluated because no face visible",
    icon: "no_face",
  },

  //HEAD RATIO

  head_to_small: {
    step: STEPS.ADJUST_FACE_POSITION,
    id: 3,
    hint: HINTS.ERROR,
    message: "Head to small get closer to camera.",
    icon: "face_size_small",
  },

  head_to_big: {
    step: STEPS.ADJUST_FACE_POSITION,
    id: 4,
    hint: HINTS.ERROR,
    message: "Head to big get move further away from camera.",
    icon: "face_size_big",
  },

  //FACE POSITION

  face_not_centered: {
    step: STEPS.ADJUST_FACE_POSITION,
    id: 5,
    hint: HINTS.ERROR,
    message: "Face is not centered properly.",
    icon: "face_not_centered",
  },

  face_adjust_position: {
    step: STEPS.ADJUST_FACE_POSITION,
    id: 6,
    hint: HINTS.WARNING,
    message: "Adjust your face position slightly.",
    icon: "face_adjust_position",
  },

  //FACE ROTATION

  face_rotated: {
    step: STEPS.ADJUST_FACE_POSITION,
    id: 7,
    hint: HINTS.ERROR,
    message: "Head is rotated too much. Look straight at the camera.",
    icon: "face_rotated",
  },

  face_rotate_adjust: {
    step: STEPS.ADJUST_FACE_POSITION,
    id: 8,
    hint: HINTS.WARNING,
    message: "Slight head rotation detected. Try to keep your head straight.",
    icon: "face_rotate_adjust",
  },

  //FACE POSTITION SUCCESS

  face_position_ok: {
    step: STEPS.ADJUST_FACE_POSITION,
    id: 9,
    hint: HINTS.SUCCESS,
    message: "Face is centered correctly.",
    icon: "face_position",
  },

  //------------------------------------------------------

  //EXPRESSION CHECK
  //EXPRESSION CHECK INFO

  expression_checking: {
    step: STEPS.ADJUST_FACE_EXPRESSION,
    id: 1,
    hint: HINTS.INFO,
    message: "Maintain a neutral facial expression.",
    icon: "info",
  },

  //EXPRESSION CHECK ERRORS

  open_eyes: {
    step: STEPS.ADJUST_FACE_EXPRESSION,
    id: 2,
    hint: HINTS.ERROR,
    message: "Eyes must be open and clearly visible.",
    icon: "eyes",
  },

  close_mouth: {
    step: STEPS.ADJUST_FACE_EXPRESSION,
    id: 3,
    hint: HINTS.ERROR,
    message:
      "Neutral expression required. Please do not smile or have mouth open.",
    icon: "mouth_closed",
  },

  //EXPRESSION CHECK SUCCESS

  valid_expression: {
    step: STEPS.ADJUST_FACE_EXPRESSION,
    id: 4,
    hint: HINTS.SUCCESS,
    message: "Expression is compliant.",
    icon: "expression",
  },

  //------------------------------------------------------

  capture_photo: {
    step: STEPS.CAPTURE_PHOTO,
    id: 1,
    hint: HINTS.SUCCESS,
    message: "All steps completed, capture photo now!",
    icon: "capture_photo",
  },

  capture_photo_not_recommended: {
    step: STEPS.CAPTURE_PHOTO,
    id: 2,
    hint: HINTS.WARNING,
    message:
      "You havent yet completed all steps, capturing now is not recommended! Press again to do it anyways.",
    icon: "warning",
  },
};
