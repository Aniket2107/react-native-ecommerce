import React, { useState, useEffect, useContext } from "react";
import { Text, View, Button } from "react-native";
import { Item, Picker } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";

import { connect } from "react-redux";

import FormContainer from "../../Shared/Forms/FormContainer";
import Input from "../../Shared/Forms/Input";
import countries from "../../assets/countries.json";
import AuthGlobal from "../../Context/store/AuthGlobal";

const Checkout = (props) => {
  const context = useContext(AuthGlobal);

  const [orderItems, setOrderItems] = useState([]);
  const [address1, setAddress1] = useState();
  const [address2, setAddress2] = useState();
  const [city, setCity] = useState();
  const [zip, setZip] = useState();
  const [country, setCountry] = useState();
  const [phone, setPhone] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    setOrderItems(props.cartItems);

    if (context.stateUser.isAuthenticated) {
      setUser(context.stateUser.user.userId);
    } else {
      props.navigation.navigate("Cart");
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to checkout",
        text2: "",
      });
    }

    return () => {
      setOrderItems([]);
    };
  }, []);

  const checkOut = () => {
    let order = {
      city,
      country,
      zip,
      phone,
      shippingAddress1: address1,
      shippingAddress2: address2,
      dateOrdered: Date.now(),
      status: "Pending",
      user,
      orderItems,
    };

    props.navigation.navigate("Payment", { order });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={"Shipping Address"}>
        <Input
          placeholder={"Phone"}
          name={"Phone"}
          value={phone}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder={"House/Apartment No. Area"}
          name={"Shipping Address 1"}
          value={address1}
          onChangeText={(text) => setAddress1(text)}
        />
        <Input
          placeholder={"Landmark, Area"}
          name={"Shipping Address 2"}
          value={address2}
          onChangeText={(text) => setAddress2(text)}
        />
        <Input
          placeholder={"City"}
          name={"City"}
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <Input
          placeholder={"Pincode"}
          name={"Pin-code"}
          value={zip}
          keyboardType={"numeric"}
          onChangeText={(text) => setZip(text)}
        />
        <Item picker>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" color={"#007aff"}></Icon>}
            style={{ width: undefined }}
            selectedValue={country}
            placeholder={"Select a Country"}
            placeholderStyle={{ color: "#007aff" }}
            placeholderIconColor={{ color: "#007aff" }}
            onValueChange={(e) => setCountry(e)}
          >
            {countries.map((country) => {
              return (
                <Picker.Item
                  key={country.code}
                  label={country.name}
                  value={country.name}
                />
              );
            })}
          </Picker>
        </Item>

        <View style={{ width: "80%", alignItems: "center" }}>
          <Button title="Confirm" onPress={() => checkOut()} />
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cartItems,
});

export default connect(mapStateToProps, null)(Checkout);
