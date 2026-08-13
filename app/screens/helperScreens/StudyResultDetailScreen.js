import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import TitleText from "../../components/StartScreen/TitleText";
import SubtitleText from "../../components/StartScreen/SubtitleText";
import Row from "../../components/CollectedData/Row";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/Colors";
import { useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

function StudyResultDetailScreen({ navigation, route }) {
  const { studyData } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Participant: " + studyData.participantId,
      headerShown: true,
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            width: 38,
            height: 38,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={26} />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={() =>
            navigation.navigate("ExportModalScreen", {
              data: studyData,
            })
          }
          style={{
            width: 38,
            height: 38,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="share-outline" size={24} />
        </Pressable>
      ),
    });
  }, [navigation]);

  function renderSummary(data) {
    return Object.entries(data || {}).map(([step, rules]) => (
      <View key={step} style={styles.summaryStep}>
        <SubtitleText style={styles.summaryStepTitle}>{step}</SubtitleText>

        {Object.entries(rules).map(([id, count]) => (
          <Row key={`${step}-${id}`} label={`Rule ${id}`} value={count} />
        ))}
      </View>
    ));
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
      <ScreenWrapper edges={["bottom"]}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <SubtitleText textAlignment="center">
              UI:{" "}
              {studyData.uiType === "optimized" ? "Guided UI" : "Baseline UI"}
            </SubtitleText>
          </View>
          <View style={styles.sectionCard}>
            <TitleText style={styles.sectionTitle}>Task Information</TitleText>
            <Row label="Attempts" value={studyData.attempts} />
            <Row
              label="Task Success"
              value={studyData.taskSuccess}
              shouldAutoFormat
            />
            <Row
              label="First Attempt Success"
              value={studyData.firstAttemptComplianceSuccess}
              shouldAutoFormat
            />
          </View>
          <View style={styles.sectionCard}>
            <TitleText style={styles.sectionTitle}>Error Summary</TitleText>
            <View style={styles.count}>
              <SubtitleText style={styles.summaryStepTitle}>
                Error Count:
              </SubtitleText>
              <SubtitleText>{studyData.errorCount}</SubtitleText>
            </View>

            {renderSummary(studyData.errors)}
          </View>
          <View style={styles.sectionCard}>
            <TitleText style={styles.sectionTitle}>Warning Summary</TitleText>
            <View style={styles.count}>
              <SubtitleText style={styles.summaryStepTitle}>
                Warning Count:
              </SubtitleText>
              <SubtitleText>{studyData.warningCount}</SubtitleText>
            </View>
            {renderSummary(studyData.warnings)}
          </View>
          <View style={styles.sectionCard}>
            <TitleText style={styles.sectionTitle}>Success Summary</TitleText>
            <View style={styles.count}>
              <SubtitleText style={styles.summaryStepTitle}>
                Successes Count:
              </SubtitleText>
              <SubtitleText>{studyData.successesCount}</SubtitleText>
            </View>
            {renderSummary(studyData.successes)}
          </View>
          <View style={styles.sectionCard}>
            <TitleText style={styles.sectionTitle}>Attempt History</TitleText>
            {(studyData.attemptHistory || []).map((attempt, i) => (
              <View key={i} style={styles.attemptCard}>
                <SubtitleText style={styles.attemptTitle}>
                  Attempt {attempt.attempt}
                </SubtitleText>
                <SubtitleText style={styles.timestamp}>
                  {attempt.timestamp}
                </SubtitleText>
                {(attempt.results || []).map((r, j) => (
                  <SubtitleText key={j}>
                    {r.step} • Rule {r.id} • {r.hint}
                  </SubtitleText>
                ))}
              </View>
            ))}
          </View>
          <View style={styles.sectionCard}>
            <TitleText style={styles.sectionTitle}>SUS Questionnaire</TitleText>
            {Array.from({ length: 10 }).map((_, i) => (
              <Row
                key={i}
                label={`Q${i + 1}`}
                value={studyData[`sus_question${i + 1}`]}
              />
            ))}
          </View>
          <View style={styles.sectionCard}>
            <TitleText style={styles.sectionTitle}>Custom Questions</TitleText>
            {Array.from({ length: 5 }).map((_, i) => (
              <Row
                key={i}
                label={`Q${i + 1}`}
                value={studyData[`custom_question${i + 1}`]}
              />
            ))}
          </View>
          <View style={styles.sectionCard}>
            <TitleText style={styles.sectionTitle}>Open Feedback</TitleText>
            <SubtitleText>
              {studyData.open_feedback || "No feedback provided"}
            </SubtitleText>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </LinearGradient>
  );
}

export default StudyResultDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    marginBottom: 4,
  },
  count: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  summaryStep: {
    marginTop: 8,
  },
  summaryStepTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  attemptCard: {
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  attemptTitle: {
    fontWeight: "bold",
  },
  timestamp: {
    opacity: 0.6,
    marginBottom: 6,
  },
});
