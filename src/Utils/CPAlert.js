import { Alert } from "react-native"


export function showDialogue(message,arrayButtons,title = "Cookpals", okButtonHandler = () => {

}, style) {
    let arrayButtonsToShow = (arrayButtons || []).concat([{"text":"Ok", onPress: okButtonHandler, style: style}])

    Alert.alert(
        title,
        message,
        arrayButtonsToShow,
        { cancelable: false }
      )
}