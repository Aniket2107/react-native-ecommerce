import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import EasyButton from "../../Shared/StyledComponenets/EasyButton";

const { width } = Dimensions.get("window");

const ListItem = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centerView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              underlayColor="#E8E8E8"
              onPress={() => setModalVisible(false)}
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                top: 5,
                right: 10,
              }}
            >
              <Icon name="close" size={20} />
            </TouchableOpacity>

            <View>
              <EasyButton
                medium
                secondary
                onPress={() => {
                  props.navigation.navigate("Add/Edit Product", {
                    product: props.product,
                  });
                  setModalVisible(false);
                }}
              >
                <Text style={styles.whiteText}>Edit</Text>
              </EasyButton>
            </View>

            <View style={{ marginTop: 5 }}>
              <EasyButton
                medium
                danger
                onPress={() => [
                  props.delete(props.product._id),
                  setModalVisible(false),
                ]}
              >
                <Text style={styles.whiteText}>Delete</Text>
              </EasyButton>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Product Details", {
            product: props.product,
          });
        }}
        onLongPress={() => setModalVisible(true)}
        style={[
          styles.container,
          { backgroundColor: props.index % 2 == 0 ? "white" : "gainsboro" },
        ]}
      >
        <Image
          source={{
            uri: props.product.image
              ? props.product.image
              : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
          }}
          resizeMode={ImageResizeMode.contain}
          style={styles.image}
        />
        <Text style={styles.item}>{props.product.brand}</Text>
        <Text numberOfLines={1} style={styles.item} ellipsizeMode="tail">
          {props.product.name}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.item}>
          {props.product.category.name}
        </Text>
        <Text style={styles.item}>₹ {props.product.price}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    width: width,
  },
  image: {
    borderRadius: 50,
    width: width / 6,
    height: 20,
    margin: 2,
  },
  item: {
    flexWrap: "wrap",
    margin: 3,
    width: width / 6,
  },
  centerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  whiteText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ListItem;
