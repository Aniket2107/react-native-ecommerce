import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Container } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";

import EasyButton from "../../Shared/StyledComponenets/EasyButton";
import OrderCard from "../../Shared/OrderCard";

import baseUrl from "../../assets/common/baseUrl";
import axios from "axios";

import AuthGlobal from "../../Context/store/AuthGlobal";
import { logoutUser } from "../../Context/actions/authActions";

const Profile = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [orders, setOrders] = useState();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("Login");
      }

      AsyncStorage.getItem("jwt")
        .then((res) => {
          // console.log("context ==========", context.stateUser.user);
          axios
            .get(`${baseUrl}user/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => {
              // console.log("user ========", user);
              setUserProfile(user.data.data);
              setLoading(false);
            });
        })
        .catch((error) => console.log(error));

      axios
        .get(`${baseUrl}order`)
        .then((x) => {
          const orderData = x.data.data;
          // console.log(data)
          // console.log(orderData);
          const userOrders = orderData.filter(
            (order) => order.user._id === context.stateUser.user.userId
          );
          setOrders(userOrders);
        })
        .catch((error) => console.log(error));

      return () => {
        setUserProfile();
        setOrders();
      };
    }, [context.stateUser.isAuthenticated])
  );

  return (
    <Container style={styles.container}>
      {loading == true ? (
        <View>
          <ActivityIndicator size={30} color="red" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.subContainer}>
          <Text style={{ fontSize: 30 }}>
            Welcome! {userProfile ? userProfile.name : " "}
          </Text>

          <View style={{ marginTop: 20 }}>
            <Text style={{ margin: 10 }}>
              Email : {userProfile ? userProfile.email : " "}
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ margin: 10 }}>
              Phone : {userProfile ? userProfile.phone : " "}
            </Text>
          </View>

          <View style={{ marginTop: 80 }}>
            <EasyButton
              danger
              large
              onPress={() => {
                AsyncStorage.removeItem("jwt");
                logoutUser(context.dispatch);
              }}
            >
              <Text style={{ color: "white" }}>Logout</Text>
            </EasyButton>
          </View>

          <View style={styles.order}>
            <Text style={{ fontSize: 20 }}>Orders: </Text>
            <View>
              {orders ? (
                orders.map((x) => {
                  return <OrderCard key={x._id} {...x} />;
                })
              ) : (
                <View style={styles.order}>
                  <Text>You have no order(s)</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  subContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  order: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 60,
  },
});

export default Profile;
