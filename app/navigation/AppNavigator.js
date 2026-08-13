import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/helperScreens/StartScreen";
import ChooseUIScreen from "../screens/helperScreens/ChooseUIScreen";
import StartTestScreen from "../screens/helperScreens/StartTestScreen";
import BaselineUIScreen from "../screens/baselineUIScreens/BaselineUIScreen";
import OptimizedUIScreen from "../screens/optimizedUIScreens/OptimizedUIScreen";
import BaselineUIReviewScreen from "../screens/baselineUIScreens/BaselineUIReviewScreen";
import OptimizedUIReviewScreen from "../screens/optimizedUIScreens/OptimizedUIReviewScreen";
import BaselineUIRetryScreen from "../screens/baselineUIScreens/BaselineUIRetryScreen";
import OptimizedUIRetryScreen from "../screens/optimizedUIScreens/OptimizedUIRetryScreen";
import EndTestScreen from "../screens/helperScreens/EndTestScreen";
import QuestionnaireWelcomeScreen from "../screens/questionnaireScreens/QuestionnaireWelcomeScreen";
import QuestionnaireEndScreen from "../screens/questionnaireScreens/QuestionnaireEndScreen";
import SUSQuestionnaireScreen from "../screens/questionnaireScreens/SUSQuestionnaireScreen";
import CustomLikertQuestionnaireScreen from "../screens/questionnaireScreens/CustomLikertQuestionnaireScreen";
import AdditionalFeedbackScreen from "../screens/questionnaireScreens/AdditionalFeedbackScreen";
import { useContext, useEffect, useRef } from "react";
import { StudyResultsContext } from "../store/StudyResultsContext";
import StudyResultDetailScreen from "../screens/helperScreens/StudyResultDetailScreen";
import CollectedDataTabs from "../screens/helperScreens/CollectedDataTabs";
import ExportModalScreen from "../screens/helperScreens/ExportModalScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { timeExpired } = useContext(StudyResultsContext);
  const navigationRef = useRef();

  useEffect(() => {
    if (timeExpired && navigationRef.current) {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: "EndTestScreen" }],
      });
    }
  }, [timeExpired]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="StartScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="ChooseUIScreen" component={ChooseUIScreen} />
        <Stack.Screen name="StartTestScreen" component={StartTestScreen} />
        <Stack.Screen name="BaselineUIScreen" component={BaselineUIScreen} />
        <Stack.Screen name="OptimizedUIScreen" component={OptimizedUIScreen} />
        <Stack.Screen
          name="BaselineUIReviewScreen"
          component={BaselineUIReviewScreen}
        />
        <Stack.Screen
          name="OptimizedUIReviewScreen"
          component={OptimizedUIReviewScreen}
        />
        <Stack.Screen
          name="BaselineUIRetryScreen"
          component={BaselineUIRetryScreen}
        />
        <Stack.Screen
          name="OptimizedUIRetryScreen"
          component={OptimizedUIRetryScreen}
        />
        <Stack.Screen name="EndTestScreen" component={EndTestScreen} />
        <Stack.Screen
          name="QuestionnaireWelcomeScreen"
          component={QuestionnaireWelcomeScreen}
        />
        <Stack.Screen
          name="SUSQuestionnaireScreen"
          component={SUSQuestionnaireScreen}
        />
        <Stack.Screen
          name="CustomLikertQuestionnaireScreen"
          component={CustomLikertQuestionnaireScreen}
        />
        <Stack.Screen
          name="AdditionalFeedbackScreen"
          component={AdditionalFeedbackScreen}
        />
        <Stack.Screen
          name="QuestionnaireEndScreen"
          component={QuestionnaireEndScreen}
        />
        <Stack.Screen name="CollectedDataTabs" component={CollectedDataTabs} />
        <Stack.Screen
          name="ExportModalScreen"
          component={ExportModalScreen}
          options={{ presentation: "modal", headerShown: true }}
        />
        <Stack.Screen
          name="StudyResultDetailScreen"
          component={StudyResultDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
