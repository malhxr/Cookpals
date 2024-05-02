import React from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from 'react-native-elements';
import Assets from '../Assets';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';

const CPSearchComponent = (props) => {
    return (
        <View style={[style.container, props.style]}>
            <Image
                source={Assets.searchdeselect}
                style={style.image}
            />
            <TextInput
                value={props.value}
                style={style.inputStyle}
                placeholder={props.placeholder}
                onChangeText={props.onChangeText}
            />
        </View>
    );
};

export default CPSearchComponent;

const style = StyleSheet.create({
    container: { flexDirection: 'row', backgroundColor: CPColors.dropdownColor, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    image: { width: 15, height: 15, marginRight: 10 },
    inputStyle: { flex: 1, fontSize: 12, fontFamily: CPFonts.regular, color: CPColors.secondary, height: 30, paddingVertical: 0 }
})