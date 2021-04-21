import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { Container, Icon, Input, Item, Header } from "native-base";
import { useFocusEffect } from "@react-navigation/native";

import ProductList from "./ProductList";
import SearchedProduct from "./SearchedProduct";
import CategoryFilter from "./CategoryFilter";
import Banner from "../../Shared/Banner";

import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";

const { height } = Dimensions.get("window");

const ProductContainer = (props) => {
  const [products, setProducts] = useState([]);
  const [searchProductsFiltered, setSearchProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [active, setActive] = useState();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);

      axios
        .get(`${baseUrl}product`)
        .then((res) => {
          setProducts(res.data.data);
          setSearchProductsFiltered(res.data.data);
          setProductsCtg(res.data.data);
          setInitialState(res.data.data);
          setLoading(false);
        })
        .catch((err) => console.log(err));

      axios
        .get(`${baseUrl}category`)
        .then((res) => {
          setCategories(res.data.data);
        })
        .catch((err) => console.log(err));

      return () => {
        setProducts([]);
        setSearchProductsFiltered([]);
        setFocus();
        setCategories([]);
        setActive();
        setInitialState([]);
      };
    }, [])
  );

  const searchProducts = (text) => {
    setSearchProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const changeCategory = (category) => {
    if (category === "all") {
      setProductsCtg(initialState);
      setActive(true);
    } else {
      setProductsCtg(products.filter((i) => i.category._id === category));
      setActive(false);
    }
  };

  return (
    <React.Fragment>
      {loading === false ? (
        <Container>
          <Header searchBar rounded style={{ backgroundColor: "gainsboro" }}>
            <Item>
              <Icon name="ios-search" />
              <Input
                placeholder="Search"
                onFocus={openList}
                onChangeText={(text) => searchProducts(text)}
              />
              {focus == true ? (
                <Icon onPress={onBlur} name="ios-close" />
              ) : null}
            </Item>
          </Header>

          {focus === true ? (
            <SearchedProduct
              key={Math.random()}
              navigation={props.navigation}
              productsFiltered={searchProductsFiltered}
            />
          ) : (
            <ScrollView>
              <View>
                <Banner />
              </View>

              <View>
                <CategoryFilter
                  categories={categories}
                  categoryFilter={changeCategory}
                  productsCtg={productsCtg}
                  active={active}
                  setActive={setActive}
                />
              </View>

              {productsCtg.length > 0 ? (
                <View style={styles.listContainer}>
                  {productsCtg.map((product) => {
                    return (
                      <ProductList
                        navigation={props.navigation}
                        product={product}
                        key={product._id}
                      />
                    );
                  })}
                </View>
              ) : (
                <View style={([styles.center], { height: height / 2 })}>
                  <Text> No product found </Text>
                </View>
              )}
            </ScrollView>
          )}
        </Container>
      ) : (
        <Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
          <ActivityIndicator size="large" color="red" />
        </Container>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  listContainer: {
    height: "auto",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductContainer;
