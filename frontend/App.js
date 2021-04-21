import React from "react";
import Header from "./Shared/Header";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import Main from "./Navigator";

import Auth from "./Context/store/Auth";

import { Provider } from "react-redux";
import store from "./Redux/store";

export default function App() {
  return (
    <Auth>
      <Provider store={store}>
        <NavigationContainer>
          <Header />
          <Main />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </Provider>
    </Auth>
  );
}
