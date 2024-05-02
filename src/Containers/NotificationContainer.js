import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CPImageComponent from "../Components/CPImageComponent";
import CPLoader from "../Components/CPLoader";
import { saveNotificationInRedux } from "../redux/Actions/User";
import CPColors from "../Utils/CPColors";
import { NOTIFICATION, READ_NOTIFICATION } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { getApi, postApi } from "../Utils/ServiceManager";
import BaseContainer from "./BaseContainer";

const NotificationContainer = (props) => {
  const userSelector = useSelector((state) => state);
  const [refreshing, setRefreshing] = useState(true);
  const [notificationArray, setNotificationArray] = useState([]);
  // userSelector?.userOperation?.notification
  console.log(notificationArray[0]?.id === undefined, "userselector");
  const dispatch = useDispatch();
  useEffect(() => {
    notificationList();
    return () => {
      dispatch(
        saveNotificationInRedux(userSelector?.userOperation?.notification)
      );
    };
  }, []);

  const notificationList = () => {
    getApi(
      NOTIFICATION,
      onSuccesNotification,
      onFailureNotification,
      userSelector.userOperation
    );
  };

  const onSuccesNotification = (response) => {
    if (response.success) {
      setNotificationArray(response?.data?.data);
      dispatch(saveNotificationInRedux(response?.data?.data));
    }
    setRefreshing(false);
  };
  console.log(notificationArray, "notification");

  const onFailureNotification = (error) => {
    setRefreshing(false);
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };
  const onNotificationPress = (notification) => {
    console.log(notification, "notification?.notificationtype");
    getApi(
      READ_NOTIFICATION + notification.id,
      () => console.log("success READ_NOTIFICATION"),
      () => console.log("failure READ_NOTIFICATION"),
      userSelector.userOperation
    );
    notificationList();
    switch (notification?.notification_type) {
      case "message":
        console.log("notificationn message", notification);
        props.navigation.navigate("chat", {
          userData: notification?.user,
          selectMode: 0,
        });
        break;
      case "profilelike":
        console.log("notificationn profilelike", notification);
        props.navigation.navigate("anotherUser", {
          isAnotherUser: true,
          fromClick: true,
          id: notification?.user?.id,
        });
        break;
      case "follow":
        console.log("notificationn follow", notification);
        props.navigation.navigate("anotherUser", {
          isAnotherUser: true,
          fromClick: true,
          id: notification?.user?.id,
        });
        break;
      case "usermatch":
        console.log("notification match", notification);
        props.navigation.navigate("match", {
          isAnotherUser: true,
          fromClick: true,
          id: notification?.user?.id,
        });
        break;

      default:
        console.log("default case");
        break;
    }
    // props.navigation.navigate("anotherUser", {
    //   isAnotherUser: true,
    //   fromClick: true,
    //   id: item?.user?.id,
    // });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      notificationList();
    });
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  return (
    <BaseContainer title={"Notifications"} onBackPress={navigateToBack}>
      {refreshing ? (
        <CPLoader />
      ) : notificationArray[0]?.id === undefined ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../Assets/images/noNotification.png")}
            resizeMode="contain"
            style={{ height: "50%", width: "50%", bottom: "08%" }}
          />
          <Text
            style={{
              fontSize: 16,
              position: "absolute",
              top: "56%",
              // marginBottom:50,
              fontWeight: "bold",
              color: CPColors.secondary,
            }}
          >
            No Notifications Found
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.listContainer}
          data={notificationArray}
          renderItem={({ item, index }) => {
            return (
              <Pressable
                key={index}
                style={{ marginBottom: 10 }}
                onPress={() => onNotificationPress(item)}
              >
                <View
                  style={[
                    {
                      backgroundColor:
                        item.read_at === 1
                          ? CPColors.extraLightPrimary
                          : CPColors.transparent,
                    },
                    styles.listView,
                  ]}
                >
                  <CPImageComponent
                    style={styles.imageComponent}
                    source={item?.user?.profile}
                  />
                  <View style={styles.subListView}>
                    <Text style={styles.titleStyle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.descriptionStyle} numberOfLines={1}>
                      {item.message}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>{item.created_at}</Text>
                </View>
              </Pressable>
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </BaseContainer>
  );
};

export default NotificationContainer;

const styles = StyleSheet.create({
  listContainer: { marginHorizontal: 10, paddingVertical: 10 },
  listView: { flex: 1, borderRadius: 10, padding: 10, flexDirection: "row" },
  imageComponent: { width: 40, height: 40, borderRadius: 40 },
  subListView: {
    flex: 1,
    justifyContent: "space-evenly",
    marginHorizontal: 15,
  },
  titleStyle: {
    fontFamily: CPFonts.semiBold,
    fontSize: 14,
    color: CPColors.secondary,
  },
  descriptionStyle: {
    fontFamily: CPFonts.regular,
    fontSize: 14,
    color: CPColors.secondaryLight,
  },
  timeText: {
    fontFamily: CPFonts.regular,
    fontSize: 10,
    color: CPColors.secondaryLight,
  },
});
