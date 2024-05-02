import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import VideoPlayers from "react-native-video-players";
import { useSelector } from "react-redux";
import Assets from "../Assets";
import CPImageComponent from "../Components/CPImageComponent";
import CPLoader from "../Components/CPLoader";
import CPRecipeSlider from "../Components/CPRecipeSlider";
import CPVideoPlayerComponent from "../Components/CPVideoPlayerComponent";
import CPColors from "../Utils/CPColors";
import { EXPLORE } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { getApi } from "../Utils/ServiceManager";
import BaseContainer from "./BaseContainer";
import DoubleClick from "react-native-double-click";
import Swiper from "react-native-deck-swiper";

const ExploreContainer = (props) => {
  const userSelector = useSelector((state) => state);
  const [refreshing, setRefreshing] = useState(true);
  const [expUserList, setExpUserList] = useState([]);

  useEffect(() => {
    explorelist();
  }, []);

  const explorelist = () => {
    getApi(
      EXPLORE,
      onSuccessExplorelist,
      onFailureExplorelist,
      userSelector.userOperation
    );
  };

  const onSuccessExplorelist = (response) => {
    setRefreshing(false);
    console.log("Explore Success ::::::: ", response);
    if (response.success) {
      setExpUserList(response.data);
    }
  };

  const onFailureExplorelist = (error) => {
    console.log("Explore Success ::::::: ", error);
    setRefreshing(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      explorelist();
    });
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const entries = expUserList?.map((x) => x.profile);
  console.log(expUserList, "entrineee");
  // [

  //     'https://hips.hearstapps.com/vidthumb/images/delish-cloud-eggs-horizontal-1536076899.jpg',

  //     'https://static01.nyt.com/images/2020/03/04/dining/tr-egg-curry/merlin_169211805_227972c0-43d1-4f25-9643-9568331d8adb-articleLarge.jpg',

  //     'https://www.whiskaffair.com/wp-content/uploads/2020/04/Kerala-Egg-Curry-2.jpg',

  //     'https://images-gmi-pmc.edge-generalmills.com/8dfd9c8e-1580-4508-a223-e5c15dd46d8e.jpg',

  // ]

  const [selectSider, setSelectedSlider] = useState(0);
  const [isToggle, setIsToggle] = useState(false);
  const exploreRecipeItemRender = ( item, index ) => {
    console.log(item, "itemitemitemitem");
    return (
      <DoubleClick
        style={styles.listItemStyle}
        onClick={() => {
          {
            isToggle
              ? props.navigation.navigate("recipeDetail", {
                // isVideoDetail: isToggle
                acc_user_Profile: false,
                isFunnyVideo: true,
                video: item?.postfunny?.video,
                fromCLick: true,
                description: item?.postfunny?.description,
                recipeId: item?.postfunny?.id,
                userId: item?.id,
                index: index,
              })
              : props.navigation.navigate("anotherUser", {
                isAnotherUser: true,
                fromClick: true,
                id: item?.id,
              });
          }
        }}
      >
        {isToggle ? (
          <View
            style={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectSider == index ? (
              <Pressable
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  zIndex: 99999,
                }}
              >
                <Image source={Assets.play_icon} />
              </Pressable>
            ) : null}

            <CPVideoPlayerComponent
              source={item?.postfunny?.video}
              // onSelectImageData={(data) => onChangeVideo(data, index)}
              style={styles.imageStyle}
              playerStyle={{
                height: heightPercentageToDP("50%"),
                width: widthPercentageToDP("85%"),
                // marginVertical: 20,

                borderRadius: 20,
              }}
            />
          </View>
        ) : (
          <CPImageComponent
            style={styles.imageStyle}
            source={item.cover_image}
          //cover image
          />
        )}
        <View style={styles.container}>
          <Pressable
            style={styles.imagePress}
            onPress={() => {
              props.navigation.navigate("anotherUser", {
                isAnotherUser: true,
                fromClick: true,
                id: item?.id,
              });
            }}
          >
            <CPImageComponent style={styles.userImage} source={item?.profile} />
          </Pressable>
          <LinearGradient
            colors={[
              CPColors.transparent,
              CPColors.transparent,
              CPColors.transparent,
              CPColors.transparent,
              "rgba(0,0,0,0.2)",
              "rgba(0,0,0,0.5)",
              "rgba(0,0,0,0.8)",
              CPColors.black,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.linearView}
          >
            <View>
              <Text style={styles.subTitle}>{item?.name}</Text>
              <Text style={styles.subTitleBio}>{item?.bio}</Text>
              <View>
                {isToggle ? (
                  <Text
                    style={{
                      color: CPColors.lightwhite,
                      marginHorizontal: 20,
                      marginBottom: 20,
                      fontSize: 12,
                      fontFamily: CPFonts.medium,
                    }}
                    numberOfLines={7}
                  >
                    {item?.postfunny?.description}
                  </Text>
                ) : (
                  <>
                    <View style={styles.subViewStyle}>
                      {item?.post?.map((x, i) => {
                        return (
                          <Pressable
                            key={i}
                            onPress={() => {
                              props.navigation.navigate("recipeDetail", {
                                acc_user_Profile: false,
                                recipeId: item?.post[i]?.id,
                                fromCLick: false,
                                userId: item?.id,
                                index: i,
                              });
                            }}
                          >
                            <Image
                              style={styles.imageItemStyle}
                              source={{ uri: x?.image }}
                            />
                          </Pressable>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
      </DoubleClick>
    );
  };

  return (
    <BaseContainer
      safeAreaBottomDisable
      isBottomAreaPadding
      leftComponet={
        <Image
          style={styles.leftComponent}
          source={Assets.logo}
          resizeMode="cover"
        />
      }
      titleComponent={
        // <Text
        //     style={styles.titleStyle}
        // >
        //     Let's cook with a {`\n`} good taste
        // </Text>
        <Pressable
          style={{ flex: 1, borderRadius: 10, marginHorizontal: 24 }}
          onPress={() => {
            setIsToggle((value) => !value);
          }}
        >
          <LinearGradient
            colors={
              props.colorArray ?? ["rgba(226,54,143,1)", "rgba(202,54,140,1)"]
            }
            style={{
              borderRadius: 8,
              flexDirection: isToggle ? "row-reverse" : "row",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Image
                source={isToggle ? Assets.laughimage : Assets.ingredient}
                style={!isToggle && { tintColor: CPColors.white }}
              />
              {isToggle ? <Image source={Assets.laughimage} /> : null}
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: CPFonts.medium,
                  color: CPColors.white,
                  marginLeft: 10,
                }}
              >
                {isToggle ? "Funny Videos" : "Recipes"}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: CPColors.white,
                margin: 2,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: CPColors.secondary,
              }}
            >
              <Image
                style={{ marginVertical: 5, marginHorizontal: 15 }}
                source={isToggle ? Assets.ingredient : Assets.laughimage}
              />
            </View>
          </LinearGradient>
        </Pressable>
      }
      rightComponent={<View />}
    // rightComponent={
    //     <View
    //         style={styles.rightViewStyle}>
    //         <Pressable
    //             style={styles.rightPress}
    //             onPress={() => {
    //                 props.navigation.navigate('notification');
    //             }}>
    //             <Image
    //                 style={styles.notiImage}
    //                 source={Assets.notification}
    //                 resizeMode="contain"
    //             />
    //         </Pressable>
    //         <Pressable
    //             onPress={() => {
    //                 props.navigation.navigate('chatlist');
    //             }}>
    //             <Image style={styles.chatImage} source={Assets.Chatimage} />
    //         </Pressable>
    //     </View>
    // }
    >
      {refreshing ? (
        <CPLoader />
      ) : (
        <ScrollView
          contentContainerStyle={styles.flexStyle}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {expUserList.length === 0 ? (
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
            // <CPRecipeSlider
            //   data={expUserList}
            //   componentRender={exploreRecipeItemRender}
            //   onBeforeSnapToItem={setSelectedSlider}
            //   onSnapToItem={setSelectedSlider}
            //   addMargin={40}
            // />
            <Swiper
              ref={(swiper) => {
                swiper = swiper;
              }}
              cards={expUserList}
              renderCard={(item, index) => exploreRecipeItemRender(item, index)}
              animateCardOpacity
              cardStyle={styles.containerSwipe}
              cardIndex={0}
              backgroundColor={"#00000000"}
              disableBottomSwipe
              disableLeftSwipe
              disableRightSwipe
              cardVerticalMargin={10}
              cardHorizontalMargin={10}
              stackSize={2}
              showSecondCard={true}
              swipeAnimationDuration={350}
              stackAnimationTension={40}
              swipeBackCard
            ></Swiper>
          )}
        </ScrollView>
      )}
    </BaseContainer>
  );
};

export default ExploreContainer;

const styles = StyleSheet.create({
  leftComponent: { marginHorizontal: 20, marginVertical: 10 },
  titleStyle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontFamily: CPFonts.abril_regular,
    color: CPColors.secondary,
  },
  containerSwipe: {
    backgroundColor: "#00000000",
    // marginBottom:400,
    width: "95%",
    height: "100%",
    marginRight: 20,
  },
  rightViewStyle: {
    marginHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  rightPress: { marginRight: 10 },
  notiImage: { width: 20, height: 20 },
  chatImage: { width: 18, height: 18 },
  flexStyle: { flex: 1 },
  listItemStyle: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 45,
    position: "relative",
  },
  imageStyle: { width: "100%", height: "100%", borderRadius: 20 },
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    justifyContent: "space-between",
  },
  imagePress: { position: "relative", marginTop: -40, alignSelf: "center" },
  userImage: {
    width: widthPercentageToDP("21"),
    height: widthPercentageToDP("21"),
    borderWidth: 2,
    borderColor: CPColors.white,
    borderRadius: widthPercentageToDP("21"),
  },
  linearView: { flex: 1, borderRadius: 20, justifyContent: "flex-end" },
  subViewStyle: { paddingBottom: 30, flexDirection: "row", overflow: "hidden" },
  subTitle: {
    fontSize: 16,
    color: CPColors.white,
    fontFamily: CPFonts.semiBold,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  subTitleBio: {
    fontSize: 12,
    color: CPColors.white,
    fontFamily: CPFonts.regular,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  listViewStyle: { flexDirection: "row", marginRight: 10 },
  imageItemStyle: {
    width: widthPercentageToDP("20%") - 10,
    height: 70,
    marginLeft: 10,
    borderRadius: 15,
    marginHorizontal: 2,
  },
});
