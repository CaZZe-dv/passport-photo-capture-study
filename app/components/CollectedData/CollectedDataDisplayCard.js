import { Pressable, StyleSheet, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TitleText from "../StartScreen/TitleText";
import SubtitleText from "../StartScreen/SubtitleText";
import { COLORS } from "../../constants/Colors";
import Row from "./Row";
import React, { useContext } from "react";
import { StudyResultsContext } from "../../store/StudyResultsContext";

function CollectedDataDisplayCard({ studyData }) {
  const studyResultsContext = useContext(StudyResultsContext);
  const navigation = useNavigation();

  const taskTime =
    studyData.endTimestamp && studyData.startTimestamp
      ? Math.max(
          0,
          Math.round(
            (new Date(studyData.endTimestamp) -
              new Date(studyData.startTimestamp)) /
              1000,
          ),
        )
      : 0;

  const displayTime =
    taskTime >= 300
      ? "Time exceeded (5 min)"
      : `${Math.floor(taskTime / 60)}m ${taskTime % 60}s`;

  const uiLabel =
    studyData.uiType === "optimized"
      ? "Guided UI"
      : studyData.uiType === "baseline"
        ? "Baseline UI"
        : "Unknown UI";

  function openDetails() {
    navigation.navigate("StudyResultDetailScreen", { studyData });
  }

  function handleDelete(e) {
    e.stopPropagation();

    Alert.alert(
      "Delete Participant",
      `Remove participant ${studyData.participantId}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            studyResultsContext.removeResult(studyData.participantId),
        },
      ],
    );
  }

  return (
    <Pressable
      onPress={openDetails}
      android_ripple={{ color: "#ddd" }}
      style={({ pressed }) => pressed && { opacity: 0.85 }}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <TitleText>{studyData.participantId}</TitleText>

          <View style={styles.headerRight}>
            <SubtitleText style={styles.uiType}>{uiLabel}</SubtitleText>

            <Pressable onPress={handleDelete} hitSlop={10}>
              <Ionicons name="trash-outline" size={20} color="#e53935" />
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <Row label="Task Time" value={displayTime} />
          <Row label="Attempts" value={studyData.attempts} />
          <Row label="Errors" value={studyData.errorCount} />
          <Row label="Warnings" value={studyData.warningCount} />
          <Row
            label="Task Success"
            value={studyData.taskSuccess}
            shouldAutoFormat
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingBottom: 8,
    marginBottom: 12,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  uiType: {
    color: COLORS.primary,
  },

  content: {
    gap: 6,
  },
});

export default React.memo(CollectedDataDisplayCard);
