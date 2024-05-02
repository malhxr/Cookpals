import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform } from "react-native";

const NotificationController = (props) => {
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Notification in background", remoteMessage);
    });
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      PushNotification.createChannel(
        {
          channelId: "fcm_fallback_notification_channel", // (required)
          channelName: "My channel", // (required)
          channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => console.log(`createChannel returned '${created}'`)
      );
      if (Platform.OS == "ios") {
        PushNotificationIOS.addNotificationRequest({
          id: messageId,
          body: notification?.body,
          title: notification?.title,
          sound: "default",
        });
      } else {
        console.log(remoteMessage, "abcccc");
        PushNotification.localNotification({
          channelId: "channel_id",
          message: remoteMessage?.notification?.body,
          title: remoteMessage?.notification?.body,
          bigPictureUrl: remoteMessage?.notification?.android?.imageUrl,
          smallIcon: remoteMessage?.notification?.android?.imageUrl,
        });
      }
    });
    return unsubscribe;
  }, []);

  return null;
};

export default NotificationController;
