import React, { useState, useRef } from 'react';
import { Platform, View } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel-chen';
// import Swiper from "react-native-deck-swiper";
import { debugLog } from '../Utils/CPConstant';
// import CPHomePostComponent from './CPHomePostComponent';

const CPRecipeSlider = (props) => {
    const [height, setHeight] = useState()

    return (
        <View style={{ flex: 1 }}
            onLayout={(event) => {
                var { x, y, width, height } = event.nativeEvent.layout;
                if (Platform.OS == 'ios') {
                    setHeight(height - 20)
                } else {
                    setHeight(height - 20 + (props.addMargin ?? 0))
                }
            }}
        >
            {props.addonsComponentRender}
            {height ?
                <Carousel
                    data={props.data}
                    useScrollView
                    renderItem={props.componentRender}
                    sliderWidth={widthPercentageToDP("100")}
                    itemWidth={widthPercentageToDP("95%")}
                    sliderHeight={props.sliderHeight ?? height}
                    itemHeight={props.itemHeight ?? height}
                    layout={'tinder'}
                    layoutCardOffset={props.layoutCardOffset ?? 19}
                    onBeforeSnapToItem={props.onBeforeSnapToItem}
                    onSnapToItem={props.onSnapToItem}
                />
                // <Swiper
                //     ref={useSwiper}
                //     animateCardOpacity
                //     // containerStyle={styles.container}
                //     cards={props.data}
                //     renderCard={card => <CPHomePostComponent card={card} />}
                //     cardIndex={0}
                //     backgroundColor="white"
                //     stackSize={2}
                //     infinite
                //     showSecondCard
                //     animateOverlayLabelsOpacity
                //     onBeforeSnapToItem={props.onBeforeSnapToItem}
                //     onSnapToItem={props.onSnapToItem}
                // />
                : null}
        </View>
    );
};

export default CPRecipeSlider;