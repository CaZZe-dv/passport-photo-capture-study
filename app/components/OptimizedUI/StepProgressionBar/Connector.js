import { StyleSheet, View } from "react-native";
import { COLORS } from "../../../constants/Colors";

function getStepState(index, currentStepIndex) {
  if (index < currentStepIndex) return 2;
  if (index === currentStepIndex) return 1;
  return 0;
}

function getColorForState(state) {
  switch (state) {
    case 2:
      return COLORS.stepLineCompleted;
    case 1:
      return COLORS.stepLineActive;
    default:
      return COLORS.stepLineBackground;
  }
}

function Connector({ index, currentStepIndex }) {
  const leftState = getStepState(index, currentStepIndex);
  const rightState = getStepState(index + 1, currentStepIndex);

  return (
    <View style={styles.connectorContainer}>
      <View
        style={[styles.line, { backgroundColor: getColorForState(leftState) }]}
      />
      <View
        style={[styles.ball, { backgroundColor: getColorForState(rightState) }]}
      />
      <View
        style={[styles.line, { backgroundColor: getColorForState(rightState) }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  connectorContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  ball: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default Connector;
