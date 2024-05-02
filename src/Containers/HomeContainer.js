import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import Assets from "../Assets";
import CPColors from "../Utils/CPColors";
import BaseContainer from "./BaseContainer";
import CPFonts from "../Utils/CPFonts";
import CPRecipeSlider from "../Components/CPRecipeSlider";
import { useDispatch, useSelector } from "react-redux";
import { getApi, postApi } from "../Utils/ServiceManager";
import {
  BOOK_MARK_API,
  FAVOURITE_POST_API,
  HOME_API,
  MY_ACCOUNT_API,
  NOTIFICATION,
} from "../Utils/CPConstant";
import CPHomePostComponent from "../Components/CPHomePostComponent";
import CPLoader from "../Components/CPLoader";
import { saveNotificationInRedux } from "../redux/Actions/User";
import { savePostInRedux } from "../redux/Actions/User";
import { showDialogue } from "../Utils/CPAlert";
import Swiper from "react-native-deck-swiper";

const HomeContainer = (props) => {
  const [selectSider, setSelectedSlider] = useState(0);
  const [recipePostArray, setRecipePostArray] = useState([]);
  const [likeArray, setLikeArray] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(true);
  const userSelector = useSelector((state) => state);
  const [isFavourite, setFavourite] = useState();
  const [swipedAllCards, setSwipedAllCards] = useState(false);
  const plan = userSelector?.userOperation?.detail?.plan?.plan_type;
  const dispatch = useDispatch();
  // const [isNewNotification, setisNewNotification] = useState(
  //   userSelector?.userOperation?.notification?.some((x) => x.read_at === 1)
  // );
  let isNewNotification = userSelector?.userOperation?.notification?.some(
    (x) => x.read_at === 1
  );

  const handleOnSwipedRight = (cardIndex) => {
    const like = likeArray[cardIndex].postlike == 1 ? 1 : 0;
    setFavourite(like === 1 ? 0 : 1);
    makeFavouriteAction(like === 1 ? 0 : 1, likeArray[cardIndex].id);
  };

  useEffect(() => {
    getApi(
      NOTIFICATION,
      (data) => {
        dispatch(saveNotificationInRedux(data?.data?.data));
        // setisNewNotification(data?.data?.data.some((x) => x.read_at === 1));
      },
      (err) => console.log(err, "notificationgetapi"),
      userSelector.userOperation
    );

    dispatch(savePostInRedux({}));
    userProfileDetail();

    props?.route?.params?.fromClick === true
      ? props.navigation.navigate("anotherUser", {
        isAnotherUser: true,
        fromClick: true,
        id: props?.route?.params?.user_id,
      })
      : homeRecipeData();
  }, [
    isNewNotification,
    // userSelector?.userOperation?.notification,
  ]);

  const forRefresh = () => {
    props?.route?.params?.fromClick === true
      ? props.navigation.navigate("anotherUser", {
        isAnotherUser: true,
        fromClick: true,
        id: props?.route?.params?.user_id,
      })
      : homeRecipeData();
  };

  const userProfileDetail = () => {
    getApi(
      MY_ACCOUNT_API,
      onSuccessMyAccount,
      onFailureMyAccount,
      userSelector.userOperation
    );
  };

  const onSuccessMyAccount = (response) => {
    console.log("SUCCESS MY ACCOUNT ::::::", response.data);
    if (response.success) {
      if (response?.data) {
        dispatch(savePostInRedux(response.data));
      }
    }
  };

  const onFailureMyAccount = (error) => {
    console.log(" FAILURE MY ACCOUNT ::::::", error);
  };

  const homeRecipeData = () => {
    getApi(
      HOME_API,
      onSuccessHomeAPI,
      onFailureHomeAPI,
      userSelector.userOperation
    );
  };

  const onSuccessHomeAPI = (response) => {
    setRefreshing(false);
    if (response.success) {
      setRecipePostArray(response.data);
      setLikeArray(response.data);
      // console.log("receipe-----", response.data);
    } else {
      setRecipePostArray([]);
    }
  };

  const onFailureHomeAPI = (error) => {
    setRefreshing(false);
    console.log(error);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      homeRecipeData();
    });
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
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
    homeRecipeData();
  };

  const onSuccessFavourite = (response) => {
    setRefreshing(false);
    setFavourite(isFavourite === 1 ? 0 : 1);
    console.log("SUCCESS FAVOURITE :::::: ", response);
  };

  const onFailureFavourite = (error) => {
    setRefreshing(false);
    console.log("FAILURE FAVOURITE :::::: ", error);
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
    homeRecipeData();
  };

  const onSuccessBookmark = (response) => {
    setRefreshing(false);
    // console.log("SUCCESS BOOKMARK :::::: ", response);
  };

  const onFailureBookmark = (error) => {
    setRefreshing(false);
    console.log("FAILURE BOOKMARK :::::: ", error);
  };

  const onSwipedAllCards = () => {
    setSwipedAllCards(true);
  };

  return (
    <BaseContainer
      safeAreaBottomDisable
      isBottomAreaPadding
      leftComponet={
        <Image
          style={styles.leftImageStyle}
          source={Assets.logo}
          resizeMode="cover"
        />
      }
      titleComponent={<Text style={styles.headerTitle}>cooking up love</Text>}
      rightComponent={
        <View style={styles.rightComponent}>
          <Pressable
            style={styles.rightPress}
            onPress={() => {
              props.navigation.navigate("notification");
            }}
          >
            {/* <NotificationSvg height={24} width={24} /> */}
            {isNewNotification && (
              <View
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 20,
                  backgroundColor: "#F13991",
                  position: "absolute",
                  right: -3,
                  top: -7,
                }}
              />
            )}
            <Image
              style={styles.notiImage}
              source={Assets.notificationInactive}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable
            // style={{ marginRight: 10 }}
            onPress={() => {
              plan != "Free Plan"
                ? props.navigation.navigate("chatlist")
                : showDialogue(
                  "You need to subscribed to premium plan for this feature",
                  [{ text: "" }],
                  "Cookpals"
                );
            }}
          >
            <Image
              style={styles.chatImage}
              source={Assets.Chatimage}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      }
    >
      {refreshing ? (
        <CPLoader />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.flexView}
        >
          {recipePostArray.length == 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../Assets/images/noResultFound.png")}
                resizeMode="contain"
                style={{ maxHeight: "40%", bottom: "08%" }}
              />
              <Text
                style={{
                  fontSize: 16,
                  position: "absolute",
                  top: "63%",
                  // marginBottom:50,
                  fontWeight: "bold",
                  color: CPColors.secondary,
                }}
              >
                No Data Found
              </Text>
            </View>
          ) : (
            <Swiper
              ref={(swiper) => {
                swiper = swiper;
              }}
              cards={recipePostArray}
              renderCard={(item, index) => {
                return (
                  <CPHomePostComponent
                    item={item}
                    key={index}
                    index={index}
                    navigation={props.navigation}
                    selectSider={selectSider == index}
                    onChangeFavourite={makeFavouriteAction}
                    onChangeBookmark={makeBookMarkAction}
                  />
                );
              }}
              onSwiped={(cardIndex) => {
                setCardIndex(cardIndex);
              }}
              // onSwipedAll={onSwipedAllCards}
              animateCardOpacity
              onSwipedRight={(cardIndex) => {
                handleOnSwipedRight(cardIndex)
              }}
              cardStyle={styles.container}
              cardIndex={0}
              backgroundColor={"#00000000"}
              disableBottomSwipe
              disableLeftSwipe
              cardVerticalMargin={10}
              cardHorizontalMargin={10}
              stackSize={2}
              showSecondCard={true}
              swipeAnimationDuration={350}
              stackAnimationTension={40}
              swipeBackCard
            ></Swiper>

            // <CPRecipeSlider
            //   data={recipePostArray}
            //   componentRender={({ item, index }) => (
            //     <CPHomePostComponent
            //       item={item}
            //       key={index}
            //       index={index}
            //       navigation={props.navigation}
            //       selectSider={selectSider == index}
            //       onChangeFavourite={makeFavouriteAction}
            //       onChangeBookmark={makeBookMarkAction}
            //     />
            //   )}
            //   onBeforeSnapToItem={setSelectedSlider}
            //   onSnapToItem={setSelectedSlider}
            // />
          )}
        </ScrollView>
      )}
    </BaseContainer>
  );
};

export default HomeContainer;

const styles = StyleSheet.create({
  flexView: { flex: 1 },
  leftImageStyle: { marginHorizontal: 20, marginVertical: 10 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontFamily: CPFonts.abril_regular,
    color: CPColors.secondary,
  },
  container: {
    backgroundColor: "#00000000",
    // marginBottom:400,
    width: "95%",
    height: "100%",
    marginRight: 20,
  },
  rightComponent: {
    marginHorizontal: 20,
    // marginRight:10,
    alignItems: "center",
    flexDirection: "row",
  },
  rightPress: { marginRight: 10, position: "relative" },
  notiImage: { width: 20, height: 20 },
  notiImageActive: { width: 24, height: 24 },
  favImage: { width: 25, height: 25 },
  chatImage: { width: 20, height: 20 },
});
