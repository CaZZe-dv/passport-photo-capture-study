import { useEffect, useState, useRef, useContext } from "react";
import { runFinalComplianceChecks } from "../../util/ComplianceCheck";
import { StyleSheet, View, Animated } from "react-native";
import ImageItem from "../StartScreen/ImageItem";
import SubtitleText from "../StartScreen/SubtitleText";
import ScanningLine from "../Photo/ScanningLine";
import { adaptFaceDetectionMetrics } from "../../util/AdaptFaceDedectionMetrics";
import { StudyResultsContext } from "../../store/StudyResultsContext";
import ComplianceReviewCarousel from "./ComplianceReviewCarousel";
import { detectFace } from "../../util/FaceDedection";
import { compressResults, mergeCounts } from "../../util/Helpers";

function ComplianceCheckerCard({
  photo,
  onComplianceChecked,
  displayImprovements = false,
}) {
  const studyResultsContext = useContext(StudyResultsContext);
  const opacity = useRef(new Animated.Value(0)).current;

  const [imageContainerHeight, setImageContainerHeight] = useState(0);
  const [isCheckingPhoto, setIsCheckingPhoto] = useState(true);
  const [isCompliant, setIsCompliant] = useState(null);
  const [complianceResults, setComplianceResults] = useState({ errorCount: 0 });
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    setIsCompliant(complianceResults.errorCount === 0);
  }, [complianceResults]);

  useEffect(() => {
    if (!photo) return;

    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    async function checkCompliance() {
      try {
        const metrics = await detectFace(photo);

        const adaptedMetrics = adaptFaceDetectionMetrics(
          metrics,
          photo.width,
          photo.height,
        );

        setMetrics(adaptedMetrics);

        const result = runFinalComplianceChecks(adaptedMetrics);

        studyResultsContext.updateStudyData((prev) => {
          const errors = compressResults(result.errors);
          const warnings = compressResults(result.warnings);
          const successes = compressResults(result.successes);

          const attemptRecord = {
            attempt: prev.attempts,
            timestamp: new Date().toISOString(),
            results: [...errors, ...warnings, ...successes],
          };

          const updated = {
            ...prev,
            errorCount: prev.errorCount + result.errorCount,
            warningCount: prev.warningCount + result.warningCount,
            successesCount: prev.successesCount + result.successesCount,

            errors: mergeCounts(prev.errors, errors),
            warnings: mergeCounts(prev.warnings, warnings),
            successes: mergeCounts(prev.successes, successes),

            attemptHistory: [...(prev.attemptHistory || []), attemptRecord],
          };

          if (result.isCompliant) {
            updated.firstAttemptComplianceSuccess = prev.attempts === 1 ? 1 : 0;
            updated.taskSuccess = 1;
            updated.endTimestamp = new Date().toISOString();
          }

          return updated;
        });

        setComplianceResults(result);
        setIsCheckingPhoto(false);
        onComplianceChecked?.(result);
      } catch (err) {
        console.log("Compliance check failed:", err);
        setIsCheckingPhoto(false);
        setIsCompliant(false);
      }
    }

    checkCompliance();
  }, [photo]);

  const renderImage = () => (
    <View style={styles.imageContainer}>
      <ImageItem source={{ uri: photo.uri }} />
    </View>
  );

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View
        onLayout={(e) => {
          const height = e.nativeEvent.layout.height;
          if (height !== imageContainerHeight) {
            setImageContainerHeight(height);
          }
        }}
      >
        {isCheckingPhoto && (
          <>
            {renderImage()}

            {imageContainerHeight > 0 && (
              <ScanningLine height={imageContainerHeight} />
            )}

            <SubtitleText style={styles.subtitle}>
              Checking photo for compliance.
            </SubtitleText>
          </>
        )}
        {!isCheckingPhoto && isCompliant && renderImage()}
        {!isCheckingPhoto && !isCompliant && displayImprovements && (
          <ComplianceReviewCarousel
            metrics={metrics}
            photo={photo}
            complianceResults={complianceResults}
          />
        )}
        {!isCheckingPhoto &&
          !isCompliant &&
          !displayImprovements &&
          renderImage()}
      </View>
      {!isCheckingPhoto && !isCompliant && !displayImprovements && (
        <SubtitleText style={styles.subtitle}>Please try again.</SubtitleText>
      )}
      {!isCheckingPhoto && isCompliant && (
        <SubtitleText style={styles.subtitle}>
          Your photo meets the requirements.
        </SubtitleText>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 35 / 45,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.75,
    marginTop: 6,
    marginBottom: 6,
  },
  errorItem: {
    textAlign: "center",
    marginBottom: 4,
  },
  title: {
    marginBottom: 6,
  },
});

export default ComplianceCheckerCard;
