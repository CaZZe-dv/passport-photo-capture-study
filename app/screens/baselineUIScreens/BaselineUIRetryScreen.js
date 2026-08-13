import { View, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import TitleText from "../../components/StartScreen/TitleText";
import TextButton from "../../components/ui/TextButton";
import ComplianceCheckerCard from "../../components/compliance/ComplianceCheckerCard";
import { useState } from "react";
import { COLORS } from "../../constants/Colors";

function BaselineUIRetryScreen({ navigation, route }) {
  const photo = route.params.photo;
  const [isChecking, setIsChecking] = useState(true);
  const [isCompliant, setIsCompliant] = useState(null);

  function onComplianceCheckedHandler(result) {
    setIsChecking(false);
    setIsCompliant(result.isCompliant);
  }

  function onButtonPressHandler() {
    if (isCompliant) {
      navigation.replace("EndTestScreen");
    } else {
      navigation.replace("BaselineUIScreen");
    }
  }

  let complianceCheckColor = "black";
  let complianceCheckText = "Compliance Check";
  if (isCompliant !== null) {
    complianceCheckColor = isCompliant ? COLORS.success : COLORS.error;
    complianceCheckText = isCompliant
      ? "Photo Compliant"
      : "Photo not Complaint";
  }

  return (
    <ScreenWrapper style={styles.screenWrapper}>
      <TitleText textAlignment="center" style={{ color: complianceCheckColor }}>
        {complianceCheckText}
      </TitleText>
      <ComplianceCheckerCard
        photo={photo}
        onComplianceChecked={onComplianceCheckedHandler}
        displayImprovements={false}
      />
      <View style={styles.buttonContainer}>
        <TextButton
          containerStyles={{
            opacity: isChecking ? 0 : 1,
            width: "100%",
          }}
          onPress={onButtonPressHandler}
          disabled={isChecking}
        >
          {isCompliant ? "End Test" : "Retake Photo"}
        </TextButton>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 12,
    alignItems: "center",
  },
});

export default BaselineUIRetryScreen;
