import { View, Text, StyleSheet } from "react-native";

function HintBadge({
  contentStyles,
  color,
  iconName,
  IconItem,
  iconSize = 28,
  iconColor = "black",
  message,
}) {
  return (
    <View style={[styles.wrapper, contentStyles]}>
      <View style={[styles.messageContainer, { borderColor: color }]}>
        <Text style={[styles.messageText, { color }]}>{message}</Text>
      </View>
      <View
        style={[
          styles.iconContainer,
          {
            borderColor: color,
            backgroundColor: "white",
          },
        ]}
      >
        <IconItem name={iconName} size={iconSize} color={iconColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 35,
  },
  iconContainer: {
    position: "absolute",
    top: -5,
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    elevation: 3,
  },
  messageContainer: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: "white",
    minWidth: 220,
    alignItems: "center",
  },
  messageText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default HintBadge;
