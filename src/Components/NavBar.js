import React from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { hasNotch } from "react-native-device-info";
import Assets from "../Assets";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import CPBackButton from "./CPBackButton";

const NavBar = (props) => {
  return (
    <View
      style={[
        styles.container,
        props.isTransparentEnable
          ? {
              position: "absolute",
              top: Platform.OS == "ios" ? (hasNotch() ? 40 : 20) : 20,
              right: 0,
              left: 0,
            }
          : {
              marginTop: Platform.OS == "android" ? 20 : hasNotch() ? 40 : 20,
            },
      ]}
    >
      {props.leftComponet ? (
        props.leftComponet
      ) : (
        <View style={[{ flex: 1 }, props.leftcmpStyle]}>
          <CPBackButton
            onBackPress={props.onBackPress}
            imageStyle={props.imageStyle}
          />
        </View>
      )}

      {props.titleComponent ? (
        props.titleComponent
      ) : (
        <Text style={[styles.titleStyle, props.titleStyle]}>{props.title}</Text>
      )}

      {props.searchComponent ? props.searchComponent : null}

      {props.rightComponent ? (
        props.rightComponent
      ) : props.searchComponent ? null : (
        <View style={{ flex: 1 }} />
      )}
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10000,
  },
  titleStyle: {
    flex: 2,
    color: CPColors.secondary,
    textAlign: "center",
    fontFamily: CPFonts.semiBold,
    fontSize: 16,
  },
});
