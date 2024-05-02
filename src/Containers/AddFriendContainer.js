import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, ScrollView, SectionList, StyleSheet } from 'react-native';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CPImageComponent from '../Components/CPImageComponent';
import CPContactMembers from '../Components/CPContactMembers';
import CPSelectedMemberComponent from '../Components/CPSelectedMemberComponent';
import CPThemeButton from '../Components/CPThemeButton';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';
import BaseContainer from './BaseContainer';
import { useSelector } from 'react-redux';
import Contacts from 'react-native-contacts';
import { createContactArray, createSectionArray, setSearchResult } from '../Utils/CPGlobalMethods';
import { postApi } from '../Utils/ServiceManager';
import { NUMBER_CHECK, SEND_INVITATION } from '../Utils/CPConstant';
import Snackbar from 'react-native-snackbar';
import CPProgressLoader from '../Components/CPProgressLoader';
import CPSearchAnimationComponent from '../Components/CPSearchAnimationComponent';
import { debounce } from "lodash";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const AddFriendContainer = (props) => {

    const [ContactData, setContactData] = useState([]);
    const [ContactDataOriginal, setContactDataOriginal] = useState([]);
    const [SelectedMembers, setSelectedMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [contactFlatArray, setcontactFlatArray] = useState([]);
    const [showSearchTextInput, setshowSearchTextInput] = useState(false);
    const [searchText, setSearchText] = useState("");
    const userSelector = useSelector((state) => state);

    /**
     * Taking contacts 
     */
    useEffect(() => {
        setIsLoading(true);
        Contacts.getAll().then((contacts) => {
            // Making data for section list
            let data = createSectionArray(contacts);
            setcontactFlatArray(data);
        });
    }, []);

    useEffect(() => {
        let number_param = contactFlatArray.map((e) => { return { phone: e?.phone?.number } });
        let param = {
            phone: JSON.stringify(number_param)
        }
        postApi(NUMBER_CHECK, param, onSuccessNumberResponse, onFailureNumberResponse, userSelector.userOperation);
    }, [contactFlatArray]);


    /**
     * Debouce for search input
     */
    const debounceHandler = useCallback(debounce((input, CData) => {
        if (input.length > 0) {
            let searchResult = setSearchResult(input, CData);
            setContactData(searchResult);
        } else {
            setContactData(ContactDataOriginal);
        }
    }, 400), []);

    /**
     * Search input handler
     * @param {input change} input 
     */
    const onSearchTextChange = (input) => {
        debounceHandler(input, ContactDataOriginal);
        setSearchText(input);
    }

    const onSuccessNumberResponse = (response) => {
        if (response.success) {
            let responseArray = response?.data;
            let data = []
            if (Array.isArray(responseArray) && responseArray.length > 0) {
                data = createContactArray(contactFlatArray, responseArray);
            }
            setContactData(data);
            setContactDataOriginal(data);
            setIsLoading(false);
        } else {
            Snackbar.show({
                text: response.message,
                duration: Snackbar.LENGTH_SHORT,
            });
            setIsLoading(false);
        }
    };

    const onFailureNumberResponse = (response) => {
        setIsLoading(false);
        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_SHORT,
        });
    };

    /**
     * Invite contacts API call
     */
    const inviteContacts = () => {
        let number_param = [...SelectedMembers];
        if (number_param.length > 0) {
            setIsLoading(true);
            let data = number_param.map((e) => { return { phone: "+" + e?.phone?.number } });
            let param = {
                phone: JSON.stringify(data)
            }
            postApi(SEND_INVITATION, param, onSuccessInviteContactsResponse, onFailureInviteContactsResponse, userSelector.userOperation);
        } else {
            Alert.alert("Cookpals", "Please any select contact");
        }

    }

    /**
     * Success handling of Invite API
     * @param {API Response} response 
     */
    const onSuccessInviteContactsResponse = (response) => {
        console.log("RESPONSE: ", response);
        if (response.success) {
            props.navigation.navigate("foodPreference");
            setIsLoading(false);
        } else {
            Snackbar.show({
                text: response.message,
                duration: Snackbar.LENGTH_SHORT,
            });
            setIsLoading(false);
        }
    };

    /**
     * Failure response handling
     * @param {Failure Response} response 
     */
    const onFailureInviteContactsResponse = (response) => {
        setIsLoading(false);
        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_SHORT,
        });
    };

    const scrollIndicatorRef = useRef();
    const sectionRef = useRef();

    const alphabets = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    const onBackPress = () => {
        props.navigation.goBack()
    }
    const Tab = createMaterialTopTabNavigator();

    const contactSegmentComponent = () => {
        return (
            <Tab.Navigator
                screenOptions={{
                    tabBarContentContainerStyle: { backgroundColor: CPColors.dropdownColor },
                    tabBarLabelStyle: { fontSize: 10, marginVertical: 2, fontFamily: CPFonts.medium },
                    tabBarIndicatorStyle: { borderBottomWidth: 1.5, borderBottomColor: CPColors.primary },
                    tabBarActiveTintColor: CPColors.secondary,
                    tabBarInactiveTintColor: CPColors.secondaryLight,
                    tabBarStyle: { marginTop: 3 }
                }}>
                <Tab.Screen name='Contacts' component={ContactScreen} />
                <Tab.Screen name='Facebook Friends ' component={ContactScreen} />
                <Tab.Screen name='Instagram Friends' component={ContactScreen} />
            </Tab.Navigator>
        )
    }

    const ContactScreen = () => {
        return (
            <View style={styles.container}>
                <CPSelectedMemberComponent
                    onClosePress={(i) => removeFromSelectedMember(i)}
                    membersArray={SelectedMembers}
                />
                <View style={styles.subContainer}>
                    <SectionList
                        ref={sectionRef}
                        sections={ContactData}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={listEmptyComponent}
                        // ListHeaderComponent={headerRender}
                        renderSectionHeader={sectionHeaderRender}
                        // extraData={props}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item, index }) => {
                            return (
                                <CPContactMembers
                                    onRemovePress={(i) => removeFromSelectedMember(i)}
                                    onPress={(i) => addItemInSelectedArray(i)}
                                    item={item}
                                />
                            );
                        }}
                    />
                    {scrollIndicatorRender()}
                </View>
                <CPThemeButton
                    style={{ margin: 15 }}
                    title={"Next"}
                    onPress={() => {
                        inviteContacts();
                    }}
                />
            </View>
        );
    };

    // const headerRender = () => {
    //     return (
    //         <>
    //             <Text style={styles.headerTitleStyle}>{"Invite Friends On Cookpals"}</Text>
    //             <FlatList
    //                 data={cookpalsMember}
    //                 scrollEnabled={false}

    //                 renderItem={({ item, index }) => {
    //                     return (
    //                         <View style={styles.headerListView}>
    //                             <CPImageComponent
    //                                 source={item.image}
    //                                 style={styles.headerImage}
    //                             />

    //                             <View style={styles.headerListSubView}>
    //                                 <Text style={styles.headerNameStyle}>{item.name}</Text>
    //                                 <Text style={styles.headerStatusStyle}>{item.status}</Text>
    //                             </View>
    //                         </View>
    //                     )
    //                 }}
    //                 ItemSeparatorComponent={() => {
    //                     return (
    //                         <View
    //                             style={styles.headerSeprator}
    //                         />
    //                     )
    //                 }}
    //             />
    //             <Text style={styles.headerBottomTxt}>{"Add More Friends On Cookpals"}</Text>
    //         </>
    //     )
    // }

    const sectionHeaderRender = ({ section: { title } }) => {
        return (
            <View style={styles.sectionHeaderStyle}>
                <Text style={styles.sectionHeaderTxtStyle}>{title}</Text>
            </View>
        )
    }

    const listEmptyComponent = () => {
        return (
            !isLoading && ContactData.length === 0 && <View style={styles.emptyView}>
                <Text style={styles.emptyTxtStyle}>No Contacts available</Text>
            </View>
        )
    }


    const scrollIndicatorRender = () => {
        return (
            <View style={styles.scrollIndicatorViewStyle}>
                <FlatList
                    ref={scrollIndicatorRef}
                    data={alphabets}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable
                                style={{ flex: 1 }}
                                onPress={() => {
                                    if (index !== 0) {
                                        sectionRef.current.scrollToLocation(
                                            {
                                                sectionIndex: index - 1,
                                                itemIndex: 0
                                            }
                                        )
                                    } else {
                                        // sectionRef.current.scrollToLocation({
                                        //     animated: true,
                                        //     sectionIndex: 0,
                                        //     itemIndex: 0,
                                        //     viewPosition: 0
                                        //   });
                                    }
                                }}
                            >
                                <Text style={styles.indicatorItemlist}>{item}</Text>
                            </Pressable>
                        )
                    }}
                />
                {/* <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
                    {alphabets.map((item, index) => { 
                        return (
                            <Pressable
                                onPress={() => { }}
                            >
                                <Text style={styles.indicatorItemlist}>{item}</Text>
                            </Pressable>
                        )
                     })}
                </ScrollView> */}
            </View>
        )
    }

    /**
     * Calling when user press plus from list
     * @param {Array Item} item 
     */
    const addItemInSelectedArray = (item) => {
        let selectedMem = [...SelectedMembers];
        selectedMem.push(item);
        setSelectedMembers(selectedMem);

        let contact = [...ContactData];
        let firstLetter = item.givenName.substring(0, 1);
        const firstIndex = contact.findIndex((e) => e.title === firstLetter);

        let subArray = contact[firstIndex].data;
        const phoneIndex = subArray.findIndex((e) => e.phone?.number === item?.phone?.number);
        contact[firstIndex].data[phoneIndex].isSelected = !contact[firstIndex].data[phoneIndex].isSelected;

        setContactData(contact);
    };

    /**
     * Calling when user press remove or plus again from list
     * @param {*} item 
     */
    const removeFromSelectedMember = (item) => {
        let selectedMem = [...SelectedMembers];

        const index = selectedMem.findIndex((e) => e.phone?.number === item?.phone?.number);
        if (index > -1) {
            selectedMem.splice(index, 1);
        }
        setSelectedMembers(selectedMem);

        let contact = [...ContactData];
        let firstLetter = item.givenName.substring(0, 1);
        const firstIndex = contact.findIndex((e) => e.title === firstLetter);

        let subArray = contact[firstIndex].data;
        const phoneIndex = subArray.findIndex((e) => e.phone?.number === item?.phone?.number);
        contact[firstIndex].data[phoneIndex].isSelected = !contact[firstIndex].data[phoneIndex].isSelected;

        setContactData(contact);
    };

    return (
        <BaseContainer
            title={"Add Friends"}
            titleComponent={showSearchTextInput && <></>}
            searchComponent={!showSearchTextInput ? null : <CPSearchAnimationComponent onClosed={() => setshowSearchTextInput(false)} value={searchText} onChangeText={(e) => { onSearchTextChange(e); console.log(e); }} placeholder={"Search here..."} />}
            rightComponent={
                !showSearchTextInput ? <View style={styles.rightComponentStyle}>
                    <Pressable onPress={() => setshowSearchTextInput(true)} style={styles.rightComponentPress}>
                        <Icon
                            type={'material-icons'}
                            name={'search'}
                            color={CPColors.borderColor}
                            style={{ margin: 5 }}
                        />
                    </Pressable>
                </View> :
                    null
            }
            onBackPress={onBackPress}
        >
            {isLoading ? <CPProgressLoader /> : null}
            <View style={{ flex: 1 }}>
                <Text style={styles.titleStyle}>{"Friends"}</Text>
                <Text style={styles.subTitle}>{"Lorem ipsum dolor sit amet"}</Text>

                {contactSegmentComponent()}

            </View>
        </BaseContainer>
    );
};

export default AddFriendContainer;

const styles = StyleSheet.create({
    titleStyle: { fontFamily: CPFonts.semiBold, fontSize: 18, color: CPColors.secondary, marginHorizontal: 24, marginTop: 15, marginBottom: 10 },
    subTitle: { fontFamily: CPFonts.regular, fontSize: 12, color: CPColors.secondaryLight, marginHorizontal: 24 },
    container: { flex: 1, paddingLeft: 18, paddingRight: 6, backgroundColor: CPColors.dropdownColor, borderTopRightRadius: 20, borderTopLeftRadius: 20 },
    subContainer: { flex: 1, paddingLeft: 10, marginTop: 10, flexDirection: 'row' },
    headerTitleStyle: { marginTop: 15, marginBottom: 5, fontSize: 14, fontFamily: CPFonts.semiBold, color: CPColors.primary },
    headerListView: { flexDirection: 'row', paddingVertical: 20 },
    headerImage: { width: 40, height: 40, borderRadius: 40 },
    headerListSubView: { marginHorizontal: 15, justifyContent: 'space-between' },
    headerNameStyle: { fontFamily: CPFonts.regular, fontSize: 14, color: CPColors.secondary },
    headerStatusStyle: { fontFamily: CPFonts.regular, fontSize: 14, color: CPColors.secondaryLight },
    headerSeprator: { height: 0.8, backgroundColor: CPColors.textInputColor },
    headerBottomTxt: { fontFamily: CPFonts.semiBold, fontSize: 14, color: CPColors.primary },
    sectionHeaderStyle: { backgroundColor: CPColors.dropdownColor },
    sectionHeaderTxtStyle: { fontSize: 20, fontFamily: CPFonts.medium, color: CPColors.secondary, marginVertical: 10 },
    scrollIndicatorViewStyle: { marginLeft: 10, marginTop: 20 },
    indicatorItemlist: { textAlign: 'center', fontSize: 10, fontFamily: CPFonts.medium, color: CPColors.borderColor },
    rightComponentStyle: { flex: 1, alignItems: 'center' },
    rightComponentPress: { backgroundColor: CPColors.dropdownColor, borderRadius: 10 },
    emptyView: { height: heightPercentageToDP(50), alignItems: 'center', justifyContent: 'center' },
    emptyTxtStyle: { fontSize: 14, fontFamily: CPFonts.medium, color: CPColors.primary, marginVertical: 10 },
})