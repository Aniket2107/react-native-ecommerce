import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Badge, Text, ListItem, Item } from "native-base";

const CategoryFilter = (props) => {
  return (
    <ScrollView
      bounces={true}
      horizontal={true}
      style={{ backgroundColor: "#f2f2f2" }}
    >
      <ListItem style={{ margin: 0, padding: 0, borderRadius: 0 }}>
        <TouchableOpacity
          key={1}
          onPress={() => {
            props.categoryFilter("all"), props.setActive(-1);
          }}
        >
          <Badge
            style={[
              styles.center,
              { margin: 5 },
              props.active === -1 ? styles.active : styles.inactive,
            ]}
          >
            <Text style={{ color: "white" }}>All</Text>
          </Badge>
        </TouchableOpacity>
        {props.categories.map((cat) => (
          <TouchableOpacity
            key={cat._id}
            onPress={() => {
              props.categoryFilter(cat._id),
                props.setActive(props.categories.indexOf(cat));
            }}
          >
            <Badge
              style={[
                styles.center,
                { margin: 5 },
                props.active === props.categories.indexOf(cat)
                  ? styles.active
                  : styles.inactive,
              ]}
            >
              <Text style={{ color: "white" }}>{cat.name}</Text>
            </Badge>
          </TouchableOpacity>
        ))}
      </ListItem>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: "#03bafc",
  },
  inactive: {
    backgroundColor: "lightgreen",
  },
});

export default CategoryFilter;
