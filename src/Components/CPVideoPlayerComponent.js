import React, { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { widthPercentageToDP } from "react-native-responsive-screen";
import VideoPlayers from "react-native-video-controls";
import Assets from "../Assets";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import CPPopupView from "./CPPopupView";

const CPVideoPlayerComponent = (props) => {
  const [videoDetails, setVideoDetails] = useState(props.source ?? null);
  const [isopenModal, setisOpenModal] = useState(false);
  const navigation = props?.navigation?.navigation;
  console.log(videoDetails, "CPVideoPlayerComponent");

  useEffect(() => {
    if (props?.isopenModal) {
      setisOpenModal(true);
    }
  }, [props?.isopenModal]);

  useEffect(() => {
    setVideoDetails(props?.source);
  }, []);

  const photoType = {
    mediaType: "photo",
  };

  const openLibrary = () => {
    onCloseModal();
    setTimeout(() => {
      launchImageLibrary(
        {
          mediaType: "video",
          videoQuality: "medium",
          durationLimit: 15000,
        },
        (image) => {
          console.log("III :::: ", image);
          if (!image?.didCancel) {
            console.log("onselectimage is no cancled");
            setVideoDetails(image?.assets[0]?.uri);
            if (props.onSelectImageData !== undefined) {
              console.log("onselectimage is not undefined");
              props.onSelectImageData(image);
            }
          }
        }
      );
    }, 500);
  };

  const openCamera = () => {
    onCloseModal();
    setTimeout(() => {
      launchCamera(
        {
          mediaType: "video",
          videoQuality: "medium",
          durationLimit: 15000,
        },
        (image) => {
          console.log("III :::: ", image, image?.assets[0]?.uri);
          if (!image?.didCancel) {
            console.log("onselectimage is no cancled");
            setVideoDetails(image?.assets[0]?.uri);
            if (props.onSelectImageData !== undefined) {
              console.log("onselectimage is not undefined");
              props.onSelectImageData(image);
            }
          }
        }
        // (image) => {
        //   console.log("cameraLaunch", image?.assets[0]?.uri);
        //   if (!image?.didCancel && image?.assets[0]?.uri) {
        //     setVideoDetails(image?.assets[0]?.uri);
        //     props.onSelectImageData(image);
        //     if (props.onSelectImageData !== undefined) {
        //       props.onSelectImageData(image);
        //     }
        //   }
        // }
      );
    }, 500);
  };

  const onCloseModal = () => {
    setisOpenModal(false);
  };

  const pickerModal = () => {
    return (
      <CPPopupView
        isVisible={isopenModal}
        onRequestClose={() => {
          setisOpenModal(false);
        }}
        animationType={"slide"}
        style={{ justifyContent: "flex-end" }}
      >
        <View
          style={{
            width: widthPercentageToDP("100"),
            backgroundColor: CPColors.white,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            shadowOpacity: 0.5,
            shadowColor: CPColors.black,
            shadowOffset: { height: 0, width: 0 },
            shadowRadius: 0.5,
          }}
        >
          <SafeAreaView style={{}}>
            <Text
              style={{
                textAlign: "center",
                fontFamily: CPFonts.bold,
                fontSize: 16,
                marginVertical: 20,
              }}
            >
              {"Select avatar"}
            </Text>
            <Pressable
              style={{
                alignItems: "center",
                borderTopWidth: 0.3,
                borderColor: CPColors.borderColor,
              }}
              onPress={openLibrary}
            >
              <Text
                style={{
                  fontFamily: CPFonts.regular,
                  fontSize: 12,
                  marginVertical: 20,
                }}
              >
                {"Select video"}
              </Text>
            </Pressable>
            <Pressable style={{ alignItems: "center" }} onPress={openCamera}>
              <Text
                style={{
                  fontFamily: CPFonts.regular,
                  marginVertical: 20,
                  fontSize: 12,
                }}
              >
                {"Capture video"}
              </Text>
            </Pressable>
            <Pressable style={{ alignItems: "center" }} onPress={onCloseModal}>
              <Text
                style={{
                  fontFamily: CPFonts.bold,
                  marginVertical: 20,
                  color: CPColors.red,
                  fontSize: 16,
                }}
              >
                {"Cancel"}
              </Text>
            </Pressable>
          </SafeAreaView>
        </View>
      </CPPopupView>
    );
  };

  return (
    <>
      <View>
        {pickerModal()}
        <Pressable
          onPress={() => setisOpenModal(!isopenModal)}
          style={props.style}
        >
          {videoDetails ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("fullScreenVideoPlayer", {
                  video: videoDetails
                })}
            >
              <VideoPlayers

                disableBack={props.disableBack ? true : null}
                disableVolume={props.disableVolume ? true : null}
                disableSeekbar={props.disableSeekbar ? true : null}
                disableTimer={props.disableTimer ? true : null}
                theme={CPColors.theme}
                source={{
                  uri: videoDetails,
                }}
                paused={true}
                resizeMode={"contain"}
                controlTimeout={2000}
                hideControlsOnStart
                backToList={() => { }}
                style={props.playerStyle}
              />
            </TouchableOpacity>
          ) : (
            <Image
              source={props.placeholder ?? Assets.video}
              style={props.imageStyle}
            />
          )}
        </Pressable>
        {props.error ? (
          <Text
            style={{
              color: CPColors.red,
              fontSize: 12,
              fontFamily: CPFonts.regular,
              marginTop: 5,
              marginLeft: 5,
            }}
          >
            {props.error}
          </Text>
        ) : null}
      </View>
    </>
  );
};

export default CPVideoPlayerComponent;
