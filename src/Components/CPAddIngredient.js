import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import CPPopover from "./CPPopover";
import { WEIGHT_API } from "../Utils/CPConstant";
import { getApi } from "../Utils/ServiceManager";
import { useSelector } from "react-redux";

const CPAddIngredient = (props) => {
  const userSelector = useSelector((state) => state);
  const [inGredientArray, setInGredientArray] = useState(props.data ?? [{}]);

  const onChangeNameHandler = (text, index) => {
    // setName(text)
    console.log("TEXT :::: ", text);
    let ingradianData = [...inGredientArray];
    ingradianData[index].item_name = text;
    console.log("CHANGE NAME :::: ", ingradianData);
    props.onChangeIngredient(ingradianData);
    setInGredientArray(ingradianData);
    // props.onChangeIngredient(ingradianData)
  };

  const onChangeQuantityHandler = (text, index) => {
    let ingradianData = [...inGredientArray];
    ingradianData[index].quantity = text;
    setInGredientArray(ingradianData);
    // setQuantity(text)
    props.onChangeIngredient(ingradianData);
  };
  const onChangeWeightHandler = (item, index) => {
    console.log("ITEMPOPOVER", item);
    let ingradianData = [...inGredientArray];
    ingradianData[index].weight = item?.id;
    setInGredientArray(ingradianData);
    // setQuantity(text)
    props.onChangeIngredient(ingradianData);
  };

  const onAddIngredient = () => {
    setInGredientArray((oldArray) => [...oldArray, {}]);
    props.onChangeIngredient([...inGredientArray, {}]);
  };

  const onRemoveIngradiant = (index) => {
    setInGredientArray(
      inGredientArray.filter((item, indexes) => indexes !== index)
    );
    props.onChangeIngredient(
      inGredientArray.filter((item, indexes) => indexes !== index)
    );
  };

  // useEffect(()=>{
  //     console.log("UPDATE :::::: ");
  //     setName(props.item.name ?? "")
  //     setQuantity(props.item.quantity ?? "")
  // },[props.item])

  const [ingredientWeight, setIngredientWeight] = useState();

  useEffect(() => {
    weightAPIAction();
  }, []);

  const weightAPIAction = () => {
    getApi(
      WEIGHT_API,
      onSuccessWeight,
      onFailureWeight,
      userSelector.userOperation
    );
  };

  const onSuccessWeight = (response) => {
    console.log("WEIGHT API :::: ", response.data);
    if (response.success) {
      setIngredientWeight(response.data);
    } else {
      setIngredientWeight([]);
    }
  };

  const onFailureWeight = (error) => {
    setIngredientWeight([]);
  };

  const IngrediantRender = ({ item, index }) => {
    return (
      <View key={index}>
        <View style={style.container} >
          <View style={[style.inputViewStyle, { flex: 2 }]}>
            <TextInput
              maxLength={20}
              value={item.item_name ?? ""}
              style={[style.inputStyle, { height: 40 }]}
              placeholder="Item name"
              placeholderTextColor={CPColors.secondaryLight}
              onChangeText={(value) => onChangeNameHandler(value, index)}
            />
          </View>

          <View
            style={[style.inputViewStyle, { flex: 1, marginHorizontal: 15 }]}
          >
            <TextInput

              value={item.quantity ?? ""}
              style={[style.inputStyle, { height: 40, marginLeft: 8, }]}
              keyboardType="phone-pad"
              placeholder="Qty"
              maxLength={3}
              placeholderTextColor={CPColors.secondaryLight}
              onChangeText={(value) => onChangeQuantityHandler(value, index)}
            />
          </View>

          <CPPopover
            data={ingredientWeight}
            onChangeWeightHandler={(value) =>
              onChangeWeightHandler(value, index)
            }
          />

          <Pressable
            style={[
              style.touchStyle,
              { alignItems: "center", justifyContent: "center" },
            ]}
            onPress={() => onRemoveIngradiant(index)}
          >
            <Icon name={"remove"} color={CPColors.borderColor} size={20} />
          </Pressable>
        </View>
        {props.isShouldVisible && (!item.quantity || !item.item_name) ? (
          <Text
            style={{
              color: CPColors.red,
              fontSize: 12,
              fontFamily: CPFonts.regular,
            
              marginLeft: 5,
            }}
          >
            {"Please add name,quantity or weight"}
          </Text>
        ) : null}
      </View>
    );
  };
  console.log("DDD ::: ", inGredientArray);
  return (
    <View>
      {/* {inGredientArray.map((item, index) => IngrediantRender(item, index))} */}
      <FlatList data={inGredientArray} renderItem={IngrediantRender} />
      <Pressable style={style.addIngredients} onPress={onAddIngredient}>
        <Icon name={"add"} size={16} color={CPColors.secondaryLight} />

        <Text style={style.inMinutes}>{"Add new Ingredient"}</Text>
      </Pressable>
    </View>
  );
};

export default CPAddIngredient;

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputViewStyle: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: CPColors.textInputColor,
    borderRadius: 10,
  },
  touchStyle: {
    borderWidth: 1.5,
    borderRadius: 20,
    borderColor: CPColors.borderColor,
    backgroundColor: CPColors.ingredianColor,
  },
  inputStyle: {
    fontSize: 16,
    fontFamily: CPFonts.regular,
    color: CPColors.secondary,
  },
  cookTime: {
    color: CPColors.secondary,
    fontSize: 16,
    fontFamily: CPFonts.medium,
  },
  inMinutes: {
    color: CPColors.secondaryLight,
    fontSize: 16,
    fontFamily: CPFonts.medium,
  },
  addIngredients: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
  },
});
