import { AntDesign, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AddSkillModal from "components/Modal";
import SkillItem from "components/Skill";
import SkillsTable, { Skill } from "components/SkillsTable";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "services/api";
import { theme } from "styles/theme";

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);
  const [searchValue, setSearchValue] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>("");
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const fetchData = async (page = 0, search = "", sort = "", size = 3) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        navigation.navigate("Login");
      }

      const userId = await AsyncStorage.getItem("id");

      const params: { [key: string]: any } = {
        page: page,
        size: size,
      };

      if (search.trim() !== "") {
        params.skillNome = search.trim();
      }

      if (sort.trim() !== "") {
        params.sort = sort.trim();
      }

      const response = await api.get(`associacoes/usuario/${userId}/skills`, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.content.length === 0) {
        setSkills([]);
      } else {
        setSkills(response.data.content);
      }

      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogOut = () => {
    navigation.navigate("Login");
    AsyncStorage.removeItem("token");
  };

  useEffect(() => {
    fetchData(currentPage, searchValue, sortValue, itemsPerPage);
  }, [currentPage, searchValue, sortValue, itemsPerPage]);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePagesChange = (value: number) => {
    setItemsPerPage(value);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setCurrentPage(0);
  };

  const handleImageClick = (id: number) => {
    setSelectedSkillId(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerTop}>
        <TouchableOpacity style={styles.logOutIcon} onPress={handleLogOut}>
          <Entypo name="log-out" size={20} color="black" />
        </TouchableOpacity>
        <SkillsTable
          skills={skills}
          onLevelChange={setSkills}
          onDelete={fetchData}
          nextPage={nextPage}
          prevPage={prevPage}
          totalPages={totalPages}
          currentPage={currentPage}
          handlePagesChange={handlePagesChange}
          handleSearch={handleSearch}
          handleSortChange={handleSortChange}
          itemsPerPage={itemsPerPage}
          searchValue={searchValue}
          sortValue={sortValue}
          onImageClick={handleImageClick}
        />
      </View>
      <View style={styles.Line}></View>
      <View style={styles.containerBot}>
        <View style={styles.skillContainer}>
          <SkillItem skillId={selectedSkillId} />
        </View>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleOpenModal}
          >
            <AntDesign name="pluscircleo" size={20} color="white" />
          </TouchableOpacity>
          <AddSkillModal
            isVisible={isModalVisible}
            onClose={handleCloseModal}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    // backgroundColor: "gray",
  },
  logOutIcon: { paddingHorizontal: 10 },
  Line: {
    borderWidth: 1,
    borderColor: "white",
  },
  containerTop: {
    backgroundColor: theme.colors.violet,
    borderColor: theme.colors.light_blue,
    borderWidth: 12,
    height: "70%",
    overflow: "hidden",
  },
  forms: {
    alignItems: "center",
  },
  modalButton: {
    justifyContent: "center",
    height: 30,
  },
  containerBot: {
    backgroundColor: theme.colors.violet,
    borderColor: theme.colors.light_blue,
    borderWidth: 12,
    height: "30%",
    overflow: "hidden",
  },
  skillContainer: {
    height: "80%",
  },
  modalContainer: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: theme.colors.blue,
    width: "10%",
    borderRadius: 30,
  },
});
