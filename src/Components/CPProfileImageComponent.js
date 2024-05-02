import React from 'react';
import { Image, Pressable, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Assets from '../Assets';
import CPColors from '../Utils/CPColors';

const CPProfileImageComponent = (props) => {

    const width = props.size
    return (
        <>
            {props.source ?
                <View style={props.containerStyle}>
                    <FastImage
                        style={[{ width: width ?? 80, height: width ?? 80, borderRadius: width ?? 80 }, props.style]}
                        source={{
                            uri: props.source,
                            priority: FastImage.priority.normal
                        }}

                    />
                    <View style={{ position: 'absolute', borderRadius: 80, top: 2, bottom: 2, right: 2, left: 2, borderWidth: 1.5, borderColor: CPColors.white }} />
                </View>
                :
                <Image
                    style={props.style}
                    source={props.placeholder ?? Assets.logo}
                />
            }
        </>
    );
};

export default CPProfileImageComponent;

