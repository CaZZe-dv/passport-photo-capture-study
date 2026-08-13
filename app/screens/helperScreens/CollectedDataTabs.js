import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CollectedDataDisplayScreen from "./CollectedDataDisplayScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

function CollectedDataTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
      }}
    >
      <Tab.Screen
        name="Participants"
        component={CollectedDataDisplayScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default CollectedDataTabs;
