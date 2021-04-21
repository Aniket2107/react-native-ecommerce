import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View elevation={1} style={styles.listHeader}>
      <View style={styles.headerItem}>
        <Text> </Text>
      </View>

      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}> Brand </Text>
      </View>

      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}> Name </Text>
      </View>

      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}> Cateogry </Text>
      </View>

      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}> Price </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "orange",
  },
  headerItem: {
    margin: 3,
    width: width / 6,
  },
});

export default ListHeader;
