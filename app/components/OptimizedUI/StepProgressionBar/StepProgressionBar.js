import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../../../constants/Colors";
import TitleText from "../../StartScreen/TitleText";
import StepProgressionItem from "./StepProgressionItem";
import Connector from "./Connector";
import {
  getStepOrderIcons,
  STEP_ORDER,
} from "../../../constants/StepInformations";
import { HINTS, STEPS } from "../../../models/Steps";

const steps = STEP_ORDER;

function StepProgressBar({
  contentStyles,
  hintIndexes,
  currentStepIndex,
  overrideStep = null,
}) {
  const displayText =
    overrideStep ??
    (currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : STEPS.CAPTURE_PHOTO);

  return (
    <View style={[styles.wrapper, contentStyles]}>
      <TitleText
        style={{ marginVertical: 6, color: COLORS.textOnPrimary }}
        textAlignment="center"
      >
        {displayText}
      </TitleText>

      <View style={styles.container}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isSelected = index === currentStepIndex;

          const hint = hintIndexes[index];
          const hasWarning = hint?.hint === HINTS.WARNING;
          const hasError = hint?.hint === HINTS.ERROR;

          return (
            <React.Fragment key={index}>
              <StepProgressionItem
                iconName={getStepOrderIcons(step)}
                hasWarning={hasWarning}
                hasError={hasError}
                isCompleted={isCompleted}
                isSelected={isSelected}
              />

              {index < steps.length - 1 && (
                <Connector index={index} currentStepIndex={currentStepIndex} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

export default StepProgressBar;

const styles = StyleSheet.create({
  wrapper: {
    width: "95%",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
