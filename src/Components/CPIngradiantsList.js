import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import Assets from '../Assets';
import CPColors from '../Utils/CPColors';
import { WEIGHT_API } from '../Utils/CPConstant';
import CPFonts from '../Utils/CPFonts';
import { getApi } from '../Utils/ServiceManager';

const CPIngradiantsList = (props) => {
  const userSelector = useSelector((state) => state);

  const [weight, setWeight] = useState([]);

  useEffect(() => {
    weightAPIAction();
  }, []);

  const weightAPIAction = () => {
    getApi(
      WEIGHT_API,
      onSuccessWeight,
      onFailureWeight,
      userSelector.userOperation,
    );
  };

  const onSuccessWeight = (response) => {
    setWeight(response.data);
  };
  const onFailureWeight = (error) => {
    console.log(error);
  };
  return (
    <FlatList
      data={props.data ?? []}
      stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => {
        return (
          <View style={style.headerView}>
            <Text style={style.headerText}>{props.title}</Text>
          </View>
        );
      }}
      renderItem={({ item, index }) => {
        console.log('ITEMPOPOVER ::::: ', weight);
        return (
          <View style={style.container} key={index}>
            <Image source={Assets.nouningredient} style={style.imageStyle} />
            <Text style={style.textStyle}>
              {item.quantity +
                ' ' +
                weight[weight.findIndex((id) => id.id === item.weight)]?.name +
                ' ' +
                item.item_name}
            </Text>
          </View>
        );
      }}
    />
  );
};

export default CPIngradiantsList;

const style = StyleSheet.create({
  headerView: { backgroundColor: CPColors.white },
  headerText: {
    fontSize: 16,
    fontFamily: CPFonts.semiBold,
    color: CPColors.secondary,
    marginTop: 25,
    marginBottom: 15,
  },
  container: { flexDirection: 'row', marginVertical: 15 },
  textStyle: {
    fontSize: 16,
    fontFamily: CPFonts.regular,
    color: CPColors.secondary,
    marginHorizontal: 5,
  },
  imageStyle: { marginHorizontal: 5 },
});
