import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import io from "socket.io-client";
import {
  AppState,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  NativeModules,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Image, Text, View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Assets from "../Assets";
import CPImageComponent from "../Components/CPImageComponent";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import BaseContainer from "./BaseContainer";
import BackgroundTimer from "react-native-background-timer";
import {
  CHAT_BASE_URL,
  GROUP_MESSAGE_LIST,
  MY_ACCOUNT_API,
  USER_DETAILS,
  USER_MESSAGE,
} from "../Utils/CPConstant";
import { useSelector } from "react-redux";
import { getApi, postApi } from "../Utils/ServiceManager";
import moment from "moment";
import CPLoader from "../Components/CPLoader";
import { showDialogue } from "../Utils/CPAlert";

const AppStateNativeModule = NativeModules.AppState;

const socket = io.connect(CHAT_BASE_URL);
const ChatContainer = (props) => {
  console.log("CHAT DETAILS :::: ", props.route.params?.userData?.group_user);
  const userSelector = useSelector((state) => state);
  const { id, name, image, group_user, admin_id, user_id, plan_type } =
    props?.route?.params?.userData;
  const { selectMode, isClicked } = props?.route?.params;
  const [groupUsers, setGroupUsers] = useState(group_user);
  const [text, setText] = useState("");
  const [userImage, setUserImage] = useState();
  const [userID, setUserID] = useState();
  const [messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [profile, setProfile] = useState();
  const [userName, setUserName] = useState();
  const appState = useRef(AppState.currentState);
  const members = props.route.params?.userData?.group_user;
  // let interval;
  const grpUser = (user_id) => {
    return members
      ?.filter((x) => x?.user_data[0]?.id === user_id)
      ?.map((x) => x)[0]?.user_data[0];
  };

  // const initAppStateListener = () => {
  //     try {
  //         // HERE call the NativeModule to get the current App state
  //         AppStateNativeModule.getCurrentAppState(
  //             res => {
  //                 _handleAppStateChange(res.app_state)
  //             },
  //             () => { } // error callback is needed in the getCurrentAppState function signature
  //         )
  //     } catch (e) { }
  //     AppState.addEventListener('change', _handleAppStateChange)
  // }
  // useEffect(() => {
  //   // initAppStateListener()
  //   // props?.navigation?.addListener('focus', () => {

  //   // });

  //   return () => {
  //     // socket.disconnect();
  //     // socket.off();
  //   };
  // }, []);

  useEffect(() => {
    return () => { };
  }, [socket]);

  useEffect(() => {
    userProfileDetail();
    if (plan_type == "Free Plan") {
      showDialogue(
        "You need to subscribed to premium plan for this feature",
        [{ text: "" }],
        "Cookpals",
        navigateToBack)
    }
    if (isClicked === true) {
      userClickedDetail(user_id)
    }

    // console.log(socket, " << SOCKET");
    // socket.on("connect", () => {
    // console.log(socket, "hehehehheheheheh"); // true
    if (selectMode === 1) {
      socket.on("message", (data) => {
        console.log(messages, "EMIT Message group::::", data);
        getLatestMessage(data);
      });
    }
    if (selectMode === 0) {
      socket.on("messagePrivate", (data) => {
        console.log("EMIT Message privet::::", data);
        getLatestMessage(data);
      });
    }
    // });
  }, [socket]);

  // console.log("MESSAGE LIST ::::: ", messages);

  const forRefresh = () => {
    messageList();
  };

  // const _handleAppStateChange = nextAppState => {
  //     if (
  //         appState.current.match(/inactive|background/) &&
  //         nextAppState === 'active'
  //     ) {
  //         console.log('App has come to the foreground!');
  //         //clearInterval when your app has come back to the foreground
  //         BackgroundTimer.clearInterval(interval);
  //     }
  //     //app goes to background
  //     //tell the server that your app is still online when your app detect that it goes to background
  //     interval = BackgroundTimer.setInterval(() => {
  //         socket.emit('joinRoom', { username: userID, room: id })
  //         getApi(USER_MESSAGE + id, onSuccess, onFailure, userSelector.userOperation);
  //     }, 5000);
  //     appState.current = nextAppState;
  //     console.log('AppState :::::: ', appState.current);
  // };


  const userProfileDetail = () => {
    getApi(
      MY_ACCOUNT_API,
      onSuccessMyAccount,
      onFailureMyAccount,
      userSelector.userOperation
    );
  };

  const onSuccessMyAccount = (response) => {
    setRefreshing(false);
    console.log("response---", response)
    if (response.success) {
      setUserImage(response.data.my_profile.profile);
      setUserID(response.data.my_profile.id);
      messageList(response.data.my_profile.id);
    }
  };

  const onFailureMyAccount = (error) => {
    setRefreshing(false);
    console.log("FAILURE MY ACCOUNT ::::::", error);
  };

  const userClickedDetail = (id) => {
    console.log(USER_DETAILS + id, "props.route.params API");
    getApi(
      USER_DETAILS + id,
      onSuccessClickAccount,
      onFailureClickAccount,
      userSelector.userOperation
    );
  };

  const onSuccessClickAccount = (response) => {
    if (response.success) {
      setUserName(response.data.my_profile.name);
      setProfile(response.data.my_profile.profile);
    }
    setRefreshing(false);
  };

  const onFailureClickAccount = (error) => {
    setRefreshing(false);
    console.log(" FAILURE CLICK ACCOUNT ::::::", error);
  };

  const getLatestMessage = (data) => {
    const newMsgObject = {
      id: messages?.length + 1,
      group_id: data?.group_id,
      sender_id: data?.msg?.username,
      receiver_id: data?.group_id,
      message: data?.msg?.text,
      type: data?.type,
      image: data?.image,
      read_at: data?.msg?.time,
    };
    if (userID === data?.username) {
      setMessages((messagelist) => [newMsgObject, ...messagelist]);
    }
    console.log(data, "ID ::::: ", messages);
  };

  const messageList = (uID) => {
    console.log("CHAT EMIT::::::::", { username: uID, room: isClicked === true ? user_id : id });
    socket?.emit("joinRoom", { username: uID, room: isClicked === true ? user_id : id });
    if (selectMode === 1) {
      postApi(
        GROUP_MESSAGE_LIST,
        { group_id: id, sender_id: uID },
        (response) => {
          setMessages(response?.data);
          console.log(response.data, "Group chat message");
        },
        (err) => console.log(err, "Group chat failure"),
        userSelector.userOperation
      );
    } else {
      const userID = isClicked === true ? user_id : id;
      getApi(
        USER_MESSAGE + userID,
        onSuccess,
        onFailure,
        userSelector.userOperation
      );
    }
  };

  const onSuccess = (response) => {
    // console.log("MESSAGES :::: ", response);
    if (response?.success) {
      setMessages(response?.data);
    }
  };

  const onFailure = (error) => {
    setRefreshing(false);
    console.log(error);
  };

  const navigateToBack = () => {
    props?.navigation?.goBack();
  };

  // console.log(messages, "messagesmessages");

  const sendMessage = () => {
    if (text?.length != 0) {
      let tempMsgData = messages;
      let newMsg = {
        id: tempMsgData.length + 1,
        sender_id: userID,
        receiver_id: isClicked === true ? user_id : id,
        read_at: moment().format("LT"),
        message: text?.trim(),
        type: selectMode === 1 ? 1 : 0,
      };
      const sendMsgObject = {
        msg: text.trim(),
        username: userID,
        room: isClicked === true ? user_id : id,
      };
      if (text.trim()) {
        // console.log(tempMsgData, "tempMsgData");
        console.log(sendMsgObject, "sendMsgObject");
        selectMode !== 1 && tempMsgData?.unshift(newMsg);
        socket.emit(
          selectMode === 1 ? "chatMessage" : "chatPrivateMessage",
          sendMsgObject
        );
        setText("");
      }
    }
  };

  const messageInputRender = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          maxHeight: 140,
          padding: 10,
          marginHorizontal: 20,
          marginBottom: 15,
          backgroundColor: CPColors.inputBackground,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#1726741A",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: Platform.OS == "android" ? 40 : 25,
            alignSelf: "center",
            fontWeight: "600",
            color: CPColors.chatInput,
          }}
          multiline
          onChangeText={(text) => setText(text)}
          value={text}
          placeholder={"Type a message"}
        />
        <Pressable onPress={sendMessage}>
          <Image
            style={{
              width: widthPercentageToDP("9.5"),
              height: widthPercentageToDP("9.5"),
              marginLeft: 10,
            }}
            source={Assets.chatsend}
          />
        </Pressable>
      </View>
    );
  };

  const messageContaint = ({ item, index }) => {
    const newUser = grpUser(item?.sender_id);
    return (
      <View key={index}>
        {item.date ? (
          <View
            style={{
              backgroundColor: CPColors.primary,
              alignSelf: "center",
              margin: 20,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                marginHorizontal: 10,
                color: CPColors.lightwhite,
                fontFamily: CPFonts.regular,
                fontSize: 10,
                marginVertical: 5,
              }}
            >
              {item.dateStatus}
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: item.sender_id === userID ? "row-reverse" : "row",
              marginHorizontal: 24,
              marginBottom: 20,
              // backgroundColor:'red'
            }}
          >
            {item.sender_id !== userID && (
              <View
                style={{
                  position: "absolute",
                  top: Platform.OS === "ios" ? -18 : -20,
                  // marginBottom:10
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: CPFonts.medium,
                    color: CPColors.secondary,
                  }}
                >
                  {newUser?.name?.split(" ")[0]}
                </Text>
              </View>
            )}
            <CPImageComponent
              style={{
                width: widthPercentageToDP("6.5"),
                height: widthPercentageToDP("6.5"),
                borderRadius: widthPercentageToDP("6.5"),
              }}
              source={
                item.sender_id === userID
                  ? userImage
                  : newUser?.profile || isClicked === true ? profile : image
              }
            />
            <View
              style={{
                marginHorizontal: 10,
                backgroundColor:
                  item.sender_id === userID
                    ? CPColors.secondary
                    : CPColors.textInputColor,
                padding: 10,
                maxWidth: widthPercentageToDP("50"),
                // borderTop:
                //   item.sender_id === userID
                //     ? "10rem 10rem 10rem 0rem"
                //     : "20rem 0rem 0rem 10rem",
                borderRadius: 10,
                borderTopLeftRadius: item.sender_id === userID ? 0 : 10,
                borderTopRightRadius: item.sender_id !== userID ? 0 : 10,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: CPFonts.medium,
                  color:
                    item.sender_id === userID
                      ? CPColors.white
                      : CPColors.secondary,
                }}
              >
                {item.message}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: CPFonts.regular,
                  color:
                    item.sender_id === userID
                      ? CPColors.white
                      : CPColors.secondaryLight,
                  marginTop: 5,
                  alignSelf: "flex-end",
                }}
              >
                {item.read_at ?? moment(item.created_at).format("LT")}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const headerRender = () => {
    return (
      <View
        style={{
          flex: 4,
          marginTop: 5,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CPImageComponent
          source={isClicked === true ? profile : image}
          style={{
            width: widthPercentageToDP("11%"),
            height: widthPercentageToDP("11%"),
            borderRadius: widthPercentageToDP("11%"),
            borderWidth: 1,
          }}
        />
        <Pressable
          onPress={() => {
            selectMode === 1
              ? props.navigation.navigate("createGroup", {
                groupMembers: groupUsers,
                setGroupMembers: setGroupUsers,
                edit: { id, name, image, admin_id },
              })
              : console.log("singleChat");
          }}
          style={{ marginHorizontal: 10, justifyContent: "space-around" }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: CPFonts.semiBold,
              color: CPColors.secondary,
            }}
          >
            {isClicked === true ? userName : name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: CPFonts.medium,
              color: CPColors.primary,
            }}
          >
            {props.route?.params?.selectMode == 0
              ? "online"
              : `${groupUsers?.length} Participants`}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" && "padding"}
      style={styles.container}
    >
      <BaseContainer
        onBackPress={navigateToBack}
        leftcmpStyle={{ flex: 0, marginTop: -15 }}
        titleComponent={headerRender()}
      >
        {refreshing ? (
          <CPLoader />
        ) : (
          <>
            <FlatList
              data={messages}
              style={styles.listContainerStyle}
              inverted
              renderItem={messageContaint}
              scrollToOverflowEnabled={true}
              showsVerticalScrollIndicator={false}
            />
            {messageInputRender()}
          </>
        )}
      </BaseContainer>
    </KeyboardAvoidingView>
  );
};

export default ChatContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CPColors.transparent,
  },
  listContainerStyle: { marginTop: 10 },
});
