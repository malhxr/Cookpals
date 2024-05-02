import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  disabled,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";

const CPThemeButton = (props) => {
  return (
    <Pressable
      style={[styles.button, props.style]}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <LinearGradient
        colors={
          props.colorArray ?? ["rgba(226,54,143,1)", "rgba(202,54,140,1)"]
        }
        style={styles.gradient}
      >
        {props.isLoading ? (
          <ActivityIndicator color={props.color ?? CPColors.white} />
        ) : (
          <Text style={[styles.text, props.labelStyle]}>{props.title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

export default CPThemeButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  button: {
    width: widthPercentageToDP("100%") - 48,
    height: 55,
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    fontFamily: CPFonts.bold,
    color: CPColors.white,
  },
});
