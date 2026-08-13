import { Pressable, StyleSheet, View } from "react-native";
import TitleText from "../StartScreen/TitleText";
import ImageItem from "../StartScreen/ImageItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants/Colors";

function OptionContainerItem({ item, isSelected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.selectedContainer,
        pressed && styles.pressed,
      ]}
    >
      {isSelected && (
        <View style={styles.checkmarkContainer}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
        </View>
      )}
      <View style={styles.titleWrapper}>
        <TitleText>{item.title}</TitleText>
      </View>
      <View style={styles.imageContainer}>
        <ImageItem source={item.source} />
      </View>
    </Pressable>
  );
}

export default OptionContainerItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  selectedContainer: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.gradientSoftStart,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },

  titleWrapper: {
    alignItems: "center",
  },

  imageContainer: {
    marginTop: 16,
    height: 150,
    borderRadius: 18,
    overflow: "hidden",
  },

  checkmarkContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 50,
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
