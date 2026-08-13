export function adaptFaceDetectionMetrics(apiResult, imageWidth, imageHeight) {
  if (!apiResult || apiResult.faceCount === 0) {
    return {
      faceCount: 0,
      brightness: apiResult?.brightness ?? 0,
      faceBrightness: apiResult?.faceBrightness ?? 0,
      backgroundBrightness: apiResult?.backgroundBrightness ?? 0,
      backgroundOk: apiResult?.backgroundOk ?? 0,
      yaw: apiResult?.yaw ?? 0,
      roll: apiResult?.roll ?? 0,
    };
  }

  const face = apiResult.faces[0];
  const box = face.boundingBox;
  const eye = face.eyeMidpoint;

  return {
    faceCount: apiResult.faceCount,
    //Lighting metrics
    brightness: apiResult.brightness,
    faceBrightness: apiResult.faceBrightness,
    backgroundBrightness: apiResult.backgroundBrightness,
    //Background plain
    backgroundOk: apiResult.backgroundOk,
    //Image size
    imageWidth,
    imageHeight,
    //Bounding box (pixel coordinates)
    boxX: box.x * imageWidth,
    boxY: box.y * imageHeight,
    boxWidth: box.width * imageWidth,
    boxHeight: box.height * imageHeight,
    //Eye midpoint (pixel coordinates)
    eyeMidX: eye.x * imageWidth,
    eyeMidY: eye.y * imageHeight,
    //Head size ratio
    headHeightRatio: face.headHeightRatio,
    //Expression checks
    mouthOpen: face.mouthOpen ? 1 : 0,
    leftEyeOpen: face.leftEyeOpen ? 1 : 0,
    rightEyeOpen: face.rightEyeOpen ? 1 : 0,
    //Head rotation placeholders
    yaw: apiResult.yaw,
    roll: apiResult.roll,
  };
}
