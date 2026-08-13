import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import IconButton from "../ui/IconButton";

function FlashController({
  containerStyle,
  onBrightnessChange,
  onToggleFlash,
}) {
  const [flashMode, setFlashMode] = useState("off");
  const [brightness, setBrightness] = useState(0.1);
  const [sliderVisible, setSliderVisible] = useState(false);

  function toggleFlashHandler() {
    if (flashMode === "off") {
      onToggleFlash(true);
      setFlashMode("on");
      requestAnimationFrame(() => {
        setSliderVisible(true);
      });
    } else {
      onToggleFlash(false);
      setFlashMode("off");
      setSliderVisible(false);
    }
  }

  function changeBrightnessHandler(value) {
    setBrightness(value);
    onBrightnessChange?.(value);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Slider */}
      {sliderVisible && (
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.05}
            value={brightness}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="#777"
            thumbTintColor="#fff"
            onValueChange={changeBrightnessHandler}
          />
        </View>
      )}
      <IconButton
        iconName={flashMode === "on" ? "flash" : "flash-off"}
        IconItem={Ionicons}
        onPress={toggleFlashHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  sliderContainer: {
    width: 140,
    marginRight: 12,
  },

  slider: {
    width: "100%",
    height: 40,
  },
});

export default FlashController;
