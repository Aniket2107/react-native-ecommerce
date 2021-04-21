import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TextInput,
  StyleSheet,
} from "react-native";

import EasyButton from "../../Shared/StyledComponenets/EasyButton";

import baseUrl from "../../assets/common/baseUrl";
import axios from "axios";

import AsyncStorage from "@react-native-community/async-storage";

const { width } = Dimensions.get("window");

const CatItem = (props) => {
  const { index, item } = props;
  return (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <EasyButton medium danger onPress={() => props.delete(item._id)}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
      </EasyButton>
    </View>
  );
};

const Categories = (props) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [token, setToken] = useState();

  useEffect(() => {
    //Get token
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((err) => console.log(err));

    axios
      .get(`${baseUrl}category`)
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => {
        alert("Somehting went wrong,try reloading");
      });

    return () => {
      setCategories([]);
      setToken();
      setCategoryName("");
    };
  }, []);

  const addCategory = () => {
    const category = {
      name: categoryName,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${baseUrl}category`, category, config)
      .then((res) => {
        setCategories([...categories, res.data.data]);
      })
      .catch((err) => {
        console.log(err);
        alert("Error adding category...");
      });

    setCategoryName("");
  };

  const deleteCategory = (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .delete(`${baseUrl}category/${id}`, config)
      .then((res) => {
        const newCategories = categories.filter((item) => item._id !== id);

        setCategories(newCategories);
      })
      .catch((err) => {
        alert("Something went wrong, try again");
      });
  };

  return (
    <View style={{ position: "relative", height: "100%" }}>
      <View style={{ marginBottom: 60 }}>
        <FlatList
          data={categories}
          renderItem={({ item, index }) => (
            <CatItem item={item} index={index} delete={deleteCategory} />
          )}
          keyExtractor={(cat) => cat._id}
        />
      </View>

      <View style={styles.buttonContainer}>
        <View>
          <Text>Add Category</Text>
        </View>
        <View style={{ width: width / 2.5 }}>
          <TextInput
            value={categoryName}
            style={styles.input}
            onChangeText={(text) => setCategoryName(text)}
          />
        </View>

        <View>
          <EasyButton medium primary onPress={() => addCategory()}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Submit</Text>
          </EasyButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "white",
    width: width,
    height: 60,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  input: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
  },
  item: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 1,
    padding: 5,
    margin: 5,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
  },
});

export default Categories;
