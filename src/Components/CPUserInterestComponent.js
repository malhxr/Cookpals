import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';
import CPButton from './CPButton';

const CPUserInterestComponent = (props) => {
console.log(props.item,'props.item')
    return (
        <>
            {/* {props?.sortFilter(props.selectedIndex === 0 ? props.item.name : props.selectedIndex === 1 ? props.Cuisine : props.Meal) &&  */}
            <Pressable style={styles.pressAction}
                onPress={props.onPress}
            >
                <Image
                    style={styles.postImageStyle}
                    source={{ uri: props.item.cover_image ?? props.item.image }}
                />

                <View style={styles.detailView}>
                    <Image
                        style={styles.userImageView}
                        source={{ uri: props.item.profile ?? props.item.user_image }}
                    />
                    <View style={styles.subDetailView}>
                        <View style={styles.userDetailViewStyle}>
                            <Text style={styles.nameStyle}>{props.item.name}</Text>

                            {props?.selectedIndex === 0 && <Text style={styles.descriptionStyle}>{props.Country[props.index] ?? props.item.description}</Text>}
                            {props?.selectedIndex === 1 && <Text style={styles.descriptionStyle}>{[props?.Cuisine[props?.index]]?.join(',')}</Text>}
                            {props?.selectedIndex === 2 && <Text style={styles.descriptionStyle}>{[props?.Meal[props?.index]]?.join(',')}</Text>}

                        </View>
                        
                    </View>

                </View>
            </Pressable> 
{/* } */}
        </>
    );
};

export default CPUserInterestComponent;

const styles = StyleSheet.create({
    pressAction: { paddingBottom: 20, backgroundColor: CPColors.white },
    postImageStyle: { flex: 1, height: 90, borderRadius: 5 },
    detailView: { flexDirection: 'row', marginLeft: 15 },
    userImageView: { width: 60, height: 60, borderRadius: 60, borderColor: CPColors.white, marginTop: -20, borderWidth: 2 },
    subDetailView: { flex: 1, flexDirection: 'row' },
    userDetailViewStyle: { flex: 1, marginVertical: 10, marginHorizontal: 10 },
    nameStyle: { fontFamily: CPFonts.bold, fontSize: 14, color: CPColors.secondary },
    descriptionStyle: { fontFamily: CPFonts.semiBold, fontSize: 12, color: CPColors.secondaryLight },
    btnStyle: { alignSelf: 'center' }
})