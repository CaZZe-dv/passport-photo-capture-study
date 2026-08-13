import { StyleSheet, View } from "react-native";
import OverlayDrawer from "./OverlayDrawer";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import HintBadge from "./HintBadge";
import { getHintColor, HINTS } from "../../models/Steps";
import { getChecksForStep } from "../../util/ComplianceCheck";
import { adaptFaceDetectionMetrics } from "../../util/AdaptFaceDedectionMetrics";
import { COLORS } from "../../constants/Colors";
import {
  getStepInformation,
  STEP_INFORMATIONS,
  STEP_ORDER,
} from "../../constants/StepInformations";
import { detectFace } from "../../util/FaceDedection";
import Icon from "../ui/Icon";
import { useIsFocused } from "@react-navigation/native";
import StepProgressBar from "./StepProgressionBar/StepProgressionBar";

const OptimizedOverlay = forwardRef(function OptimizedOverlay(
  { container, photo, capturePhoto },
  ref,
) {
  const [stepCount, setStepCount] = useState(0);
  const [result, setResult] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [activeColor, setActiveColor] = useState(COLORS.info);
  const [hintIndexes, setHintIndexes] = useState({});

  const successStreakRef = useRef(0);
  const stepTimer = useRef(null);

  const showStepIntroRef = useRef(true);
  const pendingMetricsRef = useRef(null);

  const requestIdRef = useRef(0);
  const isProcessing = useRef(false);

  const stepStatusRef = useRef({});
  const stepCountersRef = useRef({});

  const isFocused = useIsFocused();

  const resultLockRef = useRef(false);

  function areAllStepsValid() {
    return STEP_ORDER.every(
      (_, index) => stepStatusRef.current[index] === HINTS.SUCCESS,
    );
  }

  function showWarningHint() {
    resultLockRef.current = true;
    setResult(STEP_INFORMATIONS.capture_photo_not_recommended);

    setTimeout(() => {
      resultLockRef.current = false;
      const currentStep = STEP_ORDER[stepCount];
      setResult(getStepInformation(currentStep));
    }, 3000);
  }

  useImperativeHandle(ref, () => ({
    areAllStepsValid,
    showWarningHint,
  }));

  function updateStepState(stepIndex, resultCheck) {
    if (!stepCountersRef.current[stepIndex]) {
      stepCountersRef.current[stepIndex] = { success: 0, warning: 0, error: 0 };
    }

    const counters = stepCountersRef.current[stepIndex];

    if (resultCheck.hint === HINTS.SUCCESS) {
      counters.success++;
      counters.warning = 0;
      counters.error = 0;
    }

    if (resultCheck.hint === HINTS.WARNING) {
      counters.warning++;
      counters.success = 0;
      counters.error = 0;
    }

    if (resultCheck.hint === HINTS.ERROR) {
      counters.error++;
      counters.success = 0;
      counters.warning = 0;
    }

    if (counters.success >= 3) stepStatusRef.current[stepIndex] = HINTS.SUCCESS;
    if (counters.warning >= 3) stepStatusRef.current[stepIndex] = HINTS.WARNING;
    if (counters.error >= 3) stepStatusRef.current[stepIndex] = HINTS.ERROR;

    setHintIndexes((prev) => ({
      ...prev,
      [stepIndex]: { hint: stepStatusRef.current[stepIndex] },
    }));
  }

  useEffect(() => {
    setMetrics(null);
    setResult(null);

    successStreakRef.current = 0;
    showStepIntroRef.current = true;
    const currentStep = STEP_ORDER[stepCount];
    const info = getStepInformation(currentStep);

    setResult(info);

    const timer = setTimeout(() => {
      showStepIntroRef.current = false;

      if (pendingMetricsRef.current) {
        setMetrics(pendingMetricsRef.current);
        pendingMetricsRef.current = null;
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [stepCount]);

  useEffect(() => {
    if (!result) return;
    setActiveColor(getHintColor(result.hint));
  }, [result]);

  useEffect(() => {
    if (!isFocused) return;
    const interval = setInterval(async () => {
      if (isProcessing.current) return;

      if (!photo?.base64) {
        capturePhoto();
        return;
      }

      try {
        isProcessing.current = true;

        const requestId = ++requestIdRef.current;

        const apiResult = await detectFace(photo);

        if (requestId !== requestIdRef.current) return;
        if (!apiResult) return;

        const adaptedMetrics = adaptFaceDetectionMetrics(
          apiResult,
          photo.width,
          photo.height,
        );

        if (showStepIntroRef.current) {
          pendingMetricsRef.current = adaptedMetrics;
        } else {
          setMetrics(adaptedMetrics);
        }

        capturePhoto();
      } catch (err) {
        console.log("Detection error:", err);
      } finally {
        isProcessing.current = false;
      }
    }, 500);

    return () => clearInterval(interval);
  }, [photo]);

  useEffect(() => {
    if (!metrics || showStepIntroRef.current || resultLockRef.current) return;

    let firstIssue = null;

    for (let i = 0; i <= stepCount; i++) {
      const step = STEP_ORDER[i];

      const checks = getChecksForStep(step, metrics, stepCount);

      const error = checks.find((c) => c.hint === HINTS.ERROR);
      const warning = checks.find((c) => c.hint === HINTS.WARNING);
      const success = checks.find((c) => c.hint === HINTS.SUCCESS);

      const resultCheck = error || warning || success;

      if (!resultCheck) continue;

      updateStepState(i, resultCheck);

      const status = stepStatusRef.current[i];

      if (!firstIssue && (status === HINTS.ERROR || status === HINTS.WARNING)) {
        firstIssue = resultCheck;
      }
    }

    if (firstIssue) {
      setResult(firstIssue);
      successStreakRef.current = 0;
      return;
    }

    if (areAllStepsValid()) {
      setResult(STEP_INFORMATIONS.capture_photo);
    }

    const currentChecks = getChecksForStep(STEP_ORDER[stepCount], metrics);

    const successCheck = currentChecks.find((c) => c.hint === HINTS.SUCCESS);

    if (successCheck) {
      setResult(successCheck);
    }

    const currentStatus = stepStatusRef.current[stepCount];

    if (currentStatus === HINTS.SUCCESS) {
      successStreakRef.current++;

      if (successStreakRef.current >= 3 && !stepTimer.current) {
        if (stepCount === STEP_ORDER.length - 1) {
          if (areAllStepsValid()) {
            setStepCount((prev) => prev + 1);
            setResult(STEP_INFORMATIONS.capture_photo);
          }
          return;
        }

        stepTimer.current = setTimeout(() => {
          setStepCount((prev) => prev + 1);
          successStreakRef.current = 0;
          stepTimer.current = null;
        }, 300);
      }
    }
  }, [metrics, stepCount]);

  return (
    <View style={container}>
      <OverlayDrawer
        overrideStep={result?.step}
        activeStep={STEP_ORDER[stepCount]}
        color={activeColor}
        metrics={metrics}
        stepCount={stepCount}
      />

      <StepProgressBar
        contentStyles={styles.progressBar}
        currentStepIndex={stepCount}
        overrideStep={result?.step}
        hintIndexes={hintIndexes}
      />

      {result && (
        <HintBadge
          contentStyles={styles.hintBadge}
          iconName={result.icon}
          IconItem={Icon}
          color={activeColor}
          message={result.message}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  progressBar: {
    position: "absolute",
    top: -60,
    alignSelf: "center",
  },
  hintBadge: {
    position: "absolute",
    bottom: -55,
    alignSelf: "center",
  },
});

export default OptimizedOverlay;
