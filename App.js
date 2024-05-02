/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import RootNavigator from "./src/Components/RootNavigator";
import { userOperation } from "./src/redux/Reducers/UserReducer";
import persistReducer from "redux-persist/es/persistReducer";
import { combineReducers, createStore } from "redux";
import persistStore from "redux-persist/es/persistStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import PushNotification from 'react-native-push-notification';
import NotificationController from "./src/Containers/NotificationController";
import messaging from "@react-native-firebase/messaging";
import NavigationServiceManager from "./src/Utils/NavigationServiceManager";
import { showDialogue } from "./src/Utils/CPAlert";
// import { Settings } from "react-native-fbsdk-next";
// import KeyboardManager from 'react-native-keyboard-manager'

import { LogBox } from "react-native";

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(["Warning: ..."]);
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  userOperation: userOperation,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const applicationStore = createStore(persistedReducer);
const persistorStore = persistStore(applicationStore);
// console.log("persistorStore", applicationStore.getState().userOperation?.detail)

const App = (props) => {
  // useEffect(() => {
  //   if (Platform.OS === 'ios') {
  //     KeyboardManager.setEnable(true);
  //     KeyboardManager.setEnableDebugging(false);
  //     KeyboardManager.setKeyboardDistanceFromTextField(10);
  //     KeyboardManager.setLayoutIfNeededOnUpdate(true);
  //     KeyboardManager.setEnableAutoToolbar(true);
  //     KeyboardManager.setToolbarDoneBarButtonItemText("Done");
  //     KeyboardManager.setToolbarManageBehaviourBy("subviews"); // "subviews" | "tag" | "position"
  //     KeyboardManager.setToolbarPreviousNextButtonEnable(false);
  //     KeyboardManager.setToolbarTintColor('#0000FF'); // Only #000000 format is supported
  //     KeyboardManager.setToolbarBarTintColor('#FFFFFF'); // Only #000000 format is supported
  //     KeyboardManager.setShouldShowToolbarPlaceholder(true);
  //     KeyboardManager.setOverrideKeyboardAppearance(false);
  //     KeyboardManager.setKeyboardAppearance("default"); // "default" | "light" | "dark"
  //     KeyboardManager.setShouldResignOnTouchOutside(true);
  //     KeyboardManager.setShouldPlayInputClicks(true);
  //     KeyboardManager.resignFirstResponder();
  //     KeyboardManager.isKeyboardShowing()
  //       .then((isShowing) => {
  //           // ...
  //       });
  // }
  // },[])

  useEffect(() => {
    // Settings?.initializeSDK();
    // Settings.setAppID("519558259870792");
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Notification in background", remoteMessage);
      // onNotificationPress(remoteMessage);
    });
    messaging().getInitialNotification(async (remoteMessage) => {
      console.log(
        "WHEN APP INITIALIZATION ::::: ",
        remoteMessage?.data
      );
      console.log("Notification initialization", remoteMessage);

    });
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log("Notification clicked", remoteMessage);
      // onNotificationPress(remoteMessage);
    });

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: notification => {
        console.log('NOTIFICATION:', notification);
        const navigation = NavigationServiceManager.getTopLevelNavigation();
        // console.log("navigation.isReady()", navigation.isReady())
        if (notification?.userInteraction) {
          if (navigation.isReady() === true) {
            onNotificationPress(notification)
          } else {
            setTimeout(() => {
              onNotificationPress(notification);
            }, 5000);
          }
        }
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION ACTION :', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      // permissions: {
      //   alert: true,
      //   badge: true,
      //   sound: true,
      // },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }, []);

  const onNotificationPress = (remoteMessage) => {
    switch (remoteMessage?.data?.notificationtype) {
      case "message":
        console.log("notificationn message app.js---", remoteMessage);
        const plan = JSON.parse(remoteMessage?.data?.data);
        NavigationServiceManager?.navigateToDoubleroot("chat", {
          userData: plan,
          selectMode: 0,
          isClicked: true
        });
        // }
        break;
      case "profilelike":
        console.log("notificationn profilelike app.js", remoteMessage);
        NavigationServiceManager?.navigateToDoubleroot("anotherUser", {
          isAnotherUser: true,
          fromClick: true,
          id: remoteMessage?.data?.user?.id,
        });
        break;
      case "follow":
        console.log("notificationn follow app.js", remoteMessage);
        NavigationServiceManager?.navigateToDoubleroot("anotherUser", {
          isAnotherUser: true,
          fromClick: true,
          id: remoteMessage?.data?.user?.id,
        });
        break;
      case "usermatch":
        console.log("notificationn match app.js", remoteMessage);
        const data = JSON.parse(remoteMessage?.data?.data);
        NavigationServiceManager?.navigateToDoubleroot("match", {
          isAnotherUser: true,
          fromClick: true,
          cookup_id: data?.sender_id,
          name: data?.sender_name
        });
        break;

      default:
        console.log("default case");
        break;
    }
  }

  return (
    <Provider store={applicationStore}>
      <PersistGate loading={null} persistor={persistorStore}>
        <RootNavigator />
        <NotificationController />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
