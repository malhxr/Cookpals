import React from "react";
import {
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Assets from "../Assets";
import CPThemeButton from "../Components/CPThemeButton";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import BaseContainer from "./BaseContainer";
import Geolocation from "react-native-geolocation-service";
import { postApi } from "../Utils/ServiceManager";
import { USER_LOCATION } from "../Utils/CPConstant";
import { useSelector } from "react-redux";

const LocationContainer = (props) => {
  const userSelector = useSelector((state) => state);

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      locationPermission();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",
            message: "This App needs to Access your location",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          locationPermission();
        } else {
          alert("Permission Denied");
        }
      } catch (err) {
        alert("err", err);
      }
    }
  };

  const locationPermission = () => {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("GET LOCATION ::::: ", position);
        getLocation(position.coords.longitude, position.coords.latitude);
        props.navigation.navigate("addfriendmodal");
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const getLocation = (lng, lat) => {
    const params = {
      longitude: lng,
      latitude: lat,
    };
    postApi(
      USER_LOCATION,
      params,
      onSuccess,
      onFailure,
      userSelector.userOperation
    );
  };

  const onSuccess = (response) => {
    console.log("SUCESS LOCATION ::: ", response);
  };

  const onFailure = (error) => {
    console.log(error);
  };

  return (
    <BaseContainer isNavigationDisable>
      <View style={styles.container}>
        <Image source={Assets.locations} />
        <View style={styles.locationView}>
                    <Text style={styles.locationTitle}>{"Location Access"}</Text>
                    <Text style={styles.locationDescription}>
                        Lorem Ipsum is simply dummy text of the {`\n`}
                        Ipsum Is Simply Dummy Text Of The
                    </Text>
                </View>
      </View>
      <View style={styles.bottomView}>
        <CPThemeButton
          title={"Location Permission"}
          onPress={requestLocationPermission}
        />

        <CPThemeButton
          title={"Don't Allow"}
          colorArray={[CPColors.white, CPColors.white]}
          labelStyle={styles.btnStyle}
          onPress={() => props.navigation.navigate("addfriendmodal")}
        />
      </View>
    </BaseContainer>
  );
};

export default LocationContainer;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  locationView: { marginTop: heightPercentageToDP("5%") },
  locationTitle: {
    fontFamily: CPFonts.bold,
    fontSize: 26,
    color: CPColors.secondary,
    marginBottom: 15,
    textAlign: "center",
  },
  locationDescription: {
    fontSize: 12,
    fontFamily: CPFonts.medium,
    textAlign: "center",
    color: CPColors.secondaryLight,
  },
  bottomView: {
    paddingHorizontal: 24,
    paddingBottom: heightPercentageToDP("5"),
  },
  btnStyle: { color: CPColors.secondary },
});
