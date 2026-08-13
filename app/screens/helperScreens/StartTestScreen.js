import { View, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import TitleText from "../../components/StartScreen/TitleText";
import SubtitleText from "../../components/StartScreen/SubtitleText";
import TextButton from "../../components/ui/TextButton";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/Colors";
import Checkbox from "expo-checkbox";
import { StudyResultsContext } from "../../store/StudyResultsContext";

function StartTestScreen({ navigation, route }) {
  const studyResultsContext = useContext(StudyResultsContext);
  const nextScreen =
    route.params.uiType === "baseline"
      ? "BaselineUIScreen"
      : "OptimizedUIScreen";

  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleStart = () => {
    if (!isConsentGiven) {
      setShowError(true);
      return;
    }
    studyResultsContext.updateStudyData({
      startTimestamp: new Date().toISOString(),
    });
    navigation.navigate(nextScreen);
  };

  return (
    <LinearGradient
      colors={[
        COLORS.gradientFrostStart,
        COLORS.gradientFrostMid,
        COLORS.gradientFrostEnd,
      ]}
      style={{ flex: 1 }}
    >
      <ScreenWrapper>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <TitleText textAlignment="center">Study Instructions</TitleText>

            <SubtitleText style={styles.text}>
              You will now complete a task as part of a usability study.
            </SubtitleText>

            <SubtitleText style={styles.text}>
              Your task is to capture a passport-style photograph using this
              application. The image must meet defined biometric requirements.
            </SubtitleText>

            <SubtitleText style={styles.text}>
              • Maximum time: 5 minutes{"\n"}• Multiple attempts allowed{"\n"}•
              Your interaction data will be recorded anonymously
            </SubtitleText>

            <SubtitleText style={styles.text}>
              After completing the task, you will be asked to complete a short
              questionnaire within the application.
            </SubtitleText>

            <SubtitleText style={styles.text}>
              Participation is voluntary and you may stop at any time.
            </SubtitleText>

            {/* Consent Section */}
            <View style={styles.consentContainer}>
              <Checkbox
                value={isConsentGiven}
                onValueChange={(value) => {
                  setIsConsentGiven(value);
                  setShowError(false);
                }}
                color={isConsentGiven ? COLORS.primary : undefined}
              />
              <SubtitleText style={styles.consentText}>
                I agree to participate in this study.
              </SubtitleText>
            </View>

            {showError && (
              <SubtitleText style={styles.errorText}>
                You must provide consent before starting the test.
              </SubtitleText>
            )}
          </View>

          <TextButton
            onPress={handleStart}
            containerStyles={[
              styles.startButton,
              !isConsentGiven && styles.disabledButton,
            ]}
          >
            Start Test
          </TextButton>
        </View>
      </ScreenWrapper>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  textContainer: {
    gap: 16,
  },
  text: {
    lineHeight: 22,
    opacity: 0.9,
  },
  consentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 12,
  },
  consentText: {
    flex: 1,
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
  startButton: {
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default StartTestScreen;
