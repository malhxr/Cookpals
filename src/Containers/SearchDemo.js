import React, { useState } from 'react';
import { FlatList, View, TextInput, TouchableOpacity, Text, StyleSheet, Pressable } from 'react-native';

export const myStyles = StyleSheet.create({
    container: {
        minWidth: '100%',
        borderRadius: 3,
        padding: 10,
        backgroundColor: 'white'
    },
    search: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        height: 50,
        marginBottom: 50
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'blue'
    },
    flatlistContainer: {
        position: 'absolute',
        // top:0, left:0, bottom:0, right:0,
        // zIndex: 1000,
        height: 180,
        width: 300
    },
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 5,
        paddingBottom: 5
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'silver'
    },
    buttonText: {
        alignSelf: 'flex-start',
        fontSize: 13,
        margin: 0,
        padding: 5
    }
});

const SearchDemo = () => {
    const [inputValue, setInputValue] = useState('');

    const options = [
        { label: 'one', value: 'one' },
        { label: 'two', value: 'two' },
        { label: 'three', value: 'three' },
        { label: 'four', value: 'four' },
        { label: 'five', value: 'five' },
        { label: 'six', value: 'six' },
        { label: 'seven', value: 'seven' },
        { label: 'eight', value: 'eight' },
        { label: 'nine', value: 'nine' },
        { label: 'ten', value: 'ten' },
        { label: 'eleven', value: 'two' }
    ];

    return (
        <View style={myStyles.container}>
            <View style={[myStyles.inputRow, { zIndex: 9999999 }]}>
                <View style={[myStyles.search]}>
                    <TextInput
                        value={inputValue}
                        onChangeText={(value) => setInputValue(value)}
                        placeholder="Search..."
                        style={myStyles.textInput}
                    />
                    <View style={{position:'relative', zIndex:999}}>
                    {/* <View style={myStyles.flatlistContainer}> */}
                    <FlatList
                        style={myStyles.flatlistContainer}
                        // style={{ flex: 1, backgroundColor:'red' }}
                        data={options}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => console.log('pressed')}>
                                <View style={myStyles.itemRow}>
                                    <Text style={myStyles.buttonText}>
                                        {item.label}
                                    </Text>
                                </View>
                            </Pressable>
                        )}
                        keyExtractor={item => item.label}
                    />
                    {/* </View> */}
                    </View>
                </View>
            </View>

            <View style={[myStyles.inputRow, { borderWidth: 1, borderColor: 'red', height: 50 }]} />
            <View style={[myStyles.inputRow, { borderWidth: 1, borderColor: 'red', height: 50 }]} />
            <View style={[myStyles.inputRow, { borderWidth: 1, borderColor: 'red', height: 50 }]} />
            <View style={[myStyles.inputRow, { borderWidth: 1, borderColor: 'red', height: 50 }]} />
            <View style={[myStyles.inputRow, { borderWidth: 1, borderColor: 'red', height: 50 }]} />
            <View style={[myStyles.inputRow, { borderWidth: 1, borderColor: 'red', height: 50 }]} />
        </View>
    );
}


export default SearchDemo;