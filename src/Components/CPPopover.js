import React, { useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";

const CPPopover = (props) => {
  const [value, setValue] = useState("Wgt");
  const [stop, setStop] = useState(false);

  console.log("PROPS.DATA ::::: ", props);

  const onChangeHandler = (item) => {
    console.log("ITEMPOPOVER", item);
    props.onChangeWeightHandler(item);
    setValue(item.name);
    setStop(false);
  };

  return (
    <Popover
      isVisible={stop}
      placement={PopoverPlacement.BOTTOM}
      arrowStyle={{ backgroundColor: "transparent" }}
      backgroundStyle={{ opacity: 0 }}
      popoverStyle={{
        paddingVertical: 10,
        width: 75,
        backgroundColor: CPColors.dropdownColor,
        overflow: "hidden",
        borderRadius: 10,
        marginTop: -30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 2,
      }}
      from={
        <TouchableOpacity
          onPress={() => setStop(!stop)}
          style={[
            style.inputViewStyle,
            {
              flex: 1,
              marginRight: 15,
              alignItems: "center",
              justifyContent: "center",
              height: 40,
            },
          ]}
        >
          <Text
            style={[
              style.inputStyle,
              {
                color:
                  value === "Wgt"
                    ? CPColors.secondaryLight
                    : CPColors.secondary,
              },
            ]}
          >
            {value}
          </Text>
        </TouchableOpacity>
      }
    >
      <ScrollView nestedScrollEnabled={true}>
        {props.data?.map((item, id) => (
          <Pressable
            key={id}
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => onChangeHandler(item)}
          >
            <Text
              numberOfLines={1}
              style={{
                padding: 10,
                color: CPColors.secondary,
              }}
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </Popover>
  );
};

const style = StyleSheet.create({
  inputViewStyle: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: CPColors.textInputColor,
    borderRadius: 10,
  },

  inputStyle: {
    flex: Platform.OS === 'ios' ? 1 : 0,
    fontSize: 14,
    fontFamily: CPFonts.regular,
    marginBottom: Platform.OS === 'android' ? 3 : 0,
    color: CPColors.secondary,
  },
});

export default CPPopover;
