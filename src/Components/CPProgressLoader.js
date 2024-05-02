import React from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import CPColors from '../Utils/CPColors';

const CPProgressLoader = (props) => {
    return (
        <Modal visible={true}
        transparent
        >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position:'absolute', bottom:0, top:0, right:0, left:0 }}>
                <ActivityIndicator
                    color={props.color ?? CPColors.primary}
                />
            </View>
        </Modal>
    );
};

export default CPProgressLoader;