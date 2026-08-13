import { StyleSheet, Text } from "react-native";
import { COLORS } from "../../constants/Colors";

function SubtitleText({ children, style, textAlignment = "left" }) {
  return (
    <Text style={[styles.subtitle, { textAlign: textAlignment }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});

export default SubtitleText;
