import React, { useState, useCallback } from "react";
import { View, FlatList, Text } from "react-native";

import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";

import { useFocusEffect } from "@react-navigation/native";

import OrderCard from "../../Shared/OrderCard";

const Orders = (props) => {
  const [orderList, setOrderList] = useState();

  useFocusEffect(
    useCallback(() => {
      getOrders();

      return () => {
        setOrderList();
      };
    }, [])
  );

  const getOrders = () => {
    axios
      .get(`${baseUrl}order`)
      .then((res) => {
        // console.log("order list=====", res.data);
        setOrderList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View>
      {orderList?.length > 0 ? (
        <FlatList
          data={orderList}
          renderItem={({ item }) => (
            <OrderCard
              navigation={props.navigation}
              {...item}
              id={item._id}
              editMode={true}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 60,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "red", fontSize: 20 }}>
            No order(s) found
          </Text>
        </View>
      )}
    </View>
  );
};

export default Orders;
