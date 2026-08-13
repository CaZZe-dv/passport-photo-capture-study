import { View, Text, StyleSheet } from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import TitleText from "../../components/StartScreen/TitleText";
import SubtitleText from "../../components/StartScreen/SubtitleText";
import TextButton from "../../components/ui/TextButton";
import { useContext, useEffect } from "react";
import { StudyResultsContext } from "../../store/StudyResultsContext";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/Colors";

function EndTestScreen({ navigation, route }) {
  const studyResultsContext = useContext(StudyResultsContext);
  useEffect(() => {
    studyResultsContext.updateStudyData((prev) => ({
      ...prev,
      endTimestamp: new Date().toISOString(),
    }));
  }, []);

  function onContinuePressHandler() {
    navigation.navigate("QuestionnaireWelcomeScreen");
  }

  return (
    <LinearGradient
      colors={[
        COLORS.gradientFrostStart,
        COLORS.gradientFrostMid,
        COLORS.gradientFrostEnd,
      ]}
      style={{ flex: 1 }}
    >
      <ScreenWrapper style={styles.screenWrapper}>
        <View>
          <TitleText textAlignment="center">
            {studyResultsContext.studyData.taskSuccess
              ? "Task Completed"
              : "Task Time Exceeded"}
          </TitleText>
          <SubtitleText>
            {studyResultsContext.studyData.taskSuccess
              ? "You have completed the task. "
              : "You exceeded the maximum time of 5 minutes. "}
            Please proceed to do the questionaire.
          </SubtitleText>
        </View>
        <TextButton onPress={onContinuePressHandler}>Continue</TextButton>
      </ScreenWrapper>
    </LinearGradient>
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
});

export default EndTestScreen;
