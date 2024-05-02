import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Assets from '../Assets';
import CPThemeButton from '../Components/CPThemeButton';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';
import BaseContainer from './BaseContainer'
const MostFollowLikeSelectContainer = (props) => {

    const navigateToBack = () => {
        props.navigation.goBack()
    }

    const mostLikeMostDislikeAction = (value) => {
        props.navigation.navigate('preparetionDetail',
            {
                country: props.route.params.country,
                cuisine: props.route.params.cuisine,
                meals: props.route.params.meals,
                most_followed_liked: value,
                gender: props.route.params.gender
            })
    }

    return (
        <BaseContainer
            onBackPress={navigateToBack}
            isBottomMarginEnable
            safeAreaBottomDisable
            isBottomAreaPadding
        >
            <ScrollView style={styles.scrollStyle} bounces={false}>
                <View style={styles.container}>
                    <Image
                        style={styles.imageStyle}
                        resizeMode='contain'
                        source={Assets.mostlikedislikeimage}
                    />

                    {/* <Text style={styles.txtStyle}>
                        Lorem Ipsum is simply dummy text of the {`\n`}
                        Ipsum Is Simply Dummy Text Of The
                    </Text> */}

                    <CPThemeButton
                        title={"Most Followed"}
                        onPress={() => {
                            mostLikeMostDislikeAction(1)
                        }}
                    />
                    <CPThemeButton
                        colorArray={[CPColors.white, CPColors.white]}
                        style={styles.btnStyle}
                        labelStyle={{ color: CPColors.primary }}
                        title={"Most Liked"}
                        onPress={() => {
                            mostLikeMostDislikeAction(2)
                        }}
                    />
                </View>
            </ScrollView>
            <Image
                style={styles.bottomImage}
                source={Assets.bottomimages}
            />
        </BaseContainer>

    );
};

export default MostFollowLikeSelectContainer;

const styles = StyleSheet.create({
    scrollStyle: {
        zIndex: 999
    },
    container: {
        flex: 1, paddingHorizontal: 15
    },
    imageStyle: { alignSelf: 'center', marginTop: 25, height: heightPercentageToDP("35%") },
    txtStyle: { textAlign: 'center', fontFamily: CPFonts.medium, fontSize: 12, color: CPColors.secondaryLight, marginVertical: 20 },
    btnStyle: {
        backgroundColor: CPColors.white,
        shadowColor: CPColors.black,
        marginTop: 15,
        elevation: 2,
        borderWidth: 0.5,
        borderColor: CPColors.borderColor,
        shadowOpacity: 0.5,
        shadowRadius: 0.5,
        shadowOffset: {
            width: 0,
            height: 0
        }
    },
    bottomImage: { position: 'absolute', bottom: 0, left: 0, right: 0 }
})