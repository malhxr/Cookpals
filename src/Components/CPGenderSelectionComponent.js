import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';

const CPGenderSelectionComponent = (props) => {

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        console.log("DDDDD :::::: ", props.data, props.defaultValue, props?.data?.filter(item => item?.id == props?.defaultValue)[0]?.name);
        if (props.data) {
            setTitle(props?.data?.filter(item => item?.id == props?.defaultValue)[0]?.name)
        }
    }, [props.data])

    const genderArray = [
        {
            title: "Male"
        },
        {
            title: "Female"
        },
        {
            title: "Other"
        },
    ]

    const onselectGenderOption = (value) => {
        setIsOpen(false)
        setTitle(value.name)
        props.onSelectValue(value.id)
    }

    const onChangeOpen = () => {
        if (!props.isPressDisable) {
            setIsOpen(!isOpen)
        }
    }

    return (
        <>
            <Pressable
                style={styles.container}
                onPress={onChangeOpen}
            >
                {props.source ? <Image source={props.source} style={styles.imageStyle} resizeMode='contain' /> : null}
                <Text style={[styles.titleStyle, props.textStyle]}>{title || props.placeholder}</Text>

                <Icon
                    style={{ marginHorizontal: 5 }}
                    type={props.type ?? 'octicon'}
                    name={props.name ?? 'triangle-down'}
                    color={CPColors.secondaryLight}
                    size={15}
                />
            </Pressable>
            {props.error ? <Text style={{ color: CPColors.red, fontSize: 12, fontFamily: CPFonts.regular, marginTop: 5, marginLeft: 5 }}>{props.error}</Text> : null}
            {isOpen ?
                <View style={styles.dropDownList}>
                    {props.data.map((item) => {
                        return (
                            <Pressable style={styles.multipleTouchStyle} onPress={() => { onselectGenderOption(item) }}>
                                <Text style={styles.multipleItemText} >{item.name}</Text>
                            </Pressable>
                        )
                    })}
                </View>
                : null}
        </>
    );
};

export default CPGenderSelectionComponent;

const styles = StyleSheet.create({
    container: { flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 15, alignItems: 'center', borderColor: CPColors.secondary, marginTop: 25, borderRadius: 10, backgroundColor: CPColors.textInputColor },
    multipleTouchStyle: { flexDirection: 'row', padding: 5, margin: 5, borderRadius: 10, backgroundColor: CPColors.dropdownColor, alignItems: 'center' },
    multipleItemText: { fontFamily: CPFonts.regular, fontSize: 11, color: CPColors.secondary },
    imageStyle: { marginHorizontal: 10, width: 18, height: 18 },
    titleStyle: { marginHorizontal: 10, marginVertical: 5, color: CPColors.secondaryLight, fontFamily: CPFonts.medium, fontSize: 14 },
    dropDownList: {
        flex: 1, paddingBottom: 10, maxHeight: 200, minHeight: 30, padding: 5, backgroundColor: CPColors.dropdownColor, overflow: 'hidden',
        borderRadius: 10,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 2
    }
})