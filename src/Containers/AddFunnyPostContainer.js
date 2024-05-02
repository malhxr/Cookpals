import React, { useState, useEffect } from "react";
import {
  Image,
  // KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "react-native-snackbar";
import VideoPlayers from "react-native-video-players";
import { useSelector } from "react-redux";
import Assets from "../Assets";
import CPProfileImage from "../Components/CPProfileImage";
import CPRecipeVideo from "../Components/CPRecipeVideo";
import CPThemeButton from "../Components/CPThemeButton";
import CPVideoPlayerComponent from "../Components/CPVideoPlayerComponent";
import CPColors from "../Utils/CPColors";
import { POST_ADD_API } from "../Utils/CPConstant";
import { POST_EDIT_API } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { postApi } from "../Utils/ServiceManager";
import ValidationHelper from "../Utils/ValidationHelper";
import BaseContainer from "./BaseContainer";
import { showDialogue } from "../Utils/CPAlert";

// var videoDetails = null
const AddFunnyPostContainer = (props) => {
  const userSelector = useSelector((state) => state);
  const [description, setDescription] = useState(
    props?.route?.params?.description ?? ""
  );
  const [id, setId] = useState(props?.route?.params?.id ?? "");
  const [shouldVisible, setShouldVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState(
    props?.route?.params?.video ?? null
  );
  const validationHelper = new ValidationHelper();

  console.log(id, ":::::id of the funny video in the edit container");

  const plan = userSelector?.userOperation?.detail?.plan?.plan_type;
  const funny_video = userSelector?.userOperation?.post?.funny_video.length;

  useEffect(() => {
    if (funny_video >= 3 && plan == "Free Plan") {
      showDialogue(
        "You need to subscribed to premium plan for this feature",
        [{ text: "" }],
        "Cookpals",
        navigateToBack
      );
    }
  }, []);

  const navigateToBack = () => {
    props.navigation.goBack();
  };

  const onAddFunnyVideo = () => {
    setShouldVisible(true);
    if (description.trim() == "" || videoDetails == null) {
      return;
    } else {
      props?.route?.params?.isEdit
        ? editFunnyVideoAction()
        : addFunnyVideoAction();
    }
  };

  console.log("FUNNYPOST", videoDetails);
  const editFunnyVideoAction = () => {
    let params = {
      type: 2,
      description: description,
    };
    if (videoDetails?.assets[0]?.uri) {
      params["video"] = videoDetails?.assets[0];
    }
    console.log("editFunnyVideoAction", params);
    setShouldVisible(false);
    setIsLoading(true);
    postApi(
      POST_EDIT_API + id,
      params,
      onSuccessEditFunnyPost,
      onFailureEditFunnyPost,
      userSelector.userOperation
    );
  };

  const onSuccessEditFunnyPost = (response) => {
    console.log("ADD Funny Post ::::: ", response);
    if (response.success) {
      // setDescription(description)
      // setVideoDetails(videoDetails)
      props.navigation.goBack();
    }
    setIsLoading(false);
    Snackbar.show({
      text: response.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const onFailureEditFunnyPost = (error) => {
    console.log("FAILURE Funny Post ::::: ", error);
    setIsLoading(false);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const addFunnyVideoAction = () => {
    let params = {
      type: 2,
      description: description,
      video: videoDetails?.assets[0],
    };
    console.log("addFunnyVideoAction", videoDetails);
    setShouldVisible(false);
    setIsLoading(true);
    postApi(
      POST_ADD_API,
      params,
      onSuccessAddFunnyPost,
      onFailureAddFunnyPost,
      userSelector.userOperation
    );
  };

  const onSuccessAddFunnyPost = (response) => {
    console.log("ADD Funny Post ::::: ", response);
    if (response.success) {
      setDescription("");
      setVideoDetails(null);
      props.navigation.goBack();
    }
    setIsLoading(false);
    Snackbar.show({
      text: response.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const onFailureAddFunnyPost = (error) => {
    console.log("FAILURE Funny Post ::::: ", error);
    setIsLoading(false);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const onHandleVideo = (data) => {
    if (props?.route?.params?.isEdit) {
      console.log(data, ":::::data of the video in the edit container");
      setVideoDetails(data);
    } else {
      setVideoDetails(data);
      setShouldVisible(false);
    }
  };

  const onChangeDescription = (value) => {
    setShouldVisible(false);
    setDescription(value);
  };

  return (
    <BaseContainer
      title={
        props?.route?.params?.isEdit ? "Edit Funny Video" : "Post Funny Video"
      }
      onBackPress={navigateToBack}
      isLoading={isLoading}
    >
      <View style={{ flex: 1, paddingBottom: 10 }}>
        <KeyboardAwareScrollView>
          <CPVideoPlayerComponent
            source={
              props?.route?.params?.isEdit ? videoDetails : videoDetails?.uri
            }
            onSelectImageData={onHandleVideo}
            playerStyle={{
              height: 150,
              width: "85%",
              alignSelf: "center",
              marginVertical: 20,
            }}
            imageStyle={style.stepImageStyle}
          />
          {shouldVisible && videoDetails == null ? (
            <Text
              style={{
                color: CPColors.red,
                fontSize: 12,
                fontFamily: CPFonts.regular,
                marginTop: 5,
                marginLeft: 5,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {"Please add video"}
            </Text>
          ) : null}

          <TextInput
            value={description}
            style={{
              height: 150,
              borderRadius: 10,
              borderWidth: 0.4,
              borderColor: CPColors.borderColor,
              marginHorizontal: 24,
              paddingHorizontal: 15,
              paddingTop: 15,
              color: CPColors.secondary,
              fontSize: 16,
              fontFamily: CPFonts.regular,
            }}
            textAlignVertical={"top"}
            placeholder={"Description (up to 800 characters)"}
            placeholderTextColor={CPColors.secondaryLight}
            onChangeText={onChangeDescription}
            multiline
          />
          {shouldVisible &&
            validationHelper
              .isEmptyValidation(description, "Please add description")
              .trim() !== "" ? (
            <Text
              style={{
                color: CPColors.red,
                fontSize: 12,
                fontFamily: CPFonts.regular,
                marginTop: 5,
                marginLeft: 24,
                marginTop: 10,
              }}
            >
              {"Please add description"}
            </Text>
          ) : null}
        </KeyboardAwareScrollView>

        <CPThemeButton
          title={props?.route?.params?.isEdit ? "Save" : "Post"}
          onPress={onAddFunnyVideo}
          isLoading={isLoading}
        />
      </View>
    </BaseContainer>
  );
};

export default AddFunnyPostContainer;

const style = StyleSheet.create({
  stepImageStyle: { marginVertical: 50, alignSelf: "center", borderWidth: 1 },
});