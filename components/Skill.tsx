import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Skill } from "./SkillsTable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "services/api";
import { theme } from "styles/theme";

interface SkillItemProps {
  skillId: number;
}

export default function SkillItem({ skillId }: SkillItemProps) {
  const [skill, setSkill] = useState<Skill | null>(null);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get(`associacoes/${skillId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSkill(response.data);
      } catch (error) {
        console.error("Error fetching skill:", error);
      }
    };

    fetchSkill();
  }, [skillId]);

  if (!skill) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerLeft}>
        <Text style={styles.title}>{skill.nome}</Text>
        <Image style={styles.image} source={{ uri: skill.imagem }} />
      </View>
      <View style={styles.containerRight}>
        <Text style={styles.description}>{skill.descricao}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: theme.colors.dark_blue,
    borderRadius: 8,
    margin: 10,
    flexDirection: "row",
    gap: 30,
  },
  containerLeft: {},
  containerRight: {
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 30,
    color: "white",
  },
  description: {
    fontSize: 15,
    color: "white",
    textAlign: "left",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 6,
    resizeMode: "cover",
    backgroundColor: "white",
    borderRadius: 10,
  },
  level: {
    fontSize: 18,
    color: "white",
  },
});
