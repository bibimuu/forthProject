import React, { useEffect, useState, useCallback } from "react";
import { Text, ActivityIndicator, View, FlatList, Platform, StyleSheet, Button } from "react-native";
import {useSelector, useDispatch} from "react-redux";
import {HeaderButtons, Item} from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import HeaderButton from "../../components/UI/HeaderButton";
import * as productsActions from "../../store/actions/products";
import Colors from "../../constants/Colors";

const ProductOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try{
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    };
    setIsLoading(false)
  },[dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadProducts();
  },[dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
  });
};

if(error) {
  return <View style={styles.centered}>
    <Text>ERROR OCCURRED</Text>
    <Button 
      title="try again" 
      onPress={loadProducts} 
      color={Colors.primary} 
    />
  </View>
}

if(isLoading) {
  return <View>
    <ActivityIndicator
      color={Colors.primary}
      size="large"
      style={styles.centered}
    />
  </View>
}

if(!isLoading && products.length === 0) {
  return <View style={styles.centered}>
    <Text>No Products. Please Add Some!</Text>
  </View>
}

return <FlatList 
          data={products} 
          keyExtractor={item => item.id} 
          renderItem={itemData=> 
          <ProductItem 
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          >
            <Button 
              color={Colors.primary} 
              title="View Details" 
              onPress={() => {
                selectItemHandler(itemData.item.id, itemData.item.title);
              }}
            />
            <Button 
              color={Colors.primary} 
              title="To Cart" 
              onPress={() => {
                dispatch(cartActions.addToCart(itemData.item));
              }}
            />
          </ProductItem> }
        />
}

ProductOverviewScreen.navigationOptions = navData => {
  return {
  headerTitle: "All Products",
  headerLeft: (<HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item 
    title="Menu" 
    iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"} 
    onPress={()=>{
      navData.navigation.toggleDrawer();
    }} />
  </HeaderButtons>),
  headerRight: (<HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item 
    title="cart" 
    iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"} 
    onPress={()=>{
      navData.navigation.navigate('Cart')
    }} />
  </HeaderButtons>)
}}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})

export default ProductOverviewScreen;
