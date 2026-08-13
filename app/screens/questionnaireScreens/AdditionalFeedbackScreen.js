import { LinearGradient } from "expo-linear-gradient";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useContext, useState } from "react";
import TitleText from "../../components/StartScreen/TitleText";
import SubtitleText from "../../components/StartScreen/SubtitleText";
import TextButton from "../../components/ui/TextButton";
import { COLORS } from "../../constants/Colors";
import { StudyResultsContext } from "../../store/StudyResultsContext";

function AdditionalFeedbackScreen({ navigation }) {
  const studyResultsContext = useContext(StudyResultsContext);
  const [feedback, setFeedback] = useState("");
  const [showHint, setShowHint] = useState(false);
  const maxLength = 300;

  const isValid = feedback.trim().length > 0;

  function handleSubmit() {
    if (!isValid && !showHint) {
      setShowHint(true);
      return;
    }

    studyResultsContext.updateStudyData((prev) => {
      return { ...prev, open_feedback: feedback.trim() };
    });
    navigation.replace("QuestionnaireEndScreen");

    Keyboard.dismiss();
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <ScreenWrapper style={styles.screenWrapper}>
              <View style={styles.headerContainer}>
                <TitleText textAlignment="center">
                  Additional Feedback
                </TitleText>
                <SubtitleText style={styles.subtitle}>(optional)</SubtitleText>
              </View>
              <View style={styles.card}>
                <TextInput
                  style={styles.input}
                  placeholder="Type your feedback here..."
                  placeholderTextColor="#999"
                  multiline
                  value={feedback}
                  onChangeText={setFeedback}
                  maxLength={maxLength}
                  textAlignVertical="top"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
                <View style={styles.counterContainer}>
                  <SubtitleText style={styles.counter}>
                    {feedback.length}/{maxLength}
                  </SubtitleText>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                {showHint && (
                  <SubtitleText
                    textAlignment="center"
                    style={{ color: COLORS.error, paddingBottom: 24 }}
                  >
                    No feedback given, press again if on purpose.
                  </SubtitleText>
                )}
                <TextButton onPress={handleSubmit}>
                  {showHint ? "Continue anyways" : "Continue"}
                </TextButton>
              </View>
            </ScreenWrapper>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.8,
  },
  card: {
    flex: 1,
    marginVertical: 24,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  counterContainer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  counter: {
    fontSize: 12,
    opacity: 0.6,
  },
  buttonContainer: {
    marginTop: 12,
  },
});

export default AdditionalFeedbackScreen;
