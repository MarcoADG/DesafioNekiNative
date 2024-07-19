import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import SignInForm from "components/SigInForm";
import SignUpForm from "components/SignUpForm";
import { theme } from "styles/theme";

const bg = {
  uri: "https://static.wikia.nocookie.net/aesthetics/images/c/c4/Synth-sunset-.gif/revision/latest?cb=20201201041854",
};

const bg2 = {
  uri: "https://opengameart.org/sites/default/files/background_preview_0.png",
};

export default function Login() {
  const [modo, setModo] = useState(true);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.containerTop}>
          <ImageBackground source={bg2} resizeMode="cover" style={styles.image}>
            <View style={styles.forms}>
              {modo ? <SignInForm /> : <SignUpForm setModo={setModo} />}
            </View>
            <View style={styles.link}>
              <TouchableOpacity onPress={() => setModo(!modo)}>
                <Text style={styles.Text}>
                  {modo ? "Deseja criar uma conta?" : "Fazer Login"}
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.Line}></View>
        <View style={styles.containerBot}>
          <ImageBackground
            source={bg}
            resizeMode="cover"
            style={styles.image}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

export const styles = StyleSheet.create({
  containerTop: {
    borderColor: theme.colors.light_blue,
    borderWidth: 12,
    height: "80%",
    overflow: "hidden",
  },
  forms: {
    alignItems: "center",
  },
  containerBot: {
    borderColor: theme.colors.light_blue,
    borderWidth: 12,
    height: "20%",
    overflow: "hidden",
  },
  Line: {
    borderWidth: 1,
    borderColor: "white",
  },
  Text: {
    color: theme.colors.blue,
    textDecorationLine: "underline",
  },
  link: {
    backgroundColor: theme.colors.cream,
    alignItems: "center",
    width: "50%",
    marginHorizontal: "25%",
    borderWidth: 5,
    borderColor: theme.colors.dark_blue,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});
