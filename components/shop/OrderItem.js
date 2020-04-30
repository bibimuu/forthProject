import React, { useState } from 'react';
import {View, Text, Button, StyleSheet} from "react-native";

import CartItem from "./CartItem";
import Colors from "../../constants/Colors";

const OrderItem = props => {

  const [showDetails, setShowDetails] = useState(false);

  return <View style={styles.orderItem}>
    <View style={styles.summary}>
      <Text style={styles.totalAmount}>{props.amount.toFixed(2)}</Text>
      <Text style={styles.date}>{props.date}</Text>
    </View>
    <Button 
      color={Colors.primary} 
      title={showDetails ? "Hide Detail" : "Show Detail"} 
      onPress={() => {
        setShowDetails(prevState => !prevState)
      }}
      />
      {showDetails && (
      <View style={styles.detailItems}>
        {props.items.map(cartItem => (
          <CartItem
            quantity={cartItem.quantity}
            amount={cartItem.sum}
            title={cartItem.productTitle}
            key={cartItem.productId}
          />
        ))}
      </View>
      )}
  </View>
};

const styles = StyleSheet.create({
  orderItem: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    margin: 20,
    padding: 10,
    alignItems: "center"
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width:"100%",
    marginBottom: 15
  },
  totalAmount: {
    fontFamily: "open-sans-bold",
    fontSize: 16
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: "#888"
  },
  detailItems: {
    width: "100%"
  }
});

export default OrderItem;