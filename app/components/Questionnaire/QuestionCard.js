import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { AnswerType } from "../../models/Questions";
import AnswerItem from "./AnswerItem";
import { COLORS } from "../../constants/Colors";
import QuestionTitleText from "./QuestionTitleText";

function QuestionCard({ question, selectedValue, onSelectAnswer }) {
  function onSelectAnswerHandler(answerText) {
    onSelectAnswer(answerText);
  }

  return (
    <View style={styles.card}>
      <QuestionTitleText textAlignment="center" style={styles.questionText}>
        {`${question.id}. ${question.questionText}`}
      </QuestionTitleText>

      <View style={styles.answersContainer}>
        {question.answersType.map((answer, index) => (
          <AnswerItem
            key={index}
            answerText={answer}
            selected={answer === selectedValue}
            onPress={onSelectAnswerHandler}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: COLORS.surface || "#ffffff",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 8,
    marginVertical: 20,
    shadowColor: "#141111",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  questionText: {
    marginHorizontal: 24,
  },
  answersContainer: {
    width: "100%",
    gap: 12,
    marginHorizontal: 20,
  },
});

export default QuestionCard;
