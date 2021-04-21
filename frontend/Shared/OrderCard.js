import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import EasyButton from "./StyledComponenets/EasyButton";
import TrafficLight from "./StyledComponenets/Traffic";
import Toast from "react-native-toast-message";

import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import baseUrl from "../assets/common/baseUrl";

const codes = [
  { name: "Pending", code: "3" },
  { name: "Shipped", code: "2" },
  { name: "Delivered", code: "1" },
];

const OrderCard = (props) => {
  const [orderStatus, setOrderStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [statusChange, setStatusChange] = useState(props.status);
  const [token, setToken] = useState();
  const [cardColor, setCardColor] = useState();

  useEffect(() => {
    if (props.editMode) {
      AsyncStorage.getItem("jwt")
        .then((res) => setToken(res))
        .catch((err) => console.log(err));
    }

    if (props.status == "Pending") {
      setOrderStatus(<TrafficLight unavailable></TrafficLight>);
      setStatusText("Pending");
      setCardColor("#E74C3C");
    } else if (props.status == "Shipped") {
      setOrderStatus(<TrafficLight limited></TrafficLight>);
      setStatusText("Shipped");
      setCardColor("#F1C4BF");
    } else {
      setOrderStatus(<TrafficLight available></TrafficLight>);
      setStatusText("Delivered");
      setCardColor("#2ECC71");
    }

    return () => {
      setOrderStatus();
      setToken();
      setStatusText();
      setCardColor();
    };
  }, []);

  const updateOrder = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // console.log("status changes to :=====", statusChange);

    const body = {
      status: statusChange,
    };

    axios
      .put(`${baseUrl}order/${props._id}`, body, config)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order updated",
            text2: `Order id: ${props._id}`,
          });

          setTimeout(() => {
            props.navigation.navigate("Products");
          }, 400);
        }
      })
      .catch((err) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
        console.log(err);
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: cardColor }]}>
      <View style={styles.container}>
        <Text style={styles.title}>Order Number: #{props._id}</Text>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text>
          Status: {statusText} {orderStatus}{" "}
        </Text>

        <Text>
          Address: {props.shippingAddress1} {props.shippingAddress2}
        </Text>

        <Text>City: {props.city}</Text>
        <Text>Country: {props.country}</Text>
        <Text>Order Date : {props.dateOrdered.split("T")[0]}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text>Price: </Text>
        <Text style={styles.price}>{props.totalPrice}</Text>
      </View>

      {props.editMode ? (
        <View>
          <Picker
            mode="dropdown"
            iosIcon={<Icon color="blue" name="arrow-down" />}
            style={{ width: undefined }}
            selectedValue={statusChange}
            placeholder="Change Status"
            placeholderIconColor={{ color: "#007aff" }}
            onValueChange={(e) => setStatusChange(e)}
          >
            {codes.map((c) => (
              <Picker.Item key={c.code} label={c.name} value={c.name} />
            ))}
          </Picker>

          <EasyButton secondary large onPress={() => updateOrder()}>
            <Text style={{ color: "white" }}>Update</Text>
          </EasyButton>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    backgroundColor: "#62B1F6",
    padding: 5,
  },
  priceContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  price: {
    color: "white",
    fontWeight: "bold",
  },
});

export default OrderCard;
