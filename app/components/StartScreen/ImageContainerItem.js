import { StyleSheet, View, Text } from "react-native";
import ImageItem from "./ImageItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { COLORS } from "../../constants/Colors";

function ImageContainerItem({ source, isCompliant, displayText }) {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <ImageItem source={source} />
        <View style={styles.noteContainer}>
          <Text style={styles.complianceText}>
            {isCompliant ? "Compliant" : "Not Compliant"}
          </Text>
          {isCompliant ? (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.success}
              style={styles.icon}
            />
          ) : (
            <Entypo
              name="circle-with-cross"
              size={24}
              color={COLORS.error}
              style={styles.icon}
            />
          )}
        </View>
      </View>
      {displayText && (
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>{displayText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "50%",
  },
  noteContainer: {
    flexDirection: "row",
    width: "100%",
    position: "absolute",
    bottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
  },
  complianceText: {
    fontSize: 18,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    color: COLORS.textOnPrimary,
  },
  noticeContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default ImageContainerItem;
