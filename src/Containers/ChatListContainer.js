import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { hasNotch } from "react-native-device-info";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSelector } from "react-redux";
import Assets from "../Assets";
import CPChatItemList from "../Components/CPChatItemList";
import CPLoader from "../Components/CPLoader";
import CPSegmentComponent from "../Components/CPSegmentComponent";
import { showDialogue } from "../Utils/CPAlert";
import CPColors from "../Utils/CPColors";
import {
  GROUP_LIST,
  SINGLE_CHAT_DELETE,
  USER_CHATLIST,
  GROUP_CHAT_DELETE,
  GROUP_USER_REMOVE,
} from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { getApi, postApi } from "../Utils/ServiceManager";
import BaseContainer from "./BaseContainer";

const ChatListContainer = (props) => {
  const userSelector = useSelector((state) => state);
  const chatArray = ["Person", "Group"];
  const [selectedIndex, setIndex] = useState(0);
  const [chatListArray, setChatListArray] = useState([]);
  const [groupListArray, setGroupListArray] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    chatList();
    // console.log(groupListArray, "groupListArray");
    groupList();
    // const unsubscribe = props.navigation.addListener("focus", () => {
    //   chatList();
    //   groupList();
    // });
    // return unsubscribe;
  }, []);
  // console.log(groupListArray, "groupListArray");

  // const forRefresh = () => {
  //   chatList();
  //   groupList();
  // };

  const groupList = () => {
    console.log(props, "groupListArray");
    getApi(
      GROUP_LIST,
      onSuccessGroupList,
      onFailureGroupList,
      userSelector.userOperation
    );
  };

  const onSuccessGroupList = (response) => {
    setRefreshing(false);
    console.log("SUCCESS GRUOPLIST :: ", response);
    if (response.success) {
      setGroupListArray(response.data);
    }
  };

  const onFailureGroupList = (error) => {
    setRefreshing(false);
    console.log(error, "FAILURE");
  };

  const chatList = () => {
    getApi(
      USER_CHATLIST,
      onSuccessChatList,
      onFailureChatList,
      userSelector.userOperation
    );
  };

  const onSuccessChatList = (response) => {
    setRefreshing(false);
    console.log("SUCCESS CHATLIST :: ", response);
    if (response.success) {
      setChatListArray(response.data);
      console.log("you left the group");
    }
  };

  const onFailureChatList = (error) => {
    setRefreshing(false);
    console.log(error);
  };

  const deleteChatList = (id) => {
    getApi(
      SINGLE_CHAT_DELETE + id,
      onSuccessDeleteChatList,
      onFailureDeleteChatList,
      userSelector.userOperation
    );
  };

  const onSuccessDeleteChatList = (response) => {
    setRefreshing(false);
    if (response.success) chatList();
    console.log("SUCCESS DELETE :::: ", response);
  };

  const onFailureDeleteChatList = (error) => {
    setRefreshing(false);
    console.log(error, "FAILURE DELETE ::::");
  };

  const deleteGroupChatList = (data) => {
    const params = {
      group_id: data?.item?.id,
      user_id: userSelector?.userOperation?.detail?.user_id,
    };
    const isAdmin =
      userSelector?.userOperation?.detail?.user_id === data?.item?.admin_id;
    console.log(
      params,
      userSelector?.userOperation?.detail?.user_id,
      "DELETE :::: ",
      data?.item?.admin_id
    );
    if (isAdmin) {
      showDialogue(
        "Are you sure want to delete this group?",
        [{ text: "Cancel" }],
        "Cookpals",
        () => {
          console.log(data, "dataaaaa");
          getApi(
            GROUP_CHAT_DELETE + data?.item?.id,
            onSuccessDeleteGroup,
            onFailureDeleteGroup,
            userSelector.userOperation
          );
        }
      );
    } else {
      showDialogue(
        "Are you sure want to leave this group?",
        [{ text: "Cancel" }],
        "Cookpals",
        () => {
          console.log(data, "dataaaaa");
          postApi(
            GROUP_USER_REMOVE,
            params,
            onSuccessDeleteGroupChatList,
            onFailureDeleteGroupChatList,
            userSelector.userOperation
          );
        }
      );
    }
  };

  const onSuccessDeleteGroup = (response) => {
    console.log(response, "delete group");
    if (response.success) {
      chatList();
    }
  };
  const onFailureDeleteGroup = () => {
    console.log(error, "error while deleting");
  };

  const onSuccessDeleteGroupChatList = (response) => {
    setRefreshing(false);
    if (response.success) groupList();
    console.log("SUCCESS DELETE :::: ", response);
    if (!response.success) {
      console.log("FAILURE DELETE :::: ", response);
    }
  };

  const onFailureDeleteGroupChatList = (error) => {
    setRefreshing(false);
    console.log(error, "errgrpdelete");
  };

  const onChangeHandler = (value) => {
    setIndex(value);
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };
  console.log("HASARRAY", chatListArray, groupListArray);

  const NoChatListFound = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          {/* <Text
            style={{
              color: CPColors.primary,
              fontFamily: CPFonts.bold,
              fontSize: 14,
            }}
          >
            You are not in any group
          </Text> */}
          <Image
            source={require("../Assets/images/noChatListFound.png")}
            resizeMode="contain"
            style={{ height: "30%", bottom: "07%" }}
          />
          <Text
            style={{
              fontSize: 16,
              position: "absolute",
              top: "60%",
              // marginBottom:50,
              fontWeight: "bold",
              color: CPColors.secondary,
            }}
          >
            No Chats Found
          </Text>
        </View>
      </View>
    );
  };

  const ChatItemListRender = () => {
    return (
      <CPChatItemList
        chatListData={selectedIndex === 0 ? chatListArray : groupListArray}
        onPress={(data) => {
          props.navigation.navigate("chat", {
            userData: data,
            selectMode: selectedIndex,
          });
        }}
        onDeletePress={(data) => {
          console.log(data, "gbygbygby");
          selectedIndex === 0
            ? deleteChatList(data.item.id)
            : deleteGroupChatList(data);
        }}
      />
    );
  };

  return (
    <BaseContainer
      title={"Chat"}
      onBackPress={navigateToBack}
      titleStyle={styles.flexStyle}
      rightComponent={
        <View style={styles.flexStyle}>
          <Pressable
            style={styles.groupPress}
            onPress={() => {
              props.navigation.navigate("newchatlist", {
                selectMode: selectedIndex,
              });
            }}
          >
            <Image source={Assets.addgroup} />
          </Pressable>
        </View>
      }
    >
      {refreshing ? (
        <CPLoader />
      ) : (
        <View style={styles.flexStyle}>
          <CPSegmentComponent
            style={styles.segmentStyle}
            segmentArray={chatArray}
            selectedIndex={selectedIndex}
            onChangeHandler={onChangeHandler}
          />
          {(selectedIndex === 0 && chatListArray?.length === 0) ||
          (selectedIndex === 1 && groupListArray?.length === 0) ? (
            <NoChatListFound />
          ) : (
            <ChatItemListRender />
          )}
        </View>
      )}
    </BaseContainer>
  );
};

export default ChatListContainer;

const styles = StyleSheet.create({
  flexStyle: { flex: 1 },
  groupPress: { alignSelf: "flex-end", marginRight: 20 },
  segmentStyle: { paddingHorizontal: 24 },
});
