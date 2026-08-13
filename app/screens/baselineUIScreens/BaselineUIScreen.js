import { StyleSheet } from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import BaseCameraOverlayBaseline from "../../components/Camera/BaseCameraOverlayBaseline";

function BaselineUIScreen({ navigation }) {
  function onPhotoTakenHandler(photo) {
    navigation.navigate("BaselineUIReviewScreen", { photo: photo });
  }

  return (
    <ScreenWrapper style={styles.container} edges={[]}>
      <BaseCameraOverlayBaseline onPhotoTaken={onPhotoTakenHandler} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BaselineUIScreen;
