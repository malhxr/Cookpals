import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import Assets from '../Assets';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

const CPDatePickerComponent = (props) => {

    const [isToolkitVisible, setToolkitVisiblity] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dob, setDOB] = useState();

    console.log("DATE :::::: ",);

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        props.onChangeData(moment(date).format('YYYY/MM/DD'))
        setDatePickerVisibility(!isDatePickerVisible)
        setDOB(moment(date).format('YYYY/MM/DD'))
        console.log("A date has been picked: ", date);
    };

    return (
        <>
            <Pressable
                style={styles.container}
                onPress={() => { setDatePickerVisibility(true) }}
            >
                {props.source ? <Image source={props.source} style={styles.imageStyle} resizeMode='contain' /> : null}
                <Text style={[styles.titleStyle, props.textStyle]}>{dob || props.title}</Text>
                {isToolkitVisible ?
                    <View style={styles.toolkitView}>
                        <Text style={styles.infoText}>{'The user’s age has to be 15+'}</Text>
                    </View>
                    : null}
                <Pressable
                    onPress={() => {
                        if (!isToolkitVisible && props.toolkitEnable) {
                            setToolkitVisiblity(true)

                            setTimeout(() => {
                                setToolkitVisiblity(false)
                            }, 5000)

                        }
                    }}
                >
                    <Icon
                        style={{ marginHorizontal: 5 }}
                        type={props.type}
                        name={props.name}
                        color={CPColors.secondaryLight}
                        size={15}
                    />
                </Pressable>
            </Pressable>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                date={dob ? new Date(dob) : new Date()}
                maximumDate={new Date(moment().subtract(180, 'months'))}
                mode="date"
                onChange={handleConfirm}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            {props.error ? <Text style={{ color: CPColors.red, fontSize: 12, fontFamily: CPFonts.regular, marginTop: 5, marginLeft: 5 }}>{props.error}</Text> : null}
        </>
    );
};

export default CPDatePickerComponent;

const styles = StyleSheet.create({
    container: { flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 15, alignItems: 'center', borderColor: CPColors.secondary, marginTop: 25, borderRadius: 10, backgroundColor: CPColors.textInputColor },
    imageStyle: { marginHorizontal: 10, width: 18, height: 18 },
    titleStyle: { flex: 1, marginHorizontal: 10, marginVertical: 5, color: CPColors.secondary, fontFamily: CPFonts.medium, fontSize: 14 },
    toolkitView: {
        borderRadius: 5,
        padding: 5,
        position: 'absolute',
        right: 5,
        top: -20,
        backgroundColor: CPColors.white,
        shadowColor: CPColors.black,
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: {
            height: 0, width: 0
        },
        elevation: 3
    },
    infoText: { flex: 1, margin: 5, fontSize: 12, fontFamily: CPFonts.medium, color: CPColors.secondary }
})