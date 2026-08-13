import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ScreenWrapper({ children, style, edges = ["top", "bottom"] }) {
  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;
