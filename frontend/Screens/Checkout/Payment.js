import React, { useState } from "react";
import { View, Button } from "react-native";
import {
  Container,
  Header,
  Content,
  ListItem,
  Text,
  Radio,
  Right,
  Left,
  Picker,
  Icon,
  Body,
  Title,
} from "native-base";

const methods = [
  { name: "Cash on Delivery", value: 1 },
  { name: "Upi/bank transfer", value: 2 },
  { name: "Credit/Debit cards", value: 3 },
];

const paymentCards = [
  { name: "Wallet", value: 1 },
  { name: "Visa", value: 2 },
  { name: "Mastercard", value: 3 },
  { name: "Rupay", value: 4 },
  { name: "Other", value: 5 },
];

const Payment = (props) => {
  const order = props.route.params;

  const [selected, setSelected] = useState();
  const [selectCard, setSelectedCard] = useState();

  return (
    <Container>
      <Header>
        <Body>
          <Title> Choose your payment method: </Title>
        </Body>
      </Header>
      <Content>
        {methods.map((mt, idx) => {
          return (
            <ListItem onPress={() => setSelected(mt.value)} key={idx}>
              <Left>
                <Text>{mt.name}</Text>
              </Left>

              <Right>
                <Radio selected={selected == mt.value} />
              </Right>
            </ListItem>
          );
        })}

        {selected == 3 ? (
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            headerStyle={{ backgroundColor: "orange" }}
            headerBackButtonTextStyle={{ color: "#fff" }}
            headerTitleStyle={{ color: "#fff" }}
            selectedValue={selectCard}
            onValueChange={(e) => setSelectedCard(e)}
          >
            {paymentCards.map((c, idx) => {
              return <Picker.Item label={c.name} value={c.name} key={idx} />;
            })}
          </Picker>
        ) : null}

        <View style={{ marginTop: 60, alignSelf: "center" }}>
          <Button
            title="Confirm"
            onPress={() => props.navigation.navigate("Confirm", { order })}
          />
        </View>
      </Content>
    </Container>
  );
};

export default Payment;
