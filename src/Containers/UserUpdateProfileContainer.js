import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { Image, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Assets from "../Assets";
import CPBackButton from "../Components/CPBackButton";
import CPImageComponent from "../Components/CPImageComponent";
import CPProfileImage from "../Components/CPProfileImage";
import CPTextInput from "../Components/CPTextInput";
import CPThemeButton from "../Components/CPThemeButton";
import CPColors from "../Utils/CPColors";
import CPDatePickerComponent from "../Components/CPDatePickerComponent";
import CPGenderSelectionComponent from "../Components/CPGenderSelectionComponent";
import ValidationHelper from "../Utils/ValidationHelper";
import CPProfileComponent from "../Components/CPProfileComponent";
import { useDispatch, useSelector } from "react-redux";
import { getApi, postApi } from "../Utils/ServiceManager";
import { GET_GENDER_API, PROFILE_SEARCH_API, UPDATE_PROFILE_API } from "../Utils/CPConstant";
import { saveUserDetailInRedux } from "../redux/Actions/User";
import Snackbar from "react-native-snackbar";
import CPFonts from "../Utils/CPFonts";
import { Icon } from "react-native-elements";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import CPPopover from "../Components/CPPopover";
import { initial } from "lodash";

var coverImageDetail = null;
var userProfileImageDetail = null;
const UserUpdateProfileContainer = (props) => {
  const usersDispatcher = useDispatch();
  const userSelector = useSelector((state) => state);
  const [fullName, setfullName] = useState(
    userSelector?.userOperation?.detail.name ?? ""
  );
  const [phoneNumber, setphoneNumber] = useState(
    userSelector?.userOperation?.detail.phone_number ?? ""
  );
  const [description, setDescription] = useState(
    userSelector?.userOperation?.detail.bio ?? ""
  );
  const [gender, setGender] = useState(
    userSelector?.userOperation?.detail.gender ?? ""
  );

  const [genderArray, setGenderArray] = useState([]);
  const [shouldVisible, setShouldVisible] = useState(false);
  const [lgbtq, setlgbtq] = useState(
    userSelector?.userOperation?.detail.lgbtq == 1 ? true : false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFocus, setFocus] = useState(false);
  const [isTermCondition, setTermCondition] = useState(false);
  const [toggle, Settoggle] = useState(false);
  const [error, SetError] = useState(false);

  const Countrycode = [
    {
      name: "+91",
      image: Assets.india,
    },
    {
      name: "+63",
      image: Assets.philipaines,
    },
    {
      name: "+84",
      image: Assets.vietnam,
    },
    {
      name: "+1",
      image: Assets.usa,
    },
    {
      name: "+62",
      image: Assets.indonesia,
    },
  ];
  const [code, setCode] = useState(Countrycode[0]);
  const validationHelper = new ValidationHelper();

  const countrycodepress = (item) => {
    Settoggle(false);
    setCode(item);
  };

  useEffect(() => {
    genderReceiveAction();
  }, []);

  const genderReceiveAction = () => {
    getApi(GET_GENDER_API, onSuccessGetGender, onFailureGetGender);
  };

  const onSuccessGetGender = (response) => {
    console.log(" :::::::: ", response);
    setGenderArray(response.data.filter((item, index) => index !== 2));
  };

  const onFailureGetGender = (error) => {
    console.log("ERROR :::::::: ", error);
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };

  const onChangeFullName = (text) => {
    SetError(false);

    setShouldVisible(false);
    setfullName(text);
    console.log(fullName, "fullname");
  };

  const onChangeDescription = (text) => {
    SetError(false);

    setShouldVisible(false);
    setDescription(text);
  };

  const onChangePhoneNumber = (text) => {

    setShouldVisible(false);
    setphoneNumber(text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, ''));
    console.log(phoneNumber, phoneNumber.length, "ddddddd");
  };
  const updateProfile = () => {
    const params = {
      name: fullName,
      gender: gender,
      phone_number: phoneNumber,
      bio: description,
      lgbtq: lgbtq ? 1 : 0,
    };
    if (coverImageDetail) {
      params["cover_image"] = coverImageDetail;
    }

    if (userProfileImageDetail) {
      params["profile"] = userProfileImageDetail;
    }
    setIsLoading(true);
    postApi(
      UPDATE_PROFILE_API,
      params,
      onSuccessUpdateProfile,
      onFailureUpdateProfile,
      userSelector.userOperation
    );
  };
  console.log(!props?.route?.params?.isCurrentUser, 'ddddd');
  const onSuccessUpdateProfile = (response) => {
    console.log("SUCCESS UPDATE ::::: ", response);
    if (response.success) {
      let dict = response.data;
      dict["token"] = userSelector.userOperation.detail.token;
      usersDispatcher(saveUserDetailInRedux(dict));
      props.navigation.goBack();
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
    setIsLoading(false);
  };

  const onFailureUpdateProfile = (error) => {
    console.log("Failure ::::: ", error);
    setIsLoading(false);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const userDetailValidation = () => {
    setShouldVisible(true);
    SetError(true);
    if (
      validationHelper.mobileValidation(phoneNumber) !== "" ||
      validationHelper.fullNameValidation(fullName) !== "" ||
      validationHelper.descriptionValidation(description) !== "" ||
      !gender ||
      (!props?.route?.params?.isCurrentUser && coverImageDetail == null && coverImageDetail == "")
    ) {
      return;
    } else {
      if (props?.route?.params?.isCurrentUser) {
        updateProfile();
      } else {
        let params = {
          email: props.route?.params?.email,
          date_of_birth: props.route?.params?.dob,
          password: props.route?.params?.password,
          confirm_password: props.route?.params?.password,
          name: fullName,
          phone_number: code?.name + phoneNumber,
          bio: description,
          lgbtq: lgbtq ? 1 : 0,
          gender: gender,
        };

        console.log("IMageeee ::::: ", coverImageDetail);
        if (coverImageDetail) {
          params.cover_image = coverImageDetail;
        }

        if (userProfileImageDetail) {
          params.profile = userProfileImageDetail;
        }
        props.navigation.navigate("otp", params);
      }
    }
  };

  return (
    <View style={styles.flexView} pointerEvents={isLoading ? "none" : "auto"}>
      <KeyboardAwareScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <CPBackButton style={styles.backStyle} onBackPress={navigateToBack} />
        <View style={styles.topView}>
          <CPProfileImage
            isAdmin={true}
            defaultImage={userSelector?.userOperation?.detail?.cover_image}
            imagestyle={styles.widthStyle}
            placeholder={Assets.defaultselectimage}
            onSelectImageData={(data) => {
              coverImageDetail = data;
              setShouldVisible(false);
              SetError(false);
            }}
          />
          <View style={styles.topImageView}>
            <Image source={Assets.cloudimage} style={{ width: "100%", height: "100%" }} />

            <CPProfileImage
              isAdmin={true}
              isEditImage
              userProfile
              defaultImage={userSelector?.userOperation?.detail?.profile}
              style={styles.imageStyle}
              placeholder={Assets.profileimage}
              imagestyle={{ width: 90, height: 90, borderRadius: 90 }}
              onSelectImageData={(data) => {
                setShouldVisible(false);
                SetError(false);
                userProfileImageDetail = data;
              }}
            />
          </View>
        </View>
        {shouldVisible &&
          !props?.route?.params?.isCurrentUser &&
          coverImageDetail == null ? (
          <Text
            style={{
              fontFamily: CPFonts.regular,
              fontSize: 12,
              color: CPColors.red,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {"Please select cover image."}{" "}
          </Text>
        ) : shouldVisible &&
          !props?.route?.params?.isCurrentUser &&
          userProfileImageDetail == null ? (
          <Text
            style={{
              fontFamily: CPFonts.regular,
              fontSize: 12,
              color: CPColors.red,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {"Please select profile image."}{" "}
          </Text>) : null}

        <View style={styles.bottomView}>
          <CPTextInput
            maxLength={70}
            value={fullName}
            source={Assets.accountdeselect}
            placeholder={"Full Name"}
            onChangeText={onChangeFullName}
            error={
              shouldVisible &&
              validationHelper.fullNameValidation(fullName).trim()
            }
          />

          <CPGenderSelectionComponent
            // isPressDisable={props.route?.params?.isCurrentUser}
            data={genderArray}
            source={Assets.gender}
            defaultValue={gender}
            placeholder={"Gender"}
            onSelectValue={setGender}

            error={shouldVisible && !gender ? "Please select gender" : ""}
          />

          <Pressable
            style={styles.termsPressable}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => {
              setlgbtq(!lgbtq);
            }}
          >
            <Icon
              type={"ionicon"}
              name={lgbtq ? "checkbox-outline" : "square-outline"}
              size={15}
            />
            <Text style={styles.termsCondition1}>
              Belongs to
              <Text style={styles.termsCondition2}>{" LGBTQ "}</Text>
              Community
            </Text>
          </Pressable>

          {/* < 
            value={phoneNumber}
            containerStyle={{ marginTop: 0 }}
            source={Assets.call}
            placeholder={"Phone Number"}
            keyboardType={"number-pad"}
            onChangeText={onChangePhoneNumber}
            error={
              shouldVisible &&
              validationHelper.mobileValidation(phoneNumber).trim()
            }
          /> */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: 15,
              borderWidth: isFocus ? 1 : null,
              marginTop: 25,
              borderRadius: 10,
              backgroundColor: CPColors.textInputColor,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignSelf: "center", padding: 10 }}
              onPress={() => Settoggle(!toggle)}
            >
              <Image
                // source={props.source}
                source={code.image ?? Countrycode[0]?.image}
                style={{
                  alignContent: "center",
                  marginHorizontal: 10,
                  width: 18,
                  height: 18,
                }}
                resizeMode="contain"
              />
              <Text style={{ alignSelf: "center" }}>{code.name ?? "+91"}</Text>
            </TouchableOpacity>

            <TextInput
              // editable={phoneNumber ? false : null}
              value={phoneNumber}
              placeholder={"Phonenumber"}
              placeholderTextColor={CPColors.secondaryLight}
              contextMenuHidden={true}
              keyboardType="numeric"
              maxLength={11}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
          

              onChangeText={onChangePhoneNumber}
              style={{
                flex: 1,
                marginTop: 1,
                position: "relative",
                color: CPColors.secondary,
                fontFamily: CPFonts.medium,
                fontSize: 14,
              }}
            />
          </View>
          {error ? (
            <View>
              <Text
                style={{
                  color: CPColors.red,
                  fontSize: 12,
                  fontFamily: CPFonts.regular,
                  marginTop: 5,
                  marginLeft: 5,
                }}
              >
                {!phoneNumber.trim()
                  ? "Please enter phone number "
                  : phoneNumber.length < 10
                    ? "Please enter valid phone number"
                    : null}
              </Text>
            </View>
          ) : null}
          {toggle ? (
            <View
              style={{
                top: "56%",

                flexDirection: "row",
                position: "absolute",
                zIndex: 10,
                marginLeft: 40,
                width: 75,
                backgroundColor: CPColors.dropdownColor,
                overflow: "hidden",
                borderRadius: 10,
                marginTop: -30,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.8,
                shadowRadius: 1,
                elevation: 2,
              }}
            >
              <FlatList
                data={Countrycode}
                keyExtractor={(index) => index}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <TouchableOpacity
                        onPress={() => countrycodepress(item)}
                        style={{
                          flexDirection: "row",
                          paddingVertical: 10,
                        }}
                      >
                        <Image
                          style={{
                            alignContent: "center",
                            marginHorizontal: 10,
                            width: 18,
                            height: 18,
                          }}
                          source={item.image}
                        />
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          ) : null}
          <CPTextInput
            value={description}
            containerStyle={{ maxHeight: 100 }}
            source={Assets.bio_image}
            multiline
            maxLength={150}
            placeholder={"Bio"}
            onChangeText={onChangeDescription}
            error={

              shouldVisible &&
              validationHelper.descriptionValidation(description).trim()
            }
          />

          <CPThemeButton
            title={"Save & Proceed"}
            style={styles.btnStyle}
            isLoading={isLoading}
            onPress={userDetailValidation}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default UserUpdateProfileContainer;

const styles = StyleSheet.create({
  flexView: { flex: 1, marginTop: -25 },
  container: { backgroundColor: CPColors.white },
  backStyle: { position: "absolute", left: 5, top: 50, zIndex: 1000 },
  topView: {
    backgroundColor: CPColors.dropdownColor,
    width: "100%",
    height: 320,
  },
  bottomView: { backgroundColor: CPColors.white, paddingHorizontal: 24 },
  topImageView: {
    position: "absolute",
    bottom: -1,
    right: 0,
    left: 0,
    top: 200,
  },
  imageStyle: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    borderRadius: 90,
  },
  btnStyle: { marginVertical: 60 },
  widthStyle: { width: "100%", height: "100%", resizeMode: "stretch" },
  termsCondition2: {
    color: CPColors.primary,
    fontSize: 12,
    fontFamily: CPFonts.medium,
  },
  termsCondition1: {
    color: CPColors.secondary,
    fontSize: 12,
    fontFamily: CPFonts.medium,
    marginLeft: 5,
    marginBottom: 3

  },
  termsPressable: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
});
