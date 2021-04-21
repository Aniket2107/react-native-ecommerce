import React, { useState, useEffect } from "react";
import { View, Dimensions, StyleSheet, ScrollView, Button } from "react-native";
import { Text, Left, Right, ListItem, Thumbnail, Body } from "native-base";

import { connect } from "react-redux";
import * as actions from "../../Redux/actions/cartActions";

import Toast from "react-native-toast-message";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";

import AsyncStorage from "@react-native-community/async-storage";

const { height, width } = Dimensions.get("window");

const Confirm = (props) => {
  const [token, setToken] = useState();

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => setToken(res))
      .catch((err) => console.log(err));

    return () => {
      setToken();
    };
  }, []);

  const finalOrder = props.route.params;

  const confirmOrder = () => {
    const order = finalOrder.order.order;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${baseUrl}order`, order, config)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order successfull",
            text2: "Track your order in profile section..",
          });

          setTimeout(() => {
            props.clearCart();
            props.navigation.navigate("Cart");
          }, 400);
        }
      })
      .catch((err) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text: "Something went wrong",
          text2: "Please try again",
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Confirm Order</Text>
        {finalOrder ? (
          <View
            style={{ borderWidth: 1, borderColor: "orange", marginTop: 10 }}
          >
            <Text style={styles.title}>Shipping To:</Text>
            <View style={{ padding: 8 }}>
              <Text>Address 1 : {finalOrder.order.order.shippingAddress1}</Text>
              <Text>Address 2 : {finalOrder.order.order.shippingAddress2}</Text>
              <Text>City : {finalOrder.order.order.city}</Text>
              <Text>PinCode : {finalOrder.order.order.zip}</Text>
              <Text>Country : {finalOrder.order.order.country}</Text>
            </View>

            <Text style={styles.title}>Items: </Text>
            {finalOrder.order.order.orderItems.map((item, idx) => {
              return (
                <ListItem style={styles.listItem} key={idx} avatar>
                  <Left>
                    <Thumbnail
                      source={{
                        uri: item.product.image
                          ? item.product.image
                          : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                      }}
                    />
                  </Left>
                  <Body style={styles.body}>
                    <Left>
                      <Text>{item.product.name}</Text>
                    </Left>
                    <Right>
                      <Text>₹ {item.product.price}</Text>
                    </Right>
                  </Body>
                </ListItem>
              );
            })}
          </View>
        ) : null}

        <View style={{ alignItems: "center", margin: 20 }}>
          <Button title="Place Order" onPress={confirmOrder} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  body: {
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  listItem: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    width: width / 1.2,
  },
});

// const mapStateToProps = (state) => ({
//   ///
// });

const mapDispatchToProps = (dispatch) => ({
  clearCart: () => dispatch(actions.clearCart()),
});

export default connect(null, mapDispatchToProps)(Confirm);
