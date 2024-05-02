import React from "react";
import {
  View,
  Animated,
  Easing,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import PropTypes from "prop-types";
import { Icon } from "react-native-elements";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import { widthPercentageToDP } from "react-native-responsive-screen";
// import Svg, { Path } from "react-native-svg";

class CPSearchAnimationComponent extends React.Component {
  state = {
    width: 0,
    textInputAnimated: new Animated.Value(0),
    parentViewWidthAnimated: new Animated.Value(this.props.height),
    isScaled: false,
  };

  componentDidMount() {
    this.open();
  }

  //Get parent width value
  onLayout = (e) => {
    const { width } = e.nativeEvent.layout;
    this.setState({ width: widthPercentageToDP(75) });
  };

  //Search icon
  searchIcon = () => {
    const { searchIconSize, searchIconColor } = this.props;
    return (
      <View style={styles.rightComponentStyle}>
        <Pressable onPress={this.open} style={styles.rightComponentPress}>
          <Icon
            type={"material-icons"}
            name={"search"}
            color={CPColors.secondary}
            style={{ margin: 5 }}
          />
        </Pressable>
      </View>
    );
  };

  //Close icon
  closeIcon = () => {
    const { searchIconSize, searchIconColor } = this.props;
    return (
      <Icon
        type={"material-icons"}
        name={"close"}
        color={CPColors.secondary}
        size={16}
        style={{ margin: 5 }}
      />
    );
  };

  //Animation start - open effect
  open = () => {
    const { focusAfterOpened, animationSpeed, onOpened, onOpening } =
      this.props;
    onOpening && onOpening();

    Animated.timing(this.state.textInputAnimated, {
      toValue: 1,
      duration: animationSpeed[0],
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        this.setState({ isScaled: true }, () => {
          Animated.timing(this.state.parentViewWidthAnimated, {
            toValue: this.state.width,
            duration: animationSpeed[1],
            easing: Easing.linear,
            useNativeDriver: false,
          }).start(() => {
            onOpened && onOpened();
            if (focusAfterOpened) this.refTextInput.focus();
          });
        });
      }, 125);
    });
  };

  //Animation start - close effect
  close = () => {
    const { animationSpeed, onClosed, onClosing, onChangeText } = this.props;
    onClosing && onClosing();

    Animated.timing(this.state.parentViewWidthAnimated, {
      toValue: this.props.height,
      duration: animationSpeed[1],
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      this.setState({ isScaled: false }, () => {
        Animated.timing(this.state.textInputAnimated, {
          toValue: 0,
          duration: animationSpeed[0],
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(() => {
          onChangeText && onChangeText("");
          onClosed && onClosed();
        });
      });

      //   setTimeout(() => {

      //   }, 0);
    });
  };

  render() {
    const {
      height,
      borderRadius,
      fontSize,
      backgroundColor,
      placeholderTextColor,
      shadowColor,
      placeholder,
    } = this.props;

    return (
      <View onLayout={this.onLayout} styles={styles.container}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              transform: [
                { scaleX: this.state.textInputAnimated },
                { scaleY: this.state.textInputAnimated },
              ],
              opacity: this.state.textInputAnimated,
              width: this.state.parentViewWidthAnimated,
            },
          ]}
        >
          <TextInput
            {...this.props}
            ref={(ref) => (this.refTextInput = ref)}
            placeholderTextColor={
              this.state.isScaled ? placeholderTextColor : "transparent"
            }
            value={this.props.value}
            onChangeText={this.props.onChangeText}
            placeholder={placeholder}
            style={[
              styles.searchInput,
              {
                shadowColor: shadowColor,
                backgroundColor: backgroundColor,
                height: height,
                borderRadius: borderRadius,
                fontSize: fontSize,
                paddingRight: 40,
                paddingLeft: 20,
              },
            ]}
          />

          {this.state.isScaled ? (
            <TouchableOpacity
              onPress={this.close}
              style={[
                styles.inputSearchIcon,
                { width: height, height: height },
              ]}
            >
              {this.closeIcon()}
            </TouchableOpacity>
          ) : null}
        </Animated.View>

        {this.state.isScaled ? null : (
          <TouchableOpacity
            onPress={this.open}
            style={[
              styles.inputClosedSearchIcon,
              { width: height, height: height },
            ]}
          >
            {this.searchIcon()}
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    right: 26,
  },
  animatedContainer: {
    marginRight: 24,
  },
  searchInput: {
    // shadowOffset: { width: 0, height: 10 },
    // shadowOpacity: 1,
    // shadowRadius: 12,
    fontFamily: CPFonts.regular,
    color: CPColors.secondary,
  },
  inputSearchIcon: {
    position: "absolute",
    right: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputClosedSearchIcon: {
    position: "absolute",
    right: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rightComponentStyle: { alignItems: "center" },
  rightComponentPress: {
    backgroundColor: CPColors.dropdownColor,
    borderRadius: 10,
  },
});

CPSearchAnimationComponent.defaultProps = {
  height: 36,
  borderRadius: 5,
  searchIconColor: "#172774",
  searchIconSize: 20,
  focusAfterOpened: false,
  placeholderTextColor: "rgba(23, 39, 116, 0.3)",
  fontSize: 12,
  backgroundColor: "#F5F6FF",
  shadowColor: "rgba(0,0,0,0.12)",
  animationSpeed: [0, 150],
};

CPSearchAnimationComponent.propTypes = {
  height: PropTypes.number,
  borderRadius: PropTypes.number,
  fontSize: PropTypes.number,
  backgroundColor: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  searchIconSize: PropTypes.number,
  searchIconColor: PropTypes.string,
  focusAfterOpened: PropTypes.bool,
  shadowColor: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  animationSpeed: PropTypes.array,
  onOpened: PropTypes.func,
  onClosed: PropTypes.func,
  onOpening: PropTypes.func,
  onClosing: PropTypes.func,
};

export default CPSearchAnimationComponent;
