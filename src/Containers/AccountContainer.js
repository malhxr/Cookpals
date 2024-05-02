import React, { useEffect, useCallback, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  RefreshControl,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import Assets from "../Assets";
import CPBackButton from "../Components/CPBackButton";
import CPImageComponent from "../Components/CPImageComponent";
import CPPopupView from "../Components/CPPopupView";
import CPProfileComponent from "../Components/CPProfileComponent";
import CPThemeButton from "../Components/CPThemeButton";
import CPUpgradePlan from "../Components/CPUpgradePlan";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import { getApi, postApi } from "../Utils/ServiceManager";
import { useSelector } from "react-redux";
import { FOLLOW, MY_ACCOUNT_API, USER_DETAILS } from "../Utils/CPConstant";
import { heightPercentageToDP } from "react-native-responsive-screen";
import CPLoader from "../Components/CPLoader";
import { showDialogue } from "../Utils/CPAlert";
import { ScrollView } from "react-native";

const AccountContainer = (props) => {
  const userSelector = useSelector((state) => state);
  const dimension = Dimensions.get("window").width;
  const [selectedIndex, setIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [userDetail, setUserDetail] = useState();
  const [userPost, setUserPost] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [isUpgradePlanModal, setUpgradePlanModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isfollow, setIsFollow] = useState();
  const [following, setFollowing] = useState();
  const [enablescrollview, setenablescrollview] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const plan = userSelector?.userOperation?.detail?.plan?.plan_type;
  // useEffect(() => {
  //     userProfileDetail();
  //   }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const modalTitle = {
    title: "Oops!",
    description:
      "You must have to upgrade your plan to provide more videos to your followers",
    actionStr: "Upgrade Your Plan",
    image: Assets.upgradeplan,
  };

  const galleryMenuArray = [
    {
      image_select: Assets.menuselect,
      image_deselect: Assets.menudeselect,
    },
    {
      image_select: Assets.laughimage,
      image_deselect: Assets.laughimage,
    },
    {
      image_select: Assets.Pathselect,
      image_deselect: Assets.Pathdeselect,
    },
  ];

  console.log(props.route.params?.id, "props.route.params");

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      if (!props.route.params?.isAnotherUser) {
        console.log(
          "THISISDEMOLOG PROFILEUSER:::::::",
          props.route.params?.isAnotherUser
        );
        userProfileDetail();
      } else {
        console.log("THISISDEMOLOG ISANOTHERUSER:::::::");
        clickDetail();
      }
    });
    return unsubscribe;
  }, [isEnabled, isfollow, props.route.params?.id]);

  const OnFollowChange = () => {
    const params = {
      status: isEnabled ? 0 : 1,
      follower_id: props?.route?.params?.id,
    };

    postApi(
      FOLLOW,
      params,
      onSuccessFollow,
      onFailureFollow,
      userSelector.userOperation
    );
  };

  const onSuccessFollow = (response) => {
    console.log("SUCCESS followw=>> :::::: ", response);
    !props.route.params?.isAnotherUser ? userProfileDetail() : clickDetail();
  };

  const clickDetail = () => {
    userCurrentDetail();
    userClickedDetail(props?.route?.params?.id);
  };
  const onFailureFollow = (error) => {
    console.log("FAILURE ACTIVE :::::: ", error);
  };
  const userCurrentDetail = () => {
    getApi(
      MY_ACCOUNT_API,
      onSuccessCurrentMyAccount,
      onFailureMyAccount,
      userSelector.userOperation
    );
  };

  const onSuccessCurrentMyAccount = (response) => {
    console.log("SUCCESS MY ACCOUNT ::::::", response.data);
    if (response.success) {
      setFollowing(response.data.following);
      // followers": 2, "following": 9
    }

    setRefreshing(false);
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
      setUserDetail(response.data);
      console.log(userDetail, 'ddddddd');
      if (response?.data?.post) {
        setUserPost(response?.data?.post);
      }
    }

    setRefreshing(false);
  };

  const onFailureMyAccount = (error) => {
    console.log(" FAILURE MY ACCOUNT ::::::", error);
    setRefreshing(false);
  };
  const userClickedDetail = (id) => {
    console.log(USER_DETAILS + id, "props.route.params API");
    getApi(
      USER_DETAILS + id,
      onSuccessClickAccount,
      onFailureClickAccount,
      userSelector.userOperation
    );
  };

  const onSuccessClickAccount = (response) => {
    console.log(" SUCCESS CLICK ACCOUNT ::::::", response.data);
    if (response.success) {
      setUserDetail(response.data);
      setIsEnabled(response.data.my_profile?.isfollow == "1" ? true : false);
      setIsFollow(response.data.my_profile?.followtoother);
      if (response?.data?.post) {
        setUserPost(response?.data?.post);
      }
    }
    setRefreshing(false);
  };

  const onFailureClickAccount = (error) => {
    setRefreshing(false);
    console.log(" FAILURE CLICK ACCOUNT ::::::", error);
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };

  const followChange = () => {
    OnFollowChange();
    toggleSwitch();
    setUpgradePlanModal(false);
  };

  const onClickOpenDrawer = () => {
    if (!props.route.params?.isAnotherUser) {
      props.navigation.toggleDrawer();
      const galleryMenuArray = [
        {
          image_select: Assets.menuselect,
          image_deselect: Assets.menudeselect,
        },
        {
          image_select: Assets.laughimage,
          image_deselect: Assets.laughimage,
        },
        {
          image_select: Assets.Pathselect,
          image_deselect: Assets.Pathdeselect,
        },
      ];
      if (!props.route.params?.isAnotherUser) {
        userProfileDetail();
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      !props.route.params?.isAnotherUser ? userProfileDetail() : clickDetail();
    });
  }, []);

  const upgradeModal = () => {
    return (
      <CPPopupView isVisible={isUpgradePlanModal}>
        <CPUpgradePlan
          item={modalTitle}
          onPress={() => {
            setUpgradePlanModal(false);
          }}
        />
      </CPPopupView>
    );
  };

  const forRefresh = () => {
    !props.route.params?.isAnotherUser ? userProfileDetail() : clickDetail();
  };

  const accountPostGridView = ({ item, index }) => {
    // console.log(item, "otebmnncmff");
    return (
      <Pressable
        key={index}
        style={{ width: dimension / 2 - 10, height: dimension / 2 }}
        onPress={() => {
          props.navigation.navigate("recipeDetail", {
            acc_user_Profile:
              selectedIndex == 2
                ? props.route.params?.isAnotherUser
                : !props.route.params?.isAnotherUser,
            recipeId: selectedIndex == 2 ? item.post_id : item.id,
            fromCLick: false,
            userId:
              selectedIndex == 2
                ? item?.post?.user_id
                : props?.route?.params?.id,
            index: index,
          });
        }}
      >
        {selectedIndex == 1 ? (
          <View style={[styles.imageStyle, { height: "94%" }]}>
            {
              <Pressable
                key={index}
                style={styles.touchableOpacityStyle}
                onPress={() => {
                  props.navigation.navigate("recipeDetail", {
                    acc_user_Profile: !props.route.params?.isAnotherUser,
                    isFunnyVideo: true,
                    video: item?.video,
                    fromCLick: true,
                    description: props.route.params?.isAnotherUser
                      ? ""
                      : item?.description,
                    recipeId: item.id,
                    userId: props?.route?.params?.id,
                    index: index,
                  });
                }}
              >
                <Text>{""}</Text>
                <View style={[styles.imageStyle, { height: "19%" }]}>
                  <Image
                    source={Assets.play_icon}
                    style={{
                      position: "absolute",
                      alignSelf: "center",
                      zIndex: 99999,
                      marginTop: 45,
                    }}
                  />
                </View>
              </Pressable>
            }
            {/* <VideoPlayers
                            source={{
                                uri: item?.video,
                            }}
                            paused={true}
                            resizeMode={'contain'}
                            controlTimeout={2000}
                            hideControlsOnStart
                            backToList={() => { }}
                            style={[styles.imageStyle, { height: "100%" }]}
                        /> */}
          </View>
        ) : (
          <CPImageComponent
            style={[styles.imageStyle, { height: "94%" }]}
            source={item.image || item?.post?.image}
          />
        )}
      </Pressable>
    );
  };

  const headerComponent = () => {
    return (
      <>
        <View style={{ height: heightPercentageToDP("50%") }}>
          {props.route?.params?.isAnotherUser ? (
            <CPBackButton
              style={styles.backActionStyle}
              onBackPress={navigateToBack}
            />
          ) : null}

          {upgradeModal()}
          <CPProfileComponent
            data={userDetail}
            onFollowersClick={() => {
              props.navigation.navigate("followandfollowing", {
                id: !props.route.params?.isAnotherUser
                  ? userDetail?.my_profile?.id
                  : props?.route?.params?.id,
                isAnotherUser: !props.route.params?.isAnotherUser
                  ? false
                  : true,
              });
            }}
            isFavourite={props.route.params?.isAnotherUser}
            onPress={onClickOpenDrawer}
            onLikesClick={() => {
              props.navigation.navigate("likes", {
                id: !props.route.params?.isAnotherUser
                  ? userDetail?.my_profile?.id
                  : props?.route?.params?.id,
                isAnotherUser: !props.route.params?.isAnotherUser
                  ? false
                  : true,
              });
            }}
          />
          {props.route?.params?.isAnotherUser ? (
            <View style={styles.cookUpView}>
              <CPThemeButton
                title={"CookUp"}
                style={styles.cookupPress}
                labelStyle={styles.cookupLabel}
                onPress={() =>
                  isfollow === 1
                    ? props.navigation.navigate("match", {
                      cookup_id: props?.route?.params?.id,
                      name: userDetail?.my_profile?.name,
                    })
                    : showDialogue(
                      "You are not following each other! Start following to be a perfect match!",
                      [{ text: "Cancel" }],
                      "Cookpals"
                    )
                }
              />
              <CPThemeButton
                style={styles.followPress}
                labelStyle={styles.followPressLabel}
                colorArray={[CPColors.white, CPColors.white]}
                title={isEnabled === true ? "Unfollow" : "Follow"}
                onPress={() => {
                  plan == "Free Plan" && isEnabled === false && following >= 5
                    ? showDialogue(
                      "You need to subscribed to premium plan for this feature",
                      [{ text: "" }],
                      "Cookpals"
                    )
                    : followChange();
                }}
              />

              <Pressable
                style={styles.chatPress}
                onPress={() => {
                  plan != "Free Plan"
                    ? props.navigation.navigate("chat", {
                      userData: userDetail.my_profile,
                      selectMode: 0,
                    })
                    : showDialogue(
                      "You need to subscribed to premium plan for this feature",
                      [{ text: "" }],
                      "Cookpals"
                    );
                }}
              >
                <Image source={Assets.Chatimage} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.sepratorStyle} />
          )}
        </View>
      </>
    );
  };

  const stickyComponent = () => {
    return (
      <View style={styles.galleryView}>
        {galleryMenuArray.map((item, index) => {
          return (
            <>
              {props.route?.params?.isAnotherUser &&
                galleryMenuArray.length - 1 == index ? null : (
                <Pressable
                  key={index}
                  style={[
                    styles.segmentView,
                    {
                      borderBottomWidth: selectedIndex == index ? 1 : 0,
                      borderBottomColor:
                        selectedIndex == index
                          ? CPColors.secondaryLight
                          : CPColors.transparent,
                    },
                  ]}
                  onPress={() => setIndex(index)}
                >
                  <Image
                    resizeMode="center"
                    source={
                      index == selectedIndex
                        ? item.image_select
                        : item.image_deselect
                    }
                  />
                </Pressable>
              )}
              {galleryMenuArray.length - 1 == index ||
                (props.route.params?.isAnotherUser &&
                  galleryMenuArray.length - 2 == index) ? null : (
                <View
                  style={{
                    width: 1,
                    height: 15,
                    backgroundColor: CPColors.borderColor,
                  }}
                />
              )}
            </>
          );
        })}
      </View>
    );
  };

  // console.log('userrrrr::::::', userDetail);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: CPColors.white }}
      forceInset={{ bottom: "never", top: "never" }}
    >
      {refreshing ? (
        <CPLoader />
      ) : (
        <View
          style={{
            flex: 1,
            paddingBottom: props.route?.params?.isAnotherUser ? 0 : 10,
          }}
        >
          {headerComponent()}
          <FlatList
            data={
              selectedIndex == 0
                ? userDetail?.post
                : selectedIndex == 1
                  ? userDetail?.funny_video
                  : userDetail.saved_post
            }
            style={styles.galleryMainView}
            numColumns={2}
            bounces={false}
            // showsVerticalScrollIndicator={false}
            renderItem={accountPostGridView}
            // nestedScrollEnabled
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            stickyHeaderIndices={[0]}
            // stickyHeaderHiddenOnScroll={true}
            ListHeaderComponent={stickyComponent}
            scrollEnabled={selectedIndex == 0
              ? userDetail?.post.length === 0 ? false : true
              : selectedIndex == 1
                ? userDetail?.funny_video.length === 0 ? false : true
                : userDetail.saved_post.length === 0 ? false : true}

            ListEmptyComponent={() => {

              return (
                // <View
                //   style={{
                //     flex: 1,
                //     justifyContent: "center",
                //     alignItems: "center",
                //   }}
                // >
                //   <Text>
                //     {selectedIndex == 0
                //       ? "No post here"
                //       : selectedIndex == 1
                //       ? "No funny video"
                //       : "No saved post"}
                //   </Text>
                // </View>
                selectedIndex == 0 ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../Assets/images/noNotification.png")}
                      resizeMode="contain"
                      // style={{ height: "50%", width: "50%", bottom: "08%" }}
                      style={{ maxHeight: "20%", bottom: "39%" }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        position: "absolute",
                        top: "18%",
                        // marginBottom:50,
                        fontWeight: "bold",
                        color: CPColors.secondary,
                      }}
                    >
                      No Post Found
                    </Text>
                  </View>
                ) : selectedIndex == 1 ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../Assets/images/noNotification.png")}
                      resizeMode="contain"
                      style={{ maxHeight: "20%", bottom: "39%" }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        position: "absolute",
                        top: "18%",
                        // marginBottom:50,
                        fontWeight: "bold",
                        color: CPColors.secondary,
                      }}
                    >
                      No Funny Video
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../Assets/images/noNotification.png")}
                      resizeMode="contain"
                      style={{ maxHeight: "20%", bottom: "39%" }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        position: "absolute",
                        top: "18%",
                        // marginBottom:50,
                        fontWeight: "bold",
                        color: CPColors.secondary,
                      }}
                    >
                      No Saved Post
                    </Text>
                  </View>
                )
              );
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default AccountContainer;

const styles = StyleSheet.create({
  backActionStyle: { position: "absolute", left: 5, top: 30, zIndex: 1000 },
  touchableOpacityStyle: {
    position: "absolute",
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    // backgroundColor: '#911',
    backgroundColor: CPColors.transparent,
    zIndex: 9999,
  },
  cookUpView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CPColors.white,
    paddingTop: 10,
  },
  cookupPress: {
    width: "30%",
    height: 45,
  },
  cookupLabel: { marginHorizontal: 15, fontFamily: CPFonts.semiBold },
  followPress: {
    borderWidth: 0.5,
    borderColor: CPColors.secondaryLight,
    marginLeft: 8,
    height: 45,
    width: "30%",
  },
  followPressLabel: {
    color: CPColors.secondary,
    marginHorizontal: 15,
    fontFamily: CPFonts.semiBold,
  },
  chatPress: {
    backgroundColor: CPColors.white,
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: CPColors.secondaryLight,
    marginLeft: 8,
  },
  sepratorStyle: { height: 10, backgroundColor: CPColors.textInputColor },
  galleryMainView: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: CPColors.white,
  },
  galleryView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 15,
    backgroundColor: CPColors.white,
  },
  segmentView: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 20,
  },
  imageStyle: { margin: 6, borderRadius: 25, backgroundColor: "black" },
  imageStyleVideo: { borderRadius: 10, backgroundColor: "black" },
});
