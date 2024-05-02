import React, { useRef, useEffect } from "react";
import { Modal, View } from "react-native";
import LottieView from "lottie-react-native";

const CPLoader = (props) => {
  const lottieRef = useRef(null);

  useEffect(() => {
    lottieRef.current.play();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LottieView
        ref={lottieRef}
        style={{ position: "absolute", zIndex: 99999, width: 80, height: 80 }}
        source={require("../Assets/Loader/Coockpals_Loader_pink.json")}
      />
    </View>
  );
};

export default CPLoader;
