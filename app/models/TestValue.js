/* Structure of saved data
{
  participantId: "P01", (continous number starting with P and Index 01)
  uiType: "baseline/optimized", (eighter baseline or optimized)

  startTimestamp: "2026-03-06T18:22:22.000Z", (set when start test button is pressed)
  endTimestamp: "2026-03-06T18:22:22.000Z", (set when end test button pressed or time limit reached)
  attempts: 3, ()
  firstAttemptComplianceSuccess: 0, (eighter 0 or 1)
  taskSuccess: 1, (eighter 0 or 1)
  errorCount: 4,

  sus_question1: 4 (value will be in range of 1 to 5 with 1 being strongly disagree and 5 being strongly agree),
  sus_question2: 4,
  sus_question3: 2,
  sus_question4: 4,
  sus_question5: 5,
  sus_question6: 4,
  sus_question7: 4,
  sus_question8: 2,
  sus_question9: 1,
  sus_question10: 4,

  custom_question1: 4,
  custom_question2: 1,
  custom_question3: 5,
  custom_question4: 2,
  custom_question5: 5,

  open_feedback: "The instructions were unclear at first ...",

  timestamp: "2026-03-06T18:22:22.000Z",
}
*/

export default class TestValue {
  constructor() {
    this.participantId = "";
    this.uiType = "";

    this.startTimestamp = null;
    this.endTimestamp = null;

    this.attempts = 0;
    this.firstAttemptComplianceSuccess = null;
    this.taskSuccess = null;
    this.errorCount = null;
    this.errors = [];
    this.warningCount = null;
    this.warnings = [];
    this.successesCount = null;
    this.successes = [];
    this.attemptHistory = [];

    // SUS answers (1–5)
    this.sus_question1 = 0;
    this.sus_question2 = 0;
    this.sus_question3 = 0;
    this.sus_question4 = 0;
    this.sus_question5 = 0;
    this.sus_question6 = 0;
    this.sus_question7 = 0;
    this.sus_question8 = 0;
    this.sus_question9 = 0;
    this.sus_question10 = 0;

    // Custom Likert answers
    this.custom_question1 = 0;
    this.custom_question2 = 0;
    this.custom_question3 = 0;
    this.custom_question4 = 0;
    this.custom_question5 = 0;

    this.open_feedback = "";

    // General record timestamp (when object created)
    this.timestamp = new Date().toISOString();
  }
}
