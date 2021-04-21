import jwt_deocde from "jwt-decode";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-toast-message";

import baseUrl from "../../assets/common/baseUrl";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const loginUser = (user, dispatch) => {
  fetch(`${baseUrl}user/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        const token = data.data.token;
        const decode = jwt_deocde(token);
        AsyncStorage.setItem("jwt", token);
        dispatch(setCurrentUser(decode, user));
      } else {
        logoutUser(dispatch);
      }
    })
    .catch((err) => {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please provide correct credientials..",
        text2: " Error ",
      });
      logoutUser(dispatch);
    });
};

export const getUserProfile = (id) => {
  fetch(`${baseUrl}user/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data.data))
    .catch((err) => console.log(err));
};

export const logoutUser = (dispatch) => {
  AsyncStorage.removeItem("jwt");
  dispatch(setCurrentUser({}));
};

export const setCurrentUser = (decoded, user) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    getUserProfile: user,
  };
};
