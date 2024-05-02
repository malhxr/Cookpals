import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';

const CPSegmentComponent = (props) => {
    const [selectedIndex, setIndex] = useState(0)

    const onChangeHandler = (value) => {
        setIndex(value)
    }
    return (
        <View style={[{ flexDirection: 'row', height: 30 }, props.style]}>
            {props.segmentArray.map((item, index) => {
                return (
                    <Pressable
                        key={index}
                        style={{
                            flex: 1, borderBottomWidth: 1, borderBottomColor: props.selectedIndex == index ? CPColors.primary : CPColors.transparent, alignItems: 'center', justifyContent: 'center'
                        }}
                        onPress={() => props.onChangeHandler(index)}
                    >
                        <Text style={[{ color: props.selectedIndex == index ? CPColors.secondary : CPColors.secondaryLight, fontFamily: props.selectedIndex == index ? CPFonts.bold : CPFonts.regular, fontSize: 14 }, props.textStyle]}>{item}</Text>
                    </Pressable>
                )
            })}
        </View>
    );
};

export default CPSegmentComponent;