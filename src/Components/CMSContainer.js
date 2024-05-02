import React from "react";
import { View } from "react-native";
import BaseContainer from "../Containers/BaseContainer";
import { WebView } from "react-native-webview";
import { BASE_URL } from "../Utils/CPConstant";
import CPColors from "../Utils/CPColors";

const CMSContainer = (props) => {
  const onNavigationBack = () => {
    props.navigation.goBack();
  };

  return (
    <BaseContainer
      title={
        props.route.params.cms == 1 ? "Terms & Conditions" : "privacy-policy"
      }
      onBackPress={onNavigationBack}
    >
      <WebView
        source={{
          uri:
            props.route.params.cms == 1
              ? BASE_URL + "terms-and-condition"
              : BASE_URL + "privacy-policy",
        }}
        style={{ backgroundColor: CPColors.transparent }}
      />
    </BaseContainer>
  );
};

export default CMSContainer;
