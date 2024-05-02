import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';
import Assets from '../Assets';
import CPDropdown from '../Components/CPDropdown';
import CPTextInput from '../Components/CPTextInput';
import CPThemeButton from '../Components/CPThemeButton';
import CPColors from '../Utils/CPColors';
import { FORGOT_PASSWORD_API } from '../Utils/CPConstant';
import CPFonts from '../Utils/CPFonts';
import { postApi } from '../Utils/ServiceManager';
import ValidationHelper from '../Utils/ValidationHelper';
import BaseContainer from './BaseContainer';

const ForgotPassword = (props) => {

    const [email, setEmail] = useState("");
    const [shouldVisible, setShouldVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userSelector = useSelector((state) => state)

    var validationHelper = new ValidationHelper();

    const navigateToBack = () => {
        props.navigation.goBack()
    }

    const onChangeEmailHandler = (value) => {
        setEmail(value)
        setShouldVisible(false)
    }

    const forgotPasswordValidation = () => {
        setShouldVisible(true)
        if (validationHelper.emailValidation(email).trim() !== "") {
            return
        } else {
            forgotPasswordHandler()
        }
    }

    const forgotPasswordHandler = () => {
        let params = {
            email: email
        }
        setIsLoading(true)
        setShouldVisible(false)
        postApi(FORGOT_PASSWORD_API, params, onSuccessForgotPassword, onFailureForgotPassword, userSelector.userOperation)

    }

    const onSuccessForgotPassword = (response) => {
        console.log("Success forgotpassword ::::: ", response);
        setIsLoading(false)
        if (response.success) {
            setEmail("")
            Snackbar.show({
                text: response.message,
                duration: Snackbar.LENGTH_LONG,
            });
        } else {
            Snackbar.show({
                text: response.message,
                duration: Snackbar.LENGTH_LONG,
            });
        }
    }

    const onFailureForgotPassword = (error) => {
        console.log("Failure forgotpassword ::::: ", error);
        setIsLoading(false)
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    return (
        <BaseContainer
            title={'Forgot Password'}
            onBackPress={navigateToBack}
            isLoading={isLoading}
        >
            <ScrollView bounces={false} keyboardShouldPersistTaps='handled'>
                <View style={styles.container}>
                    <Image
                        source={Assets.forgotPassword}
                        style={styles.image}
                    />

                    <Text style={styles.title} >{"We will send link to Email"}</Text>
                    <Text style={styles.title} >{"Enter your email below to reset your password"}</Text>

                    <CPTextInput
                        source={Assets.email}
                        value={email}
                        placeholder={'cookpal@mail.com'}
                        onChangeText={onChangeEmailHandler}
                        error={shouldVisible && validationHelper.emailValidation(email).trim()}
                    />

                    <CPThemeButton
                        title={"Send To Mail"}
                        style={styles.btnStyle}
                        isLoading={isLoading}
                        onPress={forgotPasswordValidation}
                    />
                </View>
            </ScrollView>

        </BaseContainer>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
    image: { marginVertical: 20, alignSelf: 'center' },
    title: { textAlign: 'center', fontFamily: CPFonts.regular, fontSize: 14, color: CPColors.secondaryLight, marginVertical: 10 },
    subTitle: { marginHorizontal: 10, textAlign: 'center', fontFamily: CPFonts.regular, fontSize: 14, color: CPColors.secondaryLight },
    btnStyle: { marginTop: 60, width: widthPercentageToDP("100") - 40 }
})