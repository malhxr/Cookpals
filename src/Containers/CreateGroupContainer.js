import React, { useEffect, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { widthPercentageToDP } from "react-native-responsive-screen";
import Assets from "../Assets";
import CPImageComponent from "../Components/CPImageComponent";
import CPProfileImage from "../Components/CPProfileImage";
import CPSelectedMemberComponent from "../Components/CPSelectedMemberComponent";
import CPTextInput from "../Components/CPTextInput";
import ValidationHelper from "../Utils/ValidationHelper";
import CPThemeButton from "../Components/CPThemeButton";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import BaseContainer from "./BaseContainer";
import { useSelector } from "react-redux";
import { postApi } from "../Utils/ServiceManager";
import { CREATE_GROUP, EDIT_GROUP } from "../Utils/CPConstant";

const CreateGroupContainer = (props) => {
  const { edit } = props.route?.params;
  const [groupName, setGroupName] = useState(edit?.name ?? "");
  const [groupIcon, setGroupIcon] = useState(edit?.image ?? "");
  const [shouldVisible, setShouldVisible] = useState(false);
  const [groupMembers, setGroupMembers] = useState(
    props?.route?.params?.groupMembers
  );
  const [isLoading, setIsLoading] = useState(false);

  const validationHelper = new ValidationHelper();
  const userSelector = useSelector((state) => state);

  useEffect(() => {
    return () => {
      console.log(
        groupMembers,
        props.route?.params.setGroupMembers,
        "groupMembers"
      );
      props.route?.params?.setGroupMembers(groupMembers);
    };
  }, [groupMembers]);

  const isAdmin = edit
    ? userSelector?.userOperation?.detail?.user_id === edit?.admin_id
    : true;

  console.log(
    isAdmin,
    "isAdmin",
    userSelector?.userOperation?.detail.user_id,
    edit?.admin_id
  );

  const onChangeGroup = (text) => {
    setShouldVisible(false);
    setGroupName(text);
  };

  const validation = () => {
    setShouldVisible(true);
    setIsLoading(true);

    if (!groupName.trim()) {
      return;
    } else {
      edit ? editGroup() : addGroup();
    }
  };
  const addGroup = () => {
    const params = {
      image: groupIcon,
      name: groupName ?? edit?.name,
      groupusers: groupMembers?.map((x) => x?.id).toString(),
    };
    console.log(params, "params");
    postApi(
      CREATE_GROUP,
      params,
      onSuccess,
      onFailure,
      userSelector.userOperation
    );
  };

  console.log(groupMembers, "EDIT_PARAMS");
  const editGroup = () => {
    let params = {
      name: groupName,
      groupusers: groupMembers.map((x) => x.user_id).toString(),
      group_id: edit?.id,
    };
    if (groupIcon?.url) {
      params["image"] = groupIcon;
    }
    console.log(params, "EDIT_PARAMS");
    postApi(
      EDIT_GROUP,
      params,
      onSuccessEdit,
      onFailureEdit,
      userSelector.userOperation
    );
  };
  const onSuccessEdit = (response) => {
    props.navigation.popToTop();
    props.navigation.navigate("chatlist");
    setIsLoading(false);

    console.log(response, "responseEDIT");
  };
  const onFailureEdit = (error) => {
    setIsLoading(false);

    console.log(error, "errorEDIT");
  };

  const onSuccess = (response) => {
    setIsLoading(false);

    console.log(response, "group response");
    props.navigation.popToTop();
    props.navigation.navigate("chatlist");
    if (response.success) {
    }
  };

  const onFailure = (error) => {
    setIsLoading(false);

    console.log("FAILURE ACTIVE :::::: ", error);
  };
  const navigateToBack = () => props?.navigation?.goBack();

  return (
    <BaseContainer onBackPress={navigateToBack}>
      <View style={styles.container}>
        {/* edit ? edit?.image : */}
        <CPProfileImage
          isAdmin={isAdmin}
          placeholder={edit?.image ?? Assets.profileimage}
          defaultImage={edit?.image}
          imagestyle={{ width: 90, height: 90, borderRadius: 90 }}
          style={styles.imageStyle}
          onSelectImageData={(data) => {
            setGroupIcon(data);
          }}
          isEditImage
        />

        <CPTextInput
          // value={groupName}
          isAdmin={isAdmin}
          defaultValue={edit?.name ?? ""}
          source={Assets.group}
          placeholder={"Group Name"}
          onChangeText={onChangeGroup}
          error={
            shouldVisible &&
            validationHelper
              .isEmptyValidation(groupName, "Please enter group name")
              .trim()
          }
        />

        <Text style={styles.headerTitle}>
          {"Participants" + " (" + groupMembers.length + ")"}
        </Text>
        <CPSelectedMemberComponent
          isAdmin={isAdmin}
          membersArray={groupMembers}
          isGroup={edit ? true : false}
          onClosePress={(i) => {
            console.log(i, groupMembers, "i, groupMembers");
            setGroupMembers(groupMembers.filter((x) => x.id !== i.id));
          }}
          numColumns={4}
          style={styles.memberList}
        />
      </View>
      {isAdmin && (
        <CPThemeButton
          isLoading={isLoading}
          title={edit?.id ? "Edit" : "Next"}
          style={styles.memberList}
          onPress={() => validation()}
        />
      )}
    </BaseContainer>
  );
};

export default CreateGroupContainer;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingBottom: 10 },
  imageStyle: {
    alignSelf: "center",
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 16,
    marginTop: 40,
    fontFamily: CPFonts.semiBold,
    color: CPColors.secondary,
    marginBottom: 15,
  },
  memberList: { marginBottom: 20 },
});
