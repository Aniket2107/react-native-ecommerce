import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Header, Input, Item } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";

import AsyncStorage from "@react-native-community/async-storage";

import EasyButton from "../../Shared/StyledComponenets/EasyButton";

import ListItem from "./ListItem";
import ListHeader from "./ListHeader";

const { height, width } = Dimensions.get("window");

const Products = (props) => {
  const [productList, setProductLlist] = useState();
  const [productFilter, setProductFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();

  useFocusEffect(
    useCallback(() => {
      //Get token
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((err) => console.log(err));

      //Fetch the products
      axios
        .get(`${baseUrl}product`)
        .then((res) => {
          setProductLlist(res.data.data);
          setProductFilter(res.data.data);
          setLoading(false);
        })
        .catch((err) => console.log(err));

      return () => {
        setProductLlist();
        setProductFilter();
        setLoading(true);
      };
    }, [])
  );

  const searchProduct = (text) => {
    if (text === "") {
      setProductFilter(productList);
    } else {
      setProductFilter(
        productList.filter((i) =>
          i.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const deleteProduct = (id) => {
    axios
      .delete(`${baseUrl}product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const products = productFilter.filter((item) => item._id !== id);
        setProductFilter(products);
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <EasyButton
          secondary
          medium
          onPress={() => props.navigation.navigate("Orders")}
        >
          <Icon name="shopping-bag" size={30} color="white" />
          <Text style={styles.buttonText}>Orders</Text>
        </EasyButton>

        <EasyButton
          secondary
          medium
          onPress={() => props.navigation.navigate("Add/Edit Product")}
        >
          <Icon name="plus" size={30} color="white" />
          <Text style={styles.buttonText}>Product</Text>
        </EasyButton>

        <EasyButton
          secondary
          medium
          onPress={() => props.navigation.navigate("Categories")}
        >
          <Icon name="plus" size={30} color="white" />
          <Text style={styles.buttonText}>Category</Text>
        </EasyButton>
      </View>

      <View>
        <Header searchBar rounded style={{ backgroundColor: "gainsboro" }}>
          <Item style={{ padding: 5 }}>
            <Icon name="search" />
            <Input
              placeholder="Search"
              onChangeText={(text) => searchProduct(text)}
            />
          </Item>
        </Header>
      </View>
      {loading === true ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={productFilter}
          ListHeaderComponent={ListHeader}
          renderItem={({ item, index }) => (
            <ListItem
              product={item}
              navigation={props.navigation}
              index={index}
              delete={deleteProduct}
            />
          )}
          keyExtractor={(item) => item._id}
        ></FlatList>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  spinner: {
    height: height / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginBottom: 160,
    backgroundColor: "white",
  },
  buttonContainer: {
    margin: 20,
    alignSelf: "center",
    flexDirection: "row",
  },
  buttonText: {
    marginLeft: 4,
    color: "white",
  },
});

export default Products;
