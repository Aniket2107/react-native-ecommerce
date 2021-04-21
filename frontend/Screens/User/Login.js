import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import FormContainer from "../../Shared/Forms/FormContainer";
import Input from "../../Shared/Forms/Input";
import Error from "../../Shared/Error";

import EasyButton from "../../Shared/StyledComponenets/EasyButton";

import { loginUser } from "../../Context/actions/authActions";
import AuthGlobal from "../../Context/store/AuthGlobal";

const Login = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate("User Profile");
    }
  }, [context.stateUser.isAuthenticated]);

  const handleSubmit = () => {
    const user = {
      email,
      password,
    };

    if (!email || !password) {
      setError("Fill in your credientials");
    } else {
      setError("");
      loginUser(user, context.dispatch);
    }
  };

  return (
    <FormContainer title={"Login"}>
      <Input
        placeholder={"Enter email address"}
        name={"email"}
        value={email}
        id={"email"}
        onChangeText={(text) => setEmail(text.toLowerCase())}
      />
      <Input
        placeholder={"Enter password"}
        name={"password"}
        value={password}
        id={"password"}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />

      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <EasyButton large secondary onPress={() => handleSubmit()}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
        </EasyButton>
      </View>

      <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
        <Text style={styles.middleText}> Don't have an account yet? </Text>
        <EasyButton
          large
          secondary
          onPress={() => props.navigation.navigate("Register")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Register</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "100%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default Login;
