import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { z } from "zod";
import api from "services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "styles/theme";

const skillSchema = z.object({
  id: z.number(),
  nome: z.string(),
  level: z.string(),
  descricao: z.string(),
  imagem: z.string().url(),
});

export type Skill = z.infer<typeof skillSchema>;

interface SkillsTableProps {
  skills: Skill[];
  onLevelChange: (skills: Skill[]) => void;
  onDelete: (id: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  totalPages: number;
  currentPage: number;
  handlePagesChange: (value: number) => void;
  handleSearch: (value: string) => void;
  handleSortChange: (value: string) => void;
  itemsPerPage: number;
  searchValue: string;
  sortValue: string;
  onImageClick: (id: number) => void;
}

export default function SkillsTable({
  skills,
  nextPage,
  prevPage,
  currentPage,
  handlePagesChange,
  handleSearch,
  handleSortChange,
  itemsPerPage,
  searchValue,
  sortValue,
  onImageClick,
}: SkillsTableProps) {
  const handleLevelChange = (id: number, value: string) => {
    const updatedSkills = skills.map((skill) => {
      if (skill.id === id) {
        return {
          ...skill,
          level: value,
        };
      }
      return skill;
    });
    setSkills(updatedSkills);
  };

  const handleKeyPress = async (id: number) => {
    const skillToUpdate = skills.find((skill) => skill.id === id);
    if (!skillToUpdate) {
      console.error("Skill not found.");
      return;
    }

    const { id: skillId, level } = skillToUpdate;
    const usuarioId = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
    const requestData = {
      usuarioId,
      skillId,
      level,
    };

    api
      .put(`associacoes/${id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Skill updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating skill:", error);
      });
  };

  const handleDelete = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await api.delete(`associacoes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Skill deleted successfully with ID:", id);
      fetchData(currentPage);
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.bars}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={handleSearch}
            value={searchValue}
          />
          <TextInput
            style={styles.sortBar}
            placeholder="Sort"
            onChangeText={handleSortChange}
            value={sortValue}
          />
        </View>
        <FlatList
          data={skills}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.skillContainer}>
              <TouchableOpacity onPress={() => onImageClick(item.id)}>
                <Image style={styles.image} source={{ uri: item.imagem }} />
              </TouchableOpacity>
              <View style={styles.info}>
                <Text style={styles.title}>{item.nome}</Text>
                <Text style={styles.description}>{item.descricao}</Text>
                <TextInput
                  value={item.level.toString()}
                  onChangeText={(text) => handleLevelChange(item.id, text)}
                  onSubmitEditing={() => handleKeyPress(item.id)}
                  style={styles.infoInput}
                />
              </View>
              <View style={styles.modifyContainer}>
                <TouchableOpacity style={styles.modificarButtons}>
                  <Text style={styles.modificarTexto}>Modificar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.modificarButtons}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
      <View style={styles.pageButtons}>
        <Button title="Previous" onPress={prevPage} />
        <TextInput
          placeholder="Items per page"
          onChangeText={(text) => handlePagesChange(Number(text))}
          value={itemsPerPage.toString()}
          style={styles.pagesInput}
        />
        <Button title="Next" onPress={nextPage} />
      </View>
    </>
  );
}

export const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  bars: {
    flexDirection: "row",
    marginBottom: 14,
    gap: 8,
  },
  searchBar: {
    flex: 2,
    borderWidth: 1,
    padding: 5,
    borderColor: theme.colors.dark_blue,
    backgroundColor: theme.colors.cream,
  },
  sortBar: {
    flex: 1,
    borderWidth: 1,
    padding: 5,
    borderColor: theme.colors.dark_blue,
    backgroundColor: theme.colors.cream,
  },
  skillContainer: {
    padding: 5,
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
    alignItems: "center",
    backgroundColor: theme.colors.dark_blue,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 6,
    resizeMode: "contain",
    backgroundColor: "white",
    borderRadius: 50,
  },
  info: {
    flex: 1,
  },
  infoInput: {
    borderWidth: 1,
    padding: 8,
    color: "white",
    borderColor: theme.colors.light_blue,
  },
  deleteText: {
    color: "red",
    textAlign: "center",
  },
  modifyContainer: {
    alignSelf: "flex-end",
    gap: 5,
  },
  modificarButtons: {
    padding: 3,
    height: 30,
    backgroundColor: theme.colors.blue,
    borderRadius: 6,
  },
  modificarTexto: {
    color: "white",
    textAlign: "center",
  },
  pageButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    padding: 10,
  },
  pagesInput: {
    borderWidth: 1,
    padding: 8,
    backgroundColor: theme.colors.cream,
  },
  title: {
    fontSize: 20,
    color: "white",
  },
  description: {
    fontSize: 15,
    color: "white",
  },
});