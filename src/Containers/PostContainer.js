import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Assets from "../Assets";
import CPAddIngredient from "../Components/CPAddIngredient";
import CPAddRecipeStepList from "../Components/CPAddRecipeStepList";
import CPBackButton from "../Components/CPBackButton";
import CPDropdown from "../Components/CPDropdown";
import CPTextInput from "../Components/CPTextInput";
import CPThemeButton from "../Components/CPThemeButton";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import BaseContainer from "./BaseContainer";
// import ImagePicker from 'react-native-image-crop-picker';
import CPPopupView from "../Components/CPPopupView";
import Snackbar from "react-native-snackbar";
import { getApi, postApi } from "../Utils/ServiceManager";
import {
  CUISINE_API,
  MEAL_API,
  POST_ADD_API,
  POST_EDIT_API,
  PREPARE_TIME_API,
  UPLOAD_VIDEO_API,
} from "../Utils/CPConstant";
import { useSelector } from "react-redux";
import { Modal } from "react-native";
import CPProgressLoader from "../Components/CPProgressLoader";
import CPProfileImage from "../Components/CPProfileImage";
import { widthPercentageToDP } from "react-native-responsive-screen";
import ValidationHelper from "../Utils/ValidationHelper";
import CPUpgradePlan from "../Components/CPUpgradePlan";
import { showDialogue } from "../Utils/CPAlert";

// var coverImageDetail = null
// var recipeStep = [{}]
// var ingredientArray = [{}]
const PostContainer = (props) => {
  const userSelector = useSelector((state) => state);
  const [coverImageDetail, setCoverImageDetail] = useState(
    props.route.params?.image ?? null
  );
  const [ingredientArray, setIngredien] = useState(
    props.route.params?.ingredients ?? [{}]
  );
  const [recipeStep, setRecipeStep] = useState(
    props.route.params?.recipeStep ?? [{}]
  );
  console.log(recipeStep, "recipeSteprecipeSteprecipeStep");
  const [title, setTitle] = useState(props.route.params?.title ?? "");
  const [description, setDescription] = useState(
    props.route.params?.description ?? ""
  );
  const [cuisineArrays, setCuisineArrays] = useState([]);
  const [preparetime, setPreparetime] = useState([]);
  const [mealArrays, setMealArray] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState(
    props.route.params?.cuisineId ?? []
  );
  const [selectedMeal, setSelectedMeal] = useState(
    props.route.params?.mealId ?? []
  );
  const [selectedPreparetime, setSelectedPreparetime] = useState(
    props.route.params?.preparationTime ?? ""
  );
  const [isDisable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldVisible, setShouldVisible] = useState(false);

  const validationHelper = new ValidationHelper();
  const plan = userSelector?.userOperation?.detail?.plan?.plan_type;
  const post = userSelector?.userOperation?.post?.post.length;
  console.log(userSelector?.userOperation?.detail?.plan?.plan_type, 'plan :<<<<<<<<<');
  console.log(userSelector?.userOperation?.post?.post?.length, 'ddddd');
  useEffect(() => {
    if (post >= 3 && plan == "Free Plan") {
      showDialogue(
        "You need to subscribed to premium plan for this feature",
        [{ text: "" }],
        "Cookpals",
        navigateToBack
      );
    }
    prepateTimeAPIAction();
    getCuisine();
    mealAPIAction();
  }, []);

  const prepateTimeAPIAction = () => {
    setIsLoading(true);
    getApi(
      PREPARE_TIME_API,
      onSuccessPrepareTime,
      onFailurePrepareTime,
      userSelector.userOperation
    );
  };
  console.log(recipeStep, "recipeSteprecipeStep");

  const onSuccessPrepareTime = (response) => {
    console.log("Prepare Success ::::::: ", response);
    if (response.success) {
      setPreparetime(response.data);
    } else {
      setPreparetime([]);
    }
    setIsLoading(false);
  };

  const onFailurePrepareTime = (error) => {
    console.log("Prepare Success ::::::: ", error);
    setPreparetime([]);
    setIsLoading(false);
  };

  const getCuisine = () => {
    getApi(
      CUISINE_API,
      onSuccessCuisine,
      onFailureCuisine,
      userSelector.userOperation
    );
  };

  const onSuccessCuisine = (response) => {
    console.log("SUCCESS COUNTRY :::::: ", response);
    if (response.success) {
      setCuisineArrays(response.data);
    } else {
      setCuisineArrays([]);
    }
  };

  const onFailureCuisine = (error) => {
    console.log("Failure COUNTRY :::::: ", error);
    setCuisineArrays([]);
  };

  const mealAPIAction = () => {
    getApi(
      MEAL_API,
      onSuccessMealPlan,
      onFailureMealPlan,
      userSelector.userOperation
    );
  };

  const onSuccessMealPlan = (response) => {
    if (response.success) {
      setMealArray(response.data);
    } else {
      setMealArray([]);
    }
  };

  const onFailureMealPlan = (error) => {
    setMealArray([]);
  };

  const selectPreparationTime = (id) => {
    setSelectedPreparetime(id);
  };

  const onAddRecipeStep = (data) => {
    setRecipeStep(data);
  };

  const onChangeRecipeVideo = (data, index) => {
    console.log(data, "datadatadatadata");
    let recipeData = [...recipeStep];
    const strURIToUse =
      Platform.OS === "ios"
        ? data?.stepvideo?.replace("file:/", "")
        : data?.stepvideo;
    recipeData[index].stepvideo = strURIToUse;
    {
      props.route.params?.isEdit &&
        recipeData.map((x, i) => {
          if (i !== index) {
            x.stepvideo =
              recipeData[i].stepvideo.split("/")[
              recipeData[i].stepvideo.split("/").length - 1
              ];
          }
        });
    }
    setRecipeStep(recipeData);
    setShouldVisible(false);
  };
  console.log(" JJJ ::::::: ", recipeStep);

  const onChangeRecipeDescription = (data, index) => {
    // setRecipeStep(data)
    console.log("data :: ", data, index, recipeStep);
    let recipeVideos = [...recipeStep];
    recipeVideos[index].steps_description = data;

    setRecipeStep(recipeVideos);
    // recipeStep = data
    setShouldVisible(false);
  };

  const onChangeIngredient = (data) => {
    console.log("DATA :::::: ", data);
    // ingredientArray = data
    setIngredien(data);
    setShouldVisible(false);
  };

  const onChangeCuisine = (value) => {
    setShouldVisible(false);
    setSelectedCuisine(value);
  };

  const onChangeMeal = (value) => {
    setShouldVisible(false);
    setSelectedMeal(value);
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };

  const postValidation = () => {
    setIsDisable(true);
    if (isDisable) {
      Snackbar.show({
        text: "Wait for upload a video",
        duration: Snackbar.LENGTH_LONG,
      });
    } else {
      setShouldVisible(true);
      console.log(
        "ssss",
        recipeStep.filter((item) => !item.stepvideo || !item.steps_description)
          .length,
        recipeStep
      );
      if (
        title.trim() == "" ||
        description.trim() == "" ||
        recipeStep.filter((item) => !item.stepvideo || !item.steps_description)
          .length !== 0 ||
        !selectedCuisine ||
        !selectedMeal ||
        !selectedPreparetime ||
        ingredientArray.filter((item) => !item.quantity || !item.item_name)
          .length !== 0 ||
        !coverImageDetail
      ) {
        console.log("RETURN");
        return;
      } else {
        addRecipePost();
      }
    }
  };

  const addRecipePost = () => {
    let param = {
      type: 1,
      title: title,
      description: description.trim(),
      cuisine_id: selectedCuisine.toString(),
      meal_id: selectedMeal.toString(),
      preparation_time_id: selectedPreparetime,
      ingrediant: JSON.stringify(ingredientArray),
      // isEdit: props.route.params?.isEdit ? true : false,
      receipe_step: JSON.stringify(recipeStep),
    };
    if (coverImageDetail?.uri) {
      param["image"] = coverImageDetail;
    }
    console.log(param, "::::params in json formaaaat");
    setIsLoading(true);
    postApi(
      props.route.params?.isEdit
        ? POST_EDIT_API + props.route.params?.id
        : POST_ADD_API,
      param,
      onSuccessAddPost,
      onFailureAddPost,
      userSelector.userOperation
    );
  };

  const onSuccessAddPost = (response) => {
    console.log("SUCCESS ADD ::::::: ", response);
    setIsDisable(false);
    props.navigation.goBack();
    setIsLoading(false);
  };

  const onFailureAddPost = (error) => {
    console.log(" FAILURE ADD ::::::: ", error);
    setIsDisable(false);
    Snackbar.show({
      text: error?.message,
      duration: Snackbar.LENGTH_LONG,
    });
    setIsLoading(false);
  };

  return (
    <View style={styles.main} pointerEvents={isLoading ? "none" : "auto"}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ paddingBottom: 40 }}
        bounces={false}
      >
        {isLoading ? <CPProgressLoader /> : null}
        <CPBackButton style={styles.backBtn} onBackPress={navigateToBack} />

        <CPProfileImage
          isAdmin={true}
          imagestyle={{ width: "100%", height: widthPercentageToDP("70%") }}
          placeholder={Assets.post_cover_Image}
          onSelectImageData={setCoverImageDetail}
          defaultImage={props.route.params?.image}
        />
        {shouldVisible && !coverImageDetail ? (
          <Text
            style={{
              backgroundColor: 'lightgreen',
              color: CPColors.red,
              fontFamily: CPFonts.regular,
              fontSize: 14,
              textAlign: "right",
            }}
          >
            {"Please select cover image"}
          </Text>
        ) : null}
        <View style={styles.subView}>
          <CPTextInput
            maxLength={70}
            containerStyle={{
              paddingHorizontal: 5,
              backgroundColor: CPColors.transparent,
            }}
            onChangeText={setTitle}
            value={title}
            placeholder={"Title..."}
            error={
              shouldVisible &&
              validationHelper
                .isEmptyValidation(title, "Please enter title")
                .trim()
            }
          />

          <CPTextInput
            containerStyle={{
              paddingHorizontal: 5,
              backgroundColor: CPColors.transparent,
            }}
            returnKeyType='next'
            onChangeText={setDescription}
            value={description.replace(/\s/g, '')}
            maxLength={800}
            multiline
            placeholder={"Description..."}
            error={
              shouldVisible &&
              validationHelper
                .isEmptyValidation(description, "Please enter description")
                .trim()
            }
          />
          <CPDropdown
            style={{ paddingLeft: 18, paddingVertical: 15 }}
            data={cuisineArrays}
            onChangeValue={onChangeCuisine}
            selectedvalue={selectedCuisine}
            containerStyle={{ marginTop: -15 }}
            placeholder={"Type of Cuisine"}
            error={
              shouldVisible && selectedCuisine.length == 0
                ? "Please select cuisine"
                : null
            }
          />
          <CPDropdown
            style={{ paddingLeft: 18, paddingVertical: 15 }}
            onChangeValue={onChangeMeal}
            data={mealArrays}
            selectedvalue={selectedMeal}
            containerStyle={{ marginTop: -15 }}
            placeholder={"Type of Meal"}
            error={
              shouldVisible && selectedMeal.length == 0
                ? "Please select meal"
                : null
            }
          />
          <View style={{ paddingTop: 20, }}>
            <Text style={styles.cookTime}>
              {"Cooking Time "}{" "}
              <Text style={styles.inMinutes}>{"(in Minutes)"}</Text>
            </Text>
            <View style={styles.timeView}>
              {preparetime.map((item, index) => {
                return (
                  <Pressable
                    key={index}
                    style={styles.timePressable}
                    onPress={() => selectPreparationTime(item.id)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        {
                          color:
                            item.id == selectedPreparetime
                              ? CPColors.primary
                              : CPColors.borderColor,
                        },
                      ]}
                    >
                      {item.time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {shouldVisible && !selectedPreparetime ? (
              <Text
                style={{
                  fontSize: 12,
                  color: CPColors.red,
                  fontFamily: CPFonts.medium,
                  marginBottom: 10,
                  marginLeft: 5
                }}
              >
                {"Please select time"}
              </Text>
            ) : null}
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.cookTime, { marginBottom: 10 }]}>
              {"Ingredients"}
              <Text style={styles.inMinutes}> {"(Optional)"}</Text>
            </Text>

            <CPAddIngredient
              data={ingredientArray}
              onChangeIngredient={onChangeIngredient}
              isShouldVisible={shouldVisible}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.cookTime, { marginBottom: 10 }]}>
              {"Method"}
            </Text>

            <CPAddRecipeStepList
              data={props.route.params?.recipeStep ?? [{}]}
              setRecipeVideo={onChangeRecipeVideo}
              setRecipeDescription={onChangeRecipeDescription}
              setAddStep={onAddRecipeStep}
              removeRecipeVideo={setRecipeStep}
              isShouldVisible={shouldVisible}
              setDisablity={setIsDisable}
              navigation={props}
            />
          </View>

          <CPThemeButton
            style={{ margin: 20 }}
            disabled={isDisable}
            title={"Post"}
            isLoading={isLoading}
            onPress={postValidation}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: CPColors.white,
    // paddingBottom: 40
  },
  backBtn: {
    position: "absolute",
    left: Platform.OS == "android" ? 15 : 10,
    top: 50,
    zIndex: 1,
  },
  subView: {
    flex: 1,
    paddingHorizontal: 24,
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
  timeView: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  timePressable: { marginHorizontal: 10 },
  timeText: {
    padding: 5,
    marginBottom: 10,
    fontSize: 14,
    fontFamily: CPFonts.medium,


  },
  addIngredients: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
  },
});

export default PostContainer;
