import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import Snackbar from "react-native-snackbar";
import { useSelector } from "react-redux";
import CPColors from "../Utils/CPColors";
import { ABOUT_US_API } from "../Utils/CPConstant";
import CPFonts from "../Utils/CPFonts";
import { getApi } from "../Utils/ServiceManager";
import BaseContainer from "./BaseContainer";

const AboutUsContainer = (props) => {
  const userSelector = useSelector((state) => state);
  const [aboutusArray, setAboutusArray] = useState([]);
  // const aboutusArray = [
  //     {
  //         title: 'Who we are?',
  //         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  //     },
  //     {
  //         title: 'What we do?',
  //         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  //     },
  //     {
  //         title: 'How we Work?',
  //         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  //     },
  //     {
  //         title: 'Our Vision?',
  //         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  //     }
  // ]

  const [selectIndex, setSelectIndex] = useState();

  useEffect(() => {
    aboutUsAPIAction();
  }, []);

  const aboutUsAPIAction = () => {
    getApi(
      ABOUT_US_API,
      onSuccessAboutUs,
      onFailureAboutUs,
      userSelector.userOperation
    );
  };

  const onSuccessAboutUs = (response) => {
    if (response.success) {
      setAboutusArray(response.data);
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const onFailureAboutUs = (error) => {
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const onChangeValue = (item, index) => {
    if (selectIndex !== index) {
      setSelectIndex(index);
    } else {
      setSelectIndex();
    }
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };

  const aboutUsItemRender = ({ item, index }) => {
    return (
      <View style={styles.listItem}>
        <Pressable
          style={styles.expandPress}
          onPress={() => onChangeValue(item, index)}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Icon
            name={selectIndex == index ? "remove" : "add"}
            color={CPColors.primary}
          />
        </Pressable>
        {selectIndex == index ? (
          <View style={styles.expandView}>
            <View style={styles.viewLine} />
            <Text style={styles.descriptionStyle}>{item.description}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <BaseContainer onBackPress={navigateToBack} title={"About Us"}>
      <FlatList
        data={aboutusArray}
        bounces={false}
        renderItem={aboutUsItemRender}
      />
    </BaseContainer>
  );
};

export default AboutUsContainer;

const styles = StyleSheet.create({
  listItem: { marginHorizontal: 20, marginTop: 20 },
  expandPress: { flexDirection: "row", alignItems: "center" },
  title: {
    flex: 1,
    fontFamily: CPFonts.semiBold,
    fontSize: 16,
    color: CPColors.secondary,
  },
  expandView: { flexDirection: "row", marginVertical: 10 },
  viewLine: { height: "50%", backgroundColor: CPColors.primary, width: 1 },
  descriptionStyle: {
    flex: 1,
    marginRight: 25,
    marginLeft: 10,
    fontFamily: CPFonts.regular,
    color: CPColors.secondary,
    fontSize: 12,
  },
});
