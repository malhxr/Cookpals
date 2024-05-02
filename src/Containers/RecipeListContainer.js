import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Assets from '../Assets';
import CPImageComponent from '../Components/CPImageComponent';
import CPRecipeSlider from '../Components/CPRecipeSlider';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';
import NavigationServiceManager from '../Utils/NavigationServiceManager';
import BaseContainer from './BaseContainer';
import { useSelector } from 'react-redux';
import { getApi } from '../Utils/ServiceManager';
import { EXPLORE } from '../Utils/CPConstant';

const RecipeListContainer = (props) => {


  const userSelector = useSelector((state) => state);
  const [expUserList, setExpUserList] = useState([])
  console.log(expUserList, "getting array");

  useEffect(() => {
    explorelisted();
  }, [])


  const explorelisted = () => {
    getApi(EXPLORE, onSuccessSuggestion, onFailureSuggestion, userSelector.userOperation)
  }

  const onSuccessSuggestion = (response) => {
    console.log("suggestion Success ::::::: ", response);
    if (response.success) {
      setExpUserList(response.data)
    }

  }

  const onFailureSuggestion = (error) => {
    console.log("suggestion Success ::::::: ", error);

  }

  const [selectSider, setSelectedSlider] = useState(0);

  const onNavigationHome = () => {
    NavigationServiceManager.navigateToDoubleroot('dashboard');
  }

  const exploreRecipeItemRender = ({ item, index }) => {
    console.log(item?.post?.map(x => x.image), "kakjhfbnnd");
    return (
      <View style={styles.main}>
        <CPImageComponent style={styles.imgComponent} source={item.cover_image} />
        <Pressable
          style={styles.cardComponent}
          onPress={() => {
            props.navigation.navigate('anotherUser', {
              isAnotherUser: true,
              fromClick: true,
              id: item?.id

            });
          }}>
          <Pressable
            onPress={() => {
              props.navigation.navigate('anotherUser', {
                isAnotherUser: true,
                fromClick: true,
                id: item?.id

              });
            }}>
            <CPImageComponent
              style={styles.cpImage}
              source={
                item?.profile
              }
            />
          </Pressable>
          <LinearGradient
            colors={[
              'rgba(255,255,255,0)',
              'rgba(255,255,255,0)',
              'rgba(255,255,255,0)',
              'rgba(255,255,255,0)',
              'rgba(0,0,0,0.2)',
              'rgba(0,0,0,0.5)',
              'rgba(0,0,0,0.8)',
              'rgba(0,0,0,1.0)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientStyle}>
            <View style={styles.recipeView}>
              <Text style={styles.nameText}>{item?.name}</Text>
              <View style={styles.mapImageView}>
                {item?.post?.map((x, i) => {
                  return (
                    <Pressable
                      key={i}
                      onPress={() => {
                        props.navigation.navigate('recipeDetail',
                          {
                            acc_user_Profile: false,
                            recipeId: item?.post[i]?.id,
                            fromCLick: false,
                            userId: item?.id,
                            index: i
                          })

                      }}
                    >
                      <Image

                        style={styles.imageItemStyle}
                        source={{ uri: x?.image }}
                      />
                    </Pressable>
                  )
                })}
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </View>

    );
  };

  return (
    <BaseContainer
      leftComponet={
        <Image
          style={styles.navBarImg}
          source={Assets.logo}
          resizeMode="cover"
        />
      }
      title={`Let we help us to find ${`\n`} a perfect match`}
      titleStyle={styles.titleText}>
      <View style={styles.cardView}>
        {expUserList.length === 0 ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: CPColors.primary, fontFamily: CPFonts.bold, fontSize: 14 }}>{"No data found"}</Text>
        </View> : <CPRecipeSlider
          data={expUserList}
          componentRender={exploreRecipeItemRender}
          onBeforeSnapToItem={setSelectedSlider}
        />}
        <Pressable style={{ alignSelf: 'center' }} hitSlop={{ right: 15, left: 15, bottom: 15, top: 15 }} onPress={onNavigationHome}>
          <Text style={{ textDecorationStyle: 'solid', textDecorationLine: 'underline', fontFamily: CPFonts.bold, fontSize: 16, color: CPColors.secondary }}>{"Go to home"}</Text>
        </Pressable>
      </View>
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 45,
  },
  imgComponent: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
  cardComponent: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    justifyContent: 'space-between',
  },
  cpImage: {
    width: widthPercentageToDP('21'),
    height: widthPercentageToDP('21'),
    borderRadius: widthPercentageToDP('21'),
    position: 'relative',
    marginTop: -40,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: CPColors.white,
  },
  gradientStyle: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  nameText: {
    fontSize: 16,
    color: CPColors.white,
    fontFamily: CPFonts.semiBold,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  bodyText: {
    fontSize: 12,
    color: CPColors.lightwhite,
    fontFamily: CPFonts.medium,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  mapImageView: {
    flexDirection: 'row',
    // marginRight: 10,
  },
  singleImg: {
    flex: 1,
    height: 70,
    marginLeft: 10,
    borderRadius: 15,
    marginHorizontal: 2
  },
  navBarImg: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  titleText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: CPFonts.abril_regular,
    color: CPColors.secondary,
  },
  cardView: {
    flex: 1, paddingBottom: 20
  },
  recipeView: { paddingVertical: 30 },
  imageItemStyle: { width: widthPercentageToDP("20%") - 10, height: 70, marginLeft: 10, borderRadius: 15, marginHorizontal: 2 }
});

export default RecipeListContainer;
