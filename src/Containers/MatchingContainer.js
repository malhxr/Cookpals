import React, { useEffect, useRef, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import Assets from '../Assets';
import CPBackButton from '../Components/CPBackButton';
import CPThemeButton from '../Components/CPThemeButton';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';
import BaseContainer from './BaseContainer';
import LottieView from 'lottie-react-native';
import { useSelector } from "react-redux";
import { postApi } from "../Utils/ServiceManager";
import {
    USER_MATCH,
} from "../Utils/CPConstant";

// const IMAGE_URI = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
const MatchingContainer = (props) => {
    const [userProfile, setUserProfile] = useState();
    const [currentUserProfile, setCurrentUserProfile] = useState();
    const userSelector = useSelector((state) => state);
    const lottieRef = useRef(null)

    useEffect(() => {
        lottieRef.current.play();
        UserMatch();
    }, [])

    const onNavigationBack = () => {
        props.navigation.goBack();
    }

    const UserMatch = () => {
        const params = {
            cookup_id: props?.route?.params?.cookup_id
        }
        postApi(USER_MATCH, params, onSuccess, onFailure, userSelector.userOperation);
    }


    const onSuccess = (response) => {
        console.log("matchimage",response)
        if (response.success) {
            setCurrentUserProfile(response?.data?.cookup_profile?.profile),
            setUserProfile(response?.data?.user_profile?.profile)
        }
    }

    const onFailure = (error) => {
        console.log("FAILURE ACTIVE :::::: ", error);
    }

    return (
        <BaseContainer
            isTransparentEnable
            safeAreaBottomDisable
            backImageStyle={{ tintColor: CPColors.white }}
            onBackPress={onNavigationBack}
        >
            <View style={styles.container}>
                <StatusBar
                    backgroundColor={CPColors.secondary}
                    barStyle="light-content"
                />

                <View style={{}}>
                    <Text style={styles.titleTxt}> It's a Match!  <Image source={Assets.emojiparty} /></Text>
                    <Text style={styles.description}>You and {props?.route?.params?.name} Have {`\n`} liked each other</Text>
                    <View style={styles.subContainer}>
                        <View style={{ borderWidth: 1, width: 40, height: 40, borderRadius: 40, backgroundColor: CPColors.white, position: 'absolute', zIndex: 99999 }} />
                        <LottieView
                            ref={lottieRef}
                            style={{ position: 'absolute', zIndex: 99999, width: 80, height: 80 }}
                            source={require('../Assets/Hearts.json')}
                        />
                        <View style={styles.firstmatchView}>
                            <Image
                                style={styles.matchImage}
                                source={{ uri: userProfile }}
                            />
                        </View>
                        <View style={styles.secondmatchView}>
                            <Image
                                style={styles.matchImage}
                                source={{ uri: currentUserProfile }}
                            />
                        </View>

                    </View>
                </View>
                {/* <CPThemeButton
                style={styles.btnStyle}
                title={'Say Hi!'}
                onPress={()=>{
                    props.navigation.goBack()
                }}
            /> */}
            </View>
        </BaseContainer>
    );
};

export default MatchingContainer;

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: CPColors.secondary },
    titleTxt: { color: CPColors.white, fontFamily: CPFonts.semiBold, fontSize: 18, textAlign: 'center' },
    description: { color: CPColors.white, fontFamily: CPFonts.regular, fontSize: 12, textAlign: 'center' },
    subContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginVertical: 50 },
    heartImageStyle: { zIndex: 999, width: 20, height: 20, borderWidth: 40, backgroundColor: CPColors.white },
    firstmatchView: { flexDirection: 'row', width: widthPercentageToDP(56) },
    secondmatchView: { flexDirection: 'row', alignSelf: 'flex-end' },
    matchImage: { width: widthPercentageToDP("29"), height: widthPercentageToDP("29"), borderRadius: 15, borderWidth: 1, borderColor: CPColors.white },
    btnStyle: { width: widthPercentageToDP(85) }
})