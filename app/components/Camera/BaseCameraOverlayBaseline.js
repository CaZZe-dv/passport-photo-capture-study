import { View, StyleSheet, Image, Dimensions } from "react-native";
import { useState, useRef, useMemo } from "react";
import BaseCamera from "./BaseCamera";
import CaptureButton from "./CaptureButton";
import IconButton from "../ui/IconButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { transformToPassportPhoto } from "../../util/CropImage";
import TextIconButton from "../ui/TextIconButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import FlashController from "./FlashController";
import FlashGradient from "./FlashGradient";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

function BaseCameraOverlayBaseline({ onPhotoTaken }) {
  const cameraRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [facing, setFacing] = useState("front");
  const [flashMode, setFlashMode] = useState(false);
  const [flashBrightness, setFlashBrightness] = useState(0.1);
  const passportRatio = 35 / 45;

  const { visibleHeight, topOverlayHeight, bottomOverlayHeight } =
    useMemo(() => {
      const calculatedVisibleHeight = screenWidth / passportRatio;

      const visible = Math.min(calculatedVisibleHeight, screenHeight);
      const remaining = screenHeight - visible;

      const bottomWeight = 0.6;
      const topWeight = 1 - bottomWeight;

      return {
        visibleHeight: visible,
        topOverlayHeight: remaining * topWeight,
        bottomOverlayHeight: remaining * bottomWeight,
      };
    }, []);

  function switchCameraHandler() {
    setFacing((prev) => (prev === "front" ? "back" : "front"));
  }

  function toggleFlashHandler(value) {
    setFlashMode(value);
  }

  async function takePhotoHandler() {
    const photo = await cameraRef.current?.takePictureAsync({
      base64: true,
      quality: 1,
      skipProcessing: true,
    });

    if (!photo) {
      return;
    }

    setCapturedPhoto(photo);
  }

  async function confirmPhotoHandler() {
    const processed = await transformToPassportPhoto(
      capturedPhoto,
      topOverlayHeight,
      bottomOverlayHeight,
      screenHeight,
    );
    if (!processed) return;
    onPhotoTaken(processed);
    setCapturedPhoto(null);
  }

  function cancelPreviewHandler() {
    setCapturedPhoto(null);
  }

  function onBrightnessChangedHandler(value) {
    setFlashBrightness(value);
  }

  return (
    <View style={styles.container}>
      {capturedPhoto ? (
        <>
          <Image source={{ uri: capturedPhoto.uri }} style={styles.preview} />
          <LinearGradient
            colors={[COLORS.gradientCameraDark, COLORS.gradientCameraLight]}
            style={[styles.overlay, { height: topOverlayHeight }]}
          />
          <LinearGradient
            colors={[COLORS.gradientCameraLight, COLORS.gradientCameraDark]}
            style={[
              styles.overlay,
              { height: bottomOverlayHeight, bottom: 0, top: undefined },
            ]}
          />
          <View style={styles.topLeft}>
            <IconButton
              iconName="close"
              IconItem={Ionicons}
              onPress={cancelPreviewHandler}
            />
          </View>
          <View style={styles.bottomCenter}>
            <TextIconButton
              iconName="arrow-right"
              IconItem={AntDesign}
              onPress={confirmPhotoHandler}
            >
              Continue
            </TextIconButton>
          </View>
        </>
      ) : (
        <>
          <BaseCamera
            ref={cameraRef}
            facing={facing}
            flash={facing === "back" ? flashMode : "off"}
          />
          <LinearGradient
            colors={[COLORS.gradientCameraDark, COLORS.gradientCameraLight]}
            style={[styles.overlay, { height: topOverlayHeight }]}
          />
          <LinearGradient
            colors={[COLORS.gradientCameraLight, COLORS.gradientCameraDark]}
            style={[
              styles.overlay,
              { height: bottomOverlayHeight, bottom: 0, top: undefined },
            ]}
          />
          {flashMode && <FlashGradient flashBrightness={flashBrightness} />}
          <FlashController
            containerStyle={styles.topRight}
            onBrightnessChange={onBrightnessChangedHandler}
            onToggleFlash={toggleFlashHandler}
          />
          <View style={styles.bottomCenter}>
            <CaptureButton onPress={takePhotoHandler} />
          </View>
          <View style={styles.bottomRight}>
            <IconButton
              iconName="camera-reverse"
              IconItem={Ionicons}
              onPress={switchCameraHandler}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  preview: {
    flex: 1,
    width: "100%",
  },
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  topLeft: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  topRight: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  bottomCenter: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
  },
  bottomRight: {
    position: "absolute",
    bottom: 60,
    right: 30,
  },
});

export default BaseCameraOverlayBaseline;
