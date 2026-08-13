import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/Colors";

function TextIconButton({
  iconName,
  IconItem,
  containerStyles,
  textStyles,
  iconSize = 22,
  iconColor = COLORS.textOnPrimary,
  onPress,
  children,
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
      <Text style={[styles.text, textStyles]}>{children}</Text>
      <IconItem name={iconName} size={iconSize} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  text: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 16,
  },
});

export default TextIconButton;
