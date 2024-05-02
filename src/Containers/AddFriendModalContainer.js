import React from 'react';
import { Alert, Image, Linking, Platform, Pressable, StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Assets from '../Assets';
import CPThemeButton from '../Components/CPThemeButton';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';
import BaseContainer from './BaseContainer';
import Contacts from 'react-native-contacts';
import { showRequestAlertForAndroid, showRequestAlertForIOS } from '../Utils/CPGlobalMethods';

const AddFriendModalContainer = (props) => {

   const checkContactPermission = async () => {
     if (Platform.OS == "ios") {
       Contacts.checkPermission().then((permission) => {
         // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
         if (permission === "undefined") {
           Contacts.requestPermission().then((permission) => {
            //  console.log("PERMISSION IOS: ", permission);
           });
         }
         if (permission === "authorized") {
           props.navigation.navigate("addfriend");
          //  console.log("PERMISSION AUTHORIZED IOS: ", permission);
         }
         if (permission === "denied") {
           showRequestAlertForIOS();
          //  console.log("PERMISSION DENIED IOS: ", permission);
         }
       });
     } else {
       try {
         const granted = await PermissionsAndroid.request(
           PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
           {
             title: "Cookpals",
             message: "Cookpals would like to view your contacts.",
             buttonNeutral: "Ask Me Later",
             buttonNegative: "No",
             buttonPositive: "Yes",
           }
         );
         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //  console.log("You can use the contacts");
           props.navigation.navigate("addfriend");
         } else {
           showRequestAlertForAndroid();
         }
       } catch (err) {
         console.warn(err);
       }
     }
   };

    return (
        <BaseContainer
            isNavigationDisable
        >
            <View style={{ flex: 2 }}>
                <Image
                    source={Assets.addfriendimage}
                    style={styles.container}
                />
            </View>
            <View style={styles.container}>
                {/* <Text style={styles.description}>
                    Lorem Ipsum is simply dummy text of the {`\n`}
                    Ipsum Is Simply Dummy Text Of The
                </Text> */}

                <CPThemeButton
                    title={'Add Friends'}
                    style={styles.btnStyle}
                    onPress={() => {
                        console.log("LOG    ::::: ");
                        checkContactPermission();
                    }}
                />
                <Pressable style={{flexDirection:'row',alignItems:'center', alignSelf:'center', marginVertical:10}}
                onPress={()=>{
                    props.navigation.navigate('foodPreference')
                }}
                >
                        <Text style={{fontSize: 14, fontFamily: CPFonts.bold,marginVertical:10, color: CPColors.secondary}}>{"Skip"}</Text>
                        <Image style={{marginVertical:5, marginLeft:6}} resizeMode={'contain'} source={Assets.skip} />
                </Pressable>
            </View>
        </BaseContainer>
    );
};

export default AddFriendModalContainer;

const styles = StyleSheet.create({
    container: { flex: 1 },
    description: { textAlign: 'center', fontFamily: CPFonts.medium, fontSize: 12, color: CPColors.secondaryLight },
    btnStyle: { marginTop: 40, width: widthPercentageToDP("100") - 48, alignSelf: 'center' }
})