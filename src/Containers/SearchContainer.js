import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import CPSearchComponent from "../Components/CPSearchComponent";
import CPSegmentComponent from "../Components/CPSegmentComponent";
import CPUserInterestComponent from "../Components/CPUserInterestComponent";
import BaseContainer from "./BaseContainer";
import { getApi, postApi } from "../Utils/ServiceManager";
import { PROFILE_SEARCH_API, SEARCH_API } from "../Utils/CPConstant";
import { useFocusEffect } from "@react-navigation/native";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import { useSelector } from "react-redux";
import CPLoader from "../Components/CPLoader";

const SearchContainer = (props) => {
  useEffect(() => {
    SearchApi("");
    if (searchList?.length === 0) {
      console.log("search");
      setIsEmpty(true);
    } else {
      console.log("search");
      setIsEmpty(false);
    }
  }, []);

  const [selectedIndex, setIndex] = useState(0);

  const onChangeHandler = (value) => {
    setIndex(value);
  };

  const userSelector = useSelector((state) => state);
  const [searchList, setSearchList] = useState();
  const [nextPage, setNextPage] = useState();
  const [textSearch, setTextSearch] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  console.log(searchList, "Search List");

  const SearchApi = (text) => {
    const params = {
      search: text,
      type: selectedIndex === "" ? 1 : selectedIndex + 1,
    };
    postApi(
      PROFILE_SEARCH_API,
      params,
      onSuccessPrefrenceListRender,
      onFailurePrefrenceListRender,
      userSelector?.userOperation
    );
  };

  const onSuccessPrefrenceListRender = (response) => {
    console.log("SUCCESS ACTIVE=>> :::::: ", response);
    if (response.success) {
      setNextPage(response.data);
      setSearchList(response.data?.data);
    }
    setRefreshing(false);
  };

  const onFailurePrefrenceListRender = (error) => {
    console.log("FAILURE ACTIVE :::::: ", error);
    setRefreshing(false);
  };

  // `${PROFILE_SEARCH_API}?${nextPage?.current_page+1}`

  const SearchApiTWO = (text) => {
    const params = {
      search: text,
      type: selectedIndex === "" ? 1 : selectedIndex + 1,
    };
    postApi(
      nextPage?.next_page_url,
      params,
      onSuccessPrefrenceListRenderTWO,
      onFailurePrefrenceListRenderTWO,
      userSelector?.userOperation
    );
  };

  console.log(nextPage?.next_page_url, "url");

  const onSuccessPrefrenceListRenderTWO = (response) => {
    console.log("SUCCESS lisststs ACTIVE=>> :::::: ", response);
    if (response.success) {
      setSearchList([...searchList, ...response.data?.data]);
      setNextPage(response.data);
    }
  };

  const onFailurePrefrenceListRenderTWO = (error) => {
    console.log("FAILURE ACTIVE :::::: ", error);
  };

  const segmentArray = ["Profile", "Cuisine", "Meal Type"];

  const cuisine = searchList?.map((x) =>
    x?.my_preference?.my_preference_cuisine?.map((y) =>
      y?.cuisine?.name?.split(",")
    )
  );
  const meal = searchList?.map((x) =>
    x?.my_preference?.my_preference_meal?.map((y) => y?.meal?.name)
  );
  const country = searchList?.map((x) => x?.my_preference?.country?.name);

  const renderSearchList = ({ item, index }) => {
    // const sortFilter = (arr) => {
    //  if (selectedIndex === 0 ? arr.includes(textSearch.trim()) : arr?.filter(x => x)[index]?.join(',').includes(textSearch.trim()).length === 0) {}
    //   console.log(selectedIndex === 0 ? arr.includes(textSearch.trim()) : arr?.filter(x => x)[index]?.join(',').includes(textSearch.trim()).length === 0,arr.length,'::::lalalal');
    //   return selectedIndex === 0 ? arr.includes(textSearch.trim()) : arr?.filter(x => x)[index]?.join(',').includes(textSearch.trim())
    // }
    // console.log(item.id, 'likskjd');
    return (
      <>
        <CPUserInterestComponent
          item={item}
          index={index}
          selectedIndex={selectedIndex}
          Cuisine={cuisine}
          Meal={meal}
          // sortFilter={sortFilter}
          Country={country}
          TextSearch={textSearch}
          onPress={() => {
            props.navigation.navigate("anotherUser", {
              isAnotherUser: true,
              fromClick: true,
              id: item.id,
            });
            console.log(item, "isisisisisiisssssss");
          }}
        />
      </>
    );
  };

  const onSearchChangeHandler = (text) => {
    setTextSearch(text);
    SearchApi(text);
  };
  const SearchListData = () => {
    return (
      <FlatList
        data={searchList}
        onEndReached={() => {
          SearchApiTWO("");
        }}
        onEndReachedThreshold={0}
        contentContainerStyle={styles.flatlistStyle}
        showsVerticalScrollIndicator={false}
        renderItem={renderSearchList}
        // onScroll={() => { Keyboard.dismiss() }}
      />
    );
  };
  return (
    <BaseContainer
      isNavigationDisable
      safeAreaBottomDisable
      isBottomAreaPadding
    >
      <View style={styles.main}>
        <CPSearchComponent
          placeholder={"Search by name,cuisine, country or meal type..."}
          style={styles.searchComponent}
          onChangeText={onSearchChangeHandler}
          value={textSearch}
        />
        <CPSegmentComponent
          segmentArray={segmentArray}
          selectedIndex={selectedIndex}
          onChangeHandler={onChangeHandler}
        />
        {refreshing ? (
          <CPLoader />
        ) : selectedIndex == 0 ? (
          searchList?.length === 0 ? (
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
                style={{ height: "50%", width: "50%", bottom: "04%" }}
              />
              <Text
                style={{
                  fontSize: 16,
                  position: "absolute",
                  top: "68%",
                  // marginBottom:50,
                  fontWeight: "bold",
                  color: CPColors.secondary,
                }}
              >
                No Profile Found
              </Text>
            </View>
          ) : (
            <SearchListData />
          )
        ) : selectedIndex == 1 ? (
          searchList[0]?.id === undefined ? (
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
                style={{ height: "50%", width: "50%", bottom: "04%" }}
              />
              <Text
                style={{
                  fontSize: 16,
                  position: "absolute",
                  top: "68%",
                  // marginBottom:50,
                  fontWeight: "bold",
                  color: CPColors.secondary,
                }}
              >
                No Cuisine Found
              </Text>
            </View>
          ) : (
            <SearchListData />
          )
        ) : selectedIndex == 2 ? (
          searchList[0]?.id === undefined ? (
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
                style={{ height: "50%", width: "50%", bottom: "04%" }}
              />
              <Text
                style={{
                  fontSize: 16,
                  position: "absolute",
                  top: "68%",
                  // marginBottom:50,
                  fontWeight: "bold",
                  color: CPColors.secondary,
                }}
              >
                No Meal Type Found
              </Text>
            </View>
          ) : (
            <SearchListData />
          )
        ) : null}
      </View>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 24,
  },
  searchComponent: {
    marginVertical: 20,
  },
  flatlistStyle: {
    paddingVertical: 20,
  },
});

export default SearchContainer;
