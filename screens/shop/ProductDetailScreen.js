import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet
} from "react-native";
import {useSelector, useDispatch} from 'react-redux';
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cart";

const ProductDetailScreen = props => {
  const dispatch = useDispatch();
  const productId = props.navigation.getParam("productId")
  const selectedProduct = useSelector(state=> state.products.availableProducts.find(prod => prod.id === productId))
  
  return(
    <ScrollView>
      <Image style={styles.image} source={{uri: selectedProduct.imageUrl}}/>
      <View style={styles.action}>
        <Button color={Colors.primary} title="Add To Cart" onPress={()=>{
          dispatch(cartActions.addToCart(selectedProduct));
        }} />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
  };
}

const styles = StyleSheet.create({
  image:{
    width: "100%",
    height: 300
  },
  price:{
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
    fontFamily:"open-sans-bold"
  },
  description:{
    fontFamily:"open-sans",
    textAlign:"center",
    fontSize:14,
    marginHorizontal: 20
  },
  action: {
    marginVertical: 10,
    alignItems: "center"
  }
});

export default ProductDetailScreen;
