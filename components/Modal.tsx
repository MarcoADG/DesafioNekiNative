import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "services/api";
import { theme } from "styles/theme";
import { Picker } from "@react-native-picker/picker";

const schema = z.object({
  skill: z.string().min(1, "Por favor escolha uma skill"),
  level: z
    .number()
    .min(0, "O nível deve ser no mínimo 0")
    .max(100, "O nível deve ser no máximo 100"),
});

type FormData = z.infer<typeof schema>;

interface Skill {
  id: number;
  nome: string;
}

interface AddSkillModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AddSkillModal({
  isVisible,
  onClose,
}: AddSkillModalProps) {
  const [skills, setSkills] = useState<Skill[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await api.get("skills", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSkill: SubmitHandler<FormData> = async (data) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("id");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const selectedSkillObj = skills.find(
        (skill) => skill.nome === data.skill
      );
      if (!selectedSkillObj) {
        console.error("Selected skill not found");
        return;
      }

      const requestData = {
        usuarioId: userId,
        skillId: selectedSkillObj.id,
        level: data.level,
      };

      await api.post("associacoes/associar", requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert("Skill saved successfully", `Skill: ${data.skill}`);
      handleClose();
    } catch (error) {
      console.error("Error saving skill:", error);
    }
  };

  const handleClose = () => {
    onClose();
    setValue("skill", "");
    setValue("level", 10);
  };

  return (
    <Modal visible={isVisible} transparent onRequestClose={() => handleClose()}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Escolha uma nova skill</Text>
        <Text style={styles.modalDescription}>
          Tenha certeza de escolher a skill correta que deseja adicionar. Aperte
          em salvar quando terminar.
        </Text>
        <View>
          <Controller
            control={control}
            name="skill"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text style={styles.text}>Skills</Text>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione uma skill" value="" />
                  {skills.map((skill) => (
                    <Picker.Item
                      key={skill.id}
                      label={skill.nome}
                      value={skill.nome}
                    />
                  ))}
                </Picker>
                {errors.skill && (
                  <Text style={styles.errorText}>{errors.skill.message}</Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="level"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text style={styles.text}>Level da skill</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    const numericValue = Number(text);
                    onChange(numericValue);
                  }}
                  value={value}
                  placeholder="Level da skill, de 0 a 100"
                  keyboardType="numeric"
                />
                {errors.level && (
                  <Text style={styles.errorText}>{errors.level.message}</Text>
                )}
              </View>
            )}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(handleSaveSkill)}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: theme.colors.dark_blue,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    color: "white",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 15,
    color: "white",
    marginBottom: 20,
  },
  text: {
    color: theme.colors.white,
    marginBottom: 5,
  },
  input: {
    backgroundColor: theme.colors.cream,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    backgroundColor: theme.colors.cream,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: theme.colors.blue,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
});
