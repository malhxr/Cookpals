
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Snackbar from "react-native-snackbar";
import { useDispatch, useSelector } from "react-redux";
import Assets from "../Assets";
import CPThemeButton from "../Components/CPThemeButton";
import { saveUserLoggedInInRedux } from "../redux/Actions/User";
import CPColors from "../Utils/CPColors";
import { MY_PREFERENCE_API, PREPARE_TIME_API } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { getApi, postApi } from "../Utils/ServiceManager";
import { EDIT_FOOD_PREFERENCES } from "../Utils/CPConstant";
import BaseContainer from "./BaseContainer";

const PrepareDetailsContainer = (props) => {
  const [preparetime, setPreparetime] = useState([]);
  const [selectedPreparetime, setSelectedPreparetime] = useState(
    props?.route?.params?.preptime ?? []
  );
  const [shouldVisible, setShouldVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userSelector = useSelector((state) => state);
  const usersDispatcher = useDispatch();
  let prepTime = preparetime.filter((x) => x?.selected);
  useEffect(() => {
    prepateTimeAPIAction();
  }, []);

  console.log(prepTime, "postselectedindexpreparationtime", preparetime);
  const postprefrencePrepTimeList = () => {
    const postParams = {
      type: 3,
      preparation_time_id: prepTime.map((x) => x?.id).toString(),
    };
    console.log(postParams, "postselectedindexpreparationtime");
    setIsLoading(true);
    postApi(
      EDIT_FOOD_PREFERENCES,
      postParams,
      onSuccessPostPrefrencePrepTimeListUpdate,
      onFailurePostPrefrencePrepTimeListUpdate,
      userSelector.userOperation
    );
  };
  console.log(
    "preptime-index in preptime component::::::::::::::::",
    preparetime
  );

  const onSuccessPostPrefrencePrepTimeListUpdate = (response) => {
    navigateToBack();
    console.log("SUCCESS update=>> :::::: ", response);
    setIsLoading(true);
    Snackbar.show({
      text: response.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const onFailurePostPrefrencePrepTimeListUpdate = (error) => {
    console.log("FAILURE ACTIVE :::::: ", error);

    Snackbar.show({
      text: response.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const prepateTimeAPIAction = () => {
    getApi(
      PREPARE_TIME_API,
      onSuccessPrepareTime,
      onFailurePrepareTime,
      userSelector.userOperation
    );
  };

  const onSuccessPrepareTime = (response) => {
    let prepSelected = response?.data.map((x) => {
      return selectedPreparetime.some((y) => y.preparation_time_id === x.id);
    });
    if (response.success) {
      setPreparetime(
        response?.data.reduce(
          (p, c, i) => [...p, { ...c, selected: prepSelected[i] }],
          []
        )
      );
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  console.log(preparetime, "Prepare Success selectArr:::::::");

  const onFailurePrepareTime = (error) => {
    console.log("Prepare Success ::::::: ", error);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };

  const preparingDetailsAction = () => {
    if (selectedPreparetime) {
      if (props.route.params?.isCurrentUser) {
        postprefrencePrepTimeList();
      } else {
        myPreferenceActionAPI();
        // props.navigation.navigate('recipeList');
      }
    } else {
      setShouldVisible(true);
    }
  };

  const myPreferenceActionAPI = () => {
    const params = {
      country_id: props.route.params.country,
      meal_id: props.route.params.meals,
      cuisine_id: props.route.params.cuisine,
      gender_id: props.route.params.gender,
      most_followed_liked: props.route.params.most_followed_liked,
      preparation_time_id: prepTime.map((x) => x?.id).toString(),
    };
    setIsLoading(true);
    postApi(
      MY_PREFERENCE_API,
      params,
      onSuccessPreference,
      onFailurePreference,
      userSelector.userOperation
    );
  };

  const onSuccessPreference = (response) => {
    if (response.success) {
      usersDispatcher(saveUserLoggedInInRedux(true));
      props.navigation.navigate("recipeList");
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
    setIsLoading(false);
  };

  const onFailurePreference = (error) => {
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
    setIsLoading(false);
  };

  const onSelectTime = (value, index) => {
    setShouldVisible(false);
    console.log("onSelectTime root");
    // let prepTime = preparetime.filter((x) => x?.selected);
    // console.log(value, "preptime-index in preptime component::::::::::::::::");
    if (!value?.selected) {
      console.log("onSelectTime if block", value);
      setPreparetime((arr) => [
        ...arr.slice(0, index),
        { ...value, selected: true },
        ...arr.slice(index + 1),
      ]);
      // setSelectedPreparetime(preparetime.filter((x) => x?.selected));
    } else {
      console.log("onSelectTime else block", value);
      setPreparetime((arr) => [
        ...arr.slice(0, index),
        { ...value, selected: false },
        ...arr.slice(index + 1),
      ]);
    }
    // console.log(
    //   prepTime,
    //   "preptime-index in preptime component::::::::::::::::"
    // );
  };

  return (
    <BaseContainer
      onBackPress={navigateToBack}
      title={props?.route?.params?.isEdit ? "Choice Preferences" : ""}
      isLoading={isLoading}
    >
      <ScrollView bounces={false}>
        <View style={styles.main}>
          {!props?.route?.params?.isEdit && (
            <View style={styles.subView}>
              <Text style={styles.headingText}>{"Preparation Time"}</Text>
              {/* <Text style={styles.bodyText}>
                Lorem Ipsum Is Simply Dummy Text Of The Ipsum Is Simply Dummy Text
                Of The
              </Text> */}
            </View>
          )}
          <View style={styles.subEditView}>
            <Image source={Assets.prepareTime} style={styles.recipeImage} />

            <View style={styles.timeBtnView}>
              {preparetime.map((item, index) => {
                // let newItem;
                // if (item?.selected === undefined) {
                //   newItem = {
                //     ...item,
                //     selected: selectedPreparetime?.some(
                //       (y) => y.preparation_time_id === item.id
                //     ),
                //   };
                // } else {
                //   newItem = item;
                // }
                //   {
                //   ...item,
                //   selected: selectedPreparetime?.some(
                //     (y) => y.preparation_time_id === item.id
                //   ),
                // };
                console.log(
                  "onselecttime :::::::",
                  item?.selected === undefined
                );
                return (
                  <Pressable
                    style={[
                      styles.timeBtn,
                      {
                        backgroundColor: item?.selected
                          ? CPColors.secondary
                          : CPColors.white,
                      },
                    ]}
                    onPress={() => onSelectTime(item, index)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        {
                          color: item?.selected
                            ? CPColors.white
                            : CPColors.secondary,
                        },
                      ]}
                    >
                      {item?.time + " min"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          {!selectedPreparetime && shouldVisible ? (
            <Text
              style={{
                fontSize: 14,
                color: CPColors.red,
                fontFamily: CPFonts.medium,
                marginVertical: 5,
              }}
            >
              {"Please select time"}
            </Text>
          ) : null}
        </View>
      </ScrollView>
      <CPThemeButton
        title={props.route?.params?.isCurrentUser ? "Save Changes" : "Next"}
        style={styles.nextBtn}
        isLoading={isLoading}
        onPress={preparingDetailsAction}
      />
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    paddingBottom: 20,
    marginTop: Platform.OS == "android" ? 30 : 0,
  },
  subView: {
    alignItems: "center",
    marginHorizontal: 40,
    marginVertical: 20,
  },
  subEditView: {
    alignItems: "center",
    marginTop: 40,
  },
  headingText: {
    fontFamily: CPFonts.semiBold,
    fontSize: 18,
    marginBottom: 10,
    color: CPColors.secondary,
  },
  bodyText: {
    fontFamily: CPFonts.regular,
    textAlign: "center",
    fontSize: 12,
    color: CPColors.secondary,
  },
  recipeImage: {
    marginVertical: 20,
  },
  timeBtnView: {
    flexDirection: "row",
    marginHorizontal: 30,
    marginVertical: 20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  timeBtn: {
    padding: 6,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: CPColors.secondaryLight,
    marginBottom: 20,
    marginLeft: 10,
  },
  timeText: {
    fontSize: 14,
    fontFamily: CPFonts.semiBold,
  },
  nextBtn: {
    margin: 20,
    width: widthPercentageToDP("100") - 40,
  },
});

export default PrepareDetailsContainer;