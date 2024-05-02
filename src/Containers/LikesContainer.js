
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useSelector } from "react-redux";
import CPNewMemberItems from "../Components/CPNewMemberItems";
import { LIKES_API } from "../Utils/CPConstant";
import { getApi } from "../Utils/ServiceManager";
import BaseContainer from "./BaseContainer";

const LikesContainer = (props) => {
  const [likesListingArray, setlikesListingArray] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const userSelector = useSelector((state) => state);
  useEffect(() => {
    likes();
  }, []);

  const likes = () => {
    getApi(
      LIKES_API + props?.route?.params?.id,
      onSuccessLikesListing,
      onFailureLikesListing,
      userSelector.userOperation
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      likes();
    });
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onSuccessLikesListing = (response) => {
    console.log("suggestion Success ::::::: ", response);
    if (response.success) {
      setRefreshing(false);

      setlikesListingArray(response.data);
    }
  };

  const onFailureLikesListing = (error) => {
    setRefreshing(false);

    console.log("suggestion Success ::::::: ", error);
  };

  const onNavigationBack = () => {
    props.navigation.goBack();
  };

  return (
    <BaseContainer title={"Likes"} onBackPress={onNavigationBack}>
      <View style={{ flex: 1, marginHorizontal: 24 }}>
        <FlatList
          data={likesListingArray}
          renderItem={({ item, index }) => {
            return (
              <CPNewMemberItems
                item={item.user}
                onChangeStatus={() => { }}
                isUser={
                  userSelector.userOperation?.detail?.user_id === item?.user_id
                }
                onPress={() => {
                  console.log(
                    userSelector.userOperation?.detail?.user_id !==
                    item?.user_id,
                    item?.user_id,
                    "userSelector.userOperation?.detail?.user_id!==item?.user_id"
                  );
                  userSelector.userOperation?.detail?.user_id !==
                    item?.user_id &&
                    props.navigation.navigate("anotherUser", {
                      isAnotherUser: true,
                      fromClick: true,
                      id: item?.user_id,
                    });
                }}
              />
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </BaseContainer>
  );
};

export default LikesContainer;