import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { SwipeListView } from "react-native-swipe-list-view";
import Assets from "../Assets";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import CPImageComponent from "./CPImageComponent";
import moment from "moment";

const CPChatItemList = (props) => {
  const time = (item) => {
    var time = item?.created_at;
    // var date = new Date();
    // var time = '2022-05-11 11:32:13';
    // console.log(date)
    console.log(
      "seconds",
      moment.utc(time).local().startOf("seconds").fromNow()
    );
    return moment.utc(time).local().startOf("seconds").fromNow();
  };

  const chatItemRender = ({ item, index }) => {
    console.log(item, "propslisting");
    return (
      <Pressable
        style={style.chatPress}
        onPress={() => props.onPress(item)}
        key={index}
      >
        <CPImageComponent style={style.imageStyle} source={item.image} />

        <View style={style.chatContainerStyle}>
          <Text style={style.nameText}>{item.name}</Text>
          <Text
            style={item?.read_count == 0 ? style.msgText : style.msgBoldText}
          >
            {item?.last_message}
          </Text>
        </View>
        <View style={style.chatSubViewStyle}>
          {item?.read_count > 0 ? (
            <View style={style.countView}>
              <Text style={style.countText}>{item?.read_count}</Text>
            </View>
          ) : null}
          <Text style={style.timeStyle}>{time(item)}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={style.containerStyle}>
      <SwipeListView
        style={style.swipeStyle}
        data={props.chatListData}
        renderItem={chatItemRender}
        renderHiddenItem={(data, rowMap) => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-end",
                paddingHorizontal: 20,
              }}
            >
              <Pressable onPress={() => props.onDeletePress(data)}>
                <Image style={{ marginRight: 15 }} source={Assets.delete} />
              </Pressable>
            </View>
          );
        }}
        leftOpenValue={75}
        rightOpenValue={-100}
      />
    </View>
  );
};

export default CPChatItemList;

const style = StyleSheet.create({
  containerStyle: { flex: 1 },
  swipeStyle: { paddingTop: 20 },
  imageStyle: {
    width: widthPercentageToDP("16%"),
    height: widthPercentageToDP("16%"),
    borderRadius: widthPercentageToDP("16%"),
  },
  chatPress: {
    paddingVertical: 10,
    flexDirection: "row",
    backgroundColor: CPColors.white,
    paddingHorizontal: 24,
  },
  chatContainerStyle: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "space-around",
  },
  nameText: {
    fontSize: 16,
    fontFamily: CPFonts.semiBold,
    color: CPColors.secondary,
  },
  msgText: {
    fontSize: 14,
    fontFamily: CPFonts.medium,
    color: CPColors.secondary,
  },
  msgBoldText: {
    fontSize: 14,
    fontFamily: CPFonts.bold,
    color: CPColors.secondary,
  },
  chatSubViewStyle: { justifyContent: "center", alignItems: "flex-end" },
  countView: {
    width: 25,
    height: 25,
    backgroundColor: CPColors.primary,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: { fontSize: 14, fontFamily: CPFonts.bold, color: CPColors.white },
  timeStyle: {
    marginTop: 5,
    fontSize: 10,
    fontFamily: CPFonts.regular,
    color: CPColors.secondaryLight,
  },
});
