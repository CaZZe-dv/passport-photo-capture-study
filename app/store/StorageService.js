import AsyncStorage from "@react-native-async-storage/async-storage";

const RESULTS_KEY = "study_results";
const CURRENT_SESSION_KEY = "current_session";

export async function deleteResult(participantId) {
  try {
    const existing = await loadAllResults();

    const updated = existing.filter(
      (item) => item.participantId !== participantId,
    );

    await AsyncStorage.setItem(RESULTS_KEY, JSON.stringify(updated));

    return updated;
  } catch (error) {
    console.error("Error deleting result:", error);
    return [];
  }
}

export async function saveCurrentSession(data) {
  try {
    await AsyncStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving current session:", error);
  }
}

export async function generateNextParticipantId() {
  const results = await loadAllResults();
  const nextNumber = results?.length + 1;
  return `P${String(nextNumber).padStart(2, "0")}`;
}

export async function loadCurrentSession() {
  try {
    const stored = await AsyncStorage.getItem(CURRENT_SESSION_KEY);
    return stored
      ? JSON.parse(stored)
      : { participantId: await generateNextParticipantId() };
  } catch (error) {
    console.error("Error loading current session:", error);
    return null;
  }
}

export async function clearCurrentSession() {
  try {
    await AsyncStorage.removeItem(CURRENT_SESSION_KEY);
  } catch (error) {
    console.error("Error clearing current session:", error);
  }
}

export async function saveFinalResult(result) {
  try {
    const existing = await loadAllResults();
    const updated = [...existing, result];
    await AsyncStorage.setItem(RESULTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving final result:", error);
  }
}

export async function loadAllResults() {
  try {
    const stored = await AsyncStorage.getItem(RESULTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading results:", error);
    return [];
  }
}

export async function clearAllResults() {
  try {
    await AsyncStorage.removeItem(RESULTS_KEY);
  } catch (error) {
    console.error("Error clearing results:", error);
  }
}

export async function getNextUITypeSmart() {
  try {
    const results = await loadAllResults();

    const baselineCount = results.filter((r) => r.uiType === "baseline").length;
    const guidedCount = results.filter((r) => r.uiType === "optimized").length;

    if (baselineCount === guidedCount) {
      return Math.random() < 0.5 ? "baseline" : "optimized";
    }

    return baselineCount < guidedCount ? "baseline" : "optimized";
  } catch (error) {
    console.error("Error determining UI type:", error);
    return "baseline";
  }
}
