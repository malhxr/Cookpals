import React, { useCallback, useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Assets from "../Assets";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import BaseContainer from "./BaseContainer";
import { hasNotch } from "react-native-device-info";
import CPPopupView from "../Components/CPPopupView";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Icon } from "react-native-elements";
import CPSegmentComponent from "../Components/CPSegmentComponent";
import CPIngradiantsList from "../Components/CPIngradiantsList";
import CPRecipeStepList from "../Components/CPRecipeStepList";
import CPRecipeVideo from "../Components/CPRecipeVideo";
import { getApi, postApi } from "../Utils/ServiceManager";
import {
  POST_DELETE,
  POST_DETAIL,
  PREPARE_TIME_API,
  MY_ACCOUNT_API,
  FAVOURITE_POST_API,
  USER_DETAILS,
  BOOK_MARK_API,
  RATING_POST,
} from "../Utils/CPConstant";
import { useSelector } from "react-redux";
import Snackbar from "react-native-snackbar";
import CPUpgradePlan from "../Components/CPUpgradePlan";
import { useFocusEffect } from "@react-navigation/native";
import VideoPlayers from "react-native-video-controls";
import StarRatingsComponent from "../Components/StarRatingsComponent";
import CPLoader from "../Components/CPLoader";

const RecipeDetailContainer = (props) => {
  const [isVisible, setVisible] = useState(false);
  const [isUpgradePlanModal, setUpgradePlanModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recipeDetails, setRecipeDetail] = useState();
  const userSelector = useSelector((state) => state);
  const [FunnyvideoDetails, setFunnyVideoDetails] = useState(
    props?.route?.params?.video ?? null
  );
  const [FunnyVideoDescription, setFunnyVideoDescription] = useState("");
  const [FunnyVideoId, setFunnyVideoId] = useState(
    props?.route?.params?.recipeId ?? ""
  );
  const [preparetime, setPreparetime] = useState([]);
  const [preparetimeid, setPreparetimeid] = useState(0);
  const segmentArray = ["Ingredients", "Preparation", "Steps"];
  const [ingradianArray, setIngradianArray] = useState();
  const [recipeStepArray, setrecipeStepArray] = useState();
  const [userName, setUserName] = useState();
  const [clickUserName, setClickUserName] = useState();
  const [userImage, setUserImage] = useState();
  const [favourite, setFavourite] = useState();
  const [bookmark, setBookmark] = useState();
  const [postId, setPostId] = useState();
  const [ratingsArray, setRatingsArray] = useState();
  const [refreshing, setRefreshing] = useState(true);

  // const onChangeRecipeVideo = (data, index) => {

  //   let recipeVideos = [...recipeStepArray]
  //   recipeVideos[index].stepvideo = data
  //   setShouldVisible(false)
  // }

  // console.log(props?.route?.params?.video, ':::: video from params');
  // console.log(userImage, ':::: user image ');
  // console.log(userName, ':::: user name ');

  const modalTitle = {
    title: "Post Deleted",
    description: "Your Post has been deleted Successfully.",
    actionStr: "Okay",
    image: Assets.delete_post,
  };

  useEffect(() => {
    prepateTimeAPIAction();
    userProfileDetail();
    reciepeDetail(props?.route?.params?.recipeId);
    reciepeClickDetail(props?.route?.params?.userId);
    console.log("USERID FOR RECIPE:::", postId);
  }, []);

  const onChangeFavourite = () => {
    console.log(postId, "POSTID");
    makeFavouriteAction(favourite === 1 ? 0 : 1, postId);
  };

  const makeFavouriteAction = (isFav, id) => {
    const params = {
      post_id: id,
      status: isFav,
    };

    postApi(
      FAVOURITE_POST_API,
      params,
      onSuccessFavourite,
      onFailureFavourite,
      userSelector.userOperation
    );
  };

  const onSuccessFavourite = (response) => {
    setRefreshing(false);
    setFavourite(response.data.status);
    console.log("SUCCESS FAVOURITE :::::: ", response);
  };

  const onFailureFavourite = (error) => {
    setRefreshing(false);
    console.log("FAILURE FAVOURITE :::::: ", error);
  };

  const onChangeBookmark = () => {
    makeBookMarkAction(bookmark === 1 ? 0 : 1, postId);
  };

  const makeBookMarkAction = (isFav, id) => {
    const params = {
      post_id: id,
      status: isFav,
    };

    postApi(
      BOOK_MARK_API,
      params,
      onSuccessBookmark,
      onFailureBookmark,
      userSelector.userOperation
    );
  };

  const onSuccessBookmark = (response) => {
    setRefreshing(false);
    if (response.success) setBookmark(response.data.status);
    console.log("SUCCESS BOOKMARK :::::: ", response);
  };

  const onFailureBookmark = (error) => {
    setRefreshing(false);
    console.log("FAILURE BOOKMARK :::::: ", error);
  };

  const userProfileDetail = () => {
    setIsLoading(true);
    setClickUserName("lolol"),
      getApi(
        MY_ACCOUNT_API,
        onSuccessMyAccount,
        onFailureMyAccount,
        userSelector.userOperation
      );
  };

  const onSuccessMyAccount = (response) => {
    setRefreshing(false);
    console.log(" SUCCESS MY ACCOUNT ::::::", response);
    if (response.success) {
      if (props.route?.params?.acc_user_Profile) {
        setUserName(response.data?.my_profile?.name);
        setUserImage(response.data?.my_profile?.profile);
      }
    }
    setIsLoading(false);
  };

  const onFailureMyAccount = (error) => {
    setRefreshing(false);
    console.log(" FAILURE MY ACCOUNT ::::::", error);
    setIsLoading(false);
  };

  const reciepeDetail = (id) => {
    setIsLoading(true);
    getApi(
      POST_DETAIL + id,
      onSuccessRecipeDetail,
      onFailureRecipeDetail,
      userSelector.userOperation
    );
  };

  // const onChangeStepVideo = () => {
  //   let recipeData = [...recipeStepArray]
  //   const strURIToUse = Platform.OS === 'ios' ? response.data.post?.post_steps.uri.replace('file:/', '') : response.data.post?.post_steps.uri
  //   recipeData[index].stepvideo = strURIToUse
  //   setrecipeStepArray(recipeData)
  // }
  const onSuccessRecipeDetail = (response) => {
    setRefreshing(false);
    console.log("SUCCESS RECIPE DETAIL ::::: ", response.data.post);
    console.log("Step Video :::: ", response.data.post?.post_steps);
    setIsLoading(false);
    if (response.success) {
      setrecipeStepArray(response.data.post?.post_steps);
      setPostId(response.data.post.id);
      setFavourite(response.data.post.postlike);
      setBookmark(response.data.post.postsave);
      setRecipeDetail(response.data.post);
      setIngradianArray(response.data.post?.post_ingredients);
      setPreparetimeid(response.data.post?.preparation_time_id);
      setRatingsArray(response.data.post?.post_rating);
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const onFailureRecipeDetail = (error) => {
    setRefreshing(false);
    console.log("FAILURE RECIPE DETAIL ::::: ", error);
    setIsLoading(false);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const reciepeClickDetail = (id) => {
    setIsLoading(false);
    getApi(
      USER_DETAILS + id,
      onSuccessRecipeClickDetail,
      onFailureRecipeClickDetail,
      userSelector.userOperation
    );
  };

  const onSuccessRecipeClickDetail = (response) => {
    setRefreshing(false);
    console.log("SUCCESS RECIPE CLICK DETAILll", response?.data);
    setIsLoading(false);
    if (response.success) {
      setUserName(response.data?.my_profile?.name);
      setUserImage(response.data?.my_profile?.profile);
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const onFailureRecipeClickDetail = (error) => {
    setRefreshing(false);
    console.log("FAILURE RECIPE DETAIL ::::: ", error);
    setIsLoading(false);
    Snackbar.show({
      text: error.message,
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
    setRefreshing(false);
    if (response.success) {
      setPreparetime(response.data);
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const onFailurePrepareTime = (error) => {
    setRefreshing(false);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const onBackPress = () => {
    props.navigation.goBack();
  };

  const onDeleteModalOpen = () => {
    setUpgradePlanModal(true);
  };

  const onDeletePostHandler = () => {
    setRefreshing(true);
    setIsLoading(true);
    getApi(
      POST_DELETE + recipeDetails.id,
      onSuccessDeletePost,
      onFailureDeletePost,
      userSelector.userOperation
    );
  };

  const onSuccessDeletePost = (response) => {
    setRefreshing(false);
    if (response.success) {
      setUpgradePlanModal(false);
      onBackPress();
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
    setIsLoading(false);
    console.log(" DELETE SUCCES ::::::: ", response);
  };

  const onFailureDeletePost = (error) => {
    setRefreshing(false);
    console.log(" DELETE Failure ::::::: ", error);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
    setIsLoading(false);
  };

  const onEditPostHandler = () => {
    if (props.route.params?.isFunnyVideo) {
      props.navigation.navigate("addfunnypost", {
        isEdit: true,
        video: FunnyvideoDetails,
        description: recipeDetails?.description,
        id: FunnyVideoId,
      });
    } else {
      props.navigation.navigate("editPost", {
        isEdit: true,
        image: recipeDetails?.image,
        title: recipeDetails?.title,
        description: recipeDetails?.description,
        cuisineId: [recipeDetails?.cuisine_id],
        mealId: [recipeDetails?.meal_id],
        preparationTime: recipeDetails?.preparation_time_id,
        ingredients: recipeDetails?.post_ingredients,
        recipeStep: recipeDetails?.post_steps,
        id: recipeDetails?.id,
      });
    }
  };

  const onEditFunnyVideoHandler = () => {};
  // const FunnyVideoPlayer = () => {

  //   return (

  //     <VideoPlayers
  //       source={FunnyvideoDetails}
  //       paused={false}
  //       resizeMode={'contain'}
  //       controlTimeout={2000}
  //       hideControlsOnStart
  //       backToList={() => { }}
  //       style={[styles.imageStyle, { height: "100%" }]}
  //     />
  //   );

  // }

  // console.log(FunnyvideoDetails, 'video funny');

  const onDeletePostRender = () => {
    return (
      <CPPopupView isVisible={isUpgradePlanModal}>
        <CPUpgradePlan
          item={modalTitle}
          isLoading={isLoading}
          onPress={() => {
            setUpgradePlanModal(false);
          }}
          onProcessAction={onDeletePostHandler}
        />
      </CPPopupView>
    );
  };

  const detailModalRender = () => {
    return (
      <CPPopupView
        isVisible={isVisible}
        onRequestClose={() => {
          setVisible(false);
        }}
        isBlurViewDisable
        animationType={"slide"}
      >
        <LinearGradient
          colors={[
            CPColors.transparent,
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.6)",
            "rgba(0,0,0,0.8)",
            "rgba(0,0,0,0.8)",
            "rgba(0,0,0,1)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.gradient, props.style]}
        >
          <View style={styles.flexStyle}>
            <Pressable
              style={styles.flexStyle}
              onPress={() => {
                setVisible(false);
              }}
            />
            <View style={styles.descriptionView}>
              <Text style={styles.descriptionText}>{"Description"}</Text>
              <Text style={styles.bodyText}>{recipeDetails?.description}</Text>
            </View>
            <Pressable
              style={styles.bottomSheetImg}
              onPress={() => {
                setVisible(false);
              }}
            >
              <Image source={Assets.bottomSheetIcon} />
            </Pressable>
            <View>
              <Image
                source={Assets.recipedetailimage}
                style={{ width: "100%" }}
                resizeMode={"stretch"}
              />
              <View style={styles.popUpDetailView}>
                <Pressable
                  onPress={onChangeFavourite}
                  style={{
                    position: "absolute",
                    alignItems: "flex-end",
                    right: 50,
                    top: -20,
                    backgroundColor: CPColors.white,
                    padding: 7,
                    borderRadius: 20,
                  }}
                >
                  <Icon
                    size={26}
                    name={favourite === 1 ? "favorite" : "favorite-border"}
                    color={CPColors.red}
                  />
                </Pressable>

                <View style={styles.titleView}>
                  <Text style={styles.title}>{recipeDetails?.title}</Text>

                  <StarRatingsComponent
                    postId={postId}
                    postUserId={recipeDetails?.user_id}
                    ratings={ratingsArray}
                  />
                </View>

                <View style={styles.userView}>
                  <Image source={{ uri: userImage }} style={styles.userImage} />
                  <View style={styles.recipeByView}>
                    <Text style={styles.recipeByText}>{"Recipe By"}</Text>
                    <Text style={styles.userText}>{userName}</Text>
                  </View>

                  <View style={styles.timeView}>
                    <Icon
                      type={"material-icons"}
                      name={"schedule"}
                      size={20}
                      color={CPColors.lightwhite}
                    />
                    {preparetime.map((item, index) => {
                      return (
                        <Text style={styles.timeText}>
                          {preparetimeid === item?.id
                            ? item?.time + " min"
                            : ""}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.segmentView}>
              <CPSegmentComponent
                // style={styles.segmentcmpStyle}
                segmentArray={segmentArray}
                selectedIndex={selectedIndex}
                onChangeHandler={setSelectedIndex}
              />
              {selectedIndex == 0 ? (
                <CPIngradiantsList
                  data={ingradianArray}
                  title={"Ingredients"}
                />
              ) : selectedIndex == 1 ? (
                <CPRecipeVideo data={recipeStepArray} title={"Videos"} />
              ) : selectedIndex == 2 ? (
                <CPRecipeStepList
                  data={recipeStepArray}
                  title={"Cooking Process"}
                />
              ) : null}
            </View>
          </View>
        </LinearGradient>
      </CPPopupView>
    );
  };

  console.log("Video DETAIl s :::: ", ingradianArray);
  return refreshing ? (
    <CPLoader />
  ) : (
    <BaseContainer
      isTransparentEnable
      isBottomMarginEnable
      safeAreaBottomDisable
      isBottomAreaPadding
      isLoading={isLoading}
      rightComponent={
        <>
          {props.route?.params?.acc_user_Profile ? (
            <View
              style={{ flexDirection: "row", padding: 8, marginHorizontal: 20 }}
            >
              <Pressable onPress={onDeleteModalOpen}>
                <Image source={Assets.delete_bg} />
              </Pressable>
              <Pressable onPress={onEditPostHandler}>
                <Image style={{ marginLeft: 10 }} source={Assets.edit_bg} />
              </Pressable>
            </View>
          ) : FunnyvideoDetails !== null ? null : (
            <Pressable style={styles.rightComponent} onPress={onChangeBookmark}>
              <Icon
                name={bookmark === 1 ? "bookmark" : "bookmark-border"}
                size={15}
              />
            </Pressable>
          )}
        </>
      }
      backImageStyle={{ tintColor: CPColors.white }}
      onBackPress={onBackPress}
    >
      {onDeletePostRender()}
      <ImageBackground
        style={styles.imgageBgStyle}
        source={{
          uri: recipeDetails?.image,
        }}
      >
        {detailModalRender()}
        <LinearGradient
          colors={[
            CPColors.transparent,
            CPColors.transparent,
            CPColors.transparent,
            "rgba(0,0,0,0.5)",
            "rgba(0,0,0,0.9)",
            "rgba(0,0,0,0.9)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientView}
        >
          {FunnyvideoDetails !== null ? (
            <View style={{ flex: 1 }}>
              {/* <CPVideoPlayerComponent
                source={props?.route?.params?.video}
                style={{ height: "100%", width: "100%", alignSelf: 'center' }}
              // imageStyle={{ marginVertical: 50, alignSelf: 'center', borderWidth: 1 }}
              /> */}
              <VideoPlayers
                source={{
                  uri: props?.route?.params?.video,
                }}
                paused={false}
                resizeMode={"contain"}
                controlTimeout={2000}
                hideControlsOnStart
                backToList={() => {}}
                style={{
                  height: heightPercentageToDP("60%"),
                  width: widthPercentageToDP("100%"),
                  // zIndex: 10,
                }}
              />
            </View>
          ) : null}
          <View
            style={[
              styles.main,
              {
                position: FunnyvideoDetails !== null ? "absolute" : "relative",
                backgroundColor:
                  FunnyvideoDetails !== null ? "transparent" : null,
              },
            ]}
          >
            <Text style={styles.recipeName}>
              {props.route?.params?.fromClick ?? recipeDetails?.title}
            </Text>
            <Text style={styles.bodyTextMain}>
              {/* {!props?.route?.params?.fromClick ?
                recipeDetails?.description
              : (FunnyVideoDescription!=="") ?
                 FunnyVideoDescription
              :""} */}
              {recipeDetails?.description}
            </Text>
          </View>

          {/* {FunnyvideoDetails !== null ? (
            <>
              <View style={{flex: 1, backgroundColor: 'red'}}>
                <Pressable
                  style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    zIndex: 99999,
                    bottom: heightPercentageToDP('50%'),
                  }}>
                  <Image source={Assets.play_icon} />
                </Pressable>
              </View>
              <VideoPlayers
                source={{
                  uri: props?.route?.params?.video,
                }}
                paused={false}
                resizeMode={'contain'}
                controlTimeout={2000}
                hideControlsOnStart
                backToList={() => {}}
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  height: '100%',
                  width: '100%',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                }}>
                <CPVideoPlayerComponent
                  source={props?.route?.params?.video}
                  playerStyle={{
                    position: 'absolute',
                    alignSelf: 'center',
                    height: '100%',
                    width: '100%',
                  }}
                  imageStyle={{
                    marginVertical: 50,
                    alignSelf: 'center',
                    borderWidth: 1,
                  }}
                />
              </View>
            </>
          ) : null} */}
          {FunnyvideoDetails ? null : (
            <Pressable
              style={styles.openPopUp}
              onPress={() => {
                setVisible(true);
              }}
            >
              <Image source={Assets.bottomSheetIcon} />
            </Pressable>
          )}
        </LinearGradient>
      </ImageBackground>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  descriptionView: {
    marginHorizontal: 24,
  },
  descriptionText: {
    color: CPColors.white,
    fontSize: 16,
    fontFamily: CPFonts.semiBold,
    marginBottom: 15,
  },
  bodyText: {
    color: CPColors.lightwhite,
    fontSize: 14,
    fontFamily: CPFonts.regular,
    marginBottom: 15,
  },
  viewMore: {
    color: CPColors.white,
    textDecorationLine: "underline",
  },
  bottomSheetImg: {
    alignSelf: "center",
    marginBottom: -10,
  },
  popUpDetailView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    paddingHorizontal: 24,
  },
  favImg: {
    alignSelf: "flex-end",
    marginRight: 26,
    marginTop: -20,
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    flex: 1,
    fontFamily: CPFonts.bold,
    fontSize: 24,
    color: CPColors.white,
  },
  userView: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  recipeByView: {
    flex: 1,
    marginHorizontal: 10,
  },
  recipeByText: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: CPFonts.regular,
    color: CPColors.lightwhite,
  },
  userText: {
    fontSize: 14,
    fontFamily: CPFonts.medium,
    color: CPColors.white,
  },
  timeView: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    margin: 0.5,
    color: CPColors.lightwhite,
    fontSize: 14,
    fontFamily: CPFonts.regular,
  },
  segmentView: {
    height: heightPercentageToDP("50%"),
    paddingHorizontal: 24,
    backgroundColor: CPColors.white,
  },
  rightComponent: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    marginHorizontal: 24,
  },
  gradientView: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  main: {
    paddingHorizontal: 20,
  },
  recipeName: {
    color: CPColors.white,
    fontFamily: CPFonts.semiBold,
    fontSize: 16,
    marginBottom: 20,
  },
  bodyTextMain: {
    color: CPColors.lightwhite,
    fontFamily: CPFonts.regular,
    marginBottom: 20,
    fontSize: 12,
  },
  openPopUp: {
    alignSelf: "center",

    marginBottom: hasNotch() ? 30 : 10,
  },
  segmentcmpStyle: { marginTop: 20 },
  imageStyle: { width: 12, height: 12 },
  imgageBgStyle: { width: "100%", flex: 1, marginTop: -20 },
  flexStyle: { flex: 1 },
});

export default RecipeDetailContainer;
