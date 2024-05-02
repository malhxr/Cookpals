import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';
import Assets from '../Assets';
import CPRecipeSlider from '../Components/CPRecipeSlider';
import CPSubScriptionComponent from '../Components/CPSubScriptionComponent';
import CPColors from '../Utils/CPColors';
import { MY_SUBSCRIPTION_API, PLANS_API } from '../Utils/CPConstant';
import CPFonts from '../Utils/CPFonts';
import { getApi, postApi } from '../Utils/ServiceManager';
import { showDialogue } from '../Utils/CPAlert';
import BaseContainer from './BaseContainer';
import * as RNIap from 'react-native-iap';
import AsyncStorage from "@react-native-async-storage/async-storage";

// productid
const itemSkus = Platform.select({
  ios: ['premium_sub'],
  android: ['premium_sub'],
});

// Subscription items
const itemSubs = Platform.select({ ios: ['monthly_sub'], android: ['monthly_sub'] });

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

const SubScriptionContainer = (props) => {

  const userSelector = useSelector((state) => state)
  const [isLoading, setIsLoading] = useState(false);

  const [subscriptionArray, setSubscriptionArray] = useState([]);
  const [expireAt, setExpireAt] = useState();

  const [productList, setProductList] = useState([]);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [receipt, setReceipt] = useState();

  useEffect(() => {
    initilizeIAPConnection();
    if (props.route?.params?.isMySubscription) {
      mySubscriptionAction()
    } else {
      getPlansAction()
    }
  }, [])

  const initilizeIAPConnection = async () => {
    await RNIap.initConnection()
      .then(async (connection) => {
        console.log('IAP result', JSON.stringify(connection));
        getItems();
        getSubscription();
      })
      .catch((err) => {
        console.error(`IAP ERROR ${err.code}`, err.message);
      });
    if (Platform.OS === 'android') {
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid()
        .then(async (consumed) => {
          console.log('consumed all items?', consumed);
        }).catch((err) => {
          console.error(`flushFailedPurchasesCachedAsPendingAndroid ERROR ${err.code}`, err.message);
        });
    }
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        console.log("purchaseUpdatedListener", purchase);
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          setReceipt(receipt);
          try {
            if (Platform.OS === 'ios') {
              await RNIap.finishTransactionIOS(purchase.transactionId);
            }
            else if (Platform.OS === 'android') {
              if (purchase.purchaseStateAndroid === 1 && !purchase.isAcknowledgedAndroid) {
                // await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken).then(() => {
                  RNIap.finishTransaction(purchase, true).catch(err => {
                    console.log("error", err.code, err.message);
                  });
                });
              }
            }
          } catch (ackErr) {
            console.log('ackErr INAPP>>>>', ackErr);
          }
        } else {
          console.log("receipt not availble");
        }
      },
    );

    purchaseErrorSubscription = RNIap.purchaseErrorListener(
      (error) => {
        console.log('purchaseErrorListener INAPP>>>>', error);
      },
    );

    return (() => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      RNIap.endConnection();
    });
  };


  const getItems = async () => {
    console.log("itemSkus", itemSkus)
    try {
      const products = await RNIap.getProducts(itemSkus);
      console.log('Products', JSON.stringify(products));
      if (products.length !== 0) {
        if (Platform.OS === 'android') {
          //Your logic here to save the products in states etc
          setProductList(products);
        } else if (Platform.OS === 'ios') {
          // your logic here to save the products in states etc
          setProductList(products);
          // Make sure to check the response differently for android and ios as it is different for both
        }
      }
    } catch (err) {
      console.error("IAP error", err.code, err.message, err);
    }
  };

  const getSubscription = async () => {
    try {
      const products = await RNIap.getSubscriptions(itemSubs)
      console.log("products----", products);
      setSubscriptionList(products);
    } catch (err) {
      console.log("getSubscription error => ", err);
    }
  }

  const requestSubscription = async (sku, id) => {
    try {
      await RNIap.requestSubscription(sku, false).then((purchase) => {
        console.log("purchase token", purchase.purchaseToken)
        setSubscription(id, purchase.transactionId);
        RNIap.finishTransaction(purchase, true);
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  const requestPurchase = async (sku, id) => {
    console.log("sku", sku)
    try {
      await RNIap.requestPurchase(sku, false).then((purchase) => {
        console.log("purchase token", purchase.purchaseToken)
        setSubscription(id, purchase.transactionId);
        RNIap.finishTransaction(purchase, true);
      })
    }
    catch (err) {
      console.log('requestPurchase error => ', err);
    }
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };

  const mySubscriptionAction = () => {
    getApi(MY_SUBSCRIPTION_API, onSuccessMySubscription, onFailureMySubscription, userSelector.userOperation)
  };

  const onSuccessMySubscription = (response) => {
    console.log("MySubscription :::::: ", response);
    if (response.success) {
      setSubscriptionArray([response.data.plan])
      setExpireAt(response.data.expire_date)
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  const onFailureMySubscription = (error) => {
    console.log("Error MySubscription :::::: ", error);
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const getPlansAction = () => {
    getApi(PLANS_API, onSuccessPlanList, onFailurePlanList, userSelector.userOperation)
  };

  const onSuccessPlanList = (response) => {
    console.log("Subscription Plan :::::: ", response);
    if (response.success) {
      setSubscriptionArray(response.data)
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }
  }

  const onFailurePlanList = (error) => {
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  const setSubscription = (id, transactionId) => {
    console.log("setTransactionId", transactionId)
    const params = {
      plan_id: id,
      transaction_id: transactionId,
      user_id: userSelector?.userOperation?.detail?.user_id,
      type: '1',
    }
    setIsLoading(true)
    postApi(MY_SUBSCRIPTION_API, params, onSuccessSubscription, onFailureSubscription, userSelector.userOperation)
  }

  const onSuccessSubscription = (response) => {
    setIsLoading(false)
    if (response.success) {
      props.navigation.navigate('location')
    } else {
      Snackbar.show({
        text: response.message,
        duration: Snackbar.LENGTH_LONG,
      });
    }

  }

  const onFailureSubscription = (error) => {
    setIsLoading(false)
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  const onSubscriptionAction = (id, plan_type) => {
    if (!props.route?.params?.isMySubscription) {
      if (plan_type == "Free Plan") {
        console.log("product--!!", subscriptionList)
        requestSubscription(itemSubs[0], id)
      } else if (plan_type == "Paid Plan") {
        requestPurchase(itemSkus[0], id);
      }
    }
  }

  return (
    <BaseContainer
      isNavigationDisable={props.route?.params?.isMySubscription ? false : true}
      title={'My Subscription'}
      isLoading={isLoading}
      onBackPress={navigateToBack}>
      <View style={styles.main}>
        {props.route?.params?.isMySubscription ? null : (
          <View
            style={styles.subScriptionView}>
            <Image source={Assets.logo} />
            <View style={{ marginRight: 15, }}>
              <View style={styles.subView} />
              <Text style={styles.textStyle}>{'Best Plans For You'}</Text>
            </View>
          </View>
        )}

        {/* <CPSubScriptionComponent
          onPress={() => {
            props.navigation.navigate('adduserdetail');
          }}
        /> */}

        <CPRecipeSlider
          data={subscriptionArray}
          componentRender={({ item }) => <CPSubScriptionComponent
            item={item}
            expireAt={expireAt}
            isLoading={isLoading}
            onPress={onSubscriptionAction}
            color={CPColors.secondary}
          // title={'Repurchased'}
          />
          }
          layoutCardOffset={0}
          addonsComponentRender={
            <View style={styles.backgroundViewStyle} />
          }
        // onBeforeSnapToItem={setSelectedSlider}
        // onSnapToItem={setSelectedSlider}
        // addMargin={40}
        />
      </View>
    </BaseContainer>
  );
};

export default SubScriptionContainer;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // marginHorizontal: 20,
    marginVertical: 20,
  },
  backgroundViewStyle: {
    position: 'absolute',
    alignSelf: 'center',
    top: 70, bottom: 30, left: 20, right: 20,
    // width: widthPercentageToDP("90%"),
    // height: heightPercentageToDP("60%"),
    backgroundColor: CPColors.secondaryLight,
    borderRadius: 30
  },
  subView: {
    height: 10,
    width: 30,
    backgroundColor: CPColors.lightPrimary,
    borderRadius: 20,
    position: 'absolute',
    bottom: 3,
    // alignSelf: 'flex-end',

  },
  textStyle: {
    fontSize: 26,
    fontFamily: CPFonts.bold,
    color: CPColors.secondary,
  },
  subScriptionView: {
    marginHorizontal: 20,
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});
