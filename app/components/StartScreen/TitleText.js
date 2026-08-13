import { StyleSheet, Text } from "react-native";
import { COLORS } from "../../constants/Colors";

function TitleText({ children, style, textAlignment = "left" }) {
  return (
    <Text style={[styles.text, { textAlign: textAlignment }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.textPrimary,
    lineHeight: 38,
  },
});

export default TitleText;
