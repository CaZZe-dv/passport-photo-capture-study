import { StyleSheet, View } from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/Colors";
import TitleText from "../../components/StartScreen/TitleText";
import SubtitleText from "../../components/StartScreen/SubtitleText";
import TextButton from "../../components/ui/TextButton";

function QuestionnaireWelcomeScreen({ navigation }) {
  function onStartQuestionnaireHandler() {
    navigation.navigate("SUSQuestionnaireScreen");
  }

  return (
    <LinearGradient
      colors={[
        COLORS.gradientFrostStart,
        COLORS.gradientFrostMid,
        COLORS.gradientFrostEnd,
      ]}
      style={styles.gradient}
    >
      <ScreenWrapper style={styles.screenWrapper}>
        <View>
          <TitleText>Questionnaire</TitleText>
          <SubtitleText>
            You will now complete a short questionnaire about your experience
            with the application. The questionnaire takes approximately 2-3
            minutes. Your responses are anonymous and will be used solely for
            research purposes. Participation is voluntary.
          </SubtitleText>
        </View>
        <TextButton onPress={onStartQuestionnaireHandler}>
          Start Questionnaire
        </TextButton>
      </ScreenWrapper>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
});

export default QuestionnaireWelcomeScreen;
