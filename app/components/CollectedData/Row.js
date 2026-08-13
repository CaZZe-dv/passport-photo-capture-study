import { StyleSheet, View } from "react-native";
import SubtitleText from "../StartScreen/SubtitleText";

function Row({ label, value, shouldAutoFormat = false }) {
  function formatValue(val) {
    if (!shouldAutoFormat) return val ?? "-";
    if (val === 1) return "Yes";
    if (val === 0) return "No";
    if (val === null || val === undefined) return "-";

    return val;
  }

  return (
    <View style={styles.row}>
      <SubtitleText style={styles.label}>{label}</SubtitleText>
      <SubtitleText style={styles.value}>{formatValue(value)}</SubtitleText>
    </View>
  );
}

export default Row;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    opacity: 0.7,
  },
  value: {
    fontWeight: "600",
  },
});
