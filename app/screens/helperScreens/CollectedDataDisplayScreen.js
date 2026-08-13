import { StyleSheet, FlatList, View, Pressable } from "react-native";
import { useContext, useLayoutEffect } from "react";
import { StudyResultsContext } from "../../store/StudyResultsContext";
import CollectedDataDisplayCard from "../../components/CollectedData/CollectedDataDisplayCard";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import SubtitleText from "../../components/StartScreen/SubtitleText";

function CollectedDataDisplayScreen({ navigation }) {
  const studyResultsContext = useContext(StudyResultsContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,

      title: "Participants",
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={[{ marginLeft: 16 }, styles.headerButton]}
        >
          <Ionicons name="arrow-back" size={26} />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={() => {
            if (studyResultsContext.allResults.length === 0) return;
            navigation.navigate("ExportModalScreen", {
              data: studyResultsContext.allResults,
            });
          }}
          style={[{ marginRight: 16 }, styles.headerButton]}
        >
          <Ionicons name="share-outline" size={24} />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <LinearGradient
      colors={[
        COLORS.gradientFrostStart,
        COLORS.gradientFrostMid,
        COLORS.gradientFrostEnd,
      ]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {studyResultsContext.allResults.length > 0 ? (
          <FlatList
            data={studyResultsContext.allResults}
            keyExtractor={(item, index) => `${item.participantId}-${index}`}
            renderItem={({ item }) => (
              <CollectedDataDisplayCard studyData={item} />
            )}
          />
        ) : (
          <SubtitleText textAlignment="center">
            No recorded data yet.
          </SubtitleText>
        )}
      </View>
    </LinearGradient>
  );
}

export default CollectedDataDisplayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  headerButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
