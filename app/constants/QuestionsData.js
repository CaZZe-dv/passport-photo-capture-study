import { Question, AnswersType } from "../models/Questions";

export const SUS_QUESTIONS = [
  new Question(
    1,
    "I think that I would like to use this system frequently.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    2,
    "I found the system unnecessarily complex.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    3,
    "I thought the system was easy to use.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    4,
    "I think that I would need the support of a technical person to be able to use this system.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    5,
    "I found the various functions in this system were well integrated.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    6,
    "I thought there was too much inconsistency in this system.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    7,
    "I would imagine that most people would learn to use this system very quickly.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    8,
    "I found the system very cumbersome to use.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    9,
    "I felt very confident using the system.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    10,
    "I needed to learn a lot of things before I could get going with this system.",
    AnswersType.FIVE_ITEM,
  ),
];

export const CUSTOM_LIKERT_QUESTIONS = [
  new Question(
    1,
    "The application clearly explained what was required of me.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    2,
    "The feedback provided by the application was helpful.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    3,
    "I felt confident that my photo would be accepted.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    4,
    "The task could be completed quickly.",
    AnswersType.FIVE_ITEM,
  ),
  new Question(
    5,
    "Overall, I am satisfied with the application.",
    AnswersType.FIVE_ITEM,
  ),
];
