import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View, FlatList, Dimensions, StyleSheet } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import Assets from '../Assets';
import CPBackButton from '../Components/CPBackButton';
import CPImageComponent from '../Components/CPImageComponent';
import CPPopupView from '../Components/CPPopupView';
import CPProfileComponent from '../Components/CPProfileComponent';
import CPThemeButton from '../Components/CPThemeButton';
import CPUpgradePlan from '../Components/CPUpgradePlan';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';
import { getApi } from '../Utils/ServiceManager';
import { useSelector } from 'react-redux';
import { MY_ACCOUNT_API } from '../Utils/CPConstant';
import CPVideoPlayerComponent from '../Components/CPVideoPlayerComponent';
import VideoPlayers from 'react-native-video-players';



const AccountContainer = (props) => {

    // const {
    //     interpolate,
    //     Extrapolate
    // } = Animated;

    // var screenStyle = null;

    const userSelector = useSelector((state) => state)
    const dimension = Dimensions.get('window').width
    const [selectedIndex, setIndex] = useState(0)
    const [key, setKey] = useState(0)
    const [userDetail, setUserDetail] = useState()
    const [userPost, setUserPost] = useState([])
    const [isUpgradePlanModal, setUpgradePlanModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const modalTitle = {
        title: "Oops!",
        description: "You must have to upgrade your plan to provide more videos to your followers",
        actionStr: "Upgrade Your Plan",
        image: Assets.upgradeplan
    }

    const galleryMenuArray = [
        {
            image_select: Assets.menuselect,
            image_deselect: Assets.menudeselect,
        },
        {
            image_select: Assets.laughimage,
            image_deselect: Assets.laughimage,
        },
        {
            image_select: Assets.Pathselect,
            image_deselect: Assets.Pathdeselect,
        }
    ]

    const galleryArray = [
        {
            image: "https://img.freepik.com/free-photo/delicious-vietnamese-food-including-pho-ga-noodles-spring-rolls-white-table_181624-34062.jpg?size=626&ext=jpg",
        },
        {
            image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8&w=1000&q=80",
        },
        {
            image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80",
        },
        {
            image: "https://images.news18.com/ibnlive/uploads/2021/06/1623924457_food-chart.jpg?im=FitAndFill,width=1200,height=900",
        },
        {
            image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg",
        },
    ]

    useEffect(() => {
        if (!props.route.params?.isAnotherUser) {
            userProfileDetail()
        }
    }, [])

    const userProfileDetail = () => {
        setIsLoading(true)
        getApi(MY_ACCOUNT_API, onSuccessMyAccount, onFailureMyAccount, userSelector.userOperation)
    }

    const onSuccessMyAccount = (response) => {
        console.log(" SUCCESS MY ACCOUNT ::::::", response);
        if (response.success) {
            setUserDetail(response.data)
            if (response?.data?.post) {
                setUserPost(response?.data?.post)
            }
        }
        setIsLoading(false)
    }

    const onFailureMyAccount = (error) => {
        console.log(" FAILURE MY ACCOUNT ::::::", error);
        setIsLoading(false)
    }

    const navigateToBack = () => {
        props.navigation.goBack()
    }

    const onClickOpenDrawer = () => {
        if (!props.route.params?.isAnotherUser) {
            props.navigation.toggleDrawer()
        }
    }

    const upgradeModal = () => {
        return (
            <CPPopupView
                isVisible={isUpgradePlanModal}
            >
                <CPUpgradePlan
                    item={modalTitle}
                    onPress={() => { setUpgradePlanModal(false) }}
                />
            </CPPopupView>
        )
    }

    const accountPostGridView = ({ item, index }) => {
        return (
            <Pressable key={index} style={{ width: (dimension / 2) - 10, height: (dimension / 2) }}
                onPress={() => {
                    props.navigation.navigate('recipeDetail',
                        {
                            acc_user_Profile: !props.route.params?.isAnotherUser,
                            recipeId: item.id
                        }
                    )
                }}
            >
                {selectedIndex == 1 ?
                    <VideoPlayers
                        source={{
                            uri: item?.video,
                        }}
                        paused={true}
                        resizeMode={'contain'}
                        controlTimeout={2000}
                        hideControlsOnStart
                        backToList={() => { }}
                        style={[styles.imageStyle, { height: "94%" }]}
                    />
                    :
                    <CPImageComponent
                        style={[styles.imageStyle, { height: "94%" }]}
                        source={(item.image || item?.post?.image)}
                    />
                }
            </Pressable>
        )
    }
    console.log("sdfsdf", userDetail);
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: CPColors.white }}
            forceInset={{ bottom: 'never', top: 'never' }}
        >
            <View style={{ flex: 1, paddingBottom: props.route?.params?.isAnotherUser ? 0 : 45 }}>
                {props.route?.params?.isAnotherUser ?
                    <CPBackButton
                        style={styles.backActionStyle}
                        onBackPress={navigateToBack}
                    /> : null}

                {upgradeModal()}
                <CPProfileComponent
                    data={userDetail}
                    onFollowersClick={() => {
                        props.navigation.navigate('followandfollowing')
                    }}
                    isFavourite={props.route.params?.isAnotherUser}
                    onPress={onClickOpenDrawer}
                />
                {props.route?.params?.isAnotherUser ?
                    <View style={styles.cookUpView}>
                        <CPThemeButton
                            title={"CookUp"}
                            style={styles.cookupPress}
                            labelStyle={styles.cookupLabel}
                            onPress={() => props.navigation.navigate('match')}
                        />
                        <CPThemeButton
                            style={styles.followPress}
                            labelStyle={styles.followPressLabel}
                            colorArray={[CPColors.white, CPColors.white]}
                            title={"Follow"}
                            onPress={() => { 
                                setUpgradePlanModal(true)
                            }}
                        />
                        <Pressable style={styles.chatPress}
                            onPress={() => { }}
                        >
                            <Image
                                source={Assets.Chatimage}
                            />
                        </Pressable>

                    </View>
                    :
                    <View style={styles.sepratorStyle} />
                }
                <View style={[styles.galleryMainView, { paddingBottom: props.route?.params?.isAnotherUser ? 15 : 0 }]}>
                    <View style={styles.galleryView}>
                        {galleryMenuArray.map((item, index) => {
                            return (
                                <>
                                    {props.route?.params?.isAnotherUser && galleryMenuArray.length - 1 == index ? null :
                                        <Pressable
                                            key={index}
                                            style={[styles.segmentView, { borderBottomWidth: selectedIndex == index ? 1 : 0, borderBottomColor: selectedIndex == index ? CPColors.secondaryLight : CPColors.transparent }]}
                                            onPress={() => setIndex(index)}
                                        >
                                            <Image
                                                resizeMode='center'
                                                source={index == selectedIndex ? item.image_select : item.image_deselect}
                                            />
                                        </Pressable>
                                    }
                                    {galleryMenuArray.length - 1 == index || (props.route.params?.isAnotherUser && galleryMenuArray.length - 2 == index) ? null : <View style={{ width: 1, height: 15, backgroundColor: CPColors.borderColor }} />}
                                </>
                            )
                        })}
                    </View>
                    {/* {
                        selectedIndex == 0 ? */}
                    <FlatList
                        data={selectedIndex == 0 ? userDetail?.post : selectedIndex == 1 ? userDetail?.funny_video : userDetail.saved_post}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index}
                        renderItem={accountPostGridView}
                        ListEmptyComponent={() => {
                            return (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>{
                                        selectedIndex == 0 ? "No post here" : selectedIndex == 1 ? "No funny video" : "No save videos"}</Text>
                                </View>
                            )
                        }}
                    />
                    {/* : null
                    } */}

                </View>
            </View>
        </SafeAreaView>
    );
};

export default AccountContainer;

const styles = StyleSheet.create({
    backActionStyle: { position: 'absolute', left: 5, top: 30, zIndex: 1000 },
    cookUpView: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: CPColors.white, paddingTop: 10 },
    cookupPress: {
        width: "30%",
        height: 45
    },
    cookupLabel: { marginHorizontal: 15, fontFamily: CPFonts.semiBold },
    followPress: {
        borderWidth: 0.5,
        borderColor: CPColors.secondaryLight,
        marginLeft: 8,
        height: 45,
        width: "30%"
    }, followPressLabel: { color: CPColors.secondary, marginHorizontal: 15, fontFamily: CPFonts.semiBold },
    chatPress: { backgroundColor: CPColors.white, padding: 10, borderRadius: 10, borderWidth: 0.5, borderColor: CPColors.secondaryLight, marginLeft: 8 },
    sepratorStyle: { height: 10, backgroundColor: CPColors.textInputColor },
    galleryMainView: { flex: 1, paddingHorizontal: 10, backgroundColor: CPColors.white },
    galleryView: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 20, marginTop: 25 },
    segmentView: { flex: 1, alignItems: 'center', marginHorizontal: 10, paddingTop: 15, paddingBottom: 20 },
    imageStyle: { margin: 8, borderRadius: 10 }
})