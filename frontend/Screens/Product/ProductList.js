import React from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";

import ProductCard from "./ProductCard";

const { width } = Dimensions.get("window");

const ProductList = (props) => {
  const { product } = props;
  return (
    <TouchableOpacity
      style={{ width: "50%" }}
      onPress={() =>
        props.navigation.navigate("Product Details", { product: product })
      }
    >
      <View style={{ width: width / 2, backgroundColor: "gainsboro" }}>
        <ProductCard product={product} />
      </View>
    </TouchableOpacity>
  );
};

export default ProductList;
