import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Button,
} from "react-native";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import Toast from "react-native-toast-message";

import * as actions from "../../Redux/actions/cartActions";
import { connect } from "react-redux";

import EasyButton from "../../Shared/StyledComponenets/EasyButton";

const { width } = Dimensions.get("window");

const ProductCard = (props) => {
  const { name, price, image, countInStock } = props.product;
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode={ImageResizeMode.contain}
        source={{
          uri: image
            ? image
            : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
        }}
      />
      <View style={styles.card} />
      <Text style={styles.title}>
        {name.length > 15 ? name.substring(0, 15 - 3) + "..." : name}
      </Text>
      <Text style={styles.price}>₹{price}</Text>
      {countInStock > 0 ? (
        <View style={{ marginBottom: 60 }}>
          <EasyButton
            primary
            medium
            onPress={() => {
              props.addItemToCart(props.product),
                Toast.show({
                  topOffset: 60,
                  type: "success",
                  text1: `${name} added to Cart`,
                  text2: "Check your Cart",
                });
            }}
          >
            <Text style={{ color: "white" }}>Add to Cart</Text>
          </EasyButton>
        </View>
      ) : (
        <Text style={{ marginTop: 20, color: "red" }}>Currently available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 20,
    height: width / 1.7,
    padding: 10,
    borderRadius: 10,
    marginTop: 55,
    marginBottom: 5,
    marginLeft: 10,
    alignItems: "center",
    elevation: 8,
    backgroundColor: "white",
  },
  image: {
    width: width / 2 - 20 - 10,
    height: width / 2 - 20 - 30,
    backgroundColor: "transparent",
    position: "absolute",
    top: -45,
  },
  card: {
    marginBottom: 10,
    height: width / 2 - 20 - 90,
    backgroundColor: "transparent",
    width: width / 2 - 20 - 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  price: {
    fontSize: 20,
    color: "orange",
    marginTop: 10,
  },
});

const mapDispatchToProps = (dispatch) => ({
  addItemToCart: (product) =>
    dispatch(actions.addToCart({ quantity: 1, product })),
});

export default connect(null, mapDispatchToProps)(ProductCard);
