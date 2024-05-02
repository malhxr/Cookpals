import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DashedLine from "react-native-dashed-line";
import { Icon } from "react-native-elements";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Snackbar from "react-native-snackbar";
import VideoPlayers from "react-native-video-players";
import { useSelector } from "react-redux";
import Assets from "../Assets";
import CPColors from "../Utils/CPColors";
import { UPLOAD_VIDEO_API } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { copyAssetInFile } from "../Utils/CPGlobalMethods";
import { postApi } from "../Utils/ServiceManager";
import CPProfileImage from "./CPProfileImage";
import CPVideoPlayerComponent from "./CPVideoPlayerComponent";

var videoSelectedIndex = -1;
const CPAddRecipeStepList = (props) => {
  const userSelector = useSelector((state) => state);
  const [recipeStep, setRecipeStep] = useState(props.data ?? [{}]);
  const [shouldVisible, setShouldVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // useState(() => {
  //     console.log("dsfdsfhkjhsdfkhk");
  //     if (selectedIndex !== -1) {

  //     }
  // }, [selectedIndex])

  // useEffect(() => {
  //     setShouldVisible(props.isShouldVisible)
  // }, [props.isShouldVisible])

  const onChangeRemoveStep = (value) => {
    if (recipeStep.length !== 1) {
      setRecipeStep(recipeStep.filter((item, index) => index !== value));
      props.removeRecipeVideo(
        recipeStep.filter((item, index) => index !== value)
      );
    }
  };

  const onChangeDescription = (value, index) => {
    let recipeData = [...recipeStep];

    recipeData[index].steps_description = value;
    // props.setRecipeStep(recipeData)
    props.setRecipeDescription(value, index);
    setRecipeStep(recipeData);
  };

  const onChangeVideo = async (response, index, item) => {
    let data =
      response && response?.assets?.length > 0 ? response?.assets[0] : [];

    // let recipeData = [...recipeStep];

    const uriParts = data.fileName
      ? data?.fileName?.split(".")
      : data?.uri?.split(".");
    const strURIToUse =
      Platform.OS === "ios" ? data.uri.replace("file:/", "") : data?.uri;
    const filePath = await copyAssetInFile(data?.uri);
    // content://media/external_primary/video/media/447 file:///data/user/0/com.cookpals/cache/447 uploadStepVideo
    console.log(strURIToUse, filePath, "uploadStepVideo");
    if (data?.uri?.startsWith("content://")) {
      data.uri = filePath;
    }
    if (!data.fileName.includes(".mp4")) {
      data.fileName = data.fileName + ".mp4";
    }

    // let newName = data?.fileName?.split('-')[data?.fileName?.split('-')?.length - 1]?.split('.')[0]

    // data?.fileName = newName
    // const finalImageDetails = {
    //   uri: strURIToUse,
    //   name:
    //     data.fileName ||
    //     Math.round(new Date().getTime() / 1000) +
    //       "." +
    //       uriParts[uriParts.length - 1],
    //   type: data.type,
    // };

    // console.log(data, "responseresponse", strURIToUse);
    // recipeData[index].stepvideo = strURIToUse; // demo purpost commented
    setRecipeStep((recipeData) => [
      ...recipeData?.slice(0, index),
      { ...item, stepvideo: strURIToUse },
      ...recipeData?.slice(index + 1),
    ]);
    videoSelectedIndex = index;
    setSelectedIndex(index);
    // setRecipeStep(recipeData);
    uploadStepVideo(data);
    console.log(recipeStep, "datapdata", data);
  };

  const uploadStepVideo = (data, index) => {
    const param = {
      stepvideo: data,
    };
    console.log(param, "param");
    props.setDisablity(true);
    postApi(
      UPLOAD_VIDEO_API,
      param,
      onSuccessUploadVideo,
      onFailureUploadVideo,
      userSelector.userOperation
    );
  };

  const onSuccessUploadVideo = (response) => {
    if (response.success) {
      console.log("SUCCESS UPLOAD VIDEO ::::::: ", response);
      props.setDisablity(false);
      const selectedIndexes = selectedIndex;
      props.setRecipeVideo(response?.data, videoSelectedIndex);
      setSelectedIndex(-1);
    } else {
      console.log("FAIL ::::: ", recipeStep);
      props.setDisablity(false);
      let recipeData = [...recipeStep];
      delete recipeData[videoSelectedIndex].stepvideo;
      setRecipeStep(recipeData);
      setSelectedIndex(-1);
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const onFailureUploadVideo = (error) => {
    props.setDisablity(false);
    let recipeData = [...recipeStep];
    delete recipeData[videoSelectedIndex].stepvideo;
    setRecipeStep(recipeData);
    setSelectedIndex(-1);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
    console.log("FAILURE UPLOAD VIDEO ::::::: ", error);
  };

  const renderAddrRcipeList = (item, index) => {
    console.log("AAAAAAA :::: ", item?.stepvideo);
    return (
      <View key={index} style={style.container}>
        <View style={style.dashView}>
          <View style={style.subDashView} />

          <DashedLine
            axis="vertical"
            style={{ width: 1, flex: recipeStep.length - 1 == index ? 0.2 : 1 }}
            dashColor={CPColors.textInputColor}
            dashLength={5}
          />
        </View>
        <View style={style.subContainer}>
          <View style={style.stepView}>
            <Text style={style.stepText}>{"Step " + (index + 1)}</Text>
            <Pressable
              style={style.removeTouch}
              onPress={() => onChangeRemoveStep(index)}
            >
              <Icon name={"remove"} color={CPColors.borderColor} size={20} />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CPVideoPlayerComponent
              disableBack
              disableSeekbar
              disableTimer
              disableVolume
              source={item?.stepvideo ?? null}
              isopenModal={shouldVisible}
              navigation={props.navigation}
              onSelectImageData={(data) => {
                onChangeVideo(data, index, item);
                console.log(data, "onChangeVideodata");
              }}
              // style={{alignSelf: 'flex-start',}}
              playerStyle={{
                height: 60,
                width: "40%",
                alignSelf: "flex-start",
                marginVertical: 20,
              }}
              // style={{ borderWidth: 1 }}
              imageStyle={{
                marginVertical: 20,
                alignSelf: "flex-start",
              }}
              error={
                props.isShouldVisible && !item?.stepvideo
                  ? "Please add video"
                  : null
              }
            />
            {item?.stepvideo?.uri && selectedIndex !== index ? (
              <Pressable
                style={{ flex: 1, justifyContent: "center", borderWidth: 1 }}
                onPress={() => setShouldVisible(!shouldVisible)}
              >
                <Icon
                  style={{ alignSelf: "center" }}
                  size={20}
                  name="add"
                  color={CPColors.primary}
                />
              </Pressable>
            ) : selectedIndex == index ? (
              <ActivityIndicator color={CPColors.primary} />
            ) : null}
          </View>

          <View style={style.textViewStyle}>
            <TextInput
              value={item.steps_description ?? ""}
              style={style.textInputStyle}
              multiline

              placeholder="Enter text here..."
              placeholderTextColor={CPColors.secondary}
              onChangeText={(value) => onChangeDescription(value, index)}
            />
          </View>
          {props.isShouldVisible && !item.steps_description ? (
            <Text
              style={{
                color: CPColors.red,
                fontSize: 12,
                fontFamily: CPFonts.regular,
                marginTop: 5,
                marginLeft: 5,
              }}
            >
              {"Please add description"}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };
  return (
    <View>
      {recipeStep.map((item, index) => renderAddrRcipeList(item, index))}
      {recipeStep.filter((item) => !item.stepvideo || !item.steps_description)
        .length == 0 && selectedIndex == -1 ? (
        <Pressable
          style={style.pressable}
          onPress={() => {
            setRecipeStep((oldArray) => [...oldArray, {}]);
            props.setAddStep((oldArr) => [...oldArr, {}]);
          }}
        >
          <Icon name={"add"} size={16} color={CPColors.secondaryLight} />

          <Text style={style.textStyle}>{"Add more steps"}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default CPAddRecipeStepList;

const style = StyleSheet.create({
  container: { flexDirection: "row" },
  dashView: {
    position: "absolute",
    top: 3,
    bottom: 0,
    left: 0,
    alignItems: "center",
  },
  subDashView: {
    width: 15,
    height: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: CPColors.primary,
    backgroundColor: CPColors.white,
  },
  subContainer: { flex: 1, paddingBottom: 20, marginLeft: 30 },
  stepView: { flexDirection: "row", alignItems: "center" },
  stepText: {
    flex: 1,
    fontFamily: CPFonts.semiBold,
    fontSize: 14,
    color: CPColors.secondary,
  },
  removeTouch: {
    borderWidth: 1.5,
    borderRadius: 20,
    borderColor: CPColors.borderColor,
    backgroundColor: CPColors.ingredianColor,
  },
  stepImageStyle: { marginVertical: 10 },
  textViewStyle: {
    borderWidth: 1,
    borderColor: CPColors.textInputColor,
    borderRadius: 10,
    height: 100,
    marginTop: 5,
  },
  textInputStyle: {
    // flex: 1,
    // margin: 10,
    padding: 8,
    color: CPColors.chatInput,
    fontSize: 16,
    fontFamily: CPFonts.regular,
    marginLeft: 5
    // backgroundColor: "red",
  },
  pressable: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  textStyle: {
    fontSize: 16,
    fontFamily: CPFonts.medium,
    color: CPColors.secondaryLight,
  },
});
