import React, { useState,useCallback, useEffect, useReducer } from "react";
import {View, 
        KeyboardAvoidingView, 
        StyleSheet, 
        ScrollView, 
        Platform,
        Alert,
        ActivityIndicator
      }from "react-native";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import * as productActions from "../../store/actions/products";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if(action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    }
    let updatedFormIsValid = true;
    for(const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid ,
      inputValues: updatedValues,
      inputValidities: updatedValidities
    };
  }
  return state;
};

const EditProductScreen = props => {

  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState();

  const prodId = props.route.params ? props.route.params.productId : null;
  const editedProduct = useSelector(state => 
      state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer,{
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: ""
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: !!editedProduct,
  });

  useEffect(() => {
    if(error) {
      Alert.alert("An Error occurred", error, [{text:"okay"}]);
    }
  },[error])

  const submitHandler = useCallback(async () => {
    try{
      if(!formState.formIsValid) {
        Alert.alert("Wrong input", "please check the errors in the form.",[
          {text:"okay"}
        ]);
        return;
      }
      setError(null);
      setIsLoading(true);
      if(editedProduct) {
        await dispatch(productActions.updateProduct(prodId, formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl)
        );
      } else {
        await dispatch(
          productActions.createProduct(formState.inputValues.title, formState.inputValues.description, formState.inputValues.imageUrl, +formState.inputValues.price)
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    
    setIsLoading(false);
  },[dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler })
  }, [submitHandler]);

  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({
      type:FORM_INPUT_UPDATE, 
      value: inputValue,
      isValid: inputValidity,
      input: inputIdentifier
    });
  },[dispatchFormState]);

  if(isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          color={Colors.primary}
          size={"large"}
        />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} style={{flex:1
    }}>
      <ScrollView>
        <View style={styles.form}>
          <Input 
            id="title"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next" 
            label="Title"
            errorText="Please Enter Valid Text"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ""}
            initiallyValid={!!editedProduct}
            required
          />
          <Input 
            id="imageUrl"
            keyboardType="default"
            returnKeyType="next" 
            label="Image Url"
            errorText="Please Enter Valid Image Url"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ""}
            initiallyValid={!!editedProduct}
            required
          />
          { editedProduct ? null : (
            <Input 
              id="price"
              keyboardType="decimal-pad"
              returnKeyType="next" 
              label="Price"
              errorText="Please Enter Valid Price"
              onInputChange={inputChangeHandler}
              required
              min={0.1}
          />
          )}
          <Input 
          id="description"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            label="Description"
            errorText="Please Enter Valid Description"
            onInputChange={inputChangeHandler}
            multiline
            numberOfLines={3}
            initialValue={editedProduct ? editedProduct.description : ""}
            initiallyValid={!!editedProduct}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
};

export const screenOptions = navData => {

  const submitFn = navData.route.params ? navData.route.params.submit : null;
  const routeParams = navData.route.params ? navData.route.params : {};

  return {
    headerTitle: routeParams.productId
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title="Save" 
          iconName={Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"} 
          onPress={submitFn} 
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default EditProductScreen;