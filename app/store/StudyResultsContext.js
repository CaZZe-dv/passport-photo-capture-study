import { createContext, useEffect, useState } from "react";
import {
  clearCurrentSession,
  loadAllResults,
  loadCurrentSession,
  saveCurrentSession,
  saveFinalResult,
  clearAllResults,
  deleteResult,
  getNextUITypeSmart,
} from "./StorageService";
import TestValue from "../models/TestValue";

export const StudyResultsContext = createContext({
  studyData: {},
  allResults: [],
  timeExpired: false,
  updateStudyData: (data) => {},
  saveResult: () => {},
  removeResult: (id) => {},
  getNextUIType: () => {},
});

function StudyResultsContextProvider({ children }) {
  const [studyData, setStudyData] = useState(new TestValue());
  const [allResults, setAllResults] = useState([]);
  const [timeExpired, setTimeExpired] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  function isValidTimestamp(value) {
    return value && !isNaN(new Date(value).getTime());
  }

  useEffect(() => {
    if (!isValidTimestamp(studyData.startTimestamp)) return;
    if (isValidTimestamp(studyData.endTimestamp)) return;

    const TIME_LIMIT = 5 * 60 * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - new Date(studyData.startTimestamp).getTime();

      if (elapsed >= TIME_LIMIT) {
        console.log("Time limit reached");

        const end = new Date().toISOString();

        setStudyData((prev) => {
          const updated = {
            ...prev,
            endTimestamp: end,
            taskSuccess: 0,
          };

          setTimeExpired(true);
          saveFinalResult(updated);

          return updated;
        });

        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [studyData.startTimestamp, studyData.endTimestamp]);

  async function initialize() {
    clearCurrentSession();
    const currentSession = await loadCurrentSession();
    const allData = await loadAllResults();
    if (currentSession) {
      setStudyData(new TestValue());
      setStudyData((prev) => ({ ...prev, ...currentSession }));
    }
    if (allData) setAllResults(allData);
  }

  async function removeResult(participantId) {
    const updated = await deleteResult(participantId);
    setAllResults(updated);
  }

  async function updateStudyData(updater) {
    setStudyData((prev) => {
      const updated =
        typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      saveCurrentSession(updated);
      printStudyData(updated);
      return updated;
    });
  }

  async function saveResult() {
    await saveFinalResult(studyData);
    initialize();
  }

  function printStudyData(data) {
    if (!data) {
      console.warn("No study data available");
      return;
    }

    console.log("--------------------------------------------------");

    console.group("👤 Participant Info");
    console.log("Participant ID:", data.participantId);
    console.log("UI Type:", data.uiType);
    console.log("Record Timestamp:", data.timestamp);
    console.groupEnd();

    console.group("⏱️ Timing");
    console.log("Start:", data.startTimestamp);
    console.log("End:", data.endTimestamp);
    console.groupEnd();

    console.group("🎯 Task Performance");
    console.log("Attempts:", data.attempts);
    console.log("First Attempt Success:", data.firstAttemptComplianceSuccess);
    console.log("Task Success:", data.taskSuccess);
    console.log("Total Errors:", data.errorCount);
    console.log("Total Warnings:", data.warningCount);
    console.log("Total Successes:", data.successesCount);
    console.groupEnd();

    console.group("❌ Error Summary");
    Object.entries(data.errors || {}).forEach(([step, rules]) => {
      Object.entries(rules).forEach(([id, count]) => {
        console.log(`Step: ${step} | Rule: ${id} | Count: ${count}`);
      });
    });
    console.groupEnd();

    console.group("⚠️ Warning Summary");
    Object.entries(data.warnings || {}).forEach(([step, rules]) => {
      Object.entries(rules).forEach(([id, count]) => {
        console.log(`Step: ${step} | Rule: ${id} | Count: ${count}`);
      });
    });
    console.groupEnd();

    console.group("✅ Success Summary");
    Object.entries(data.successes || {}).forEach(([step, rules]) => {
      Object.entries(rules).forEach(([id, count]) => {
        console.log(`Step: ${step} | Rule: ${id} | Count: ${count}`);
      });
    });
    console.groupEnd();

    console.group("📸 Attempt History");
    (data.attemptHistory || []).forEach((attempt) => {
      console.group(`Attempt ${attempt.attempt} | ${attempt.timestamp}`);

      (attempt.results || []).forEach((r) => {
        console.log(`Step: ${r.step} | Rule: ${r.id} | Hint: ${r.hint}`);
      });

      console.groupEnd();
    });
    console.groupEnd();

    console.group("📋 SUS Questionnaire");
    for (let i = 1; i <= 10; i++) {
      console.log(`Q${i}:`, data[`sus_question${i}`]);
    }
    console.groupEnd();

    console.group("🧠 Custom Questions");
    for (let i = 1; i <= 5; i++) {
      console.log(`Q${i}:`, data[`custom_question${i}`]);
    }
    console.groupEnd();

    console.group("💬 Open Feedback");
    console.log(data.open_feedback || "No feedback provided");
    console.groupEnd();

    console.log("--------------------------------------------------");
  }

  async function getNextUIType() {
    return await getNextUITypeSmart();
  }

  const values = {
    studyData: studyData,
    allResults: allResults,
    timeExpired: timeExpired,
    updateStudyData: updateStudyData,
    saveResult: saveResult,
    clearAllResults: clearAllResults,
    removeResult: removeResult,
    getNextUIType: getNextUIType,
  };

  return (
    <StudyResultsContext.Provider value={values}>
      {children}
    </StudyResultsContext.Provider>
  );
}

export default StudyResultsContextProvider;
