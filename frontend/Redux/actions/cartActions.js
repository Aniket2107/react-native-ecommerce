import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "../constants";

export const addToCart = (data) => (dispatch) => {
  dispatch({ type: ADD_TO_CART, payload: data });
};

export const removeFromCart = (data) => (dispatch) => {
  dispatch({ type: REMOVE_FROM_CART, payload: data });
};

export const clearCart = () => (dispatch) => {
  dispatch({ type: CLEAR_CART });
};
