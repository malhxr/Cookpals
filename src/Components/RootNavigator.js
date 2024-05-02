import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  Platform,
  StyleSheet,
  Keyboard,
  ImageBackground,
} from "react-native";
import { hasNotch } from "react-native-device-info";
import Animated from "react-native-reanimated";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import SafeAreaView from "react-native-safe-area-view";
import NavigationServiceManager from "../Utils/NavigationServiceManager";
import Assets from "../Assets";
import AboutUsContainer from "../Containers/AboutUsContainer";
import AccountContainer from "../Containers/AccountContainer";
import AddFriendContainer from "../Containers/AddFriendContainer";
import AddFriendModalContainer from "../Containers/AddFriendModalContainer";
import AddFunnyPostContainer from "../Containers/AddFunnyPostContainer";
import UserUpdateProfileContainer from "../Containers/UserUpdateProfileContainer";
import AllFollowreandFollowingList from "../Containers/AllFollowreandFollowingList";
import ChangePassword from "../Containers/ChangePassword";
import ChatContainer from "../Containers/ChatContainer";
import ChatListContainer from "../Containers/ChatListContainer";
import ContactUsContainer from "../Containers/ContactUsContainer";
import CreateGroupContainer from "../Containers/CreateGroupContainer";
import ExploreContainer from "../Containers/ExploreContainer";
import FollowerandFollowing from "../Containers/FollowerandFollowing";
import FoodPreferences from "../Containers/FoodPreferences";
import ForgotPassword from "../Containers/ForgotPassword";
import HomeContainer from "../Containers/HomeContainer";
import LocationContainer from "../Containers/LocationContainer";
import LoginContainer from "../Containers/LoginContainer";
import MatchingContainer from "../Containers/MatchingContainer";
import MostFollowLikeSelectContainer from "../Containers/MostFollowLikeSelectContainer";
import MyPreferencesContainer from "../Containers/MyPreferencesContainer";
import NewChatContainer from "../Containers/NewChatContainer";
import NotificationContainer from "../Containers/NotificationContainer";
import OTPContainer from "../Containers/OTPContainer";
import PostContainer from "../Containers/PostContainer";
import PrepareDetailsContainer from "../Containers/PrepareDetailsContainer";
import RecipeDetailContainer from "../Containers/RecipeDetailContainer";
import FullScreenVideoContainer from "../Containers/FullScreenVideoContainer";
import RecipeListContainer from "../Containers/RecipeListContainer";
import SearchContainer from "../Containers/SearchContainer";
import SearchDemo from "../Containers/SearchDemo";
import SignUpContainer from "../Containers/SignUpContainer";
import SplashContainer from "../Containers/SplashContainer";
import SubScriptionContainer from "../Containers/SubScriptionContainer";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import ActivityStatusContainer from "../Containers/ActivityStatusContainer";
import CPDrawer from "./CPDrawer";
import CPPopupView from "./CPPopupView";
import CPTabBarComponent from "./CPTabBarComponent";
import MealPreferencesContainer from "../Containers/MealPreferencesContainer";
import CMSContainer from "./CMSContainer";
import LikesListContainer from "../Containers/LikesListContainer";
import UserFunnyPostsContainer from "../Containers/UserFunnyPostsContainer";
import LikesContainer from "../Containers/LikesContainer";

export const BASE_STACK = createStackNavigator();
export const HOME_STACK = createStackNavigator();
export const EXPLORE_STACK = createStackNavigator();
export const POST_STACK = createStackNavigator();
export const SEARCH_STACK = createStackNavigator();
export const ACCOUNT_STACK = createStackNavigator();
export const BOTTOM_TAB = createBottomTabNavigator();
export const MAIN_DRAWER = createDrawerNavigator();

export const HOME_STACK_NAVIGATOR = () => {
  return (
    <HOME_STACK.Navigator
      initialRouteName={"Home"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <HOME_STACK.Screen
        name="Home"
        component={HomeContainer}
        headerShown={false}
      />
      {/* <HOME_STACK.Screen name="Home" component={iphoneXXs11Pro29} headerShown={false} /> */}
    </HOME_STACK.Navigator>
  );
};

export const EXPLORE_STACK_NAVIGATOR = () => {
  return (
    <EXPLORE_STACK.Navigator
      initialRouteName={"Explore"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <EXPLORE_STACK.Screen name="Explore" component={ExploreContainer} />
    </EXPLORE_STACK.Navigator>
  );
};

export const POST_STACK_NAVIGATOR = () => {
  return (
    <POST_STACK.Navigator
      initialRouteName={"Post"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <POST_STACK.Screen name="Post" component={PostContainer} />
    </POST_STACK.Navigator>
  );
};

export const SEARCH_STACK_NAVIGATOR = () => {
  return (
    <SEARCH_STACK.Navigator
      initialRouteName={"Search"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <SEARCH_STACK.Screen name="Search" component={SearchContainer} />
    </SEARCH_STACK.Navigator>
  );
};

export const ACCOUNT_STACK_NAVIGATOR = () => {
  return (
    <ACCOUNT_STACK.Navigator
      initialRouteName={"account"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <ACCOUNT_STACK.Screen name="account" component={AccountContainer} />
    </ACCOUNT_STACK.Navigator>
  );
};

export const MAIN_DRAWER_NAVIGATOR = () => {
  return (
    <MAIN_DRAWER.Navigator
      initialRouteName={"Account"}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerType: "back",
        overlayColor: CPColors.transparent,
        drawerStyle: {
          backgroundColor: CPColors.transparent,
          width: "60%",
        },
        swipeEnabled: false,
      }}
      // drawerPosition="right"

      // drawerType='back'

      // overlayColor='transparent'
      // drawerStyle={{
      //     backgroundColor: CPColors.transparent,
      //     width: '60%'
      // }}
      drawerContent={(props) => {
        return <CPDrawer {...props} />;
      }}
    >
      <MAIN_DRAWER.Screen name="Account" component={TAB_NAVIGATOR_STACK} />
    </MAIN_DRAWER.Navigator>
  );
};

export const TAB_NAVIGATOR_STACK = () => {
  const tabArray = [
    {
      name: "home",
      title: "Home",
      image_select: Assets.homeselect,
      image_deselect: Assets.homedeselect,
    },
    {
      name: "explore",
      title: "Explore",
      image_select: Assets.exploreselect,
      image_deselect: Assets.exploredeselect,
    },
    {
      name: "post",
      title: "Post",
      image_select: Assets.postdeselect,
      image_deselect: Assets.postdeselect,
    },
    {
      name: "search",
      title: "Search",
      image_select: Assets.searchselect,
      image_deselect: Assets.searchdeselect,
    },
    {
      name: "account",
      title: "Account",
      image_select: Assets.accountselect,
      image_deselect: Assets.accountdeselect,
    },
  ];

  const isDrawerOpen = useDrawerStatus() == "open";
  const navigation = useNavigation();
  const { interpolate, Extrapolate } = Animated;

  let screenStyle = null;
  const scale = interpolate(isDrawerOpen ? 1 : 0, {
    inputRange: [0, 1],
    outputRange: [1, 0.85],
    extrapolate: Extrapolate.CLAMP,
  });

  const borderRadius = interpolate(isDrawerOpen ? 1 : 0, {
    inputRange: [0, 1],
    outputRange: [0, 20],
    extrapolate: Extrapolate.CLAMP,
  });

  screenStyle = {
    transform: [
      {
        scale: scale,
      },
    ],
    borderRadius,
  };
  const [isOpen, setOpen] = useState(false);
  const openModel = () => {
    return (
      <CPPopupView
        modalStyle={{ marginBottom: hasNotch() ? 115 : 90 }}
        // mainModalStyle={{height:100}}
        style={{ justifyContent: "flex-end" }}
        isVisible={isOpen}
        onRequestClose={() => setOpen(false)}
      >
        <ImageBackground
          style={{
            width: 140,
            height: 70,
            paddingBottom: 10,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 5,
            alignSelf: "center",
          }}
          source={Assets.postPopopImage}
          resizeMode="contain"
        >
          <Pressable
            onPress={() => {
              navigation.navigate("post");
              setOpen(false);
            }}
          >
            <Image
              style={{
                width: widthPercentageToDP("8"),
                height: widthPercentageToDP("8"),
              }}
              source={Assets.ingrediant_bg}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              setOpen(false);
            }}
          >
            <Image
              style={{
                width: widthPercentageToDP("8"),
                height: widthPercentageToDP("8"),
              }}
              source={Assets.close_post}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("addfunnypost");
              setOpen(false);
            }}
          >
            <Image
              style={{
                width: widthPercentageToDP("8"),
                height: widthPercentageToDP("8"),
              }}
              source={Assets.laughImage_bg}
            />
          </Pressable>
        </ImageBackground>
      </CPPopupView>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: CPColors.white,
        paddingRight: isDrawerOpen ? 60 : 0,
      }}
    >
      {isDrawerOpen ? (
        <View
          style={{
            position: "absolute",
            bottom: 100,
            top: 100,
            right: 50,
            left: 0,
            borderRadius: 30,
            backgroundColor: CPColors.white,
            shadowColor: CPColors.black,
            shadowRadius: 10,
            shadowOpacity: 0.4,
            elevation: 5,
          }}
        />
      ) : null}
      <Animated.View
        style={[
          {
            flex: 1,
            borderWidth: 0.4,
            borderColor: CPColors.borderColor,
            backgroundColor: CPColors.white,
            overflow: "hidden",
            shadowColor: CPColors.black,
            shadowRadius: 10,
            shadowOpacity: 1,
            elevation: 5,
          },
          screenStyle,
        ]}
      >
        {openModel()}
        <BOTTOM_TAB.Navigator
          initialRouteName="home"
          screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard: true,
          }}
        >
          {tabArray.map((item, index) => {
            return (
              <BOTTOM_TAB.Screen
                key={index}
                name={item.name}
                options={{
                  tabBarShowLabel: false,
                  // tabBarBackground: CPColors.white,
                  tabBarLabelStyle: {},
                  tabBarStyle: {
                    // flex: 1,
                    // alignItems:'flex-start',
                    backgroundColor: CPColors.white,
                    borderTopColor: CPColors.transparent,
                    elevation: 0,
                    // borderColor: CPColors.white,
                    paddingTop: 6,
                    height: 66,
                    // justifyContent:'space-evenly',
                    // borderWidth: "none",
                    // padding: 10,
                  },
                  tabBarIcon: ({ focused }) => (
                    <Pressable
                      style={{
                        flex: 1,
                        alignItems: "center",
                        // alignSelf: "flex-end",
                        // backgroundColor: CPColors.white,
                        // paddingTop: 20,
                      }}
                      onPress={() => {
                        console.log("ON OPEN ::::: ");
                        if (index !== 2) {
                          navigation.navigate(item.name);
                          setOpen(false);
                        } else {
                          setOpen(true);
                        }
                      }}
                    >
                      <Image
                        source={
                          focused ? item.image_select : item.image_deselect
                        }
                        resizeMode={"contain"}
                        style={[
                          {
                            width: 20,
                            height: 20,
                            // backgroundColor: CPColors.primary,
                          },
                        ]}
                      />

                      <Text
                        style={{
                          color: CPColors.secondary,
                          fontFamily: CPFonts.light,
                          fontSize: 12,
                          marginVertical: 5,
                        }}
                      >
                        {item.title}
                      </Text>
                      {focused ? (
                        <Image
                          source={Assets.bottomselected}
                          resizeMode="contain"
                          style={{}}
                        />
                      ) : (
                        <View
                          style={{ height: 15, width: "100%", marginTop: 10 }}
                        />
                      )}
                    </Pressable>
                  ),
                  // tabBarButton: (props) => (
                  //   <Pressable
                  //     style={{
                  //       flex: 1,
                  //       alignItems: "center",
                  //       alignSelf: "flex-end",
                  //       backgroundColor: CPColors.white,
                  //       // padding: 20,
                  //     }}
                  //     onPress={() => {
                  //       console.log("ON OPEN ::::: ");
                  //       if (index !== 2) {
                  //         navigation.navigate(item.name);
                  //         setOpen(false);
                  //       } else {
                  //         setOpen(true);
                  //       }
                  //     }}
                  //   >
                  //     <Image
                  //       source={
                  //         props.accessibilityState.selected
                  //           ? item.image_select
                  //           : item.image_deselect
                  //       }
                  //       resizeMode={"contain"}
                  //       style={[
                  //         {
                  //           width: 20,
                  //           height: 20,
                  //           // backgroundColor: CPColors.primary,
                  //         },
                  //       ]}
                  //     />

                  //     <Text
                  //       style={{
                  //         color: CPColors.secondary,
                  //         fontFamily: CPFonts.light,
                  //         fontSize: 12,
                  //         marginTop: 10,
                  //       }}
                  //     >
                  //       {item.title}
                  //     </Text>
                  //     {props.accessibilityState.selected ? (
                  //       <Image
                  //         source={Assets.bottomselected}
                  //         resizeMode="contain"
                  //         style={{ height: 15, width: "100%", marginTop: 10 }}
                  //       />
                  //     ) : (
                  //       <View
                  //         style={{ height: 15, width: "100%", marginTop: 10 }}
                  //       />
                  //     )}
                  //   </Pressable>
                  // ),
                  // tabBarHideOnKeyboard: true,
                  // tabBarVisible: index !== 2
                }}
                component={
                  index == 0
                    ? HOME_STACK_NAVIGATOR
                    : index == 1
                      ? EXPLORE_STACK_NAVIGATOR
                      : index == 2
                        ? POST_STACK_NAVIGATOR
                        : index == 3
                          ? SEARCH_STACK_NAVIGATOR
                          : ACCOUNT_STACK_NAVIGATOR
                }
              />
            );
          })}
        </BOTTOM_TAB.Navigator>
      </Animated.View>
    </View>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer
      ref={(navigationRef) =>
        NavigationServiceManager.setTopLevelNavigation(navigationRef)
      }
    >
      <BASE_STACK.Navigator
        initialRouteName={"splash"}
        headerShown={false}
        screenOptions={{ headerShown: false }}
      >
        <BASE_STACK.Screen name="splash" component={SplashContainer} />
        <BASE_STACK.Screen name="login" component={LoginContainer} />
        <BASE_STACK.Screen
          name="addfriendmodal"
          component={AddFriendModalContainer}
        />
        <BASE_STACK.Screen name="addfriend" component={AddFriendContainer} />
        <BASE_STACK.Screen name="otp" component={OTPContainer} />
        <BASE_STACK.Screen name="location" component={LocationContainer} />
        <BASE_STACK.Screen name="signup" component={SignUpContainer} />
        <BASE_STACK.Screen
          name="adduserdetail"
          component={UserUpdateProfileContainer}
        />
        <BASE_STACK.Screen name="dashboard" component={MAIN_DRAWER_NAVIGATOR} />
        <BASE_STACK.Screen name="forgotPassword" component={ForgotPassword} />
        <BASE_STACK.Screen
          name="notification"
          component={NotificationContainer}
        />
        <BASE_STACK.Screen name="post" component={PostContainer} />
        <BASE_STACK.Screen
          name="addfunnypost"
          component={AddFunnyPostContainer}
        />
        <BASE_STACK.Screen name="changePassword" component={ChangePassword} />
        <BASE_STACK.Screen name="contactus" component={ContactUsContainer} />
        <BASE_STACK.Screen name="aboutus" component={AboutUsContainer} />
        <BASE_STACK.Screen name="anotherUser" component={AccountContainer} />
        <BASE_STACK.Screen
          name="myPreference"
          component={MyPreferencesContainer}
        />
        <BASE_STACK.Screen
          name="mealPreference"
          component={MealPreferencesContainer}
        />
        <BASE_STACK.Screen name="foodPreference" component={FoodPreferences} />
        <BASE_STACK.Screen
          name="mostlikedislike"
          component={MostFollowLikeSelectContainer}
        />
        <BASE_STACK.Screen
          name="preparetionDetail"
          component={PrepareDetailsContainer}
        />
        <BASE_STACK.Screen name="recipeList" component={RecipeListContainer} />
        <BASE_STACK.Screen
          name="recipeDetail"
          component={RecipeDetailContainer}
        />
        <BASE_STACK.Screen
          name="fullScreenVideoPlayer"
          component={FullScreenVideoContainer}
        />
        <BASE_STACK.Screen
          name="followandfollowing"
          component={FollowerandFollowing}
        />
        <BASE_STACK.Screen
          name="allfollowandfollowing"
          component={AllFollowreandFollowingList}
        />
        <BASE_STACK.Screen name="chatlist" component={ChatListContainer} />
        <BASE_STACK.Screen name="newchatlist" component={NewChatContainer} />
        <BASE_STACK.Screen
          name="createGroup"
          component={CreateGroupContainer}
        />
        <BASE_STACK.Screen name="chat" component={ChatContainer} />
        <BASE_STACK.Screen name="match" component={MatchingContainer} />
        <BASE_STACK.Screen
          name="subScription"
          component={SubScriptionContainer}
        />
        <BASE_STACK.Screen
          name="activityStatus"
          component={ActivityStatusContainer}
        />
        <BASE_STACK.Screen name="cms" component={CMSContainer} />
        <BASE_STACK.Screen name="likeList" component={LikesListContainer} />
        <BASE_STACK.Screen name="editPost" component={PostContainer} />
        <BASE_STACK.Screen name="likes" component={LikesContainer} />
        <BASE_STACK.Screen
          name="userFunnyPost"
          component={UserFunnyPostsContainer}
        />
      </BASE_STACK.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
