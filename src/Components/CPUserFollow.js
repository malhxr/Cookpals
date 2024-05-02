import React, { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import CPColors from '../Utils/CPColors';
import { FOLLOW, REMOVE } from '../Utils/CPConstant';
import CPFonts from '../Utils/CPFonts';
import { postApi } from '../Utils/ServiceManager';
import CPButton from './CPButton';
import { showDialogue } from "../Utils/CPAlert";

const CPUserInterestComponent = (props) => {

    const userSelector = useSelector((state) => state);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isEnabledForFollow, setIsEnabledForFollow] = useState(false);
    const [isEnabledRemove, setIsEnabledRemove] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const toggleSwitchForRemove = () => setIsEnabledRemove(previousState => !previousState);
    const plan = userSelector?.userOperation?.detail?.plan?.plan_type;

    const OnFollowChange = (item) => {
        const params = {
            status: isEnabled ? 1 : 0,
            follower_id: props?.selectedIndex === 0 ? item.user_id : item.follower_id

        }
        postApi(FOLLOW, params, onSuccessFollow, onFailureFollow, userSelector.userOperation)

    }
    const OnFollowChangeForFollow = (item) => {

        const params = {
            status: !isEnabledForFollow ? 1 : 0,
            follower_id: props?.selectedIndex === 0 ? item.user_id : item.follower_id

        }
        postApi(FOLLOW, params, onSuccessFollow, onFailureFollow, userSelector.userOperation)

    }

    const onSuccessFollow = (response) => {
        console.log("SUCCESS followw=>> :::::: ", response);
        if (response.success) {
            setIsEnabled(response.data.status == "0" ? true : false)
            setIsEnabledForFollow(response.data.status == "1" ? true : false)
        }
    }

    const onFailureFollow = (error) => {
        console.log("FAILURE ACTIVE :::::: ", error);

    }


    const OnRemove = (item) => {
        props.setClickID(item.user_id)
        const Params = {
            follower_id: item.user_id
        }
        postApi(REMOVE, Params, onSuccessremove, onFailureRemove, userSelector.userOperation)

    }
    const onSuccessremove = (response) => {
        console.log("SUCCESS removeeeee=>> :::::: ", response);

    }

    const onFailureRemove = (error) => {
        console.log("FAILURE ACTIVE :::::: ", error);
    }

    const followChange = () => {
        toggleSwitch()
        OnFollowChange(props.item)
    }
    const followChangeForFollow = () => {
        toggleSwitch()
        OnFollowChangeForFollow(props.item)
    }

    return (
        <>

            <Pressable style={styles.pressAction}
                onPress={props.onPress}
            >
                <Image
                    style={styles.postImageStyle}
                    source={{ uri: props?.selectedIndex === 0 ? props.item?.followers?.cover_image : props.item?.following?.cover_image }}
                />

                <View style={styles.detailView}>
                    <Image
                        style={styles.userImageView}
                        source={{ uri: props?.selectedIndex === 0 ? props.item?.followers?.profile : props.item?.following?.profile }}
                    />
                    <View style={styles.subDetailView}>
                        <View style={styles.userDetailViewStyle}>
                            <Text style={styles.nameStyle}>{props?.selectedIndex === 0 ? props.item?.followers?.name : props.item?.following?.name}</Text>

                        </View>
                        {props.isFollowing && !props.isAnotherUser ?
                            <View style={{ alignItems: 'center' }}>
                                {props.isUnfollow ? null :
                                    props?.selectedIndex === 0 && props?.item?.isfollow === 0 ?

                                        <CPButton
                                            title={!isEnabledForFollow ? 'Follow' : 'Unfollow'}
                                            style={{ borderWidth: 0, marginTop: 5 }}
                                            textStyle={{ color: CPColors.primary }}
                                            onPress={() => {
                                                plan == "Free Plan" && !isEnabledForFollow && props?.followingLength >= 5 ?
                                                    showDialogue(
                                                        "You need to subscribed to premium plan for this feature",
                                                        [{ text: "" }],
                                                        "Cookpals"
                                                    ) : followChangeForFollow()
                                                // props?.followList(props?.route?.params?.idForRefresh)
                                            }}
                                        />
                                        : null

                                }

                                {props?.selectedIndex === 0 ?

                                    <CPButton
                                        title={!isEnabledRemove ? 'Remove' : 'Removed'}
                                        style={{ marginTop: props?.item?.isfollow === 0 ? 5 : 10 }}
                                        onPress={() => {
                                            // props?.followList(props?.route?.params?.idForRefresh)
                                            toggleSwitchForRemove()
                                            OnRemove(props.item)
                                        }}
                                    />
                                    :
                                    <CPButton
                                        title={!isEnabled ? 'Unfollow' : 'Follow'}
                                        style={{ marginTop: props.isUnfollow ? 10 : 0 }}
                                        onPress={() => {
                                            // props?.followList(props?.route?.params?.idForRefresh)
                                            plan == "Free Plan" && isEnabled && props?.followingLength > 5 ?
                                                showDialogue(
                                                    "You need to subscribed to premium plan for this feature",
                                                    [{ text: "" }],
                                                    "Cookpals"
                                                ) : followChange()

                                        }}
                                    />

                                }
                            </View>
                            : props.isFollow ?
                                <CPButton
                                    style={styles.btnStyle}
                                    title={'Follow'}

                                />
                                :
                                null
                        }
                    </View>

                </View>
            </Pressable>

        </>
    );
};

export default CPUserInterestComponent;

const styles = StyleSheet.create({
    pressAction: { paddingBottom: 20, backgroundColor: CPColors.white },
    postImageStyle: { flex: 1, height: 90, borderRadius: 5 },
    detailView: { flexDirection: 'row', marginLeft: 15 },
    userImageView: { width: 60, height: 60, borderRadius: 60, borderColor: CPColors.white, marginTop: -20, borderWidth: 2 },
    subDetailView: { flex: 1, flexDirection: 'row' },
    userDetailViewStyle: { flex: 1, marginVertical: 10, marginHorizontal: 10 },
    nameStyle: { fontFamily: CPFonts.bold, fontSize: 14, color: CPColors.secondary },
    descriptionStyle: { fontFamily: CPFonts.semiBold, fontSize: 12, color: CPColors.secondaryLight },
    btnStyle: { alignSelf: 'center' }
})