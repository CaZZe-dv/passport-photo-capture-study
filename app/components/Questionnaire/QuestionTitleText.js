import { StyleSheet, Text } from "react-native";
import { COLORS } from "../../constants/Colors";

function QuestionTitleText({ children, style, textAlignment = "left" }) {
  return (
    <Text style={[styles.text, { textAlign: textAlignment }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: "400",
    color: COLORS.textPrimary,
  },
});

export default QuestionTitleText;
