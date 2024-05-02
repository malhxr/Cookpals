import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { Icon } from "react-native-elements";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";

const CPTextInput = (props) => {
  const [isFocus, setFocus] = useState(false);
  const [isVisibility, setIsVisibility] = useState(
    props.secureTextEntry ?? false
  );

  useEffect(() => {
    if (props.defaultsecureTextEntry) {
      setIsVisibility(false);
    }
  }, [props.defaultsecureTextEntry]);

  return (
    <View>
      <View
        style={[
          style.container,
          {
            alignItems: props.multiline ? "flex-start" : "center",
            borderColor: isFocus ? CPColors.secondary : CPColors.textInputColor,
          },
          props.containerStyle,
        ]}
      >
        {props.source ? (
          <Image
            source={props.source}
            style={{
              marginTop: props.multiline ? 2 : 0,
              marginHorizontal: 10,
              width: 18,
              height: 18,
            }}
            resizeMode="contain"
          />
        ) : null}
        <TextInput
          editable={props?.isAdmin}
          style={[props.style, style.inputStyle]}
          value={props.value}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholderTextColor={
            props.placeholderTextColor ?? CPColors.secondaryLight
          }
          maxLength={props.maxLength}
          autoCapitalize={"none"}
          returnKeyType={props.returnKeyType}
          secureTextEntry={isVisibility}
          keyboardType={props.keyboardType ?? "default"}
          numberOfLines={props.numberOfLines ?? 1}
          multiline={props.multiline ?? false}
          onChangeText={props.onChangeText}
        />
        {props.secureTextEntry ? (
          <Icon
            style={{ alignSelf: "center" }}
            type={"material-icons-outlined"}
            name={!isVisibility ? "visibility-off" : "visibility"}
            color={CPColors.secondaryLight}
            onPress={() => setIsVisibility(!isVisibility)}
          />
        ) : null}
      </View>
      {props.error ? (
        <Text
          style={{
            color: CPColors.red,
            fontSize: 12,
            fontFamily: CPFonts.regular,
            marginTop: 5,
            marginLeft: 5,
          }}
        >
          {props.error}
        </Text>
      ) : null}
    </View>
  );
};

export default CPTextInput;

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    marginTop: 25,
    borderRadius: 10,
    backgroundColor: CPColors.textInputColor,
  },
  inputStyle: {
    flex: 1,
    paddingVertical: 5,
    marginLeft: 10,
    color: CPColors.secondary,
    fontFamily: CPFonts.medium,
    fontSize: 14,
  },
});
