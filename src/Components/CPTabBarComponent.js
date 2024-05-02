import React from 'react';
import { Image, Pressable, View } from 'react-native';
import Assets from '../Assets';

const CPTabBarComponent = (props) => {

    const tabArray = [
        { name: 'home', title: "Home", image_select: Assets.homeselect, image_deselect: Assets.homedeselect },
        { name: 'explore', title: "Explore", image_select: Assets.exploreselect, image_deselect: Assets.exploredeselect },
        { name: 'post', title: "Post", image_select: Assets.postdeselect, image_deselect: Assets.postdeselect },
        { name: 'search', title: "Search", image_select: Assets.searchselect, image_deselect: Assets.searchdeselect },
        { name: 'account', title: "Account", image_select: Assets.accountselect, image_deselect: Assets.accountdeselect },
    ];

    const onChangeTabNavigation = (data, index) => {
        //     if(index == 0){
        //     NavigationServiceManager.navigateToSpecificRoute(data.name)
        // }else{
        // if(index == 1 && userState.userDetail.group == 3 && userState.childrenList.length == 0){


        //     props.navigation.navigate('groups')
        // }else{
        props.navigation.navigate(data.name)
        // }

        // }
    }
    return (
        <View style={{ flexDirection: 'row' }}>
            {tabArray.map((item, index) => {
                return (
                    <Pressable
                        onPress={() => onChangeTabNavigation(item, index)}
                    >
                        <Image
                            source={index == props.state.index ? item.image_select : item.image_deselect}
                            resizeMode={'contain'}

                            style={[
                                {
                                    width: 20, height: 20
                                }
                            ]}
                        />
                    </Pressable>
                )
            })}
        </View>
    );
};

export default CPTabBarComponent;