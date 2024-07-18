import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "./SigInForm";
import api from "services/api";
import { theme } from "styles/theme";
import CheckBox from "react-native-check-box";

const registerSchema = loginSchema
  .extend({
    confirmarSenha: z.string().min(1, "Por favor, preencha todos os campos."),
  })
  .refine((data) => data.password === data.confirmarSenha, {
    message: "Senhas diferentes.",
    path: ["confirmarSenha"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

interface SignUpFormProps {
  setModo: (modo: boolean) => void;
}

export default function SignUpForm({ setModo }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckedShow, setIsCheckedShow] = useState(false);

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handlePasswordShow = () => {
    setIsCheckedShow(!isCheckedShow);
    setShowPassword(!showPassword);
  };

  const handleRegisterSubmit = async (data) => {
    try {
      await api.post("login/signup", {
        login: data.username,
        senha: data.password,
      });
      Alert.alert("Conta criada com sucesso!");
      setModo(true);
    } catch (error) {
      registerForm.setError("username", {
        message: "Erro ao criar conta. Por favor, tente novamente.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={registerForm.control}
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
            {registerForm.formState.errors.username && (
              <Text style={styles.text}>
                {registerForm.formState.errors.username.message}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={registerForm.control}
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
            {registerForm.formState.errors.password && (
              <Text style={styles.text}>
                {registerForm.formState.errors.password.message}
              </Text>
            )}
          </View>
        )}
      />
      <Controller
        control={registerForm.control}
        name="confirmarSenha"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text style={styles.text}>Confirmar Password</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Confirmar Password"
              secureTextEntry={!showPassword}
            />
            {registerForm.formState.errors.confirmarSenha && (
              <Text style={styles.text}>
                {registerForm.formState.errors.confirmarSenha.message}
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
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={registerForm.handleSubmit(handleRegisterSubmit)}
      >
        <Text style={styles.text}>Registrar</Text>
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
