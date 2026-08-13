import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

export function convertToCSV(data) {
  if (!data) return "";

  const rowsData = Array.isArray(data) ? data : [data];

  if (rowsData.length === 0) return "";

  const headers = Object.keys(rowsData[0]);

  const headerRow = headers.join(",");

  const rows = rowsData.map((row) =>
    headers.map((h) => JSON.stringify(row[h] ?? "")).join(","),
  );

  return [headerRow, ...rows].join("\n");
}

async function exportFile(filename, content, mimeType) {
  try {
    const file = new File(Paths.cache, filename);
    file.write(content);

    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing is not available on this device");
      return;
    }

    await Sharing.shareAsync(file.uri, {
      mimeType,
      dialogTitle: "Export Study Data",
      UTI: mimeType,
    });
  } catch (err) {
    console.error("Export error:", err);
    alert("Failed to export file");
  }
}

export async function exportAllJSON(data) {
  console.log("exportAllJSON called");
  const json = JSON.stringify(data, null, 2);
  await exportFile("study_results.json", json, "application/json");
}

export async function exportSingleJSON(item) {
  const json = JSON.stringify(item, null, 2);
  await exportFile(
    `participant_${item.participantId}.json`,
    json,
    "application/json",
  );
}

export async function exportAllCSV(data) {
  console.log("exportAllCSV called");
  const csv = convertToCSV(data);
  await exportFile("study_results.csv", csv, "text/csv");
}

export async function exportSingleCSV(item) {
  const csv = convertToCSV([item]);
  await exportFile(`participant_${item.participantId}.csv`, csv, "text/csv");
}
