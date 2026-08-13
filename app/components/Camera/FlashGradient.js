import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

function FlashGradient({
  flashBrightness = 0.35,
  holeWidth = "50%",
  holeHeight = "50%",
  radius = 100,
}) {
  const strong = `rgba(255,255,255,${flashBrightness})`;
  const transparent = "rgba(255,255,255,0)";

  return (
    <View style={styles.container} pointerEvents="none">
      <LinearGradient
        colors={[strong, strong, transparent]}
        locations={[0, 0.25, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.top}
      />

      <LinearGradient
        colors={[strong, strong, transparent]}
        locations={[0, 0.25, 1]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.bottom}
      />

      <LinearGradient
        colors={[strong, strong, transparent]}
        locations={[0, 0.25, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.left}
      />

      <LinearGradient
        colors={[strong, strong, transparent]}
        locations={[0, 0.25, 1]}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.right}
      />

      <View
        style={[
          styles.hole,
          {
            width: holeWidth,
            height: holeHeight,
            borderRadius: radius,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },

  top: {
    position: "absolute",
    top: 0,
    height: "18%",
    width: "100%",
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    height: "18%",
    width: "100%",
  },

  left: {
    position: "absolute",
    left: 0,
    width: "18%",
    height: "100%",
  },

  right: {
    position: "absolute",
    right: 0,
    width: "18%",
    height: "100%",
  },

  hole: {
    position: "absolute",
    alignSelf: "center",
    top: "25%",
    backgroundColor: "transparent",
  },
});

export default FlashGradient;
