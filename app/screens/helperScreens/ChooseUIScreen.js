import { StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/Colors";
import TitleText from "../../components/StartScreen/TitleText";
import SubtitleText from "../../components/StartScreen/SubtitleText";
import TextButton from "../../components/ui/TextButton";
import OptionsChooser from "../../components/ChooseUIScreen/OptionsChooser";
import { useState, useContext, useEffect } from "react";
import { UI_OPTIONS } from "../../constants/UIOptions";
import OptionContainerItem from "../../components/ChooseUIScreen/OptionContainerItem";
import { StudyResultsContext } from "../../store/StudyResultsContext";

function ChooseUIScreen({ navigation }) {
  const studyResultsContext = useContext(StudyResultsContext);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function loadUIType() {
      const nextUI = await studyResultsContext.getNextUIType();
      console.log(nextUI);

      const defaultItem = nextUI === "baseline" ? UI_OPTIONS[0] : UI_OPTIONS[1];

      setSelectedItem(defaultItem);
    }

    loadUIType();
  }, []);

  function onSelectHandler(item) {
    setSelectedItem(item);
  }

  function onChooseHandler() {
    if (!selectedItem) return;
    const selectedUI =
      selectedItem.title === "Baseline UI" ? "baseline" : "optimized";
    studyResultsContext.updateStudyData({ uiType: selectedUI });
    navigation.navigate("StartTestScreen", {
      uiType: selectedUI,
    });
  }

  return (
    <LinearGradient
      colors={[
        COLORS.gradientFrostStart,
        COLORS.gradientFrostMid,
        COLORS.gradientFrostEnd,
      ]}
      style={{ flex: 1 }}
    >
      <ScreenWrapper>
        <View style={styles.container}>
          <TitleText textAlignment="center">Select User Interface</TitleText>
          <SubtitleText>
            Choose between the Baseline UI and the Optimized UI version for
            taking a photo capture process.
          </SubtitleText>
          <OptionsChooser
            items={UI_OPTIONS}
            selected={selectedItem}
            RenderItem={OptionContainerItem}
            onSelect={onSelectHandler}
            showScrollIndicator={false}
            prohibitScroll={true}
          />
          <TextButton onPress={onChooseHandler}>Choose</TextButton>
        </View>
      </ScreenWrapper>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
});

export default ChooseUIScreen;
