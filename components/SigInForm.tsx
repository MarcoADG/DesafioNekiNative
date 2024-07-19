import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import CheckBox from "react-native-check-box";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "services/api";
import { theme } from "styles/theme";
import { useNavigation } from "@react-navigation/native";

export const loginSchema = z.object({
  username: z.string().min(1, "Por favor, preencha todos os campos."),
  password: z.string().min(1, "Por favor, preencha todos os campos."),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [savePassword, setSavePassword] = useState(false);
  const [isCheckedShow, setIsCheckedShow] = useState(false);
  const [isCheckedSave, setIsCheckedSave] = useState(false);

  const navigation = useNavigation();

  const loginForm = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const handlePasswordShow = () => {
    setIsCheckedShow(!isCheckedShow);
    setShowPassword(!showPassword);
  };

  const handleSavePasswordChange = async () => {
    if (!savePassword) {
      await AsyncStorage.setItem(
        "savedPassword",
        loginForm.getValues("password")
      );
    } else {
      await AsyncStorage.removeItem("savedPassword");
    }
    setSavePassword(!savePassword);
    setIsCheckedSave(!isCheckedSave);
  };

  const handleLoginSubmit = async (data: any) => {
    try {
      const response = await api.post("login/signin", {
        username: data.username,
        password: data.password,
      });
      const token = response.data.accessToken;
      await AsyncStorage.setItem("token", token);
      console.log("data", response.data);
      const decoded = jwtDecode(token);
      const userId = String(response.data.id);
      await AsyncStorage.setItem("id", userId);
      Alert.alert("Login successful", `Welcome ${data.username}`);
      navigation.navigate("Skill");
    } catch (error) {
      loginForm.setError("username", {
        message: "Credenciais inválidas. Por favor, tente novamente.",
      });
    }
  };

  useEffect(() => {
    const fetchSavedPassword = async () => {
      const savedPassword = await AsyncStorage.getItem("savedPassword");
      if (savedPassword) {
        loginForm.setValue("password", savedPassword);
        setSavePassword(true);
      }
    };
    fetchSavedPassword();
  }, []);

  return (
    <View style={styles.container}>
      <Controller
        control={loginForm.control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text style={styles.text}>Username</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Login"
            />
            {loginForm.formState.errors.username && (
              <Text style={styles.textError}>
                {loginForm.formState.errors.username.message}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={loginForm.control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text style={styles.text}>Password</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              secureTextEntry={!showPassword}
            />
            {loginForm.formState.errors.password && (
              <Text style={styles.textError}>
                {loginForm.formState.errors.password.message}
              </Text>
            )}
          </View>
        )}
      />
      <View style={styles.checkboxs}>
        <View style={styles.checkbox}>
          <CheckBox onClick={handlePasswordShow} isChecked={isCheckedShow} />
          <Text style={styles.text}>Mostrar senha</Text>
        </View>
        <View style={styles.checkbox}>
          <CheckBox
            onClick={handleSavePasswordChange}
            isChecked={isCheckedSave}
          />
          <Text style={styles.text}>Salvar senha</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={loginForm.handleSubmit(handleLoginSubmit)}
      >
        <Text style={styles.text}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.dark_blue,
    width: 300,
    padding: 20,
    borderRadius: 5,
  },
  text: { color: theme.colors.white },
  textError: {
    color: "#FF0000",
  },
  input: {
    backgroundColor: theme.colors.cream,
    padding: 5,
    margin: 2,
    borderRadius: 10,
  },
  button: {
    flexDirection: "row",
    backgroundColor: theme.colors.blue,
    width: "100%",
    borderRadius: 7,
    padding: 5,
  },
  checkbox: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 7,
  },
  checkboxs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
