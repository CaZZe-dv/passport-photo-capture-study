import { LinearGradient } from "expo-linear-gradient";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import TitleText from "../../components/StartScreen/TitleText";
import TextButton from "../../components/ui/TextButton";
import ProgressBar from "../../components/Questionnaire/ProgressBar";
import { useContext, useState } from "react";
import { CUSTOM_LIKERT_QUESTIONS } from "../../constants/QuestionsData";
import QuestionCard from "../../components/Questionnaire/QuestionCard";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/Colors";
import { StudyResultsContext } from "../../store/StudyResultsContext";
import { AnswerType } from "../../models/Questions";

function CustomLikertQuestionnaireScreen({ navigation }) {
  const studyResultsContext = useContext(StudyResultsContext);
  const questions = CUSTOM_LIKERT_QUESTIONS;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const currentQuestion = questions[questionIndex];

  function handleAnswer(value) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  }

  function convertAnswerToNumber(value) {
    switch (value) {
      case AnswerType.STRONGLY_DISAGREE:
        return 1;
      case AnswerType.DISAGREE:
        return 2;
      case AnswerType.NEUTRAL:
        return 3;
      case AnswerType.AGREE:
        return 4;
      case AnswerType.STRONGLY_AGREE:
        return 5;
    }
  }

  function onPressNextQuestionHandler() {
    studyResultsContext.updateStudyData((prev) => {
      return {
        ...prev,
        [`custom_question${currentQuestion.id}`]: convertAnswerToNumber(
          answers[currentQuestion.id],
        ),
      };
    });
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      navigation.navigate("AdditionalFeedbackScreen", {
        susAnswers: answers,
      });
    }
  }
  const isAnswered = answers[currentQuestion.id] !== undefined;

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
          <TitleText textAlignment="center">
            Custom Likert Questionnaire
          </TitleText>
          <ProgressBar length={questions.length} index={questionIndex} />
          <QuestionCard
            question={currentQuestion}
            selectedValue={answers[currentQuestion.id]}
            onSelectAnswer={handleAnswer}
          />
        </View>

        <TextButton onPress={onPressNextQuestionHandler} disabled={!isAnswered}>
          {questionIndex === questions.length - 1
            ? "Continue"
            : "Next Question"}
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

export default CustomLikertQuestionnaireScreen;
