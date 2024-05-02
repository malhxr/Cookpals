import React, { useState } from 'react';
import { Modal, StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, SafeAreaView, Pressable } from 'react-native';
import { BlurView, VibrancyView } from "@react-native-community/blur";
import CPColors from '../Utils/CPColors';

const CPPopupView = (props) => {

    const onRequestClose = () => {
        if (props.onRequestClose !== undefined) {
            props.onRequestClose()
        }
    }

    return (
        // <SafeAreaView>
        <Modal visible={props.isVisible} transparent={true}
        style={props.mainModalStyle}
            animationType={props.animationType ?? 'none'}
            onRequestClose={onRequestClose}>
            <View style={[{ flex: 1 }, props.modalStyle]}>
                {props.isBlurViewDisable ?
                    <View style={[{ flex: 1, backgroundColor: CPColors.transparent }, props.style]}>
                        <Pressable style={style.blurStyle} onPress={onRequestClose}>

                        </Pressable>
                        {props.children}
                    </View>
                    :
                    <View style={[style.container, props.style]}>
                        <BlurView
                            style={style.blurStyle}
                            blurType={props.blurType ?? "light"}
                            blurAmount={10}
                            // reducedTransparencyFallbackColor="black"
                        >
                            <TouchableOpacity style={{ flex: 1, backgroundColor: CPColors.transparent }} onPress={onRequestClose} />
                        </BlurView>
                        {props.children}
                    </View>
                }
            </View>
        </Modal>
    );
};

export default CPPopupView;

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    blurStyle: {
        // alignItems:'center',
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
})