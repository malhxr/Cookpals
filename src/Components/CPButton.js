import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";

const CPButton = (props) => {
  return (
    <Pressable
      style={[style.pressStyle, props.style]}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <Text style={[style.textStyle, props.textStyle]}>{props.title}</Text>
    </Pressable>
  );
};

export default CPButton;

const style = StyleSheet.create({
  pressStyle: {
    borderWidth: 1,
    borderColor: CPColors.secondaryLight,
    borderRadius: 5,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 12,
    fontFamily: CPFonts.regular,
    color: CPColors.secondary,
    marginVertical: 5,
  },
});
