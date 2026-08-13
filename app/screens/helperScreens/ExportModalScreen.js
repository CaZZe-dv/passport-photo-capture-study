import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  exportAllCSV,
  exportAllJSON,
  exportSingleCSV,
  exportSingleJSON,
  convertToCSV,
} from "../../util/DataExportService";
import ScreenWrapper from "../../components/layout/ScreenWrapper";

function ExportModalScreen({ route, navigation }) {
  const { data } = route.params;
  const [format, setFormat] = useState("json");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Export Data",

      headerRight: () => (
        <Pressable
          onPress={() => exportFile()}
          style={{
            width: 38,
            height: 38,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="share-outline" size={24} />
        </Pressable>
      ),

      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            width: 38,
            height: 38,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="close" size={24} />
        </Pressable>
      ),
    });
  }, [navigation, format, data]);

  function getPreview() {
    if (format === "json") {
      return JSON.stringify(data, null, 2);
    }

    return convertToCSV(data);
  }

  async function exportFile() {
    const isArray = Array.isArray(data);

    if (format === "json") {
      if (isArray) {
        await exportAllJSON(data);
      } else {
        await exportSingleJSON(data);
      }
    } else {
      if (isArray) {
        await exportAllCSV(data);
      } else {
        await exportSingleCSV(data);
      }
    }
  }

  return (
    <ScreenWrapper style={styles.container} edges={["bottom"]}>
      <View style={styles.formatRow}>
        <Pressable
          onPress={() => setFormat("json")}
          style={[styles.formatButton, format === "json" && styles.active]}
        >
          <Text style={styles.formatText}>JSON</Text>
        </Pressable>

        <Pressable
          onPress={() => setFormat("csv")}
          style={[styles.formatButton, format === "csv" && styles.active]}
        >
          <Text style={styles.formatText}>CSV</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.preview}>
        <Text style={styles.previewText}>{getPreview()}</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

export default ExportModalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  headerButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  formatRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  formatButton: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
  },
  active: {
    backgroundColor: "#3b82f6",
  },
  formatText: {
    color: "white",
    fontWeight: "600",
  },
  preview: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 10,
  },
  previewText: {
    color: "white",
    fontFamily: "monospace",
  },
});
