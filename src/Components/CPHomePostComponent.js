import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import Assets from "../Assets";
import CPColors from "../Utils/CPColors";
import { USER_DETAILS } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { getApi } from "../Utils/ServiceManager";
import CPImageComponent from "./CPImageComponent";
import CPLoader from "./CPLoader";
import DoubleClick from "react-native-double-click";

const CPHomePostComponent = (props) => {
  const { item, index, selectSider } = props;
  const userSelector = useSelector((state) => state);
  const [isFavourite, setFavourite] = useState(item.postlike == 1 ? 1 : 0);
  const [isBookmark, setBookmark] = useState(item.postsave == 1 ? 1 : 0);
  const [refreshing, setRefreshing] = useState(true);
  const [user, setUser] = useState();
  const { followerscount, followingcount, postcount } = item;
  // console.log("selectslider", followerscount, followingcount, postcount);

  useEffect(() => {
    userDetails();
  }, []);

  const onClickFunnyPost = () => {
    props.navigation.navigate("userFunnyPost", {
      userId: item.user_id,
      navigation: props.navigation,
    });
  };

  const userDetails = () => {
    getApi(
      USER_DETAILS + item.user_id,
      onSuccessClickAccount,
      onFailureClickAccount,
      userSelector.userOperation
    );
  };
  const onSuccessClickAccount = (response) => {
    setRefreshing(false);
    if (response.success) {
      setUser(response.data);
    }
  };

  const onFailureClickAccount = (error) => {
    setRefreshing(false);
    console.log(" FAILURE CLICK ACCOUNT ::::::", error);
  };

  const onChangeFavourite = () => {
    setFavourite(isFavourite === 1 ? 0 : 1);
    props.onChangeFavourite(isFavourite === 1 ? 0 : 1, item.id);
  };

  const onChangeBookmark = () => {
    setBookmark(isBookmark === 1 ? 0 : 1);
    props.onChangeBookmark(isBookmark === 1 ? 0 : 1, item.id);
  };

  const showLikelist = (data) => {
    data.length > 0
      ? props.navigation.navigate("likeList", {
        post_like: item?.post_like,
        user,
      })
      : null;
  };

  // refreshing ? (
  //   <CPLoader />
  // ) :
  return (
    <View style={styles.container} key={index}>
      <DoubleClick
        style={{ flex: 1 }}
        onClick={() => {
          props.navigation.navigate("recipeDetail", {
            acc_user_Profile: false,
            recipeId: item?.id,
            userId: item?.user_id,
          });
        }}
      >
        <FastImage
          style={styles.backgroundImage}
          source={{
            uri: item?.image,
            priority: FastImage.priority.normal,
          }}
        />
      </DoubleClick>
      <View style={styles.frontTopView}>
        <View style={styles.recipeDetailView}>
          <Pressable
            onPress={() => {
              props.navigation.navigate("anotherUser", {
                isAnotherUser: true,
                fromClick: true,
                id: item?.user_id,
              });
            }}
            style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
          >
            <View style={{}}>
              <FastImage
                style={styles.userImage}
                source={{
                  uri: item?.user?.profile,
                  priority: FastImage.priority.normal,
                }}
              />

              <Image
                style={{ position: "absolute", bottom: 8, right: 8 }}
                source={Assets.online_image}
              />
            </View>
            <View style={styles.userDetailView}>
              <Text style={styles.nameTitle} numberOfLines={2}>
                {item?.user?.name}
              </Text>
              <Text style={styles.locationStyle}>
                {item?.user?.my_preference?.country?.name}
              </Text>
            </View>
          </Pressable>
          <View style={styles.userSubView}>
            <Pressable style={styles.watchliststyle} onPress={onClickFunnyPost}>
              <Image source={Assets.laughimage} resizeMode="center" />
            </Pressable>
            <Pressable
              style={[{ marginLeft: 5 }, styles.watchliststyle]}
              onPress={onChangeBookmark}
            >
              <Icon
                name={isBookmark === 1 ? "bookmark" : "bookmark-border"}
                size={15}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.sepratorStyle} />
        <View style={styles.postView}>
          <View style={styles.postSubView}>
            <Text style={styles.countStyle}>{postcount + " "}</Text>
            <Text style={styles.statusStyle}>{"Posts"}</Text>
          </View>
          <View style={styles.verticalSeprator} />
          <View style={styles.postSubView}>
            <Text style={styles.countStyle}>{followerscount + " "}</Text>
            <Text style={styles.statusStyle}>{"Followers"}</Text>
          </View>
          <View style={styles.verticalSeprator} />
          <View style={styles.postSubView}>
            <Text style={styles.countStyle}>{followingcount + " "}</Text>
            <Text style={styles.statusStyle}>{"Followings"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.frontBottomView}>
        <View style={styles.flexView}>
          <Text style={styles.recipeTitle}>{item?.title}</Text>
          <View style={styles.recipeTimeView}>
            <Image source={Assets.cookingtime} style={styles.timeImage} />
            <Text style={styles.timeTitle}>
              {item?.preparation_time?.time + " mins"}
            </Text>
          </View>
        </View>
        <Pressable
          style={styles.frontBottmSubView}
          onPress={() => showLikelist(item.post_like)}
        >
          <Text style={styles.likebyTxt}>{"Liked by"}</Text>
          <View style={styles.recipeTimeView}>
            {item?.post_like?.map((i, index) => {
              return (
                <CPImageComponent
                  index={index}
                  key={index}
                  style={styles.likeView}
                  source={i?.user?.profile}
                />
              );
            })}
          </View>
        </Pressable>
        {/* {selectSider ? ( */}
        <View style={styles.selectedIndexView}>
          <Pressable
            style={{
              backgroundColor:
                isFavourite !== 0 ? CPColors.primary : CPColors.white,
              padding: 5,
              borderRadius: 20,
            }}
            onPress={onChangeFavourite}
          >
            <Icon
              size={20}
              name={isFavourite === 0 ? "favorite-border" : "favorite"}
              color={isFavourite === 0 ? CPColors.primary : CPColors.white}
            />
          </Pressable>
          <View style={styles.swipeViewStyle}>
            <Image source={Assets.forwardimage} style={styles.notiImage} />
          </View>
        </View>
        {/* ) : null} */}
      </View>
    </View>
  );
};

export default CPHomePostComponent;

const styles = StyleSheet.create({
  flexView: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: CPColors.white,
    margin: 20,
    borderRadius: 20,
  },
  backgroundImage: { flex: 1, borderRadius: 20 },
  frontTopView: {
    padding: 15,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  recipeDetailView: { flexDirection: "row", alignItems: "center" },
  userImage: {
    width: widthPercentageToDP("21"),
    height: widthPercentageToDP("21"),
    borderRadius: widthPercentageToDP("21"),
  },
  userDetailView: { flex: 1, marginLeft: 15 },
  nameTitle: {
    fontSize: 16,
    fontFamily: CPFonts.semiBold,
    color: CPColors.white,
  },
  locationStyle: {
    fontSize: 12,
    fontFamily: CPFonts.medium,
    color: CPColors.white,
  },
  userSubView: { flexDirection: "row", marginLeft: 10 },
  watchliststyle: {
    backgroundColor: CPColors.white,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  sepratorStyle: {
    height: 1,
    backgroundColor: CPColors.borderColor,
    marginVertical: 15,
    marginHorizontal: 10,
  },
  postView: { flexDirection: "row", marginHorizontal: 10 },
  postSubView: { flex: 1, flexDirection: "row", justifyContent: "center" },
  countStyle: { fontFamily: CPFonts.bold, fontSize: 12, color: CPColors.white },
  statusStyle: {
    fontFamily: CPFonts.medium,
    fontSize: 12,
    color: CPColors.white,
  },
  verticalSeprator: { width: 1, height: 15, backgroundColor: CPColors.white },
  frontBottomView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  recipeTitle: {
    fontSize: 18,
    fontFamily: CPFonts.semiBold,
    color: CPColors.white,
  },
  recipeTimeView: { flexDirection: "row", marginTop: 5, alignItems: "center" },
  timeImage: { width: 10, height: 10 },
  timeTitle: {
    color: CPColors.lightwhite,
    marginHorizontal: 5,
    fontSize: 12,
    fontFamily: CPFonts.medium,
  },
  frontBottmSubView: { marginHorizontal: 10 },
  likebyTxt: {
    color: CPColors.lightwhite,
    fontFamily: CPFonts.medium,
    fontSize: 11,
    marginLeft: -10,
  },
  lastLikeView: {
    height: 25,
    width: 25,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.8)",
    marginLeft: -15,
    alignItems: "center",
    justifyContent: "center",
    borderColor: CPColors.white,
    borderWidth: 1,
  },
  likeView: {
    height: 25,
    width: 25,
    borderRadius: 15,
    resizeMode: "contain",
    borderColor: CPColors.white,
    borderWidth: 1,
    marginLeft: -15,
  },
  totallikeText: {
    color: CPColors.white,
    fontFamily: CPFonts.medium,
    fontSize: 7,
  },
  selectedIndexView: {
    position: "absolute",
    bottom: -10,
    top: -15,
    left: widthPercentageToDP("50%") - 40,
    justifyContent: "space-between",
  },
  swipeViewStyle: {
    backgroundColor: CPColors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CPColors.white,
    shadowColor: CPColors.white,
    shadowRadius: 0.5,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    alignSelf: "center",
  },
  notiImage: { width: 25, height: 25 },
  favImage: { width: 25, height: 25 },
});
