import { View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../../constants/Colors";
import Icon from "../../ui/Icon";
import { getHintColor, HINTS } from "../../../models/Steps";

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

function getLightColorForState(state) {
  switch (state) {
    case 2:
      return COLORS.stepProgressionItemCompletedLight;
    case 1:
      return COLORS.stepProgressionItemSelectedLight;
    default:
      return COLORS.stepProgressionItemBackground;
  }
}

function StepProgressionItem({
  iconName,
  hasWarning,
  hasError,
  isCompleted,
  isSelected,
}) {
  const state = isCompleted ? 2 : isSelected ? 1 : 0;

  const warningColor = getHintColor(HINTS.WARNING);
  const errorColor = getHintColor(HINTS.ERROR);

  let borderColor = getColorForState(state);

  if (hasError) borderColor = errorColor;
  else if (hasWarning) borderColor = warningColor;

  return (
    <View
      style={[
        styles.stepItem,
        {
          borderColor: borderColor,
          backgroundColor: getLightColorForState(state),
        },
      ]}
    >
      <Icon name={iconName} />

      {(hasError ||
        hasWarning ||
        isCompleted ||
        (!isCompleted && !isSelected)) && (
        <View
          style={[
            styles.checkContainer,
            {
              backgroundColor: hasError
                ? errorColor
                : hasWarning
                  ? warningColor
                  : !isCompleted && !isSelected
                    ? COLORS.stepLockBackground
                    : COLORS.checkmarkBackground,
            },
          ]}
        >
          {hasError ? (
            <Ionicons name="close" size={10} color="white" />
          ) : hasWarning ? (
            <Ionicons name="alert-circle" size={10} color="white" />
          ) : !isCompleted && !isSelected ? (
            <Ionicons name="lock-closed" size={10} color="black" />
          ) : (
            <Ionicons name="checkmark" size={10} color="white" />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stepItem: {
    height: 44,
    width: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkContainer: {
    position: "absolute",
    bottom: -2,
    right: -2,
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: COLORS.checkmarkBackground,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StepProgressionItem;
