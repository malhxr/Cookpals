import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import Assets from "../Assets";
import CPColors from "../Utils/CPColors";
import { PROFILE_LIKE } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { postApi } from "../Utils/ServiceManager";
import CPProfileImageComponent from "./CPProfileImageComponent";

const CPProfileComponent = (props) => {
  const { data } = props;
  const userSelector = useSelector((state) => state);
  const [favourite, setFavourite] = useState(
    data?.my_profile?.profilelike ?? 0
  );

  useEffect(() => {
    setFavourite(data?.my_profile?.profilelike ?? 0);
    return () => {};
  }, [data?.my_profile?.profilelike]);

  console.log(
    "USER DATA :::: profile useeffect",
    data?.my_profile?.profilelike,
    favourite
  );

  const setFavProfile = () => {
    const params = {
      profile_id: data?.my_profile?.id,
      status: favourite === 0 ? 1 : 0,
    };
    console.log(params, "params");
    postApi(
      PROFILE_LIKE,
      params,
      onSuccessFav,
      onFailureFav,
      userSelector.userOperation
    );
  };
  const onSuccessFav = (response) => {
    console.log(
      "USER DATA :::: profile response",
      response?.data?.status,
      favourite
    );
    if (response.success) {
      // favourite === 0 ? setFavourite(1) : setFavourite(0);
      setFavourite(favourite === 0 ? 1 : 0);
      console.log("USER DATA :::: profile favourite", favourite);
    }
  };
  const onFailureFav = (error) => {
    console.log(error);
  };

  return (
    <View style={style.mainContainer}>
      <ImageBackground
        style={style.bgImageStyle}
        source={
          data?.my_profile?.cover_image
            ? { uri: data?.my_profile?.cover_image }
            : Assets.profilebanner
        }
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.6)",
            "rgba(255,255,255,0.9)",
            "rgba(255,255,255,1)",
            "#ffffff",
            "#ffffff",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={style.mainContainer}
        >
          <View style={style.mainContainer}>
            <View style={style.subProfileView}>
              <View style={style.profileView}>
                <CPProfileImageComponent
                  size={80}
                  source={data?.my_profile?.profile}
                />
                <Pressable style={style.drawerPress} onPress={props.onPress}>
                  {props.isFavourite ? (
                    <Pressable
                      onPress={setFavProfile}
                      style={{
                        borderRadius: 20,
                        backgroundColor:
                          favourite !== 1 ? "#fff" : CPColors.primary,
                      }}
                    >
                      <Icon
                        style={{ padding: 7 }}
                        size={20}
                        name={favourite !== 1 ? "favorite-border" : "favorite"}
                        color={favourite !== 1 ? CPColors.primary : "#fff"}
                      />
                    </Pressable>
                  ) : (
                    <Image source={Assets.drawer_icon} />
                  )}
                </Pressable>
              </View>
              <Text style={style.nameStyle}>{data?.my_profile?.name}</Text>
              <Text style={style.statusStyle}>
                {data?.my_profile?.my_preference?.country?.name}
              </Text>

              <Text
                numberOfLines={2}
                style={{
                  marginTop: 20,
                  marginHorizontal: 60,
                  textAlign: "center",
                  fontSize: 12,
                  fontFamily: CPFonts.regular,
                  color: CPColors.secondaryLight,
                }}
              >
                {data?.my_profile?.bio}
              </Text>
            </View>

            <View style={style.eventViewStyle}>
              <Pressable
                onPress={props.onLikesClick}
                style={style.pressbleStyle}
              >
                <Text style={style.countStyle}>{data?.likes}</Text>
                <Text style={style.eventStyle}>{"Likes"}</Text>
              </Pressable>
              <View style={style.sepretorStyle} />
              <Pressable
                style={style.pressbleStyle}
                onPress={props.onFollowersClick}
              >
                <Text style={style.countStyle}>{data?.followers}</Text>
                <Text style={style.eventStyle}>{"Followers"}</Text>
              </Pressable>
              <View style={style.sepretorStyle} />
              <Pressable
                style={style.pressbleStyle}
                onPress={props.onFollowersClick}
              >
                <Text style={style.countStyle}>{data?.following}</Text>
                <Text style={style.eventStyle}>{"Followings"}</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default CPProfileComponent;

const style = StyleSheet.create({
  mainContainer: { flex: 1 },
  bgImageStyle: { width: "100%", height: "100%" },
  subProfileView: { flex: 1, justifyContent: "flex-end", marginBottom: 10 },
  profileView: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  drawerPress: { position: "absolute", bottom: 30, right: 15 },
  nameStyle: {
    fontFamily: CPFonts.semiBold,
    fontSize: 16,
    color: CPColors.secondary,
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  statusStyle: {
    fontFamily: CPFonts.medium,
    fontSize: 12,
    color: CPColors.secondaryLight,
    textAlign: "center",
  },
  pressbleStyle: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    justifyContent: "center",
  },
  countStyle: {
    fontFamily: CPFonts.bold,
    fontSize: 12,
    color: CPColors.secondary,
    marginBottom: 3,
  },
  eventStyle: {
    fontFamily: CPFonts.medium,
    fontSize: 12,
    color: CPColors.secondaryLight,
  },
  sepretorStyle: {
    width: 1,
    height: 15,
    backgroundColor: CPColors.borderColor,
  },
  eventViewStyle: {
    flexDirection: "row",
    marginHorizontal: 30,
    alignItems: "center",
  },
});
