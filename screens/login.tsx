import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import SignInForm from "components/SigInForm";
import SignUpForm from "components/SignUpForm";
import { theme } from "styles/theme";

export default function Login() {
  const [modo, setModo] = useState(true);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.containerTop}>
          <View>
            {modo ? <SignInForm /> : <SignUpForm setModo={setModo} />}
          </View>
          <View>
            <TouchableOpacity onPress={() => setModo(!modo)}>
              <Text style={styles.Text}>Deseja criar uma conta?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.Line}></View>
        <View style={styles.containerBot}>
          <Text>Hello</Text>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

export const styles = StyleSheet.create({
  containerTop: {
    padding: 10,
    borderColor: theme.colors.light_blue,
    borderWidth: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "60%",
  },
  containerBot: {
    borderColor: theme.colors.light_blue,
    borderWidth: 12,
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
  },
  Line: {
    borderWidth: 2,
    borderColor: "black",
  },
  Text: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
