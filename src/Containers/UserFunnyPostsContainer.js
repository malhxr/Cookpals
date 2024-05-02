import React, { useEffect, useState } from "react";
import { Pressable, View, Text, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import Assets from "../Assets";
import CPBackButton from "../Components/CPBackButton";
import CPImageComponent from "../Components/CPImageComponent";
import CPRecipeSlider from "../Components/CPRecipeSlider";
import CPVideoPlayerComponent from "../Components/CPVideoPlayerComponent";
import CPColors from "../Utils/CPColors";
import { USER_FUNNYPOST } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { getApi } from "../Utils/ServiceManager";

const UserFunnyPostsContainer = (props) => {
  const userSelector = useSelector((state) => state);
  const [selectSiderVideo, setSelectedSliderVideo] = useState(0);
  const [funnyPosts, setFunnyPosts] = useState({});

  useEffect(() => {
    userFunnyPost();
  }, []);

  const userFunnyPost = () => {
    getApi(
      USER_FUNNYPOST + props.route.params.userId,
      onSuccessFunnyPost,
      onFailureFunnyPost,
      userSelector.userOperation
    );
  };

  const onSuccessFunnyPost = (response) => {
    console.log(response, "responseoffunnypost");
    if (response.success) setFunnyPosts(response.data[0]);
    else {
      setFunnyPosts({});
    }
  };
  const onFailureFunnyPost = (error) => {
    console.log(error);
  };

  const exploreRecipeItemRender = ({ item, index }) => {
    return (
      <Pressable
        key={index}
        style={{
          marginHorizontal: 20,
          marginTop: 60,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        }}
        onPress={() => {
          props.navigation.navigate("recipeDetail", {
            acc_user_Profile: false,
            isFunnyVideo: true,
            video: item?.video,
            fromCLick: true,
            description: item?.description,
            recipeId: item?.id,
            userId: item?.user_id,
            index: index,
          });
        }}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectSiderVideo == index ? (
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
            source={item?.video}
            style={{ width: "100%", height: "100%", borderRadius: 20 }}
            playerStyle={{
              height: heightPercentageToDP("50%"),
              width: widthPercentageToDP("85%"),
              borderRadius: 20,
            }}
          />
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            top: 0,
            justifyContent: "space-between",
          }}
        >
          <Pressable
            style={{
              position: "relative",
              marginTop: -40,
              alignSelf: "center",
            }}
            onPress={() => {
              props.navigation.navigate("anotherUser", {
                isAnotherUser: true,
                fromClick: true,
                id: item?.user_id,
              });
            }}
          >
            <CPImageComponent
              style={{
                width: widthPercentageToDP("21"),
                height: widthPercentageToDP("21"),
                borderWidth: 2,
                borderColor: CPColors.white,
                borderRadius: widthPercentageToDP("21"),
              }}
              source={funnyPosts?.profile}
            />
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
            style={{ flex: 1, borderRadius: 20, justifyContent: "flex-end" }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: CPColors.white,
                  fontFamily: CPFonts.semiBold,
                  marginHorizontal: 20,
                  marginVertical: 15,
                }}
              >
                {item?.title}
              </Text>
              <View>
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
                  {item?.description}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", marginVertical: 80 }}>
      <CPBackButton
        style={{ position: "absolute", left: 10, top: 0, zIndex: 1000 }}
        onBackPress={() => props.navigation.goBack()}
      />
      {funnyPosts?.user_post?.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{
              color: CPColors.primary,
              fontFamily: CPFonts.bold,
              fontSize: 14,
            }}
          >
            {"No video found"}
          </Text>
        </View>
      ) : (
        <CPRecipeSlider
          data={funnyPosts.user_post}
          componentRender={exploreRecipeItemRender}
          onBeforeSnapToItem={setSelectedSliderVideo}
          onSnapToItem={setSelectedSliderVideo}
          addMargin={40}
        />
      )}
    </View>
  );
};

export default UserFunnyPostsContainer;
