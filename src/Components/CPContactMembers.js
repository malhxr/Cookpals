import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import CPColors from '../Utils/CPColors';
import { FOLLOW, USER_DETAILS } from '../Utils/CPConstant';
import CPFonts from '../Utils/CPFonts';
import { getApi, postApi } from '../Utils/ServiceManager';
import CPButton from './CPButton';
import CPImageComponent from './CPImageComponent';

const CPContactMembers = (props) => {

    // const userSelector = useSelector((state) => state)
    // const [user, setUser] = useState()
    // const [userFollow, setUserFollow] = useState()


    //-------------------- Commenting below code for getting userdetails which is not required
    // useEffect(() => {
    //     userDetails()
    // }, [])

    // const userDetails = () => {
    //     getApi(
    //         USER_DETAILS + props.item.id,
    //         onSuccessClickAccount,
    //         onFailureClickAccount,
    //         userSelector.userOperation,
    //     );
    // }
    // const onSuccessClickAccount = (response) => {
    //     if (response.success) {
    //         setUser(response.data)
    //         setUserFollow(response.data?.my_profile?.isfollow)
    //     }
    // };

    // const onFailureClickAccount = (error) => {
    //     console.log(' FAILURE CLICK ACCOUNT ::::::', error);
    // };

    // const onChangeFollowUnFollowStatus = () => {
        // props.onPress(props.item)
        // if (user) {
        //     OnFollowChangeForFollow()
        // } else {
        //     props?.onChangeStatus(data)
        // }
    // }

    // const OnFollowChangeForFollow = () => {

    //     const params = {
    //         status: user?.my_profile?.isfollow === 0 ? 1 : 0,
    //         follower_id: props.item.id

    //     }
    //     postApi(FOLLOW, params, onSuccessFollow, onFailureFollow, userSelector.userOperation)

    // }

    // const onSuccessFollow = (response) => {
    //     if (response.success)
    //         setUserFollow(response.data.status)
    // }

    // const onFailureFollow = (error) => {
    //     console.log("FAILURE ACTIVE :::::: ", error);

    // }

    return (
        <Pressable style={style.pressableStyle}
            onPress={() => props.item.isSelected ? props.onRemovePress(props.item) : props.onPress(props.item)}
        //commented the above line for build but is necessary when working on this component
        >
            {props?.item?.hasThumbnail ? 
                <CPImageComponent
                style={style.imageStyle}
                source={props?.item?.thumbnailPath ?? props?.item.image}
                /> 
                : 
                <View style={style.profileContainer}>
                    <Text style={style.profileText}>{props?.item?.givenName.substring(0,1)}{props?.item?.familyName.substring(0,1)}</Text>
                </View>
            }
           

            <View style={style.viewStyle}>
                <Text style={style.nameStyle}>{props?.item?.givenName} {props?.item?.familyName}</Text>
                <Text style={style.subTitle}>{props?.item?.contact || "Contact"}</Text>
            </View>

            <Icon name={props.item.isSelected ? 'check' : 'add'} style={{ backgroundColor: props.isSelected ? CPColors.primary : CPColors.transparent, borderRadius: 8, borderColor: CPColors.primary, borderWidth: 2 }} size={20} color={props.isSelected ? CPColors.white : CPColors.primary} />
        </Pressable>
    );
};

export default CPContactMembers;

const style = StyleSheet.create({
    pressableStyle: { paddingVertical: 10, flexDirection: 'row', alignItems: 'center' },
    imageStyle: { width: widthPercentageToDP("10%"), height: widthPercentageToDP("10%"), borderRadius: widthPercentageToDP("10%") },
    viewStyle: { flex: 1, marginHorizontal: 15, justifyContent: 'space-between' },
    nameStyle: { fontSize: 14, fontFamily: CPFonts.regular, color: CPColors.secondary },
    subTitle: { fontSize: 14, fontFamily: CPFonts.regular, color: CPColors.secondaryLight, marginTop: 5 },
    profileContainer: { backgroundColor: CPColors.lightwhite, height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
    profileText: { fontSize: 14, fontFamily: CPFonts.semiBold },
})
