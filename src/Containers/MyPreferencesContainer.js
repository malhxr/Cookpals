import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import BaseContainer from "./BaseContainer";
import { MY_PREFERENCE_API } from "../Utils/CPConstant";
import { getApi } from "../Utils/ServiceManager";

const MyPreferencesContainer = (props) => {
  const [countryArrays, setCountryArrays] = useState([]);
  const [preptimeArrays, setpreptimeArrays] = useState([]);
  const [cuisineArrays, setCuisineArrays] = useState([]);
  const [mealsArrays, setmealsArrays] = useState([]);
  const [genderPrefrences, setGenderPrefrencesArrays] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const [PrefList, setPrefList] = useState([]);
  // const [updatePrefList, setUpdatePrefList] = useState(props?.route?.params?.updateList)

  useEffect(() => {
    getprefrencelist();
  }, []);

  const getprefrencelist = () => {
    getApi(
      MY_PREFERENCE_API,
      onSuccessPrefrenceListRender,
      onFailurePrefrenceListRender
    );
  };

  console.log("preptimeArrays::::::", preptimeArrays);

  const onSuccessPrefrenceListRender = (response) => {
    console.log("SUCCESS ACTIVE=>> :::::: ", response.data?.my_preference_time);
    if (response.success) {
      setRefreshing(false);
      setPrefList(response.data);
      setCountryArrays([response.data.country_id]);
      setCuisineArrays(
        response.data.my_preference_cuisine.map((x) => x.cuisine_id)
      );
      setGenderPrefrencesArrays(
        response.data.my_preference_gender.map((x) => x.gender_id)
      );
      setmealsArrays(response.data.meal.map((x) => x.meal_id));
      setpreptimeArrays(
        response.data?.my_preference_time.map((x) => ({ ...x, selected: true }))
      );
    }
  };

  const onFailurePrefrenceListRender = (error) => {
    console.log("FAILURE ACTIVE :::::: ", error);
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };

  const navigateToFoodPreferences = () => {
    props.navigation.navigate("foodPreference", {
      isCurrentUser: true,
      isEdit: true,
      country: countryArrays,
      cuisine: cuisineArrays,
      gender: genderPrefrences,
    });
  };

  const navigateToMealPreferences = () => {
    props.navigation.navigate("mealPreference", {
      isCurrentUser: true,
      isEdit: true,
      meals: mealsArrays,
    });
  };

  const navigateToPrepareTime = () => {
    props.navigation.navigate("preparetionDetail", {
      isCurrentUser: true,
      isEdit: true,
      preptime: preptimeArrays,
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      getprefrencelist();
    });
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  // console.log('preflist in mypreference container:::::::', PrefList);
  // console.log('cuisine in mypreference container::::::::::::::', cuisineArrays);
  // console.log('gender in mypreference container::::::::::::::', genderPrefrences);
  // console.log('meals in mypreference container::::::::::::::', mealsArrays);
  // console.log('prep time in mypreference container::::::::::::::', preptimeArrays);

  return (
    <BaseContainer title={"My Preferences"} onBackPress={navigateToBack}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.container}
      >
        <Pressable style={styles.typeView} onPress={navigateToFoodPreferences}>
          <View style={styles.dottedView} />
          <Text style={styles.titleStyle}>
            {"Type Of Country, Cuisine & Gender"}
          </Text>
        </Pressable>
        <Pressable style={styles.typeView} onPress={navigateToMealPreferences}>
          <View style={styles.dottedView} />
          <Text style={styles.titleStyle}>{"Type of Meal"}</Text>
        </Pressable>
        <Pressable style={styles.typeView} onPress={navigateToPrepareTime}>
          <View style={styles.dottedView} />
          <Text style={styles.titleStyle}>{"Preparation Time"}</Text>
        </Pressable>
      </ScrollView>
    </BaseContainer>
  );
};

export default MyPreferencesContainer;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 15 },
  typeView: { flexDirection: "row", alignItems: "center", marginTop: 25 },
  dottedView: {
    width: 10,
    marginHorizontal: 15,
    height: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: CPColors.lightPrimary,
    borderColor: CPColors.lightBorderPrimary,
  },
  titleStyle: { color: CPColors.secondary, fontFamily: CPFonts.bold },
});
