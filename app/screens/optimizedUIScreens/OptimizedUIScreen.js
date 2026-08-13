import { StyleSheet } from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import BaseCameraOverlayOptimized from "../../components/Camera/BaseCameraOverlayOptimzed";

function OptimizedUIScreen({ navigation }) {
  function onPhotoTakenHandler(photo) {
    navigation.navigate("OptimizedUIReviewScreen", { photo: photo });
  }

  return (
    <ScreenWrapper style={styles.container} edges={[]}>
      <BaseCameraOverlayOptimized onPhotoTaken={onPhotoTakenHandler} />
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

export default OptimizedUIScreen;
