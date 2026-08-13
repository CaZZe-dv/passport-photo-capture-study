import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import { COLORS } from "../../constants/Colors";
import TextButton from "../../components/ui/TextButton";
import ImageContainer from "../../components/StartScreen/ImageContainer";
import HorizontalItemScrollContainer from "../../components/StartScreen/HorizontalItemScrollContainer";
import { IMAGE_EXAMPLES } from "../../constants/DummyDataImageExamples";
import TitleText from "../../components/StartScreen/TitleText";
import SubtitleText from "../../components/StartScreen/SubtitleText";
import { LinearGradient } from "expo-linear-gradient";

function StartScreen({ navigation }) {
  function onTakePhotoButtonPressHandler() {
    navigation.navigate("ChooseUIScreen");
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
      <ScreenWrapper>
        <View style={styles.content}>
          <View>
            <TitleText>Perfect Passport{"\n"}Photos in Minutes</TitleText>
            <SubtitleText>
              Get Perfect Passport Photos in minutes with our step by step
              guidance.
            </SubtitleText>
            <View style={styles.carouselWrapper}>
              <HorizontalItemScrollContainer
                items={IMAGE_EXAMPLES}
                RenderItem={ImageContainer}
                autoScroll
                interval={3000}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TextButton
              style={styles.primaryButton}
              onPress={onTakePhotoButtonPressHandler}
            >
              Take Photo Now
            </TextButton>
            <TextButton
              containerStyles={styles.secondaryButton}
              textStyles={styles.secondaryButtonText}
              onPress={() => navigation.navigate("CollectedDataTabs")}
            >
              Learn More
            </TextButton>
          </View>
        </View>
      </ScreenWrapper>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  secondaryButtonText: {
    color: COLORS.textSecondary,
  },
  carouselWrapper: {
    marginTop: 32,
  },
  buttonContainer: {
    marginTop: 64,
  },
});

export default StartScreen;
