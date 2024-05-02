import React from 'react';
import { Image, Pressable } from 'react-native';
import Assets from '../Assets';
import CPColors from '../Utils/CPColors';

const CPBackButton = (props) => {
    return (
        <Pressable
            style={props.style}
            
            onPress={props.onBackPress}
        >
            <Image style={[props.left ? { marginHorizontal: 24, margin: 15, marginLeft: 13 } : { marginHorizontal: 24, margin: 15, }, props.imageStyle]} source={Assets.backArrow} />
        </Pressable>
    );
};

export default CPBackButton;