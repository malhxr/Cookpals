import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CPColors from "../Utils/CPColors";
import CPNewMemberItems from "./CPNewMemberItems";
import CPSelectedMemberComponent from "./CPSelectedMemberComponent";
import Snackbar from "react-native-snackbar";

const CPNewChatItemList = (props) => {
  const isShouldIndexSelected = (items) => {
    return props?.selectedIndexes?.some((item, index) => item.id == items.id);
  };
  const onFilterMember = (item) => {
    props?.setSelectedIndexes(
      props?.selectedIndexes?.filter((x) => x.id !== item.id)
    );
  };
  console.log(props?.selectedIndexes, "selectedIndexes");

  return (
    <>
      {props.mode == 1 && props?.selectedIndexes?.length !== 0 ? (
        <View style={style.container}>
          <CPSelectedMemberComponent
            onClosePress={(item) => onFilterMember(item)}
            membersArray={props?.selectedIndexes}
          />
        </View>
      ) : null}
      {props.mode == 1 && props?.selectedIndexes?.length !== 0 ? (
        <View style={style.sepratorStyle} />
      ) : null}
      <FlatList
        style={style.listStyle}
        data={props.chatGroupData}
        renderItem={({ item }) => (
          <CPNewMemberItems
            mode={props.mode}
            item={item}
            isNewGrp
            addOnButton
            id={item.id}
            isSelected={isShouldIndexSelected(item)}
            onPress={(item) => {
              if (isShouldIndexSelected(item)) {
                props?.setSelectedIndexes(
                  props?.selectedIndexes?.filter(
                    (items, indexes) => items.id !== item.id
                  )
                );
                props.onChangeReceiveMembers(
                  props?.selectedIndexes?.filter(
                    (items, indexes) => items.id !== item.id
                  )
                );
              } else {
                if (props.mode == 0) {
                  props?.setSelectedIndexes([item]);
                  props.onChangeReceiveMembers([item]);
                } else {
                  if (props?.selectedIndexes?.length < 25) {
                    props?.setSelectedIndexes((oldArray) => [
                      ...oldArray,
                      item,
                    ]);
                    props.onChangeReceiveMembers([
                      ...props?.selectedIndexes,
                      item,
                    ]);
                  } else {
                    Snackbar.show({
                      text: "You can't select more than 25 participants.",
                      duration: Snackbar.LENGTH_LONG,
                    });
                  }
                }
              }
            }}
          />
        )}
      />
    </>
  );
};

export default CPNewChatItemList;

const style = StyleSheet.create({
  container: { marginHorizontal: 24, paddingVertical: 10, marginBottom: 10 },
  sepratorStyle: {
    height: 1,
    borderWidth: 1,
    borderColor: CPColors.dropdownColor,
  },
  listStyle: { paddingHorizontal: 24, marginTop: 5 },
});
