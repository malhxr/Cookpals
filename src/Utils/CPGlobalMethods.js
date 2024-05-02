import { Alert, Linking, Platform } from "react-native";

var RNFS = require("react-native-fs");

/**
 *
 * @param {*} url
 * @returns Copied path from the cache memory
 */
export const copyAssetInFile = async (url) => {
  if (url?.startsWith("content://")) {
    const uriComponents = url?.split("/");
    const fileNameAndExtension = uriComponents[uriComponents?.length - 1];
    const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
    await RNFS.copyFile(url, destPath);
    return "file://" + destPath;
  }
  if (url?.startsWith("file://")) {
    const uriComponents = url
      ?.split("/")
      [url?.split("/").length - 1]?.split(".")[0];
    const fileNameAndExtension = uriComponents[uriComponents?.length - 1];
    const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
    await RNFS.copyFile(url, destPath);
    return "file://" + destPath;
  }
};

/**
 * Navigate to setting in iOS
 */
export const showRequestAlertForIOS = () => {
  Linking.canOpenURL("app-settings:")
    .then((supported) => {
      if (!supported) {
        console.log("Can't handle settings url");
      } else {
        Alert.alert(
          "Cookpals",
          "Please go to Settings and give contact permission",
          [
            {
              text: "Go To Settings",
              onPress: () => {
                return Linking.openURL("app-settings:");
              },
            },
            {
              text: "Cancel",
              onPress: (e) => {
                global.isCancelPressed = true;
              },
              style: "cancel",
            },
          ]
        );
      }
    })
    .catch((err) => console.error("An error occurred", err));
};

/**
 * Navigate to setting in android
 */
export const showRequestAlertForAndroid = () => {
  Alert.alert("Cookpals", "You have to give permission to get contacts ", [
    {
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel",
    },
    { text: "Allow", onPress: () => Linking.openSettings() },
  ]);
};

/**
 * Creating flat array from contact array
 * @param {Array of contacts from phonebook} data
 * @returns
 */
export const createSectionArray = (data) => {
  let output = [];

  for (var i = 0; i < data.length; i++) {
    data[i].phoneNumbers.map((e) => {
      let phoneObj = { ...data[i] };
      let num = { ...e };
      num.number = num.number.replace(/[- )(]/g, "");
      phoneObj.phone = num;
      output.push(phoneObj);
    });
  }
  return output;
};

/**
 * Making section array with alphabets
 * @param {Flat array} contactFlatArray
 * @param {Number-check api response} responseArray
 * @returns
 */
export const createContactArray = (contactFlatArray, responseArray) => {
  let output = [];
  for (let index = 0; index < responseArray.length; index++) {
    const element = responseArray[index];
    let res = contactFlatArray.find((x) => x?.phone?.number === element);
    output.push(res);
  }

  let final = [];
  if (output.length > 0) {
    for (var i = 0; i < output.length; i++) {
      let firstLetter = output[i].givenName.substring(0, 1);

      if (final.some((e) => e.title === firstLetter)) {
        const index = final.findIndex((e) => e.title === firstLetter);
        let obj = final.find((e) => e.title === firstLetter);
        output[i].contact = "Contacts";
        output[i].fullName = output[i].givenName + " " + output[i].familyName;
        output[i].isSelected = false;
        final[index] = obj;
        obj.data.push(output[i]);
      } else {
        output[i].contact = "Contacts";
        output[i].fullName = output[i].givenName + " " + output[i].familyName;
        output[i].isSelected = false;
        final.push({
          title: firstLetter,
          data: [output[i]],
        });
      }
    }
    final.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
  }
  return final;
};

/**
 * Searching through contact array and giving search results
 * @param {Search Input} searchKey
 * @param {Original Contact Array} array
 * @returns
 */
export const setSearchResult = (searchKey, array) => {
  const filterData = array
    .flatMap((cg) => cg.data)
    .filter((c) => c.fullName.toLowerCase().includes(searchKey.toLowerCase()));

  let final = [];
  if (filterData.length > 0) {
    for (var i = 0; i < filterData.length; i++) {
      let firstLetter = filterData[i].givenName.substring(0, 1);

      if (final.some((e) => e.title === firstLetter)) {
        const index = final.findIndex((e) => e.title === firstLetter);
        let obj = final.find((e) => e.title === firstLetter);
        final[index] = obj;
        obj.data.push(filterData[i]);
      } else {
        final.push({
          title: firstLetter,
          data: [filterData[i]],
        });
      }
    }
    final.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
  }
  return final;
};
