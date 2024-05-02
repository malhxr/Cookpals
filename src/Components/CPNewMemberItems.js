import React, { useEffect, useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import CPColors from "../Utils/CPColors";
import { FOLLOW, USER_DETAILS } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { getApi, postApi } from "../Utils/ServiceManager";
import CPButton from "./CPButton";
import CPImageComponent from "./CPImageComponent";
import { showDialogue } from "../Utils/CPAlert";
import { MY_ACCOUNT_API } from "../Utils/CPConstant";
import { savePostInRedux } from "../redux/Actions/User";
import NavigationServiceManager from "../Utils/NavigationServiceManager";

const CPNewMemberItems = (props) => {
  const userSelector = useSelector((state) => state);
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const [userFollow, setUserFollow] = useState();
  const plan = userSelector?.userOperation?.detail?.plan?.plan_type;
  const following = userSelector?.userOperation?.post?.following;

  useEffect(() => {
    !props.isNewGrp && userDetails();
  }, []);

  const userDetails = () => {
    getApi(
      USER_DETAILS + props.item.id,
      onSuccessClickAccount,
      onFailureClickAccount,
      userSelector.userOperation
    );
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
    if (response.success) {
      dispatch(savePostInRedux(response.data));
    }
  };

  const onFailureMyAccount = (error) => {
    console.log(" FAILURE MY ACCOUNT ::::::", error);
  };

  const onSuccessClickAccount = (response) => {
    if (response.success) {
      setUser(response.data);
      setUserFollow(response.data?.my_profile?.isfollow);
      userCurrentDetail();
    }
  };

  const onFailureClickAccount = (error) => {
    console.log(" FAILURE CLICK ACCOUNT ::::::", error);
  };

  const onChangeFollowUnFollowStatus = () => {
    console.log(following)
    if (plan == "Free Plan" && following >= 5 && userFollow === 0) {
      showDialogue(
        "You need to subscribed to premium plan for this feature",
        [{ text: "" }],
        "Cookpals"
      );
    } else {
      if (user) {
        OnFollowChangeForFollow();
      } else {
        props?.onChangeStatus(data);
      }
    }
  };

  const OnFollowChangeForFollow = () => {
    const params = {
      status: user?.my_profile?.isfollow === 0 ? 1 : 0,
      follower_id: props.item.id,
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
    if (response.success) {
      setUserFollow(response.data.status);
      userDetails();
    }
  };

  const onFailureFollow = (error) => {
    console.log("FAILURE ACTIVE :::::: ", error);
  };

  return (
    <Pressable
      style={style.pressableStyle}
      onPress={() => props.onPress(props.item)}
      //commented the above line for build but is necessary when working on this component
    >
      <CPImageComponent
        style={style.imageStyle}
        source={
          props?.item?.profile ??
          (props.mode == 0
            ? props?.item?.user_list[0]?.profile
            : props?.item?.profile)
        }
      />

      <View style={style.viewStyle}>
        <Text style={style.nameStyle}>
          {props.mode == 0
            ? props?.item?.user_list[0]?.name
            : props?.item?.name}
        </Text>
        <Text style={style.subTitle}>
          {props.mode == 0
            ? props?.item?.user_list[0]?.my_preference_chatelist?.country?.name
            : props?.item?.my_preference_chatelist?.country?.name}
        </Text>
      </View>
      {props.onChangeStatus ? (
        <CPButton
          style={{ alignSelf: "center" }}
          title={
            props?.item?.follow || userFollow === 0 ? "Follow" : "Unfollow"
          }
          onPress={onChangeFollowUnFollowStatus}
        />
      ) : props.mode == 0 ? (
        <Icon
          name={props.isSelected ? "check" : "add"}
          style={{
            backgroundColor: props.isSelected
              ? CPColors.primary
              : CPColors.transparent,
            borderRadius: 8,
            borderColor: CPColors.primary,
            borderWidth: 2,
          }}
          size={20}
          color={props.isSelected ? CPColors.white : CPColors.primary}
        />
      ) : (
        <Icon
          name={props.isSelected ? "check" : "add"}
          style={{
            backgroundColor: props.isSelected
              ? CPColors.primary
              : CPColors.transparent,
            borderRadius: 8,
            borderColor: CPColors.primary,
            borderWidth: 2,
          }}
          size={20}
          color={props.isSelected ? CPColors.white : CPColors.primary}
        />
      )}
    </Pressable>
  );
};

export default CPNewMemberItems;

const style = StyleSheet.create({
  pressableStyle: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  imageStyle: {
    width: widthPercentageToDP("10%"),
    height: widthPercentageToDP("10%"),
    borderRadius: widthPercentageToDP("10%"),
  },
  viewStyle: { flex: 1, marginHorizontal: 15, justifyContent: "space-between" },
  nameStyle: {
    fontSize: 14,
    fontFamily: CPFonts.regular,
    color: CPColors.secondary,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: CPFonts.regular,
    color: CPColors.secondaryLight,
    marginTop: 5,
  },
});
