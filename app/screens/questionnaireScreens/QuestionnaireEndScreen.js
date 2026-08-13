import { LinearGradient } from "expo-linear-gradient";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import TitleText from "../../components/StartScreen/TitleText";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/Colors";
import SubtitleText from "../../components/StartScreen/SubtitleText";
import TextButton from "../../components/ui/TextButton";
import LottieView from "lottie-react-native";
import { useContext, useEffect, useRef } from "react";
import { StudyResultsContext } from "../../store/StudyResultsContext";

function QuestionnaireEndScreen({ navigation }) {
  const studyResultsContext = useContext(StudyResultsContext);
  const animationRef = useRef(null);

  useEffect(() => {
    studyResultsContext.saveResult();
    animationRef.current?.play();
    const timer = setTimeout(() => {
      animationRef.current?.pause();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  function onResetPressHandler() {
    navigation.navigate("StartScreen");
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
      <ScreenWrapper style={styles.screenWrapper}>
        <TitleText textAlignment="center">Thank you</TitleText>

        <View style={styles.content}>
          <LottieView
            ref={animationRef}
            source={require("../../assets/animations/Checked.json")}
            loop={false}
            style={{ width: 300, height: 300 }}
          />

          <SubtitleText textAlignment="center">
            Thank you for participating in the study.
          </SubtitleText>
        </View>

        <TextButton onPress={onResetPressHandler}>Reset</TextButton>
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
  content: {
    alignItems: "center",
  },
});

export default QuestionnaireEndScreen;
