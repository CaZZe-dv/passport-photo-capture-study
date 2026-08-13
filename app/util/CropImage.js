import * as ImageManipulator from "expo-image-manipulator";

export async function transformToPassportPhoto(
  photo,
  topOverlayHeight,
  bottomOverlayHeight,
  screenHeight,
) {
  const imageWidth = photo.width;
  const imageHeight = photo.height;
  const topRatio = topOverlayHeight / screenHeight;
  const bottomRatio = bottomOverlayHeight / screenHeight;
  const cropTop = imageHeight * topRatio;
  const cropBottom = imageHeight * bottomRatio;
  const cropHeight = imageHeight - cropTop - cropBottom;

  const cropRegion = {
    originX: 0,
    originY: Math.round(cropTop),
    width: Math.round(imageWidth),
    height: Math.round(cropHeight),
  };

  const actions = [
    {
      crop: cropRegion,
    },
  ];
  try {
    const result = await ImageManipulator.manipulateAsync(photo.uri, actions, {
      compress: 1,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    });
    return result;
  } catch (err) {
    return null;
  }
}
