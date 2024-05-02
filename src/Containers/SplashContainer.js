import React, { useEffect } from "react";
import { Image, View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { useSelector } from "react-redux";
import NavigationServiceManager from "../Utils/NavigationServiceManager";
import Assets from "../Assets";

const SplashContainer = (props) => {
  const userSelector = useSelector((state) => state);

  console.log("STATE ::::: ", userSelector);
  useEffect(() => {
    setTimeout(() => {
      // props.navigation.navigate('addfriendmodal')
      if (userSelector.userOperation.isLoggedIn) {
        NavigationServiceManager.navigateToSpecificRoute("dashboard");
        SplashScreen.hide();
      } else {
        NavigationServiceManager.navigateToSpecificRoute("login");
        SplashScreen.hide();
      }
    }, 2000);
  }, []);

  return (
    // <Image
    //     style={{ width: '100%', height: '100%' }}
    //     resizeMode='cover'
    //     source={Assets.splash}
    // />
    <View style={{ flex: 1 }}></View>
  );
};

export default SplashContainer;
