import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/Colors";

function ImageItem({ source, fallBackText = "No image found" }) {
  const [error, setError] = useState(false);

  if (!source || error) {
    return (
      <View style={[styles.container, styles.fallback]}>
        <Text style={styles.fallBackText}>{fallBackText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={styles.image}
        onError={() => setError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  fallBackText: {
    marginTop: 8,
    color: COLORS.textSecondary,
  },
});

export default ImageItem;
