import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

import FormContainer from "../../Shared/Forms/FormContainer";
import Input from "../../Shared/Forms/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponenets/EasyButton";

import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password || !phone) {
      setError("All fields are mandatory");
    } else {
      setError("");

      let user = {
        name,
        email,
        password,
        phone,
        isAdmin: false,
      };

      axios
        .post(`${baseUrl}user/register`, user)
        .then((res) => {
          if (res.status == 200) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Registeration Success!",
              text2: "Please Login ",
            }),
              setTimeout(() => {
                props.navigation.navigate("Login");
              }, 500);
          }
        })
        .catch((err) => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong,",
            text2: "Please try again",
          }),
            console.log(err.response);
        });
    }
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title="Register">
        <Input
          placeholder={"Enter email"}
          name={"email"}
          value={email}
          id={"email"}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <Input
          placeholder={"Name"}
          name={"name"}
          value={name}
          id={"name"}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder={"Enter Phone Number"}
          name={"phone"}
          value={phone}
          id={"phone"}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder={"Password"}
          name={"password"}
          value={password}
          id={"password"}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
      </FormContainer>
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
      </View>
      <View style={{ alignSelf: "center" }}>
        <EasyButton large secondary onPress={() => handleRegister()}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Register</Text>
        </EasyButton>
      </View>

      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Text>Have an account?</Text>
        <EasyButton
          secondary
          large
          buttonStyle={{ backgroundColor: "#1E6738", borderRadius: 10 }}
          onPress={() => props.navigation.navigate("Login")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Login here</Text>
        </EasyButton>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    margin: 10,
    alignItems: "center",
  },
});

export default Register;
