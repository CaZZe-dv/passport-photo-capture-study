import { Pressable, StyleSheet, View } from "react-native";
import SubtitleText from "../StartScreen/SubtitleText";

function AnswerItem({ answerText, selected, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(answerText)}
    >
      <View style={styles.outerCircle}>
        {selected && <View style={styles.innerCircle} />}
      </View>

      <View style={styles.textWrapper}>
        <SubtitleText style={styles.text}>{answerText}</SubtitleText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  textWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    marginVertical: 0,
  },
  outerCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#333",
  },
  pressed: {
    opacity: 0.6,
  },
});

export default AnswerItem;
