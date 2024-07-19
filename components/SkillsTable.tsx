import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "styles/theme";
import { z } from "zod";

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
  onDelete,
}: SkillsTableProps) {
  const [editedLevels, setEditedLevels] = useState<{ [key: number]: string }>(
    {}
  );
  const [searchInputValue, setSearchInputValue] = useState(searchValue);

  const handleLevelChange = (id: number, value: string) => {
    setEditedLevels((prevLevels) => ({
      ...prevLevels,
      [id]: value,
    }));
  };

  const handleKeyPress = async (id: number) => {
    const newLevel = editedLevels[id];
    if (newLevel === undefined) {
      console.error("No new level set for skill.");
      return;
    }

    const skillToUpdate = skills.find((skill) => skill.id === id);
    if (!skillToUpdate) {
      console.error("Skill not found.");
      return;
    }

    const { id: skillId } = skillToUpdate;
    const usuarioId = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
    const requestData = {
      usuarioId,
      skillId,
      level: newLevel,
    };

    api
      .put(`associacoes/${id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Skill updated successfully:", response.data);
        // Optionally update the skill level in the skills array here
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
      onDelete();
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const handleSearchClick = () => {
    handleSearch(searchInputValue);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.bars}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={setSearchInputValue}
            value={searchInputValue}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchClick}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
          <Picker
            selectedValue={sortValue}
            style={styles.sortPicker}
            onValueChange={(itemValue) => handleSortChange(itemValue)}
          >
            <Picker.Item enabled={false} label="Sort" />
            <Picker.Item label="Name Asc" value="skills.nome,asc" />
            <Picker.Item label="Name Desc" value="skills.nome,desc" />
            <Picker.Item label="Level Asc" value="level,asc" />
            <Picker.Item label="Level Desc" value="level,desc" />
          </Picker>
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
                  value={editedLevels[item.id]}
                  placeholder={item.level.toString()}
                  placeholderTextColor={"black"}
                  onChangeText={(text) => handleLevelChange(item.id, text)}
                  onSubmitEditing={() => handleKeyPress(item.id)}
                  style={styles.infoInput}
                />
              </View>
              <View style={styles.modifyContainer}>
                <TouchableOpacity
                  style={styles.modificarButtons}
                  onPress={() => handleLevelChange}
                >
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
        <TouchableOpacity style={styles.pagesButton} onPress={prevPage}>
          <Text style={styles.pageText}>Previous</Text>
        </TouchableOpacity>
        <Picker
          selectedValue={itemsPerPage}
          style={styles.pagesPicker}
          onValueChange={(itemValue) => handlePagesChange(itemValue)}
        >
          <Picker.Item label="3" value={3} />
          <Picker.Item label="4" value={4} />
          <Picker.Item label="5" value={5} />
          <Picker.Item label="10" value={10} />
          <Picker.Item label="15" value={15} />
          <Picker.Item label="20" value={20} />
          <Picker.Item label="25" value={25} />
        </Picker>
        <TouchableOpacity style={styles.pagesButton} onPress={nextPage}>
          <Text style={styles.pageText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  bars: {
    flexDirection: "row",
    marginBottom: 14,
  },
  searchBar: {
    flex: 2,
    borderWidth: 1,
    padding: 5,
    borderColor: theme.colors.dark_blue,
    backgroundColor: theme.colors.cream,
  },
  searchButton: {
    backgroundColor: theme.colors.blue,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  searchButtonText: {
    color: "white",
  },
  sortPicker: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 28,
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
    backgroundColor: theme.colors.cream,
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
    alignItems: "center",
    padding: 10,
  },
  pagesPicker: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: theme.colors.cream,
  },
  title: {
    fontSize: 20,
    color: "white",
  },
  pagesButton: {
    backgroundColor: theme.colors.blue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
  },
  pageText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  description: {
    fontSize: 15,
    color: "white",
  },
});
