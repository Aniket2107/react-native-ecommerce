import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Content, Left, Body, Thumbnail, ListItem, Text } from "native-base";

const { width } = Dimensions.get("window");

const SearchedProduct = (props) => {
  const { productsFiltered } = props;

  return (
    <Content style={{ width: width }}>
      {productsFiltered.length > 0 ? (
        productsFiltered.map((product) => {
          return (
            <ListItem
              onPress={() =>
                props.navigation.navigate("Product Details", {
                  product: product,
                })
              }
              key={product._id}
              avatar
            >
              <Left>
                <Thumbnail
                  source={{
                    uri: product.image
                      ? product.image
                      : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                  }}
                />
              </Left>
              <Body>
                <Text>{product.name}</Text>
                <Text note={product.description}></Text>
              </Body>
            </ListItem>
          );
        })
      ) : (
        <View style={styles.center}>
          <Text style={{ alignSelf: "center" }}>No product(s) found </Text>
        </View>
      )}
    </Content>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchedProduct;
