import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScreenContent } from "components/ScreenContent";
import { StyleSheet, View } from "react-native";

import { Button } from "../components/Button";
import { RootStackParamList } from "../navigation";

type OverviewScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  "Overview"
>;

export default function Overview() {
  const navigation = useNavigation<OverviewScreenNavigationProps>();

  return (
    <View style={styles.container}>
      <ScreenContent
        path="screens/overview.tsx"
        title="Overview"
      ></ScreenContent>
      <Button
        onPress={() => navigation.navigate("Login")}
        title="Login Screen"
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
