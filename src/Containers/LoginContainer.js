import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Snackbar from "react-native-snackbar";
import { useDispatch, useSelector } from "react-redux";
import NavigationServiceManager from "../Utils/NavigationServiceManager";
import Assets from "../Assets";
import CPTextInput from "../Components/CPTextInput";
import CPThemeButton from "../Components/CPThemeButton";
import {
  saveUserLoggedInInRedux,
  saveUserDetailInRedux,
} from "../redux/Actions/User";
import CPColors from "../Utils/CPColors";
import { LOGIN_API, RESEND_EMAIL_API } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { checkFirebaseServices } from "../Utils/FireBaseServiceManager";
import { postApi } from "../Utils/ServiceManager";
import ValidationHelper from "../Utils/ValidationHelper";
import {
  LoginButton,
  AccessToken,
  GraphRequest,
} from "react-native-fbsdk-next";

const LoginContainer = (props) => {
  const usersDispatcher = useDispatch();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [shouldVisible, setShouldVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceToken, setDeviceToken] = useState("");

  useEffect(() => {
    usersDispatcher(saveUserLoggedInInRedux(false));
    usersDispatcher(saveUserDetailInRedux({}));
    checkFirebaseServices(
      (onSuccessToken) => {
        setDeviceToken(onSuccessToken);
      },
      (onFailureToken) => {
        console.log("FIREBASE FAILURE ::::::: ", onFailureToken);
      }
    );
  }, []);

  var validationHelper = new ValidationHelper();
  const onChangeEmail = (text) => {
    setShouldVisible(false);
    setemail(text);
  };

  const onChangePassword = (text) => {
    setShouldVisible(false);
    setPassword(text);
  };

  const onLoginValidations = () => {
    setShouldVisible(true);
    if (
      email.trim() == "" ||
      validationHelper.passwordValidation(password).trim() !== ""
    ) {
      return;
    } else {
      // NavigationServiceManager.navigateToSpecificRoute('dashboard');
      onLoginhandler();
    }
  };

  const onLoginhandler = () => {
    const loginParam = {
      email: email,
      password: password,
      type: Platform.OS,
      token: deviceToken,
      device_name: DeviceInfo.getModel(),
    };
    setIsLoading(true);
    console.log(loginParam, "loginParamloginParam");
    postApi(LOGIN_API, loginParam, onSuccessResponse, onFailureResponse);
  };

  const onSuccessResponse = (response) => {
    console.log("onSuccess Response ::::: ", response?.data?.plan);
    setIsLoading(false);
    if (response.success) {
      if (!response.data.plan) {
        usersDispatcher(saveUserDetailInRedux(response.data));
        props.navigation.navigate("subScription");
      } else if (!response.data.my_preference) {
        usersDispatcher(saveUserDetailInRedux(response.data));
        props.navigation.navigate("foodPreference");
      } else {
        usersDispatcher(saveUserDetailInRedux(response.data));
        usersDispatcher(saveUserLoggedInInRedux(true));
        NavigationServiceManager.navigateToSpecificRoute("dashboard");
      }

      // props.navigation.navigate('subScription')
    } else {
      resendEmailAction();
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const onFailureResponse = (response) => {
    setIsLoading(false);
    console.log("onFailure Response ::::: ", response);

    Snackbar.show({
      text: response.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const resendEmailAction = () => {
    const params = {
      email: email,
    };
    postApi(
      RESEND_EMAIL_API,
      params,
      onSuccessResendEmail,
      onFailureResendEmail
    );
  };

  const onSuccessResendEmail = (response) => {
    console.log("SUCCESS ::::::: ", response);
  };

  const onFailureResendEmail = (error) => {
    console.log("FAILURE ::::::: ", error);
  };

  const FbLogin = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LoginButton
          // style={{ padding: 20, backgroundColor: "gray" }}
          onLoginFinished={(error, result) => {
            console.log("pressedfggg");
            if (error) {
              alert("login has error: " + result.error);
            } else if (result.isCancelled) {
              alert("login is cancelled.");
            } else {
              AccessToken.getCurrentAccessToken().then((data) => {
                let accessToken = data.accessToken;
                alert(accessToken.toString());

                const responseInfoCallback = (error, result) => {
                  if (error) {
                    console.log(error);
                    alert("Error fetching data: " + error.toString());
                  } else {
                    console.log(result);
                    alert("Success fetching data: " + result.toString());
                  }
                };

                const infoRequest = new GraphRequest(
                  "/me",
                  {
                    accessToken: accessToken,
                    parameters: {
                      fields: {
                        string: "email,name,first_name,middle_name,last_name",
                      },
                    },
                  },
                  responseInfoCallback
                );

                // Start the graph request.
                new GraphRequestManager().addRequest(infoRequest).start();
              });
            }
          }}
        />
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardView}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <StatusBar backgroundColor={"#f2f2f3"} barStyle="dark-content" />
      <View
        style={styles.flexViewStyle}
        pointerEvents={isLoading ? "none" : "auto"}
      >
        <Image
          style={styles.imageStyle}
          source={Assets.login2}
          resizeMode="cover"
        />
        <View style={styles.container}>
          <View style={styles.socialMediaView}>
            <View style={styles.waterPlaceholderView} />
            <Text style={styles.titleStyle}>{"Log In"}</Text>
            <View style={styles.socialMediaSubView}>
              {/* <TouchableOpacity onPress={()=>FbLogin()}>
                <Image source={Assets.facebook} />
              </TouchableOpacity> */}
              <FbLogin />

              {/* <TouchableOpacity>
                <Image style={styles.instaImage} source={Assets.instagram} />
              </TouchableOpacity> */}
            </View>
          </View>
          <CPTextInput
            value={email}
            source={Assets.email}
            placeholder={"E-Mail or Phone Number"}
            keyboardType={"email-address"}
            onChangeText={onChangeEmail}
            error={
              shouldVisible &&
              validationHelper
                .isEmptyValidation(email, "Please enter email or number")
                .trim()
            }
          />
          <CPTextInput
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
          <Pressable
            style={styles.forgotPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => {
              props.navigation.navigate("forgotPassword");
            }}
          >
            <Text style={styles.forgotText}>{"forgot password?"}</Text>
          </Pressable>
          <CPThemeButton
            title={"Sign In"}
            isLoading={isLoading}
            style={styles.signInPressStyle}
            onPress={onLoginValidations}
          />

          <Pressable
            style={styles.signUpPressStyle}
            onPress={() => {
              props.navigation.navigate("signup");
            }}
          >
            <Text style={styles.signUpText}>
              {"Not Exploring CookPals yet? "}
            </Text>
            <Text style={styles.signUpSubTitle}>{"Sign up"}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginContainer;

const styles = StyleSheet.create({
  keyboardView: {
    backgroundColor: CPColors.white,
    flex: 1,
  },
  flexViewStyle: { flex: 1 },
  imageStyle: { width: "100%", height: 330 },
  container: { paddingHorizontal: 20 },
  socialMediaView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -40,
    marginBottom: 20,
  },
  waterPlaceholderView: {
    height: 10,
    width: 30,
    backgroundColor: CPColors.lightPrimary,
    borderRadius: 20,
    position: "absolute",
    bottom: 5,
    alignSelf: "flex-end",
  },
  titleStyle: {
    fontSize: 32,
    fontFamily: CPFonts.bold,
    color: CPColors.secondary,
  },
  socialMediaSubView: { flexDirection: "row" },
  instaImage: { marginLeft: 15 },
  forgotPress: { alignSelf: "flex-end", marginVertical: 10 },
  forgotText: {
    textDecorationLine: "underline",
    color: CPColors.secondary,
  },
  signInPressStyle: { marginVertical: 60 },
  signUpPressStyle: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  signUpText: {
    fontSize: 14,
    fontFamily: CPFonts.medium,
    color: CPColors.secondary,
  },
  signUpSubTitle: {
    textDecorationLine: "underline",
    color: CPColors.primary,
    fontSize: 14,
    fontFamily: CPFonts.medium,
  },
});
