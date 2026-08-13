import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
import StudyResultsContextProvider from "./store/StudyResultsContext";

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <StudyResultsContextProvider>
        <AppNavigator />
      </StudyResultsContextProvider>
    </>
  );
}
