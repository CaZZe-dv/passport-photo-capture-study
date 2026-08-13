import { StyleSheet, View, Animated } from "react-native";
import { useEffect, useRef } from "react";
import SubtitleText from "../StartScreen/SubtitleText";
import { COLORS } from "../../constants/Colors";

function ProgressBar({ length, index }) {
  const progress = (index + 1) / length;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [index]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <SubtitleText>
          Question {index + 1} of {length}
        </SubtitleText>
        <SubtitleText>{Math.round(progress * 100)}%</SubtitleText>
      </View>

      <View style={styles.outerBar}>
        <Animated.View
          style={[styles.innerBar, { width: widthInterpolated }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 20,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  outerBar: {
    width: "100%",
    height: 10,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    overflow: "hidden",
  },
  innerBar: {
    height: "100%",
    backgroundColor: COLORS.primaryDark,
    borderRadius: 20,
  },
});

export default ProgressBar;
