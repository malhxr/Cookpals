import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Assets from '../Assets';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';
import CPProgressLoader from './CPProgressLoader';

const CPUpgradePlan = (props) => {
    return (
        <View style={{}}>
            <View style={styles.container}>
                <Text style={styles.upgradeTitle}>{props.item.actionStr}</Text>
                <Pressable style={styles.forwardPress}
                    hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
                    onPress={props.onProcessAction}
                >
                    {props.isLoading ?
                        <ActivityIndicator
                            size={20}
                            color={CPColors.white}
                        />
                        :
                        <Icon
                            name={'arrow-forward'}
                            color={CPColors.white}
                            size={20}
                        />
                    }
                </Pressable>
                <View style={styles.frontView}>
                    {props.isCloseDisable ? null :
                        <Pressable style={styles.closePress}
                            hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
                            onPress={props.onPress}
                        >

                            <Icon name={'close'} size={15} />
                        </Pressable>
                    }
                    <Image style={{ marginBottom: 5, marginTop: 15 }} source={props.item.image} />
                    <Text style={styles.titleTxt}>{props.item.title}</Text>
                    <Text style={styles.descriptionStyle}>{props.item.description}</Text>
                </View>
            </View>
        </View>
    );
};

export default CPUpgradePlan;

const styles = StyleSheet.create({
    container: { width: widthPercentageToDP('60%'), height: widthPercentageToDP("75%"), backgroundColor: CPColors.secondary, borderRadius: 10, padding: 15, marginLeft: -30, justifyContent: 'flex-end', position: 'relative' },
    upgradeTitle: { fontFamily: CPFonts.bold, fontSize: 16, color: CPColors.white, textAlign: 'center' },
    forwardPress: { backgroundColor: CPColors.primary, position: 'absolute', right: -15, bottom: 8, padding: 5, borderRadius: 20 },
    frontView: { justifyContent: 'center', position: 'absolute', bottom: 50, left: 30, right: -20, top: -20, backgroundColor: CPColors.white, alignItems: 'center', padding: 15, borderRadius: 10, shadowColor: CPColors.black, shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 0 } },
    titleTxt: { marginVertical: 10, fontSize: 14, fontFamily: CPFonts.bold, color: CPColors.secondary },
    descriptionStyle: { textAlign: 'center', fontSize: 12, fontFamily: CPFonts.regular, color: CPColors.secondaryLight },
    closePress: { alignSelf: 'flex-start', position: 'absolute', top: 10, left: 10 }
})