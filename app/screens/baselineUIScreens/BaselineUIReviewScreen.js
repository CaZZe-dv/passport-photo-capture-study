import { View, StyleSheet, Animated } from "react-native";
import { useContext, useEffect, useRef } from "react";

import ScreenWrapper from "../../components/layout/ScreenWrapper";
import TitleText from "../../components/StartScreen/TitleText";
import SubtitleText from "../../components/StartScreen/SubtitleText";
import TextButton from "../../components/ui/TextButton";
import ImageItem from "../../components/StartScreen/ImageItem";
import { StudyResultsContext } from "../../store/StudyResultsContext";

function BaselineUIReviewScreen({ navigation, route }) {
  const studyResultsContext = useContext(StudyResultsContext);
  const photo = route.params.photo;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  function onRetakeHandler() {
    navigation.goBack();
  }

  function onConfirmHandler() {
    studyResultsContext.updateStudyData((prev) => ({
      ...prev,
      attempts: prev.attempts + 1,
    }));
    navigation.navigate("BaselineUIRetryScreen", { photo: photo });
  }

  return (
    <ScreenWrapper style={styles.screenWrapper}>
      <TitleText textAlignment="center">Review Photo</TitleText>

      <Animated.View style={[styles.card, { opacity }]}>
        <View style={styles.imageContainer}>
          <ImageItem source={{ uri: photo.uri }} />
        </View>

        <SubtitleText style={styles.subtitle}>
          Please review your photo.{"\n"}
          Press continue to check compliance.
        </SubtitleText>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <TextButton onPress={onRetakeHandler} variant="secondary">
            Retake
          </TextButton>
        </View>

        <View style={styles.buttonWrapper}>
          <TextButton onPress={onConfirmHandler} variant="primary">
            Continue
          </TextButton>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginVertical: 16,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.75,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 6,
  },
});

export default BaselineUIReviewScreen;
