import React, { useState, useEffect } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import NavigationServiceManager from '../Utils/NavigationServiceManager';
import Assets from '../Assets';
import {
  saveUserLoggedInInRedux,
  saveUserDetailInRedux,
} from '../redux/Actions/User';
import { showDialogue } from '../Utils/CPAlert';
import CPColors from '../Utils/CPColors';
import { LOGOUT_API, MY_ACCOUNT_API } from '../Utils/CPConstant';
import CPFonts from '../Utils/CPFonts';
import { getApi, postApi } from '../Utils/ServiceManager';
import CPProfileImageComponent from './CPProfileImageComponent';

const CPDrawer = (props) => {
  const userDispatcher = useDispatch();
  const userSelector = useSelector((state) => state);
  const [userDetail, setUserDetail] = useState();

  useEffect(() => {
    UserDetails();
  }, []);

  // console.log('USER DETAILS ::::: ', userDetail);

  const UserDetails = () => {
    getApi(
      MY_ACCOUNT_API,
      onSuccessMyAccount,
      onFailureMyAccount,
      userSelector.userOperation,
    );
  };

  const onSuccessMyAccount = (response) => {
    if (response.success) {
      console.log(
        'USER DETAILS SUCCESS ::::: ',
        response.data.my_profile.my_preference.country.name,
      );
      setUserDetail(response.data?.my_profile?.my_preference?.country.name);
    }
  };

  const onFailureMyAccount = (error) => {
    console.log(' FAILURE MY ACCOUNT ::::::', error);
  };

  const onLogOut = () => {
    const logoutParam = {
      logout: true,
    };
    postApi(
      LOGOUT_API,
      logoutParam,
      onSuccessResponse,
      onFailureResponse,
      userSelector.userOperation,
    );
  };

  const onSuccessResponse = (response) => {
    console.log('SUCCESS LOGOUT :::::: ', response);
    if (response.success) {
      userDispatcher(saveUserLoggedInInRedux(false));
      userDispatcher(saveUserDetailInRedux({}));
      NavigationServiceManager.navigateToSpecificRoute('login');
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const onFailureResponse = (error) => {
    console.log('LOGOUT FAILURE :::::: ', error);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const menuArray = [
    {
      title: 'My Subscription',
      image: Assets.mySubscription,
    },
    {
      title: 'My Preferences',
      image: Assets.mypreference,
    },
    {
      title: 'Activity Status',
      image: Assets.activityStatus,
    },
    {
      title: 'Change Password',
      image: Assets.change_password_icon,
    },
    {
      title: 'Terms & Conditions',
      image: Assets.termandcondition,
    },
    {
      title: 'Privacy',
      image: Assets.privacyPolicy,
    },
    {
      title: 'About',
      image: Assets.aboutUs,
    },
    {
      title: 'Contact Us',
      image: Assets.supportUs,
    },
  ];

  const onChangeHandler = (index) => {
    switch (index) {
      case 0:
        // NavigationServiceManager?.navigateToDoubleroot('subScription', {
        //   isMySubscription: true,
        // });
        props.navigation.navigate('subScription', {
          isMySubscription: true,
        });
        console.log("pros!!", props.navigation);
        console.log("NavigationServiceManager!!", NavigationServiceManager);
        props.navigation.closeDrawer();
        break;
      case 1:
        props.navigation.navigate('myPreference');
        props.navigation.closeDrawer();
        break;
      case 2:
        props.navigation.navigate('activityStatus');
        props.navigation.closeDrawer();
        break;
      case 3:
        props.navigation.navigate('changePassword');
        props.navigation.closeDrawer();
        break;
      case 4:
        props.navigation.navigate('cms', {
          cms: 1,
        });
        props.navigation.closeDrawer();
        break;
      case 5:
        props.navigation.navigate('cms', {
          cms: 2,
        });
        props.navigation.closeDrawer();
        break;
      case 6:
        props.navigation.navigate('aboutus');
        props.navigation.closeDrawer();
        break;
      case 7:
        props.navigation.navigate('contactus');
        props.navigation.closeDrawer();
        break;

      default:
        break;
    }
  };

  return (
    <View style={style.container}>
      <View style={style.subContainerStyle}>
        <Pressable
          onPress={() => {
            props.navigation.navigate('adduserdetail', {
              isCurrentUser: true,
            });
            props.navigation.closeDrawer();
          }}>
          <CPProfileImageComponent
            size={60}
            source={userSelector?.userOperation?.detail?.profile}
          />
        </Pressable>
        <Pressable
          style={style.editPressable}
          onPress={() => {
            props.navigation.navigate('adduserdetail', {
              isCurrentUser: true,
            });
            props.navigation.closeDrawer();
          }}>
          <Image source={Assets.edit} />
        </Pressable>
        <View style={{ marginLeft: 10 }}>
          <Text style={style.nameStyle}>
            {userSelector?.userOperation?.detail?.name}
          </Text>
          <Text style={style.locationStyle}>{userDetail}</Text>
        </View>
      </View>

      <FlatList
        data={menuArray}
        style={{ marginTop: 40 }}
        bounces={false}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              style={style.pressableStyle}
              onPress={() => onChangeHandler(index)}>
              <Image source={item.image} resizeMode="contain" />
              <Text style={style.titleStyle}>{item.title}</Text>
            </Pressable>
          );
        }}
      />

      <Pressable
        style={style.logoutPress}
        onPress={() => {
          showDialogue(
            'Are you sure want to logout?',
            [{ text: 'Cancel' }],
            'Cookpals',
            onLogOut,
          );
        }}>
        <Image source={Assets.logout} resizeMode={'contain'} />

        <Text style={style.logoutText}>{'Log Out'}</Text>

      </Pressable>
      <Text style={{
        fontFamily: CPFonts.regular,
        fontSize: 16,
        color: CPColors.secondary, marginTop: 10, marginLeft: 70
      }}>V: 1.0.1</Text>
    </View>
  );
};

export default CPDrawer;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CPColors.white,
    paddingVertical: 60,
    paddingRight: 20,
  },
  subContainerStyle: { flexDirection: 'row', alignItems: 'center' },
  editPressable: { position: 'absolute', bottom: -10, left: 45 },
  nameStyle: {
    fontSize: 16,
    maxWidth: 100,
    fontFamily: CPFonts.semiBold,
    color: CPColors.secondary,
    marginBottom: 5,
  },
  locationStyle: {
    fontSize: 12,
    fontFamily: CPFonts.medium,
    color: CPColors.secondaryLight,
  },
  pressableStyle: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
  },
  titleStyle: {
    fontFamily: CPFonts.regular,
    fontSize: 16,
    color: CPColors.secondary,
    marginLeft: 20,
  },
  logoutPress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginRight: 20,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: CPColors.primary,
  },
  logoutText: {
    fontFamily: CPFonts.regular,
    color: CPColors.primary,
    fontSize: 16,
    marginLeft: 20,
    marginTop: 2,
  },
});
