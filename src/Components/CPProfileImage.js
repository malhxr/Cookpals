import React, { useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import SafeAreaView from "react-native-safe-area-view";
import Assets from "../Assets/index";
import { showDialogue } from "../Utils/CPAlert";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import CPPopupView from "./CPPopupView";
import CPImageComponent from "./CPImageComponent";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const CPProfileImage = (props) => {
  const [imageDetails, setImageDetails] = useState(props.defaultImage ?? null);
  const [isopenModal, setisOpenModal] = useState(false);

  const videoType = {
    mediaType: "video",
    videoQuality: "medium",
    durationLimit: 15000,
  };

  const photoType = {
    mediaType: "photo",
  };

  const openLibrary = () => {
    onCloseModal();
    setTimeout(() => {
      launchImageLibrary(props.mediaType ? videoType : photoType, (image) => {
        console.log("III :::: ", image);
        if (!image?.didCancel) {
          setImageDetails(image?.assets[0].uri);
          if (props.onSelectImageData !== undefined) {
            props.onSelectImageData(image?.assets[0]);
          }
        }
      });
    }, 500);
  };

  const openCamera = () => {
    onCloseModal();
    setTimeout(() => {
      launchCamera(props.mediaType ? videoType : photoType, (image) => {
        console.log("III :::: ", image);
        if (!image?.didCancel) {
          setImageDetails(image?.assets[0]?.uri);
          if (props.onSelectImageData !== undefined) {
            props.onSelectImageData(image?.assets[0]);
          }
        }
      });
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
          <SafeAreaView forceInset={{ top: "never" }} style={{}}>
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
                {props.mediaType ? "Select video" : "Select photo"}
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
                {props.mediaType ? "Capture video" : "Capture photo"}
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
      {pickerModal()}
      <Pressable
        style={[
          props.style,
          props.userProfile && imageDetails
            ? { borderWidth: 2, borderColor: CPColors.primary, padding: 2 }
            : props.style,
        ]}
        onPress={() => {
          props?.isAdmin && setisOpenModal(true);
        }}
      >
        {props.renderComponent ? (
          props.renderComponent
        ) : (
          <>
            <CPImageComponent
              style={props.imagestyle}
              source={imageDetails}
              placeholder={props.placeholder}
            />
            {props.isEditImage && imageDetails ? (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: "#cedef5",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ height: 16, width: 16 }}
                  resizeMode="contain"
                  source={Assets.camera}
                />
              </View>
            ) : null}
          </>
        )}
      </Pressable>
    </>
  );
};

export default CPProfileImage;
