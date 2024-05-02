"useStript";
import axios from "axios";
import { Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import NavigationServiceManager from "./NavigationServiceManager";
import { BASE_URL, BEARER, debugLog, REGISTRATION_API } from "./CPConstant";

const instance = axios.create({
  baseURL: BASE_URL,
});

export const postApi = async (
  url,
  params,
  onSuccess,
  onFailure,
  getPropsForHeader
) => {
  const formdata = new FormData();
  debugLog(" ::: Params :::: ", params, getPropsForHeader);
  Object.keys(params || {}).map((keyToCheck) => {
    if (
      keyToCheck == "profile" ||
      keyToCheck == "cover_image" ||
      keyToCheck == "image" ||
      keyToCheck == "stepvideo" ||
      keyToCheck == "video"
    ) {
      const uriParts = params[keyToCheck].fileName
        ? params[keyToCheck].fileName.split(".")
        : params[keyToCheck].uri.split(".");
      const strURIToUse =
        Platform.OS === "ios"
          ? params[keyToCheck].uri.replace("file:/", "")
          : params[keyToCheck].uri;
      const finalImageDetails = {
        uri: strURIToUse,
        name:
          params[keyToCheck].fileName ||
          Math.round(new Date().getTime() / 1000) +
            "." +
            uriParts[uriParts.length - 1],
        type: params[keyToCheck].type,
      };
      formdata.append(keyToCheck, finalImageDetails);
      console.log(formdata, "param ::: ", finalImageDetails);
    } else {
      formdata.append(keyToCheck, params[keyToCheck]);
    }
  });

  debugLog(" ::: formdata :::: ", formdata);

  instance.defaults.headers.common["Content-Type"] = "multipart/form-data";
  if (getPropsForHeader) {
    instance.defaults.headers.common["Authorization"] =
      BEARER + getPropsForHeader?.detail?.token;
  } else {
    instance.defaults.headers.common["Authorization"] = "";
  }

  // console.log("INSTANT :::::: ", instance.defaults.headers, " :::::::: ", url);
  // formdata.append('email','sdfsf@sdf.vvv');
  await NetInfo.fetch().then((state) => {
    if (state.isConnected) {
      instance
        .post(url, formdata)
        .then((response) => {
          // console.log("SUCCESS :::::::: ", response, url);
          // if (response.data.success) {
          onSuccess(response.data);
          // } else {
          //     onFailure({ status: false, message: response.data.message })
          // }
        })
        .catch((error) => {
          console.log("ERROR :::::::: ", error, " :: ", url);
          if (error.message.includes("401")) {
            console.log("401 warning");
            NavigationServiceManager.navigateToSpecificRoute("login");
            clearDataFromAsync(
              "userdata",
              () => {
                NavigationServiceManager.navigateToSpecificRoute("login");
              },
              () => {}
            );
          }
          onFailure({
            status: false,
            message: "Something went wrong" + `\n` + "please try again later",
          });
        });
    } else {
      onFailure({ status: false, message: "Check your internet connection" });
    }
  });
};

export const getApi = async (url, onSuccess, onFailure, getPropsForHeader) => {
  if (getPropsForHeader) {
    instance.defaults.headers.common["Authorization"] =
      BEARER + getPropsForHeader?.detail?.token;
  }
  // console.log("INSTANT :::::: ", instance.defaults, " :::::::: ", url);
  await NetInfo.fetch().then((state) => {
    if (state.isConnected) {
      instance
        .get(url)
        .then((response) => {
          // console.log("SUCCESS :::::::", response, url);
          if (response?.data?.success) {
            // clearDataFromAsync('userdata', ()=>{NavigationServiceManager.navigateToSpecificRoute('login')}, () => { })
            onSuccess(response.data);
          } else {
            onFailure({ status: false, message: response.data.message });
          }
        })
        .catch((error) => {
          console.log("ERROR :::::::: ", error, " ::::::::: ", url);
          console.log(error.message.includes("401"), "errorlog", error.message);
          if (error.message.includes("401")) {
            console.log("401 warning");
            NavigationServiceManager.navigateToSpecificRoute("login");
            clearDataFromAsync(
              "userdata",
              () => {
                NavigationServiceManager.navigateToSpecificRoute("login");
              },
              () => {}
            );
          }
          onFailure({
            status: false,
            message: "Something went wrong" + `\n` + "please try again later",
          });
        });
    } else {
      onSuccess({ status: false, message: "Check your internet connection" });
    }
  });
};
