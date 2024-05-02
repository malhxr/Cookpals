import React from 'react';
import { FlatList, View } from 'react-native';
import CPNewMemberItems from '../Components/CPNewMemberItems';
import BaseContainer from './BaseContainer';

const LikesListContainer = (props) => {

    const onNavigationBack = () => {
        props.navigation.goBack()
    }

    return (
        <BaseContainer
            title={"Liked by"}
            onBackPress={onNavigationBack}
        >
            <View style={{ flex: 1, marginHorizontal: 24 }}>
                <FlatList
                    data={props?.route?.params?.post_like}
                    renderItem={({ item, index }) => <CPNewMemberItems onPress={() => props.navigation.navigate('anotherUser', {
                        isAnotherUser: true,
                        fromClick: true,
                        id: item?.user_id
                    })} item={item.user} onChangeStatus={() => { }} />}
                />
            </View>
        </BaseContainer>
    );
};

export default LikesListContainer;