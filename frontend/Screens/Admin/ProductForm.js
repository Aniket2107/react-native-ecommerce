import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Item, Picker } from "native-base";

import FormContainer from "../../Shared/Forms/FormContainer";
import Input from "../../Shared/Forms/Input";
import EasyButton from "../../Shared/StyledComponenets/EasyButton";
import Error from "../../Shared/Error";

import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";

import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";

import * as ImagePicker from "expo-image-picker";
import mime from "mime";

const ProductForm = (props) => {
  const [pickerValue, setPickerValue] = useState();
  const [brand, setBrand] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [category, setCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [countInStock, setCountInStock] = useState();
  const [rating, setRating] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [richDescription, setRichDescription] = useState();
  const [numOfReviews, setNumOfReviews] = useState();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!props.route.params) {
      setProduct(null);
    } else {
      setProduct(props.route.params.product);
      setBrand(props.route.params.product.brand);
      setName(props.route.params.product.name);
      setPrice(props.route.params.product.price.toString());
      setDescription(props.route.params.product.description);
      setMainImage(props.route.params.product.image);
      setImage(props.route.params.product.image);
      setCategory(props.route.params.product.category._id);
      setCountInStock(props.route.params.product.countInStock.toString());
    }

    //Get token
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((res) => console.log(res));

    //Categories
    axios
      .get(`${baseUrl}category`)
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => console.log(err));

    //Image picker
    (async () => {
      if (Platform.os != "web") {
        const { status } = ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Please provide Camera permission) ");
        }
      }
    })();

    return () => {
      setCategories([]);
    };
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMainImage(result.uri);
      setImage(result.uri);
    }
  };

  const addProduct = () => {
    if (!name || !brand || !price || !category || !description) {
      setError("Please fill in all data");
    }

    let formData = new FormData();

    const newImageUri = "file:///" + image.split("/").join("");

    formData.append("image", {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop(),
    });
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("countInStock", countInStock);
    formData.append("rating", rating);
    formData.append("isFeatured", featured);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (product !== null) {
      axios
        .put(`${baseUrl}product/${product._id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Product Updated",
              text2: " Thank you! ",
            });

            setTimeout(() => {
              props.navigation.navigate("Products");
            }, 300);
          }
        })
        .catch((err) => {
          console.log(err);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Try again",
          });
        });
    } else {
      axios
        .post(`${baseUrl}product`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Product added",
              text2: " Thank you! ",
            });

            setTimeout(() => {
              props.navigation.navigate("Products");
            }, 300);
          }
        })
        .catch((err) => {
          console.log(err);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Try again",
          });
        });
    }
  };

  return (
    <FormContainer title="Add Product">
      <View style={styles.imageContainer}>
        <Image source={{ uri: mainImage }} style={styles.image} />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Icon style={{ color: "white" }} name="camera" />
        </TouchableOpacity>
      </View>

      <View style={styles.label}>
        <Text style={{ textDecorationLine: "underline" }}>Brand</Text>
      </View>
      <Input
        placeholder={"Brand"}
        name="Brand"
        value={brand}
        id="brand"
        onChangeText={(text) => setBrand(text)}
      />

      <View style={styles.label}>
        <Text style={{ textDecorationLine: "underline" }}>Name</Text>
      </View>
      <Input
        placeholder={"Product Name"}
        name="Name"
        value={name}
        id="Name"
        onChangeText={(text) => setName(text)}
      />

      <View style={styles.label}>
        <Text style={{ textDecorationLine: "underline" }}>Price</Text>
      </View>
      <Input
        placeholder={"Price"}
        name="Price"
        value={price}
        id="price"
        keyboardType={"numeric"}
        onChangeText={(text) => setPrice(text)}
      />

      <View style={styles.label}>
        <Text style={{ textDecorationLine: "underline" }}>Stock</Text>
      </View>
      <Input
        placeholder={"Stock"}
        name="Stock"
        value={countInStock}
        id="stock"
        keyboardType={"numeric"}
        onChangeText={(text) => setCountInStock(text)}
      />

      <View style={styles.label}>
        <Text style={{ textDecorationLine: "underline" }}>Description</Text>
      </View>
      <Input
        placeholder={"Description"}
        name="Description"
        value={description}
        id="description"
        onChangeText={(text) => setDescription(text)}
      />

      <Item picker>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" color="#77aff" />}
          style={{ width: undefined }}
          placeholder="Select category"
          selectedValue={pickerValue}
          placeholderStyle={{ color: "#77aff" }}
          placeholderIconColor={{ color: "#77aff" }}
          onValueChange={(e) => [setPickerValue(e), setCategory(e)]}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
          ))}
        </Picker>
      </Item>

      {error ? <Error message={error} /> : null}

      <View style={[styles.buttonText, { marginBottom: 50, marginTop: 10 }]}>
        <EasyButton large primary onPress={() => addProduct()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  label: {
    width: "80%",
    marginTop: 10,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 80,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    padding: 8,
    borderRadius: 100,
    backgroundColor: "grey",
    elevation: 20,
  },
});

export default ProductForm;
