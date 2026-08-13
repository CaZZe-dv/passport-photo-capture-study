import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../../constants/Colors";

function TextButton({
  children,
  containerStyles,
  textStyles,
  onPress,
  disabled = false,
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        containerStyles,

        disabled && styles.containerDisabled,

        pressed && !disabled && styles.containerPressed,
      ]}
    >
      <Text style={[styles.text, textStyles, disabled && styles.textDisabled]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  containerPressed: {
    opacity: 0.7,
  },
  containerDisabled: {
    backgroundColor: "#8e95fd",
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  textDisabled: {
    color: "#777",
  },
});

export default TextButton;
