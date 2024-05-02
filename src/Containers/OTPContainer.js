import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Assets from "../Assets";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import BaseContainer from "./BaseContainer";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CPThemeButton from "../Components/CPThemeButton";
import CPPopupView from "../Components/CPPopupView";
import CPUpgradePlan from "../Components/CPUpgradePlan";
import { postApi } from "../Utils/ServiceManager";
import {
  CHECK_EMAIL_VERIFY_API,
  REGISTRATION_API,
  SEND_OTP_API,
} from "../Utils/CPConstant";
import Snackbar from "react-native-snackbar";
import { useDispatch, useSelector } from "react-redux";
import { saveUserDetailInRedux } from "../redux/Actions/User";
import deviceInfoModule from "react-native-device-info";
import { checkFirebaseServices } from "../Utils/FireBaseServiceManager";

const OTPContainer = (props) => {
  const usersDispatcher = useDispatch();
  const userSelector = useSelector((state) => state);
  const [isRegistrationModal, setRegistrationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setotp] = useState("");
  const [recieveOtp, setreceiveotp] = useState("");
  const [timerCount, setTimer] = useState(60);
  const [clickCount, setClickCount] = useState(0);
  const [deviceToken, setDeviceToken] = useState("");

  const modalTitle = {
    title: "Registration Successful",
    description:
      "Your information has been registered successfully. Please verify the link sent in your email.",
    actionStr: "Proceed Further",
    image: Assets.registerPopup,
  };
  console.log("dsfdfs ::::::", props.route.params);
  useEffect(() => {
    sendOTP();
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        return lastTimerCount <= 1 ? 0 : lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    checkFirebaseServices(
      (onSuccessToken) => {
        setDeviceToken(onSuccessToken);
      },
      (onFailureToken) => {
        console.log("FIREBASE FAILURE ::::::: ", onFailureToken);
      }
    );
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, []);

  const updateTimerAndCount = () => {
    setTimer(60);
    setClickCount(clickCount + 1);
  };

  const sendOTP = () => {
    let param = {
      phone_number: props.route?.params?.phone_number,
    };
    postApi(SEND_OTP_API, param, onSuccessOTP, onFailureOTP);
  };

  const onSuccessOTP = (response) => {
    console.log("OTP Success :::::::", response);
    setreceiveotp(response.data.otp);
    updateTimerAndCount();
  };

  const onFailureOTP = (error) => {
    console.log("OTP Failure :::::::", error);
    updateTimerAndCount();
  };

  const validationRegistration = () => {
    if (otp == "1111") {
      // recieveOtp in place of 1234
      onRegistrationHandler();
    } else {
      Snackbar.show({
        text: "Invalid OTP, please try again",
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const onRegistrationHandler = () => {
    const params = {
      email: props.route?.params?.email,
      password: props.route?.params?.password,
      confirm_password: props.route?.params?.confirm_password,
      date_of_birth: props.route?.params?.date_of_birth,
      name: props.route?.params?.name,
      gender: props.route?.params?.gender,
      phone_number: props.route?.params?.phone_number,
      profile: props.route?.params?.profile,
      cover_image: props.route?.params?.cover_image,
      bio: props.route?.params?.bio,
      lgbtq: props.route?.params?.lgbtq,
      type: Platform.OS,
      token: deviceToken,
      device_name: deviceInfoModule.getModel(),
    };
    setIsLoading(true);
    postApi(
      REGISTRATION_API,
      params,
      onSuccessRegistration,
      onFailureRegistration
    );
  };

  const onSuccessRegistration = (response) => {
    console.log("Registarion Success ::::: ", response);
    if (response.success) {
      usersDispatcher(saveUserDetailInRedux(response.data));
      setRegistrationModal(true);
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
    setIsLoading(false);
  };

  const onFailureRegistration = (error) => {
    console.log("Registarion Failure ::::: ", error);
    setIsLoading(false);

    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const checkEmailVerification = () => {
    const params = {
      email: props.route?.params?.email,
    };
    setIsLoading(true);
    postApi(
      CHECK_EMAIL_VERIFY_API,
      params,
      onSuccessCheckEmailVerify,
      onFailureCheckEmailVerify,
      userSelector.userOperation
    );
  };

  const onSuccessCheckEmailVerify = (response) => {
    console.log("EMAILVERIFY ::::::: ", response);
    if (response.success) {
      if (response?.data?.email_verified == "1") {
        props.navigation.navigate("subScription");
        setRegistrationModal(false);
        setIsLoading(true);
      } else {
        Snackbar.show({
          text: "Your email not varify please verify your email.",
          duration: Snackbar.LENGTH_LONG,
        });
        setIsLoading(false);
      }
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
      setIsLoading(false);
    }
  };

  const onFailureCheckEmailVerify = (error) => {
    console.log("FAILURE EMAILVERIFY ::::::: ", error);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
    setIsLoading(false);
  };

  const onBackPress = () => {
    props.navigation.goBack();
  };

  const registrationSuccessModal = () => {
    return (
      <CPPopupView isVisible={isRegistrationModal}>
        <CPUpgradePlan
          item={modalTitle}
          isLoading={isLoading}
          isCloseDisable
          onProcessAction={checkEmailVerification}
          onPress={() => {
            setRegistrationModal(false);
          }}
        />
      </CPPopupView>
    );
  };

  return (
    <BaseContainer
      title={"Verify Phone Number"}
      onBackPress={onBackPress}
      isLoading={isLoading}
    >
      {registrationSuccessModal()}
      <KeyboardAwareScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image style={styles.otpImage} source={Assets.otppassword} />
          <Text style={styles.otpTitle}>
            {"Code is sent to " + props.route?.params?.phone_number}
          </Text>
          <Text style={styles.otpDescription}>
            We will send you a One Time Password on{" "}
          </Text>
          <Text style={styles.otpDescription}>your phone number</Text>
          {/* {/ <Text style={styles.otpDescription}>elementu code lacus sed egestas.</Text> /} */}
          <OTPInputView
            onCodeChanged={(code) => {
              setotp(code);
            }}
            pinCount={4}
            style={styles.otpViewStyle}
            codeInputFieldStyle={styles.otpInputStyle}
            codeInputHighlightStyle={{
              borderColor: CPColors.secondary,
            }}
            onCodeFilled={(code) => {
              console.log(`Code is ${code}, you are good to go!`);
              setotp(code);
            }}
          />

          <CPThemeButton
            title={"Verify & Create Account"}
            style={styles.btnStyle}
            isLoading={isLoading}
            onPress={() => {
              // props.navigation.navigate('location')
              // setRegistrationModal(true)
              validationRegistration();
            }}
          />
          <View style={styles.expireTimeView}>
            <Text style={styles.codeTitle}>{"Code Expire in : "}</Text>
            <Text style={styles.codeTime}>
              {"00:"}
              {timerCount}
            </Text>
          </View>
          <Pressable
            style={styles.resendCodeView}
            onPress={sendOTP}
            disabled={clickCount >= 4 ? true : false}
          >
            <Text style={styles.codeTitle}>{"Did not get the code? "}</Text>
            <Text style={styles.resendCode}>{"Resend Code"}</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};

export default OTPContainer;

const styles = StyleSheet.create({
  otpImage: { marginVertical: 25 },
  container: { flex: 1, alignItems: "center", paddingHorizontal: 24 },
  otpTitle: {
    fontSize: 14,
    fontFamily: CPFonts.medium,
    color: CPColors.secondary,
    marginVertical: 10,
  },
  otpDescription: {
    fontSize: 14,
    fontFamily: CPFonts.medium,
    color: CPColors.secondaryLight,
    marginBottom: 5,
  },
  otpInputStyle: {
    borderRadius: 5,
    borderColor: CPColors.transparent,
    color: CPColors.secondary,
    backgroundColor: CPColors.textInputColor,
    fontFamily: CPFonts.regular,
    fontSize: 22,
  },
  otpViewStyle: {
    height: 80,
    width: widthPercentageToDP("70%"),
    marginBottom: 25,
    marginTop: 20,
  },
  btnStyle: { width: widthPercentageToDP("100%") - 48 },
  expireTimeView: { flexDirection: "row", marginVertical: 15 },
  resendCodeView: { flexDirection: "row", marginBottom: 10 },
  codeTitle: {
    fontFamily: CPFonts.regular,
    fontSize: 14,
    color: CPColors.secondary,
  },
  codeTime: {
    color: CPColors.primary,
    fontFamily: CPFonts.medium,
    fontSize: 14,
  },
  resendCode: {
    color: CPColors.primary,
    fontFamily: CPFonts.medium,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});