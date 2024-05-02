import React, { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import BaseContainer from './BaseContainer';
import CPColors from '../Utils/CPColors';
import { GET_ACTIVE_STATUS_API } from '../Utils/CPConstant';
import CPFonts from '../Utils/CPFonts';
import { getApi } from '../Utils/ServiceManager';
import { postApi } from '../Utils/ServiceManager';

const ActivityStatusContainer = (props) => {

    const userSelector = useSelector((state) => state)
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    useEffect(() => {
        getActiveStatusAction()
    }, [])

    const getActiveStatusAction = () => {
        getApi(GET_ACTIVE_STATUS_API, onSuccessActivityHandler, onFailureActivityHandler, userSelector.userOperation)
    }

    const postActivityStatusAction = () => {
        const postParams = {
            status: isEnabled ? 0 : 1
        }
        postApi(GET_ACTIVE_STATUS_API, postParams, onValuechangeHandler, onFailureActivityHandler, userSelector.userOperation)
    }

    const onValuechangeHandler = (response) => {
        console.log("post api respone :::::: ", response);
        // setIsEnabled(response.data.activity_status == "1" ? true : false)

    }

    const onSuccessActivityHandler = (response) => {
        console.log("SUCCESS ACTIVE=>> :::::: ", response);
        if (response.success) {
            setIsEnabled(response.data.activity_status == "1" ? true : false)
        }
    }

    const onFailureActivityHandler = (error) => {
        console.log("FAILURE ACTIVE :::::: ", error);
    }

    const onNavigationBack = () => {
        props.navigation.goBack()
    }

    const changeHappened = () => {
        toggleSwitch()
        postActivityStatusAction()
        console.log('postapi called');
    }

    return (
        <BaseContainer
            title={"Activity Status"}
            onBackPress={onNavigationBack}
        >
            <View style={{ flexDirection: 'row', marginHorizontal: 24, marginVertical: 35 }}>
                <View style={{ flex: 1, marginRight: 24 }}>
                    <Text style={{ fontFamily: CPFonts.medium, fontSize: 14, color: CPColors.secondary }}>{"Show Activity Status"}</Text>
                    <Text style={{ fontFamily: CPFonts.regular, fontSize: 12, color: CPColors.secondaryLight, marginVertical: 20 }}>
                        {"Allow Account You Follow And Anyone You Message To See Whether You Are Active Or Not"}
                    </Text>
                </View>

                <Switch
                    trackColor={{ false: CPColors.borderColor, true: CPColors.secondary }}
                    thumbColor={isEnabled ? CPColors.white : CPColors.white}
                    onValueChange={changeHappened}
                    value={isEnabled}

                />
            </View>
        </BaseContainer>
    );
};

export default ActivityStatusContainer;