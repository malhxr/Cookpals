import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import Assets from "../Assets";
import { showDialogue } from "../Utils/CPAlert";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import CPImageComponent from "./CPImageComponent";

const CPSelectedMemberComponent = (props) => {
  const userData = useSelector((state) => state);
  console.log("propsisAdmin", userData?.userOperation?.detail?.user_id);
  const adminId = userData?.userOperation?.detail?.user_id;
  const closePress = (item) => {
    showDialogue(
      "Are you sure want to remove this user?",
      [{ text: "Cancel" }],
      "Cookpals",
      () => props?.onClosePress(item)
    );
  };

  return (
    <>
      <View style={props.style}>
        {props?.membersArray?.length !== 0 ? (
          <FlatList
            data={props.membersArray}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({ item, index }) => {
              console.log(item?.user_id, "propsisAdmin");
              return (
                <View
                  style={{
                    width:
                      widthPercentageToDP("86.5%") / (props.numColumns ?? 5),
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <View style={style.memberImageView}>
                    {/* {props?.item?.hasThumbnail ? */}
                    <CPImageComponent
                      key={index}
                      style={style.imageStyle}
                      source={item?.thumbnailPath ?? item?.profile}
                    />
                    {/* :
                                            <View style={style.profileContainer}>
                                                <Text style={style.profileText}>{item?.givenName?.substring(0, 1)}{item?.familyName?.substring(0, 1)}</Text>
                                            </View>() => props?.onClosePress(item)
                                        } */}
                  </View>
                  <Pressable
                    onPress={() => closePress(item)}
                    style={{
                      marginTop: -10,
                      display:
                        props?.isAdmin && item?.user_id !== adminId
                          ? "flex"
                          : "none",
                    }}
                  >
                    <CPImageComponent placeholder={Assets.close} />
                  </Pressable>
                  <Text style={style.nameStyle} numberOfLines={2}>
                    {props?.isGroup ? item?.user_data[0]?.name : item.name}
                  </Text>
                </View>
              );
            }}
          />
        ) : null}
      </View>
    </>
  );
};

export default CPSelectedMemberComponent;

const style = StyleSheet.create({
  memberImageView: {
    padding: 2,
    borderWidth: 1,
    borderColor: CPColors.imageborderColor,
    borderRadius: widthPercentageToDP("10%"),
  },
  imageStyle: {
    width: widthPercentageToDP("10%"),
    height: widthPercentageToDP("10%"),
    borderRadius: widthPercentageToDP("10%"),
  },
  nameStyle: {
    fontSize: 12,
    fontFamily: CPFonts.regular,
    color: CPColors.secondaryLight,
    textAlign: "center",
  },
  profileContainer: {
    backgroundColor: CPColors.lightwhite,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  profileText: { fontSize: 14, fontFamily: CPFonts.semiBold },
});
