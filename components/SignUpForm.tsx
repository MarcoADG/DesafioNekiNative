import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "./SigInForm";
import api from "services/api";

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

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterSubmit = async (data) => {
    try {
      await api.post("http://seu_api_url/login/signup", {
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
    <SafeAreaView className="flex-1 justify-center p-4">
      <View>
        <Controller
          control={registerForm.control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <Text className="text-lg">Username</Text>
              <TextInput
                className="border p-2 rounded"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Login"
              />
              {registerForm.formState.errors.username && (
                <Text className="text-red-500">
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
            <View className="mb-4">
              <Text className="text-lg">Password</Text>
              <TextInput
                className="border p-2 rounded"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Password"
                secureTextEntry={!showPassword}
              />
              {registerForm.formState.errors.password && (
                <Text className="text-red-500">
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
            <View className="mb-4">
              <Text className="text-lg">Confirmar Password</Text>
              <TextInput
                className="border p-2 rounded"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Confirmar Password"
                secureTextEntry={!showPassword}
              />
              {registerForm.formState.errors.confirmarSenha && (
                <Text className="text-red-500">
                  {registerForm.formState.errors.confirmarSenha.message}
                </Text>
              )}
            </View>
          )}
        />
        <View className="flex flex-row items-center mb-4">
          <TouchableOpacity onPress={handleCheckboxChange}>
            <Text className="text-blue-600 underline">Mostrar senha</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded"
          onPress={registerForm.handleSubmit(handleRegisterSubmit)}
        >
          <Text className="text-white text-center">Registrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
