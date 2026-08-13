import { StyleSheet, View, Pressable } from "react-native";
import { COLORS } from "../../constants/Colors";

function Pagination({ stepsLength, currentStep, onPress }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: stepsLength }).map((_, index) => (
        <Pressable key={index} onPress={() => onPress?.(index)}>
          <View
            style={[styles.dot, index === currentStep && styles.activeDot]}
          />
        </Pressable>
      ))}
    </View>
  );
}

export default Pagination;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.overlay,
    marginHorizontal: 4,
  },
  activeDot: {
    transform: [{ scale: 1.4 }],
    backgroundColor: COLORS.primary,
  },
});
