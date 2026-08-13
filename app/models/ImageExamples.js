export class ImageExamples {
  constructor(
    imageSourceCompliant,
    imageSourceNonCompliant,
    displayTextCompliant,
    displayTextNonCompliant,
  ) {
    this.id = Math.random();
    this.imageSourceCompliant = imageSourceCompliant;
    this.imageSourceNonCompliant = imageSourceNonCompliant;
    this.displayTextCompliant = displayTextCompliant;
    this.displayTextNonCompliant = displayTextNonCompliant;
  }
}
