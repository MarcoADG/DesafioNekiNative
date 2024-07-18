import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "styles/theme";

import Login from "screens/login";

export type RootStackParamList = {
  Login: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitleAlign: "center",
            title: "Bem Vindo ao seu app de skills",
            headerStyle: { backgroundColor: theme.colors.dark_blue },
            headerTitleStyle: { color: "white" },
          }}
        />
        {/* <Stack.Screen
          name="Details"
          component={Details}
          options={({ navigation }) => ({
            headerLeft: () => <BackButton onPress={navigation.goBack} />,
          })}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
