import React, { useState, useEffect } from "react";
import BaseContainer from "./BaseContainer";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  Image,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CPUserInterestComponent from "../Components/CPUserInterestComponent";
import Assets from "../Assets";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getApi } from "../Utils/ServiceManager";
import { EXPLORE } from "../Utils/CPConstant";
import CPLoader from "../Components/CPLoader";
import CPFonts from "../Utils/CPFonts";
import CPColors from "../Utils/CPColors";

const AllFollowreandFollowingList = (props) => {
  const userSelector = useSelector((state) => state);
  const [expUserList, setExpUserList] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    explorelist();
  }, []);


  const explorelist = () => {
    getApi(
      EXPLORE,
      onSuccessAllExplorelist,
      onFailureAllExplorelist,
      userSelector.userOperation
    );
  };

  const onSuccessAllExplorelist = (response) => {
    console.log("All Explore Success ::::::: ", response);
    if (response.success) {
      setExpUserList(response.data);
    }
    setRefreshing(false);
  };

  const onFailureAllExplorelist = (error) => {
    console.log("Explore Success ::::::: ", error);
    setRefreshing(false);
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };

  const renderSearchList = ({ item, index }) => {
    return (
      <CPUserInterestComponent
        item={item}
        isFollow
        onPress={() => {
          props.navigation.navigate("anotherUser", {
            isAnotherUser: true,
            fromClick: true,
            id: item.id,
          });
        }}
      />
    );
  };

  return (
    <BaseContainer onBackPress={navigateToBack} title={"Discover People"}>
      {refreshing ? (
        <CPLoader />
      ) : (
        <View style={styles.container}>
          {expUserList.length == 0 ? (
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
                {"No data found"}
              </Text>
            </View>
          ) : (
            <SwipeListView
              data={expUserList}
              style={{ paddingTop: Platform.OS == "android" ? 30 : 10 }}
              renderItem={renderSearchList}
              renderHiddenItem={(data, rowMap) => (
                <View style={styles.itemListStyle}>
                  <Pressable>
                    <Image style={styles.imageStyle} source={Assets.delete} />
                  </Pressable>
                </View>
              )}
              leftOpenValue={75}
              rightOpenValue={-75}
            />
          )}
        </View>
      )}
    </BaseContainer>
  );
};

export default AllFollowreandFollowingList;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  itemListStyle: {
    flex: 1,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  imageStyle: { marginRight: 15 },
});
