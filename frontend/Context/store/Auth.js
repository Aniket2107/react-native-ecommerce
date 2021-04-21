import React, { useReducer, useEffect, useState } from "react";
import jwt_deocde from "jwt-decode";
import AsyncStorage from "@react-native-community/async-storage";

import authReducer from "../reducers/authReducer";
import { setCurrentUser } from "../actions/authActions";
import AuthGlobal from "./AuthGlobal";

const Auth = (props) => {
  const [stateUser, dispatch] = useReducer(authReducer, {
    isAuthenticated: null,
    error: {},
  });
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
    if (AsyncStorage.jwt) {
      const decoded = AsyncStorage.jwt;
      if (setShowChild) {
        dispatch(setCurrentUser(jwt_deocde(decoded)));
      }
    }
    return () => {
      setShowChild(false);
    };
  }, []);

  if (!showChild) {
    return null;
  } else {
    return (
      <AuthGlobal.Provider
        value={{
          stateUser,
          dispatch,
        }}
      >
        {props.children}
      </AuthGlobal.Provider>
    );
  }
};

export default Auth;
