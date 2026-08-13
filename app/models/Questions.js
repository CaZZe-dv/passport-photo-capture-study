export const AnswerType = Object.freeze({
  STRONGLY_AGREE: "Strongly agree",
  AGREE: "Agree",
  NEUTRAL: "Neutral",
  DISAGREE: "Disagree",
  STRONGLY_DISAGREE: "Strongly Disagree",
});

export const AnswersType = Object.freeze({
  FIVE_ITEM: [
    AnswerType.STRONGLY_DISAGREE,
    AnswerType.DISAGREE,
    AnswerType.NEUTRAL,
    AnswerType.AGREE,
    AnswerType.STRONGLY_AGREE,
  ],
});

export class Question {
  constructor(id, questionText, answersType) {
    this.id = id;
    this.questionText = questionText;
    this.answersType = answersType;
  }
}


