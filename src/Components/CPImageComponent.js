import React from "react";
import { Image, View } from "react-native";
import FastImage from "react-native-fast-image";
import Assets from "../Assets";

const CPImageComponent = (props) => {
  return (
    <View key={props?.item}>
      {props.source ? (
        <FastImage
          style={props.style}
          source={{
            uri: props.source,
            priority: FastImage.priority.normal,
          }}
          resizeMode={props.resizeMode ?? "cover"}
        />
      ) : (
        <Image style={props.style} source={props.placeholder ?? Assets.logo} />
      )}
    </View>
  );
};

export default CPImageComponent;
