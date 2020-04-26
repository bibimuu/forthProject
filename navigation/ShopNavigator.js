import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Platform } from "react-native";

import CartScreen from "../screens/shop/CartScreen";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import Colors from "../constants/Colors";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : ""
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold"
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans"
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary
};

const ProductsNavigator = createStackNavigator(
  {
  ProductsOverview: ProductsOverviewScreen,
  ProductDetail: ProductDetailScreen,
  Cart: CartScreen
}, {
  defaultNavigationOptions: defaultNavOptions
});

const OrdersNavigator = createDrawerNavigator({
  Orders:OrdersScreen
},{
  defaultNavigationOptions: defaultNavOptions
});

const shopNavigator = createDrawerNavigator({
  Products: ProductsNavigator,
  Orders: OrdersNavigator
},{
  contentOptions: {
    activeTintColor: Colors.primary
  }
})

export default createAppContainer(shopNavigator);