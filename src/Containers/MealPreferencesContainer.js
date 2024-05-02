import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';
import CPDropdown from '../Components/CPDropdown';
import CPThemeButton from '../Components/CPThemeButton';
import { MEAL_API } from '../Utils/CPConstant';
import { getApi } from '../Utils/ServiceManager';
import { postApi } from '../Utils/ServiceManager';
import { EDIT_FOOD_PREFERENCES } from '../Utils/CPConstant';
import BaseContainer from './BaseContainer';
import CPFonts from '../Utils/CPFonts';
import CPColors from '../Utils/CPColors';

const MealPreferencesContainer = (props) => {

    const [mealArrays, setMealArray] = useState([]);
    const userSelector = useSelector((state) => state)
    const [selectedMealArrays, setSelectedMealArrays] = useState(props?.route?.params?.meals ?? []);
    const [shouldVisible, setShouldVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setOpen] = useState("");

    useEffect(() => {
        mealAPIAction()
    }, [])



    const postprefrenceMeallist = () => {
        const postParams = {
            type: 2,
            meal_id: selectedMealArrays.toString()

        }
        setIsLoading(true)
        postApi(EDIT_FOOD_PREFERENCES, postParams, onSuccessPrefrenceMealListUpdate, onFailurePrefrenceMealListRender, userSelector.userOperation)
    }

    const onSuccessPrefrenceMealListUpdate = (response) => {
        navigateToBack()
        console.log("SUCCESS update=>> :::::: ", response);
        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    const onFailurePrefrenceMealListRender = (error) => {
        console.log("FAILURE ACTIVE :::::: ", error);
        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }



    const mealAPIAction = () => {
        getApi(MEAL_API, onSuccessMealPlan, onFailureMealPlan, userSelector.userOperation)
    }

    const onSuccessMealPlan = (response) => {
        if (response.success) {
            setMealArray(response.data)
        } else {
            Snackbar.show({
                text: response.message,
                duration: Snackbar.LENGTH_LONG,
            });
        }
    }

    const onFailureMealPlan = (error) => {
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_LONG,
        });
    }

    const navigateToBack = () => {
        props.navigation.goBack()
    }

    const onChangeMealPreferences = () => {
        if (selectedMealArrays.length !== 0) {
            if (props.route.params?.isCurrentUser) {
                postprefrenceMeallist()


            } else {
                props.navigation.navigate('mostlikedislike', {
                    country: props.route.params.country,
                    cuisine: props.route.params.cuisine,
                    meals: selectedMealArrays.toString(),
                    gender: props.route.params.gender

                })

            }
        } else {
            setShouldVisible(true)
        }
    }

    // console.log('meal array in mealpreference component::::::::::::::::', selectedMealArrays.toString());

    return (
        <BaseContainer
            title={props?.route?.params?.isEdit ? 'Choice Preferences' : 'Set your Preferences'}
            onBackPress={navigateToBack}
            isLoading={isLoading}
        >

            <View style={styles.container}>
                <View style={{ flex: 1 }}>

                    {!props?.route?.params?.isEdit &&
                        <View style={styles.subContainer}>
                            <Text style={styles.titleStyle}>{'Get Started'}</Text>
                            <Text style={styles.subTitleStyle}>{'Our Platform Provide You The Best Match' + `\n` + ' With Favourable Taste'}</Text>
                        </View>}

                    <CPDropdown
                        multiple
                        data={mealArrays}
                        selectedvalue={selectedMealArrays}
                        title={"Choose Your Meal"}
                        onChangeValue={(data) => {
                            setShouldVisible(false)
                            setSelectedMealArrays(data)
                        }}
                        error={shouldVisible && selectedMealArrays.length == 0 ? "Please select meal" : null}
                    />
                </View>
                <CPThemeButton
                    title={props?.route?.params?.isEdit ? 'Save Changes' : 'Next'}
                    onPress={onChangeMealPreferences}
                    isLoading={isLoading}
                />
            </View>
        </BaseContainer>
    );
};

export default MealPreferencesContainer;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    subContainer: { paddingVertical: 45, alignItems: 'center' },
    titleStyle: { fontSize: 18, fontFamily: CPFonts.semiBold, marginVertical: 15, color: CPColors.secondary },
    subTitleStyle: { fontSize: 12, fontFamily: CPFonts.regular, textAlign: 'center', color: CPColors.secondary },
})