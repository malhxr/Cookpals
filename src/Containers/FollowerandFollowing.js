import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import Assets from "../Assets";
import CPLoader from "../Components/CPLoader";
import CPSearchComponent from "../Components/CPSearchComponent";
import CPSegmentComponent from "../Components/CPSegmentComponent";
import CPUserFollow from "../Components/CPUserFollow";
import CPColors from "../Utils/CPColors";
import { FOLLOWING } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { getApi } from "../Utils/ServiceManager";
import BaseContainer from "./BaseContainer";

const FollowerandFollowing = (props) => {
  const userSelector = useSelector((state) => state);
  const followersArray = ["Followers", "Following"];
  const [selectedIndex, setIndex] = useState(0);
  const [follower, setFollower] = useState();
  const [following, setFollowing] = useState();
  const [clickID, setClickID] = useState();
  const [refreshing, setRefreshing] = useState(true);
  const [id, setId] = useState(props?.route?.params?.id);

  // useEffect(() => {
  //     followList()
  // }, [])

  useEffect(() => {
    followList(props?.route?.params?.id)
}, []);

  const followList = (id) => {
    getApi(
      FOLLOWING + id,
      onSuccesFollowing,
      onFailureFollowing,
      userSelector.userOperation
    );
  };

  const onSuccesFollowing = (response) => {
    if (response.success) {
      setFollower(response?.data?.followers);
      setFollowing(response?.data?.following);
    }
    setRefreshing(false);
  };
  console.log(following, "followoowww");

  const onFailureFollowing = (error) => {
    setRefreshing(false);
  };

  const onChangeHandler = (value) => {
    setIndex(value);
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };

  const renderSearchList = ({ item, index }) => {
    return (
      <CPUserFollow
        item={item}
        index={index}
        isFollowing
        followLength={follower.length}
        followingLength={following.length}
        selectedIndex={selectedIndex}
        setClickID={setClickID}
        isUnfollow={selectedIndex}
        followList={followList}
        idForRefresh={props?.route?.params?.id}
        isAnotherUser={!props.route.params?.isAnotherUser ? false : true}
        onPress={() => {
          props.navigation.navigate("anotherUser", {
            isAnotherUser: true,
            fromClick: true,
            id: selectedIndex == 0 ? item.user_id : item.follower_id,
          });
        }}
      />
    );
  };

  return (
    <BaseContainer
      titleComponent={true}
      onBackPress={navigateToBack}
      leftcmpStyle={{ flex: 0 }}
      // rightComponent={
      //     <CPSearchComponent
      //         placeholder={'Search by name,cusine or meal type...'}
      //         style={styles.searchStyle}
      //     />
      // }
    >
      <View style={styles.container}>
        <CPSegmentComponent
          segmentArray={followersArray}
          selectedIndex={selectedIndex}
          onChangeHandler={onChangeHandler}
          // style={{marginTop:30}}
        />
        {refreshing ? (
          <CPLoader />
        ) : (selectedIndex == 0 && follower?.map((x) => x).length === 0) ||
          (selectedIndex == 1 && following?.map((x) => x).length === 0) ? (
          <>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: CPColors.primary,
                  fontFamily: CPFonts.bold,
                  fontSize: 14,
                }}
              >
                {"No users found"}
              </Text>
            </View>

            {selectedIndex ? null : !props.route.params?.isAnotherUser ? (
              <Pressable
                onPress={() => {
                  props.navigation.navigate("allfollowandfollowing");
                }}
              >
                <Text style={styles.footerText}>{"See All Suggestions"}</Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <FlatList
            data={selectedIndex == 0 ? follower : following}
            contentContainerStyle={styles.listView}
            ListFooterComponent={() => {
              return (
                <>
                  {selectedIndex ? null : !props.route.params?.isAnotherUser ? (
                    <Pressable
                      style={styles.listViewPress}
                      onPress={() => {
                        props.navigation.navigate("allfollowandfollowing");
                      }}
                    >
                      <Text style={styles.footerText}>
                        {"See All Suggestions"}
                      </Text>
                    </Pressable>
                  ) : null}
                </>
              );
            }}
            renderItem={renderSearchList}
          />
        )}
      </View>
    </BaseContainer>
  );
};

export default FollowerandFollowing;

const styles = StyleSheet.create({
  searchStyle: {
    flex: 1,
    marginBottom: -30,
    marginRight: 20,
  },
  container: { flex: 1, paddingHorizontal: 24 },
  listView: { paddingVertical: 20 },
  listViewPress: { alignSelf: "flex-start" },
  footerText: {
    fontSize: 14,
    fontFamily: CPFonts.medium,
    color: CPColors.primary,
  },
});
