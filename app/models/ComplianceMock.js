export class ComplianceMock {
  constructor(
    id,
    faceCount,
    yaw,
    roll,
    smileProb,
    leftEyeOpenProb,
    rightEyeOpenProb,
    boxX,
    boxY,
    boxWidth,
    boxHeight,
    imageWidth,
    imageHeight,
    brightness,
    backgroundVariance,
  ) {
    this.id = id;
    this.faceCount = faceCount;
    this.yaw = yaw;
    this.roll = roll;
    this.smileProb = smileProb;
    this.leftEyeOpenProb = leftEyeOpenProb;
    this.rightEyeOpenProb = rightEyeOpenProb;
    this.boxX = boxX;
    this.boxY = boxY;
    this.boxWidth = boxWidth;
    this.boxHeight = boxHeight;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.brightness = brightness;
    this.backgroundVariance = backgroundVariance;
  }
}
