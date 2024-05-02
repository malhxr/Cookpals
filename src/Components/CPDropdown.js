import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Icon } from "react-native-elements";
import { log } from "react-native-reanimated";
import { SvgUri } from "react-native-svg";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";

const CPDropdown = (props) => {
  const [isOpen, setOpen] = useState(false);
  // const [isOpen, setOpen] = useState(false);

  const [value, setValue] = useState(props.selectedvalue ?? []);
  const [items, setItems] = useState([]);
  const [country, setCountry] = useState("");
  const onOpenHandler = () => {
    setOpen(!isOpen);
  };

  const onChangeHandler = (item) => {
    console.log(item.name, 'dddddd');
    setCountry(item.name);
    if (props.multiple) {
      if (isValueSelected(item.id)) {
        setValue(value.filter((items) => items !== item.id));
        props.onChangeValue(value.filter((items) => items !== item.id));
      } else {
        setValue((oldValue) => [...oldValue, item.id]);
        props.onChangeValue([...value, item.id]);
      }
    } else {
      setValue([item.id]);
      setOpen(false);
      props.onChangeValue([item.id]);
    }
  };

  const removeItemHandler = (item) => {
    setValue(value.filter((items) => items !== item));
    if (props.onRemoveItem != undefined) {
      props.onRemoveItem(value.filter((items) => items !== item))
    }
  };

  const isValueSelected = (item) => {
    return value.some((items) => items == item);
  };

  const returnName = (id) => {
    return props?.data.filter((item) => item.id == id).map((item) => item.name);
  };
  //   console.log('value in cpDropdown:::::', value);
  return (
    <>
      <View style={[style.container, props.containerStyle]}>
        <View>
          <Text style={style.titleStyle}>{props.title}</Text>
          <Pressable
            style={[
              style.pressTouch,
              {
                borderColor: isOpen
                  ? CPColors.borderColor
                  : CPColors.textInputColor,
              },
              props.style,
            ]}
            onPress={onOpenHandler}
          >
            {props.multiple || value.length == 0 ? null : (
              <SvgUri
                style={{ marginRight: 10 }}
                width={25}
                height={25}
                uri={value[0]?.image}
              />
            )}
            <Text style={style.selectedTextStyle}>
              {value.length == 0
                ? "Select"
                : props.multiple
                  ? value.length + " Selected"
                  : returnName(value[0])}
            </Text>
            <Icon
              type={"ionicon"}
              name={isOpen ? "caret-up" : "caret-down"}
              color={CPColors.borderColor}
              style={{ marginHorizontal: 5 }}
            />
          </Pressable>
          {props.error && (
            <Text
              style={{
                fontSize: 12,
                color: CPColors.red,
                fontFamily: CPFonts.medium,
                marginVertical: 5,
                marginLeft:5
              }}
            >
              {props.error}
            </Text>
          )}
          {props.multiple && value.length !== 0 && (
            <View style={style.multipleViewStyle}>
              {value.map((item) => {

                return (
                  <Pressable style={style.multipleTouchStyle}
                    onPress={() => { removeItemHandler(item) }}>
                    <Text style={style.multipleItemText}>
                      {returnName(item)}
                    </Text>
                    <Icon
                      type={"material-icons"}
                      name={"cancel"}
                      size={15}
                      color={CPColors.primary}
                      style={{ marginLeft: 5 }}
                    />
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
        {isOpen && (
          <View style={style.dropDownList}>
            {props?.data && props?.data.length !== 0 ? (
              <ScrollView nestedScrollEnabled={true}>
                {props?.data.map((item, index) => {
                  return (
                    <Pressable
                      style={style.listItemTouchStyle}
                      onPress={() => onChangeHandler(item)}
                    >
                      {props.multiple ? (
                        <Icon
                          type={"material-icons"}
                          name={
                            isValueSelected(item.id)
                              ? "check-box"
                              : "check-box-outline-blank"
                          }
                          color={CPColors.secondary}
                          style={{ marginLeft: 5 }}
                        />
                      ) : (
                        <SvgUri width={40} height={40} uri={item.image} />
                      )}
                      <Text
                        style={
                          country === item.name
                            ? style.listItemStyle1
                            : style.listItemStyle
                        }
                      >
                        {item.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              <Text style={style.noDataText}>{"No data available"}</Text>
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default CPDropdown;

const style = StyleSheet.create({
  container: { marginTop: 10 },
  dropDownList: {
    // flex: 1,
    paddingBottom: 10,
    maxHeight: 200,
    minHeight: 30,
    padding: 5,
    backgroundColor: CPColors.dropdownColor,
    overflow: "hidden",
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 2,
  },
  titleStyle: {
    fontFamily: CPFonts.semiBold,
    fontSize: 14,
    marginVertical: 10,
    color: CPColors.secondary,
  },
  pressTouch: {
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
  },
  selectedTextStyle: { flex: 1, color: CPColors.secondary },
  multipleViewStyle: {
    flexDirection: "row",
    marginHorizontal: 5,
    marginTop: 10,
    flexWrap: "wrap",
  },
  multipleTouchStyle: {
    flexDirection: "row",
    padding: 5,
    margin: 5,
    borderRadius: 10,
    backgroundColor: CPColors.dropdownColor,
    alignItems: "center",
  },
  multipleItemText: { fontFamily: CPFonts.regular, fontSize: 11 },
  listItemTouchStyle: { flexDirection: "row", alignItems: "center" },
  listItemStyle: { padding: 10, color: CPColors.secondary },
  listItemStyle1: { padding: 10, color: CPColors.red },
  noDataText: {
    flex: 1,
    textAlign: "center",
    color: CPColors.secondary,
    alignSelf: "center",
  },
});