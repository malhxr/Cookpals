import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Platform, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';
import CPDropdown from '../Components/CPDropdown';
import CPThemeButton from '../Components/CPThemeButton';
import CPColors from '../Utils/CPColors';
import { COUNTRY_API, CUISINE_API, GET_GENDER_API } from '../Utils/CPConstant';
import CPFonts from '../Utils/CPFonts';
import { getApi } from '../Utils/ServiceManager';
import { MY_PREFERENCE_API } from '../Utils/CPConstant';
import { postApi } from '../Utils/ServiceManager';
import { EDIT_FOOD_PREFERENCES } from '../Utils/CPConstant';
import BaseContainer from './BaseContainer';

const FoodPreferences = (props) => {



    const scrollRef = useRef(null)
    const userSelector = useSelector((state) => state)
    const [countryArrays, setCountryArrays] = useState([]);
    const [cuisineArrays, setCuisineArrays] = useState([]);
    const [genderPrefrences, setGenderPrefrencesArrays] = useState([]);
    const [selectedCuisineArrays, setSelectedCuisineArrays] = useState(props?.route?.params?.cuisine ?? []);
    const [selectedGenderPrefrences, setSelectedGenderPrefrencesArrays] = useState(props?.route?.params?.gender ?? []);
    const [selectedCountryArrays, setSelectedCountryArrays] = useState(props?.route?.params?.country ?? []);
    const [shouldVisible, setShouldVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getCountryName()
        getCuisine()
        genderReceiveAction()
    }, [])



    const postprefrencelist = () => {
        const postParams = {
            type: 1,
            country_id: selectedCountryArrays.toString(),
            cuisine_id: selectedCuisineArrays.toString(),
            gender_id: selectedGenderPrefrences.toString()
        }
        setIsLoading(true)
        postApi(EDIT_FOOD_PREFERENCES, postParams, onSuccessPrefrenceListUpdate, onFailurePrefrenceListRender, userSelector.userOperation)
    }

    const onSuccessPrefrenceListUpdate = (response) => {
        navigateToBack()
        console.log("SUCCESS update=>> :::::: ", response);
        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    const onFailurePrefrenceListRender = (error) => {
        console.log("FAILURE ACTIVE :::::: ", error);
        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    const genderReceiveAction = () => {
        getApi(GET_GENDER_API, onSuccessGetGender, onFailureGetGender)
    }

    const onSuccessGetGender = (response) => {
        console.log(" :::::::: ", response);
        setGenderPrefrencesArrays(response.data)
    }

    const onFailureGetGender = (error) => {
        console.log("ERROR :::::::: ", error);
    }

    const getCountryName = () => {
        getApi(COUNTRY_API, onSuccessCountryNames, onFailureCountryNames, userSelector.userOperation)
    }

    const onSuccessCountryNames = (response) => {
        console.log("SUCCESS COUNTRY :::::: ", response);
        if (response.success) {
            setCountryArrays(response.data)
        } else {
            Snackbar.show({
                text: response.message,
                duration: Snackbar.LENGTH_LONG,
            });
        }
    }

    const onFailureCountryNames = (error) => {
        console.log("Failure COUNTRY :::::: ", error);
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    const getCuisine = () => {
        getApi(CUISINE_API, onSuccessCuisine, onFailureCuisine, userSelector.userOperation)
    }

    const onSuccessCuisine = (response) => {
        console.log("SUCCESS COUNTRY :::::: ", response);
        if (response.success) {
            setCuisineArrays(response.data)
        } else {
            Snackbar.show({
                text: response.message,
                duration: Snackbar.LENGTH_LONG,
            });
        }
    }

    const onFailureCuisine = (error) => {
        console.log("Failure COUNTRY :::::: ", error);
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    const navigateToBack = () => {
        props.navigation.goBack()
    }

    const onFoodPrefernceAction = () => {
        if (selectedCountryArrays.length !== 0 && selectedCuisineArrays.length !== 0 && selectedGenderPrefrences.length !== 0) {
            if (props.route.params?.isCurrentUser) {
                postprefrencelist()

            } else {
                props.navigation.navigate('mealPreference', {
                    country: selectedCountryArrays[0],
                    cuisine: selectedCuisineArrays.toString(),
                    gender: selectedGenderPrefrences.toString()
                })
            }
        } else {
            setShouldVisible(true)
        }

    }
    // console.log('CountryArrays in food-prefrence component:::::', selectedCountryArrays);
    // console.log('CuisineArrays in food-prefrence component:::::', selectedCuisineArrays);
    // console.log('genderArrays in food-prefrence component:::::', selectedGenderPrefrences);

    return (
        <BaseContainer
            title={props?.route?.params?.isEdit ? 'Choice Preferences' : 'Set your Preferences'}
            onBackPress={navigateToBack}
            isLoading={isLoading}
        >
            <View style={props?.route?.params?.isEdit ? styles.editContainer : styles.container}>
                <ScrollView
                    ref={scrollRef}
                    bounces={false}
                    contentContainerStyle={styles.scrollStyle}
                    showsVerticalScrollIndicator={false}
                // onContentSizeChange={(contentWidth, contentHeight) => { scrollRef.current.scrollToEnd({ animated: true }) }}
                >
                    {!props?.route?.params?.isEdit &&
                        <View style={styles.subContainer}>
                            <Text style={styles.titleStyle}>{"Get Started"}</Text>
                            <Text style={styles.subTitleStyle}>{"Our Platform Provide You The Best Match" + `\n` + " With Favourable Taste"}</Text>
                        </View>}

                    <CPDropdown
                    id={1}
                    isOpen={}
                        data={countryArrays}
                        selectedvalue={selectedCountryArrays}
                        title={"Choose Your Country"}
                        onChangeValue={(data) => {
                            setShouldVisible(false)
                            setSelectedCountryArrays(data)
                        }}
                        error={shouldVisible && selectedCountryArrays.length == 0 ? "Please select country" : null}
                    />

                    <CPDropdown
                        multiple
                        id={2}
                        isOpen={}
                        data={cuisineArrays}
                        selectedvalue={selectedCuisineArrays}
                        title={"Type of Cuisine"}
                        onChangeValue={(data) => {
                            setShouldVisible(false)
                            setSelectedCuisineArrays(data)
                        }}
                        onRemoveItem={(data) => {
                            setSelectedCuisineArrays(data)
                        }}
                        error={shouldVisible && selectedCuisineArrays.length == 0 ? "Please select cuisine" : null}
                    />

                    <CPDropdown
                        multiple
                        id={3}
                        isOpen={}
                        data={genderPrefrences}
                        selectedvalue={selectedGenderPrefrences}
                        title={"Gender Preferences"}
                        onChangeValue={(data) => {
                            setShouldVisible(false)
                            setSelectedGenderPrefrencesArrays(data)
                        }}
                        onRemoveItem={(data) => {
                            setSelectedGenderPrefrencesArrays(data)
                        }}
                        error={shouldVisible && selectedGenderPrefrences.length == 0 ? "Please select gender preferences" : null}
                    />

                </ScrollView>
            </View>
            <CPThemeButton
                style={styles.btnStyle}
                title={props?.route?.params?.isEdit ? 'Save Changes' : 'Next'}
                onPress={onFoodPrefernceAction}
                isLoading={isLoading}
            />
            {/* comment foor test */}
        </BaseContainer>

    );
};

export default FoodPreferences;

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    editContainer: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
    scrollStyle: { paddingBottom: 20 },
    subContainer: { paddingVertical: 45, alignItems: 'center' },
    titleStyle: { fontSize: 18, fontFamily: CPFonts.semiBold, marginVertical: 15, color: CPColors.secondary },
    subTitleStyle: { fontSize: 12, fontFamily: CPFonts.regular, textAlign: 'center', color: CPColors.secondary },
    btnStyle: { margin: 20 }
})