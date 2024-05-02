import React from 'react';
import { ImageBackground, Platform, View } from 'react-native';
import CPColors from '../Utils/CPColors';
import SafeAreaView from 'react-native-safe-area-view';
import NavBar from '../Components/NavBar';
import { StatusBar } from 'react-native';
import Assets from '../Assets';
import { hasNotch } from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';

const BaseContainer = (props) => {
  return (
    <SafeAreaView
      forceInset={{ bottom: Platform.OS == 'android' || props.safeAreaBottomDisable ? 'never' : 'always', top: 'never' }}
      style={[{ flex: 1, backgroundColor: CPColors.white }, props.style]}>

      <LinearGradient colors={['rgba(209,204,226,0.8)', 'rgba(209,204,226,0.3)', CPColors.white, CPColors.white, CPColors.white, CPColors.white, CPColors.white, CPColors.white, CPColors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}>
        <View style={{
          flex: 1,
          marginBottom: props.isBottomAreaPadding && !props.isBottomMarginEnable ? 45 : 0,
          paddingTop: props.isNavigationDisable ? (hasNotch() ? 40 : 20) : Platform.OS == 'android' ? 20 : 0
        }} pointerEvents={props.ispointerEvents ? 'none' : 'auto'}
        >

          <StatusBar
            translucent
            backgroundColor={props.statusBackground ?? "transparent"}
            // backgroundColor={CNColor.white}
            barStyle="dark-content"
          />
          {props.isNavigationDisable ? null :
            <NavBar
              searchComponent={props.searchComponent}
              title={props.title}
              onBackPress={props.onBackPress}
              leftcmpStyle={props.leftcmpStyle}
              leftComponet={props.leftComponet}
              rightComponent={props.rightComponent}
              titleComponent={props.titleComponent}
              titleStyle={props.titleStyle}
              imageStyle={props.backImageStyle}
              isTransparentEnable={props.isTransparentEnable}
            />
          }
          <View style={{ flex: 1 }} pointerEvents={props.isLoading ? 'none' : 'auto'}>
            {props.children}
          </View>
        </View>
      </LinearGradient>
      {/* // </ImageBackground>  */}
    </SafeAreaView>
  );
};

export default BaseContainer;