import { StyleSheet, View, Dimensions } from "react-native";
import ImageContainerItem from "./ImageContainerItem";
import { COLORS } from "../../constants/Colors";

function ImageContainer({ item }) {
  const {
    imageSourceCompliant,
    imageSourceNonCompliant,
    displayTextCompliant,
    displayTextNonCompliant,
  } = item;

  return (
    <View style={styles.container}>
      <ImageContainerItem
        source={imageSourceCompliant}
        isCompliant={true}
        displayText={displayTextCompliant}
      />
      <ImageContainerItem
        source={imageSourceNonCompliant}
        isCompliant={false}
        displayText={displayTextNonCompliant}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
});

export default ImageContainer;
