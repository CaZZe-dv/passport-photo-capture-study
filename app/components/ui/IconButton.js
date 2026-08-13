import { Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/Colors";

function IconButton({
  iconName,
  IconItem,
  containerStyles,
  iconSize = 22,
  iconColor = COLORS.primary,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        containerStyles,
        pressed && styles.pressed,
      ]}
    >
      <IconItem name={iconName} size={iconSize} color={iconColor} />
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
