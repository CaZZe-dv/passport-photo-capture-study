import { FlatList, View, StyleSheet } from "react-native";
import { useState } from "react";
import Icon from "../ui/Icon";
import { getHintColor, getHintIcon, HINTS } from "../../models/Steps";
import ImageItem from "../StartScreen/ImageItem";
import SubtitleText from "../StartScreen/SubtitleText";
import Pagination from "./Pagination";
import OverlayComplianceCarousel from "./OverlayComplianceCarousel";

function ComplianceReviewCarousel({ metrics, complianceResults, photo }) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  console.log(metrics);
  console.log(complianceResults);
  if (!complianceResults) return null;

  const ordered = [
    ...(complianceResults.errors || []),
    ...(complianceResults.warnings || []),
    ...(complianceResults.successes || []),
  ];

  return (
    <View
      style={{ width: "100%" }}
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width);
      }}
    >
      <FlatList
        data={ordered}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.step}-${item.id}-${index}`}
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const step = Math.round(offsetX / containerWidth);
          setCurrentStep(step);
        }}
        scrollEventThrottle={1}
        renderItem={({ item, index }) => {
          const color = getHintColor(item.hint);
          const statusIcon = getHintIcon(item.hint);
          const hint = item.hint;

          return (
            <View style={[styles.page, { width: containerWidth }]}>
              <View style={styles.titleRow}>
                <Icon name={statusIcon} size={26} color={color} />
                <SubtitleText textAlignment="center" style={styles.titleText}>
                  {item.step}
                </SubtitleText>
              </View>

              <View style={styles.imageContainer}>
                <ImageItem source={{ uri: photo.uri }} />

                {index === currentStep && (
                  <OverlayComplianceCarousel
                    metrics={metrics}
                    check={item}
                    index={index}
                  />
                )}
              </View>

              {(hint === HINTS.ERROR || hint === HINTS.WARNING) && (
                <SubtitleText textAlignment="center" style={styles.subtitle}>
                  Please adjust the following:
                </SubtitleText>
              )}

              <View style={styles.messageRow}>
                <Icon name={item.icon} size={20} color={color} />
                <SubtitleText style={styles.messageText}>
                  {item.message}
                </SubtitleText>
              </View>
            </View>
          );
        }}
      />
      <Pagination stepsLength={ordered.length} currentStep={currentStep} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  titleText: {
    marginLeft: 8,
    textAlignVertical: "center",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 35 / 45,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  subtitle: {
    marginBottom: 8,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    marginTop: 6,
  },
  messageText: {
    marginLeft: 10,
    flex: 1,
  },
});

export default ComplianceReviewCarousel;
