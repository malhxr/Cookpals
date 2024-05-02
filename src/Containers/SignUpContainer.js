import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  useWindowDimensions,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import SafeAreaView from "react-native-safe-area-view";
import Assets from "../Assets";
import CPTextInput from "../Components/CPTextInput";
import CPThemeButton from "../Components/CPThemeButton";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import BaseContainer from "./BaseContainer";
import CPDatePickerComponent from "../Components/CPDatePickerComponent";
import ValidationHelper from "../Utils/ValidationHelper";
import { showDialogue } from "../Utils/CPAlert";
import { postApi } from "../Utils/ServiceManager";
import { CHECK_EMAIL_API } from "../Utils/CPConstant";
import Snackbar from "react-native-snackbar";

const SignUpContainer = (props) => {
  const [isTermCondition, setTermCondition] = useState(false);
  const [shouldVisible, setShouldVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validationHelper = new ValidationHelper();
  const [email, setemail] = useState("");
  const [dob, setDOB] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onChangeEmail = (text) => {
    setShouldVisible(false);
    setemail(text);
  };

  const onChangePassword = (text) => {
    setShouldVisible(false);
    setPassword(text);
  };

  const onChangeConfirmPassword = (text) => {
    setShouldVisible(false);
    setConfirmPassword(text);
  };

  const checkValidationHandler = () => {
    setShouldVisible(true);
    if (
      validationHelper.emailValidation(email).trim() !== "" ||
      validationHelper.passwordValidation(password).trim() !== "" ||
      validationHelper
        .confirmPasswordValidation(password, confirmPassword)
        .trim() !== "" ||
      dob.trim() == ""
    ) {
      return;
    } else if (!isTermCondition) {
      showDialogue("Please select terms and condition");
    } else {
      checkEmailExisting();
    }
  };

  const checkEmailExisting = () => {
    let params = {
      email: email,
    };
    setIsLoading(true);
    postApi(CHECK_EMAIL_API, params, onSuccessHandler, onFailureHandler);
  };

  const onSuccessHandler = (response) => {
    console.log("Success Check mail ::::::: ", response);
    setIsLoading(false);
    if (response.success) {
      props.navigation.navigate("adduserdetail", {
        email: email,
        dob: dob,
        password: password,
      });
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const onFailureHandler = (error) => {
    console.log("Failure Check mail ::::::: ", error);
    setIsLoading(false);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.main}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <StatusBar backgroundColor={"#f2f2f3"} barStyle="dark-content" />
      <View pointerEvents={isLoading ? "none" : "auto"}>
        <Image
          style={styles.topImg}
          source={Assets.login2}
          resizeMode="cover"
        />
        <View style={styles.subView}>
          <View style={styles.topView}>
            <View style={styles.topSubView} />
            <Text style={styles.signUpText}>{"Sign Up"}</Text>
            <View style={styles.socialBtnView}>
              <Pressable>
                <Image source={Assets.facebook} />
              </Pressable>
              <Pressable>
                <Image style={styles.socialImg} source={Assets.instagram} />
              </Pressable>
            </View>
          </View>

          <CPTextInput
            value={email}
            source={Assets.email}
            placeholder={"E-Mail"}
            onChangeText={onChangeEmail}
            error={
              shouldVisible && validationHelper.emailValidation(email).trim()
            }
          />

          <CPDatePickerComponent
            toolkitEnable
            source={Assets.birthdaycalender}
            title={"YYYY/MM/DD"}
            type={"octicon"}
            name={"info"}
            onChangeData={setDOB}
            error={
              shouldVisible && dob.trim() == ""
                ? "Please select date of birth"
                : ""
            }
          />

          <CPTextInput
            maxLength={15}
            value={password}
            source={Assets.password}
            placeholder={"Password"}
            secureTextEntry
            onChangeText={onChangePassword}
            error={
              shouldVisible &&
              validationHelper.passwordValidation(password).trim()
            }
          />

          <CPTextInput
            maxLength={15}
            
            value={confirmPassword}
            source={Assets.password}
            placeholder={"Confirm Password"}
            secureTextEntry
            onChangeText={onChangeConfirmPassword}
            error={
              shouldVisible &&
              validationHelper
                .confirmPasswordValidation(password, confirmPassword)
                .trim()
            }
          />

          <View
            style={styles.termsPressable}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Pressable
              style={styles.termsPressable}
              onPress={() => {
                setTermCondition(!isTermCondition);
              }}
            >
              <Icon
                type={"ionicon"}
                name={isTermCondition ? "checkbox-outline" : "square-outline"}
                size={15}
              />
              <Text style={styles.termsCondition1}>
                {"I here by accept All the "}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                props.navigation.navigate("cms", {
                  cms: 1,
                });
              }}
            >
              <Text style={styles.termsCondition2}>
                {"Terms and Conditions"}
              </Text>
            </Pressable>
          </View>

          <CPThemeButton
            title={"Sign Up"}
            style={styles.signUpBtn}
            isLoading={isLoading}
            onPress={() => {
              console.log("LOG    ::::: ");
              checkValidationHandler();
              // props.navigation.navigate('adduserdetail');
            }}
          />

          <Pressable
            style={styles.signInView}
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Text style={styles.alreadyUserText}>
              {"Already  An Explorer Of CookPals? "}
            </Text>
            <Text style={styles.signInText}>{"Sign In"}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUpContainer;

const styles = StyleSheet.create({
  main: {
    backgroundColor: CPColors.white,
    flex: 1,
  },
  topImg: {
    width: "100%",
    height: 330,
  },
  subView: {
    paddingHorizontal: 20,
  },
  topView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -40,
  },
  topSubView: {
    height: 10,
    width: 30,
    backgroundColor: CPColors.lightPrimary,
    borderRadius: 20,
    position: "absolute",
    bottom: 5,
    alignSelf: "flex-end",
  },
  signUpText: {
    fontSize: 32,
    fontFamily: CPFonts.bold,
    color: CPColors.secondary,
  },
  socialBtnView: {
    flexDirection: "row",
  },
  socialImg: {
    marginLeft: 15,
  },
  termsCondition1: {
    color: CPColors.secondary,
    fontSize: 12,
    fontFamily: CPFonts.medium,
    marginLeft: 5,
  },
  termsCondition2: {
    textDecorationLine: "underline",
    color: CPColors.primary,
    fontSize: 12,
    fontFamily: CPFonts.medium,
  },
  signUpBtn: {
    marginVertical: 60,
  },
  signInView: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  alreadyUserText: {
    fontSize: 14,
    fontFamily: CPFonts.medium,
    color: CPColors.secondary,
  },
  signInText: {
    textDecorationLine: "underline",
    color: CPColors.primary,
    fontSize: 14,
    fontFamily: CPFonts.medium,
  },
  termsPressable: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});
