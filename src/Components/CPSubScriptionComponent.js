import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Assets from "../Assets";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import CPThemeButton from "./CPThemeButton";

const CPSubScriptionComponent = (props) => {
  console.log("SUBSCRIPTION ITEM :::: ", props.expireAt);
  return (
    <View style={style.container}>
      {/* <View style={style.backgroundViewStyle} /> */}
      <View style={style.frontView}>
        <View style={style.painView}>
          <Text style={style.painText}>{props.item.plan_type}</Text>
          {props.item.plan_type == "Free Plan" ? null : (
            <Text
              style={{
                marginTop: 10,
                color: CPColors.lightwhite,
                fontSize: 18,
                fontFamily: CPFonts.medium,
              }}
            >
              ${props.item.price}
            </Text>
          )}
        </View>
        <View style={style.planDetailView}>
          <Text style={style.planTitle}>{props.item.plan_name}</Text>
          <Text style={style.planDetailText}>{props.item.description}</Text>
        </View>

        <FlatList
          data={props.item.features}
          style={style.listStyle}
          bounces={false}
          renderItem={({ item, index }) => {
            return (
              <View style={style.listViewStyle}>
                <View style={style.listSymbolStyle} />
                <Text style={style.listTitleStyle}>{item.name}</Text>
              </View>
            );
          }}
        />

        <CPThemeButton
          // title={props.item.isPaid ? 'Subscribe Now' : 'Activate Plan'}
          title={
            props.title ??
            (props.item.isPaid ? "Subscribe Now" : "Activate Plan")
          }
          style={style.planBtnStyle}
          colorArray={[CPColors.white, CPColors.white]}
          labelStyle={{ color: CPColors.secondary }}
          onPress={() => props.onPress(props.item.id, props.item.plan_type)}
          isLoading={props.isLoading}
          color={props.color}
        />
        {props.expireAt ? (
          <View style={style.statusView}>
            <Text style={style.dayCountText}>{"10 "}</Text>
            <Text style={style.leftDayTxtStyle}>
              {"Days Left To End Subscription "}
            </Text>
          </View>
        ) : null}

        <View style={style.absoluteView}>
          <Image
            source={Assets.msgtooltip}
            resizeMode={"contain"}
            style={{ top: "10%", height: 41, height: 50 }}
          />
          <Image
            source={Assets.favtooltip}
            resizeMode={"contain"}
            style={{ marginLeft: 10, height: 41, height: 50, top: "30%" }}
          />
        </View>
      </View>
    </View>
  );
};

export default CPSubScriptionComponent;

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    justifyContent: "center",
  },
  backgroundViewStyle: {
    width: widthPercentageToDP("90%"),
    height: heightPercentageToDP("60%"),
    backgroundColor: CPColors.secondaryLight,
    borderRadius: 30,
  },
  frontView: { flex: 1, backgroundColor: CPColors.secondary, borderRadius: 20 },
  painView: {
    backgroundColor: CPColors.primary,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 25,
  },
  painText: { color: CPColors.white, fontFamily: CPFonts.bold, fontSize: 24 },
  planDetailView: {
    marginHorizontal: 15,
    paddingVertical: 20,
    paddingHorizontal: 5,
    borderBottomWidth: 0.3,
    borderBottomColor: CPColors.white,
  },
  planTitle: { color: CPColors.white, fontFamily: CPFonts.bold, fontSize: 24 },
  planDetailText: {
    color: CPColors.lightwhite,
    fontFamily: CPFonts.medium,
    fontSize: 12,
    marginTop: 10,
  },
  listStyle: { marginBottom: 10, marginTop: 10 },
  listViewStyle: { flexDirection: "row", marginTop: 10 },
  listSymbolStyle: {
    width: 10,
    marginTop: 4,
    marginLeft: 15,
    height: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: CPColors.lightPrimary,
    borderColor: CPColors.lightBorderPrimary,
  },
  listTitleStyle: { flex: 1, color: CPColors.white, marginHorizontal: 15 },
  planBtnStyle: {
    marginHorizontal: 20,
    width: "90%",
    height: 45,
    marginBottom: 15,
    borderRadius: 10,
  },
  absoluteView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 100,
    right: 20,
  },
  statusView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  dayCountText: {
    fontFamily: CPFonts.bold,
    fontSize: 21,
    color: CPColors.white,
  },
  leftDayTxtStyle: {
    fontFamily: CPFonts.medium,
    fontSize: 13,
    color: CPColors.white,
  },
});
