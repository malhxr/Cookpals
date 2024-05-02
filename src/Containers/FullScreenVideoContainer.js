import React, { useCallback, useState, useEffect } from "react";
import {
    Image,
    ImageBackground,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import CPColors from "../Utils/CPColors";
import LinearGradient from "react-native-linear-gradient";
import BaseContainer from "./BaseContainer";
import {
    heightPercentageToDP,
    widthPercentageToDP,
} from "react-native-responsive-screen";
import VideoPlayers from "react-native-video-controls";

const FullScreenVideoContainer = (props) => {

    const onBackPress = () => {
        props.navigation.goBack();
    };

    return (
        <>
            <BaseContainer
                isTransparentEnable
                isBottomMarginEnable
                safeAreaBottomDisable
                isBottomAreaPadding
                backImageStyle={{ tintColor: CPColors.white }}
                onBackPress={onBackPress}>
                <LinearGradient
                    colors={[
                        CPColors.transparent,
                        CPColors.transparent,
                        CPColors.transparent,
                        "rgba(0,0,0,0.5)",
                        "rgba(0,0,0,0.9)",
                        "rgba(0,0,0,0.9)",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientView}
                >
                    <View style={{ flex: 1 }}>
                        <VideoPlayers
                            theme={CPColors.theme}
                            source={{
                                uri: props?.route?.params?.video,
                            }}
                            paused={false}
                            resizeMode={"contain"}
                            controlTimeout={2000}
                            hideControlsOnStart
                            backToList={() => { }}
                            style={{
                                height: heightPercentageToDP("60%"),
                                width: widthPercentageToDP("100%"),
                            }}
                        />
                    </View>
                </LinearGradient>
            </BaseContainer>
        </>
    )
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: "flex-end",
    },
    gradientView: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-end",
    },
});
export default FullScreenVideoContainer;
