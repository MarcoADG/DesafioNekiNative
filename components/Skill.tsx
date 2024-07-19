import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Skill } from "./SkillsTable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "services/api";
import { theme } from "styles/theme";
import AddSkillModal from "./Modal";

interface SkillItemProps {
  skillId: number;
}

const gif =
  "https://i.pinimg.com/originals/29/14/97/2914979d57cf620dbf74856235f6f704.gif";

export default function SkillItem({ skillId }: SkillItemProps) {
  const [skill, setSkill] = useState<Skill | null>(null);

  useEffect(() => {
    const fetchSkill = async () => {
      // if (!skillId) {
      //   skillId = 1;
      // }
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
    return (
      <Image resizeMode="stretch" style={{ flex: 1 }} source={{ uri: gif }} />
    );
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
    margin: 5,
    flexDirection: "row",
    gap: 30,
  },
  containerLeft: {
    flex: 1.5,
  },
  containerRight: {
    flex: 2,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
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
