import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import { Icon } from "react-native-elements";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Assets from "../Assets";
import CPNewChatItemList from "../Components/CPNewChatItemList";
import CPThemeButton from "../Components/CPThemeButton";
import CPColors from "../Utils/CPColors";
import { ADD_CHAT_FOLLOWERS_LIST } from "../Utils/CPConstant";
import BaseContainer from "./BaseContainer";
import { getApi } from "../Utils/ServiceManager";

const NewChatContainer = (props) => {
  const userSelector = useSelector((state) => state);
  const [chatListArray, setChatListArray] = useState([]);
  var selectedMembers = [];
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    newChatUserList();
  }, []);

  const newChatUserList = () => {
    getApi(
      ADD_CHAT_FOLLOWERS_LIST + props.route?.params?.selectMode,
      onSuccessChatUserList,
      onFailureChatUserList,
      userSelector.userOperation
    );
  };

  const onSuccessChatUserList = (response) => {
    if (response.success) {
      setChatListArray(response.data);
    }
  };

  const onFailureChatUserList = (error) => {
    console.log("Error----", error);
  };

  console.log(chatListArray, "selectedMembers");
  const navigationToNext = () => {
    setIsLoading(true);

    if (props.route?.params?.selectMode == 1) {
      if (selectedIndexes.length > 1) {
        console.log("navigate");
        props.navigation.navigate("createGroup", {
          groupMembers: selectedIndexes,
          setGroupMembers: setSelectedIndexes,
        });
      }
    } else {
      // props.navigation.goBack();
      if (selectedIndexes.length == 1) {
        props.navigation.replace("chat", {
          userData: selectedIndexes[0]?.user_list[0],
          selectMode: props.route?.params?.selectMode,
        });
        // } else {
      }
    }
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };
  return (
    <BaseContainer
      title={props.route?.params?.selectMode == 0 ? "New Chat" : "New Group"}
      rightComponent={
        <View style={styles.flexViewStyle}>
          <Icon
            type={"material-icons"}
            name={"search"}
            color={CPColors.borderColor}
            style={{
              marginRight: 20,
              padding: 3,
              borderRadius: 10,
              alignSelf: "flex-end",
            }}
          />
        </View>
      }
      onBackPress={navigateToBack}
    >
      {chatListArray[0]?.id === undefined ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Image
            source={require("../Assets/images/noChatListFound.png")}
            resizeMode="contain"
            style={{ height: "50%", width: "50%", bottom: "07%" }}
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
      ) : (
        <View style={styles.container}>
          <CPNewChatItemList
            chatGroupData={chatListArray}
            mode={props.route?.params?.selectMode}
            setSelectedIndexes={setSelectedIndexes}
            selectedIndexes={selectedIndexes}
            onChangeReceiveMembers={(data) => {
              selectedMembers = selectedIndexes;
            }}
          />

          <CPThemeButton
            isLoading={isLoading}
            style={styles.btnStyle}
            title={props.route?.params?.selectMode == 0 ? "Start Chat" : "Next"}
            onPress={navigationToNext}
          />
        </View>
      )}
    </BaseContainer>
  );
};

export default NewChatContainer;

const styles = StyleSheet.create({
  flexViewStyle: { flex: 1 },
  container: { flex: 1, paddingBottom: 10 },
  btnStyle: { width: widthPercentageToDP("85"), alignSelf: "center" },
});
