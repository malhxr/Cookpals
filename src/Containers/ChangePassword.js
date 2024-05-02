import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';
import Assets from '../Assets';
import CPTextInput from '../Components/CPTextInput';
import CPThemeButton from '../Components/CPThemeButton';
import CPColors from '../Utils/CPColors';
import { CHANGE_PASSWORD_API } from '../Utils/CPConstant';
import CPFonts from '../Utils/CPFonts';
import { postApi } from '../Utils/ServiceManager';
import ValidationHelper from '../Utils/ValidationHelper';
import BaseContainer from './BaseContainer';

const ChangePassword = (props) => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [cmpPassword, setCmpPassword] = useState("");
    const [shouldVisible, setShouldVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const userSelector = useSelector((state) => state)
    var validationHelper = new ValidationHelper();

    const onChangeCurrentPassword = (value) => {
        setShouldVisible(false)
        setCurrentPassword(value)
    }

    const onChangeNewPassword = (value) => {
        setShouldVisible(false)
        setNewPassword(value)
    }

    const onChangeConfirmPassword = (value) => {
        setShouldVisible(false)
        setCmpPassword(value)
    }

    const navigateToBack = () => {
        props.navigation.goBack()
    }

    const validationHandler = () => {
        setShouldVisible(true)

        if (validationHelper.passwordValidation(currentPassword).trim() !== "" ||
            validationHelper.passwordValidation(newPassword).trim() !== "" ||
            validationHelper.confirmPasswordValidation(newPassword, cmpPassword).trim() !== ""
        ) {
            return
        } else {
            changePasswordAction()
        }
    }

    const changePasswordAction = () => {
        const params = {
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: cmpPassword
        }
        setIsLoading(true)
        postApi(CHANGE_PASSWORD_API, params, onSuccessChangePassword, onFailureChangePassword, userSelector.userOperation)
    }

    const onSuccessChangePassword = (response) => {
        console.log("SUCCESS CHANGE PASSWORD ::::: ", response);
        setIsLoading(false)
        if (response.success) {
            props.navigation.navigate('login')
        } else {
            Snackbar.show({
                text: response.message,
                duration: Snackbar.LENGTH_LONG,
            });
        }
    }

    const onFailureChangePassword = (error) => {
        console.log("FAILURE CHANGE PASSWORD ::::: ", error);
        setIsLoading(false)
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    return (
        <BaseContainer
            onBackPress={navigateToBack}
            title={'Change Password'}
            isLoading={isLoading}
        >
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
            >
                <View style={styles.container}>

                    <Image
                        source={Assets.changePassword}
                        style={styles.imageStyle}
                    />

                    <CPTextInput
                        source={Assets.password}
                        placeholder={'Current Password'}
                        secureTextEntry
                        
                        onChangeText={onChangeCurrentPassword}
                        error={shouldVisible ? validationHelper.passwordValidation(currentPassword).trim() : ""}
                    />
                    <CPTextInput
                        source={Assets.password}
                        placeholder={'New Password'}
                        secureTextEntry
                        defaultsecureTextEntry
                        onChangeText={onChangeNewPassword}
                        error={shouldVisible ? validationHelper.passwordValidation(newPassword).trim() : ""}
                    />

                    <CPTextInput
                        source={Assets.password}
                        placeholder={'Confirm Password'}
                        secureTextEntry
                        defaultsecureTextEntry
                        onChangeText={onChangeConfirmPassword}
                        error={shouldVisible ? validationHelper.confirmPasswordValidation(newPassword, cmpPassword).trim() : ""}
                    />

                    <CPThemeButton
                        title={"Save Password"}
                        style={styles.btnStyle}
                        isLoading={isLoading}
                        onPress={validationHandler}
                    />

                </View>
            </KeyboardAwareScrollView>
        </BaseContainer>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    imageStyle: { marginVertical: 40, alignSelf: 'center' },
    btnStyle: { marginTop: 60, width: widthPercentageToDP("100") - 40, marginBottom: 20 }
})