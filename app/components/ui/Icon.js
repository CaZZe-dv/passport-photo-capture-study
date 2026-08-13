import { View } from "react-native";
import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

const icons = {
  /* ---------- GENERIC STATUS ICONS ---------- */

  info: (props) => (
    <Ionicons
      name="information-circle"
      size={props.size || 24}
      color={props.color || "#2196F3"}
    />
  ),

  success: (props) => (
    <Ionicons
      name="checkmark-circle"
      size={props.size || 24}
      color={props.color || "#4CAF50"}
    />
  ),

  warning: (props) => (
    <Ionicons
      name="warning"
      size={props.size || 24}
      color={props.color || "#FF9800"}
    />
  ),

  error: (props) => (
    <Ionicons
      name="close-circle"
      size={props.size || 24}
      color={props.color || "#F44336"}
    />
  ),

  /* ---------- FACE DETECTION ---------- */

  face: (props) => (
    <FontAwesome6
      name="face-smile"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  no_face: (props) => (
    <View>
      <FontAwesome6
        name="face-meh"
        size={props.size || 24}
        color={props.color || "black"}
      />
      <FontAwesome6
        name="xmark"
        size={(props.size || 24) * 0.6}
        color="red"
        style={{
          position: "absolute",
          right: -2,
          top: -2,
        }}
      />
    </View>
  ),

  multiple_faces: (props) => (
    <FontAwesome6
      name="users"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  adjust_face_bounds: (props) => (
    <AntDesign
      name="compress"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  face_not_in_bounds: (props) => (
    <AntDesign
      name="expand"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  /* ---------- LIGHTING ---------- */

  lighting: (props) => (
    <Ionicons
      name="sunny"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  lighting_dark: (props) => (
    <Ionicons
      name="moon"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  lighting_bright: (props) => (
    <MaterialIcons
      name="wb-sunny"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  backlight: (props) => (
    <Ionicons
      name="sunny-outline"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  /* ---------- BACKGROUND ---------- */

  background: (props) => (
    <MaterialIcons
      name="wallpaper"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  background_error: (props) => (
    <MaterialIcons
      name="broken-image"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  /* ---------- POSITION ---------- */

  face_position: (props) => (
    <MaterialIcons
      name="center-focus-strong"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  face_rotation: (props) => (
    <MaterialIcons
      name="screen-rotation"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  face_size_small: (props) => (
    <MaterialIcons
      name="zoom-in"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  face_size_big: (props) => (
    <MaterialIcons
      name="zoom-out"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  /* ---------- FACE POSITION ---------- */

  face_not_centered: (props) => (
    <MaterialIcons
      name="center-focus-weak"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  face_adjust_position: (props) => (
    <MaterialIcons
      name="center-focus-weak"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  face_position_ok: (props) => (
    <MaterialIcons
      name="center-focus-strong"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  /* ---------- FACE ROTATION ---------- */

  face_rotated: (props) => (
    <MaterialIcons
      name="screen-rotation"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  face_rotate_adjust: (props) => (
    <MaterialIcons
      name="screen-rotation"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  face_rotation_ok: (props) => (
    <Ionicons
      name="checkmark-circle"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  /* ---------- HEAD RATIO ---------- */

  head_ratio_correct: (props) => (
    <Ionicons
      name="checkmark-circle"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  /* ---------- EXPRESSION ---------- */

  expression: (props) => (
    <FontAwesome6
      name="face-meh"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  eyes: (props) => (
    <FontAwesome6
      name="eye"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  mouth_closed: (props) => (
    <MaterialIcons
      name="sentiment-neutral"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),

  /* ---------- Capture Photo ---------- */

  capture_photo: (props) => (
    <MaterialIcons
      name="photo-camera"
      size={props.size || 24}
      color={props.color || "black"}
    />
  ),
};

function Icon({ name, size = 24, color = "black" }) {
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent size={size} color={color} />;
}

export default Icon;
