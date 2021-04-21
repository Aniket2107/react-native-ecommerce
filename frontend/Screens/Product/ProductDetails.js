import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Button,
} from "react-native";
import { Left, Right, Container, H1 } from "native-base";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import Toast from "react-native-toast-message";

import EasyButton from "../../Shared/StyledComponenets/EasyButton";
import TrafficLight from "../../Shared/StyledComponenets/Traffic";

import { connect } from "react-redux";
import * as actions from "../../Redux/actions/cartActions";

const ProductDetails = (props) => {
  // console.log(props.route.params.product);
  const [product, setProduct] = useState(props.route.params.product);
  const [avability, setAvability] = useState(null);
  const [avabilityText, setAvabilityText] = useState("");

  useEffect(() => {
    if (props.route.params.product.countInStock == 0) {
      setAvability(<TrafficLight unavailable></TrafficLight>);
      setAvabilityText("Unavailable");
    } else if (props.route.params.product.countInStock <= 5) {
      setAvability(<TrafficLight limited></TrafficLight>);
      setAvabilityText("Limited Stock");
    } else {
      setAvability(<TrafficLight available></TrafficLight>);
      setAvabilityText("Available");
    }

    return () => {
      setAvability(null);
      setAvabilityText("");
    };
  }, []);

  return (
    <Container style={styles.container}>
      <ScrollView
        style={{
          marginBottom: 60,
          padding: 5,
        }}
      >
        <View>
          <Image
            source={{
              uri: product.image
                ? product.image
                : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
            }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        <View style={styles.contextContainer}>
          <H1 style={styles.contextHeader}>{product.name}</H1>
          <Text style={styles.contextText}>{product.brand}</Text>
        </View>

        <View style={styles.avabilityContainer}>
          <View style={styles.avability}>
            <Text style={{ marginRight: 10 }}>Avability : {avabilityText}</Text>
            {avability}
          </View>

          <View>
            <Text>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Left>
          <Text style={styles.price}>₹{product.price}</Text>
        </Left>

        <Right>
          <EasyButton
            primary
            medium
            onPress={() => {
              props.addItemToCart(product),
                Toast.show({
                  topOffset: 60,
                  type: "success",
                  text1: `${product.name} added to Cart`,
                  text2: "Check your Cart",
                });
            }}
          >
            <Text style={{ color: "white" }}>Add to cart</Text>
          </EasyButton>
        </Right>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
  },
  imageContainer: {
    backgroundColor: "white",
    padding: 0,
    margin: 0,
  },
  image: {
    width: "100%",
    height: 250,
  },
  contextContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contextHeader: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  contextText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "white",
  },
  price: {
    fontSize: 24,
    margin: 20,
    color: "red",
  },
  avabilityContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  avability: {
    flexDirection: "row",
    marginBottom: 10,
  },
});

const mapDispatchToProps = (dispatch) => ({
  addItemToCart: (product) =>
    dispatch(actions.addToCart({ quantity: 1, product })),
});

export default connect(null, mapDispatchToProps)(ProductDetails);
