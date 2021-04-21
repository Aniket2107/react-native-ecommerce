import React, { useContext } from "react";
import { View, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Container, Text, Left, Right, H1 } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { SwipeListView } from "react-native-swipe-list-view";

import EasyButton from "../../Shared/StyledComponenets/EasyButton";

import { connect } from "react-redux";

import * as actions from "../../Redux/actions/cartActions";
import CartItem from "./CartItem";

import AuthGlobal from "../../Context/store/AuthGlobal";

const { height, width } = Dimensions.get("window");

const Cart = (props) => {
  const context = useContext(AuthGlobal);

  let total = 0;
  props.cartItems.forEach((item) => {
    return (total += item.product.price);
  });

  return (
    <React.Fragment>
      {props.cartItems.length > 0 ? (
        <Container>
          <H1 style={{ alignSelf: "center" }}>Cart</H1>

          <SwipeListView
            data={props.cartItems}
            renderItem={(data) => <CartItem item={data} key={Math.random()} />}
            renderHiddenItem={(data) => (
              <View style={styles.hiddenContainer} key={data.item}>
                <TouchableOpacity
                  style={styles.hiddenButton}
                  onPress={() => props.removeFromCart(data.item)}
                >
                  <Icon name="trash" color="white" size={30} />
                </TouchableOpacity>
              </View>
            )}
            disableRightSwipe={true}
            previewOpenDelay={2000}
            friction={1000}
            tension={40}
            leftOpenValue={75}
            stopLeftSwipe={75}
            rightOpenValue={-75}
          />

          {/* {props.cartItems.map((item, idx) => {
            return <CartItem item={item} key={idx} />;
          })} */}

          <View style={styles.bottomContainer}>
            <Left>
              <Text style={styles.price}>₹{total}</Text>
            </Left>

            <Right>
              <EasyButton
                danger
                medium
                title="Clear"
                onPress={() => props.clearFullCart()}
              >
                <Text style={{ color: "white" }}>Clear</Text>
              </EasyButton>
            </Right>

            <Right>
              {context.stateUser.isAuthenticated ? (
                <EasyButton
                  primary
                  medium
                  onPress={() => props.navigation.navigate("Checkout")}
                >
                  <Text style={{ color: "white" }}>Checkout</Text>
                </EasyButton>
              ) : (
                <EasyButton
                  secondary
                  medium
                  onPress={() => props.navigation.navigate("Login")}
                >
                  <Text style={{ color: "white" }}>Login</Text>
                </EasyButton>
              )}
            </Right>
          </View>
        </Container>
      ) : (
        <Container style={styles.emptyContainer}>
          <Text>Your cart seems empty</Text>
          <Text>Add products to your cart :) </Text>
        </Container>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    height: height,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "white",
    elevation: 20,
  },
  price: {
    fontSize: 18,
    margin: 20,
    color: "red",
  },
  hiddenContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  hiddenButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 25,
    height: 70,
    width: width / 1.2,
  },
});

const mapStateToProps = (state) => ({
  cartItems: state.cartItems,
});

const mapDispatchToProps = (dispatch) => ({
  clearFullCart: () => dispatch(actions.clearCart()),
  removeFromCart: (item) => dispatch(actions.removeFromCart(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
