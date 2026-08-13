import { forwardRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  CameraView,
  PermissionStatus,
  useCameraPermissions,
} from "expo-camera";
import { COLORS } from "../../constants/Colors";

const BaseCamera = forwardRef(function BaseCamera(
  { facing = "front", flash, ratio = "4:3", shouldMirrorFrontPreview = true },
  ref,
) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) return;

    if (permission.status === PermissionStatus.UNDETERMINED) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={ref}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        flash={flash}
        ratio={ratio}
        mirror={shouldMirrorFrontPreview}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.darkBackground,
  },
});

export default BaseCamera;
