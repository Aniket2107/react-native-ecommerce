import React from "react";
import { SafeAreaView, StyleSheet, Image } from "react-native";

const Header = () => {
  return (
    <SafeAreaView style={styles.header}>
      <Image
        source={require("../assets/Logo.png")}
        resizeMode={"contain"}
        style={{ height: 50 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "lightblue",
    width: "100%",
    // marginTop: 10,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    padding: 5,
  },
});

export default Header;
