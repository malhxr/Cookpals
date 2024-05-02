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
import { CONTACT_US_API } from '../Utils/CPConstant';
import CPFonts from '../Utils/CPFonts';
import { postApi } from '../Utils/ServiceManager';
import ValidationHelper from '../Utils/ValidationHelper';
import BaseContainer from './BaseContainer';

const ContactUsContainer = (props) => {

    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [description, setDescription] = useState("");
    const [shouldVisible, setShouldVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const userSelector = useSelector((state) => state)
    var validationHelper = new ValidationHelper();

    const navigateToBack = () => {
        props.navigation.goBack()
    }

    const onChangeEmail = (data) => {
        setShouldVisible(false)
        setEmail(data)
    }

    const onChangeNumber = (data) => {
        setShouldVisible(false)
        setNumber(data)
    }

    const onChangeDescription = (data) => {
        setShouldVisible(false)
        setDescription(data)
    }

    const contactUsValidationHandler = () => {
        setShouldVisible(true)
        if (validationHelper.emailValidation(email).trim() !== "" ||
            validationHelper.mobileValidation(number).trim() !== "" ||
            validationHelper.isEmptyValidation(description, "").trim() !== ""
        ) {
            return
        } else {
            contactUsAPIHandler()
        }
    }

    const contactUsAPIHandler = () => {
        const param = {
            email: email,
            phone: number,
            message: description
        }
        setIsLoading(true)
        setShouldVisible(false)
        postApi(CONTACT_US_API, param, onSuccessContactUs, onFailureContactUs, userSelector.userOperation)
    }

    const onSuccessContactUs = (response) => {
        console.log("SUCCESS CONTACT ::::: ", response);
        setIsLoading(false)
        if (response.success) {
            setEmail("")
            setNumber("")
            setDescription("")
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

    const onFailureContactUs = (error) => {
        console.log("FAILURE CONTACT ::::: ", error);
        setIsLoading(false)
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    return (
        <BaseContainer
            onBackPress={navigateToBack}
            isLoading={isLoading}
        >
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
            >
                <View style={styles.container}>

                    <Text style={styles.titleTxt}>{"Contact Us"}</Text>
                    <Text
                        style={styles.subDescription}>Lorem Ipsum Is Simply Dummy Text Of The
                        Ipsum Is Simply Dummy Text Of The</Text>

                    <Image style={styles.imageStyle} source={Assets.contactUs} />

                    <CPTextInput value={email} source={Assets.email} placeholder={'cookpal@mail.com'} onChangeText={onChangeEmail}
                        error={shouldVisible && validationHelper.emailValidation(email).trim()}
                    />
                    <CPTextInput value={number} source={Assets.call} placeholder={'Phone Number'} onChangeText={onChangeNumber}
                        error={shouldVisible && validationHelper.mobileValidation(number).trim()}
                    />
                    <CPTextInput value={description} source={Assets.Chatimage} placeholder={'cookpal@mail.com'} multiline={true} containerStyle={{ height: 140 }}
                        onChangeText={onChangeDescription}
                        error={shouldVisible && validationHelper.isEmptyValidation(description, "Please enter description").trim()}
                    />

                    <CPThemeButton
                        title={"Contact"}
                        style={styles.btnStyle}
                        isLoading={isLoading}
                        onPress={contactUsValidationHandler}
                    />
                </View>
            </KeyboardAwareScrollView>
        </BaseContainer>
    );
};

export default ContactUsContainer;

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
    titleTxt: { fontFamily: CPFonts.semiBold, fontSize: 18, color: CPColors.secondary, textAlign: 'center' },
    subDescription: { fontFamily: CPFonts.regular, marginTop: 20, marginHorizontal: 40, fontSize: 12, textAlign: 'center', color: CPColors.secondary },
    imageStyle: { marginBottom: 10 },
    btnStyle: { marginTop: 40, width: widthPercentageToDP("100") - 40 }
})