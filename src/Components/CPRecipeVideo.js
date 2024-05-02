import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DashedLine from "react-native-dashed-line";
import Video from "react-native-video";
import VideoPlayers from "react-native-video-players";
import Assets from "../Assets";
import CPColors from "../Utils/CPColors";
import CPFonts from "../Utils/CPFonts";
import CPVideoPlayerComponent from "./CPVideoPlayerComponent";

const CPRecipeVideo = (props) => {
  const useReff = useRef(null);
  const [selectedVideo, setSelected] = useState();

  console.log("SELECTED ::::: ", props.data);
  return (
    <FlatList
      data={props.data ?? [1, 2, 3]}
      stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => {
        return (
          <View key={index} style={{}}>
            <View style={style.stepViewStyle}>
              <View style={style.dashViewStyle} />

              <DashedLine
                axis="vertical"
                style={{ width: 1, flex: 2 == index ? 0.7 : 1 }}
                dashColor={CPColors.textInputColor}
                dashLength={5}
              />
            </View>
            <View style={style.recipeView}>
              <Text style={style.stepText}>{"Step " + (index + 1)}</Text>
              {/* <Video
                                ref={useReff}
                                // controls
                                // fullscreen={true}
                                paused={selectedVideo !== index}
                                // paused
                                resizeMode='contain'
                                source={{uri: 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4'}}
                                // onEnd={()=>{
                                //     console.log("END :: ");
                                //     setSelected()
                                // }}
                                style={{
                                    height: 150,
                                    width: '100%',
                                    marginVertical:20
                                }}
                                onPlaybackRateChange={(value) => {
                                    console.log("onPlaybackRateChange ::::::: ", value);
                                    if (value.playbackRate) {
                                        setSelected(index)
                                    }
                                }}
                            /> */}

              <CPVideoPlayerComponent
                source={item.stepvideo}
                // onSelectImageData={(data) => onChangeVideo(data, index)}
                playerStyle={{
                  height: 150,
                  width: "100%",
                  marginVertical: 20,
                }}
              />
              {/* <VideoPlayer
                                source={require('./theVideo.mp4')}
                                showOnStart={false}
                                onPlay={() => {
                                    console.log("onPlay ::::: ");
                                }}
                                onShowControls={() => {
                                    console.log("onShowControls ::::: ");
                                }}
                                toggleResizeModeOnFullscreen
                            //   navigator={<Video />}
                            /> */}
              {selectedVideo !== index ? (
                <Pressable
                  style={style.playPressStyle}
                  onPress={() => {
                    setSelected(index);
                  }}
                >
                  <Image source={Assets.play_icon} />
                </Pressable>
              ) : null}
            </View>
          </View>
        );
      }}
      ListHeaderComponent={() => {
        return (
          <View style={style.headerStyle}>
            <Text style={style.itemHeaderTxt}>{props.title}</Text>
          </View>
        );
      }}
    />
    // <ScrollView style={{}}>
    //     {.map((item, index) => {
    //         return (

    //         )
    //     })}
    // </ScrollView>
  );
};

export default CPRecipeVideo;

const style = StyleSheet.create({
  stepViewStyle: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
  },
  dashViewStyle: {
    width: 15,
    height: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: CPColors.primary,
  },
  recipeView: { marginLeft: 30, paddingBottom: 20 },
  stepText: {
    fontFamily: CPFonts.semiBold,
    fontSize: 14,
    color: CPColors.secondary,
  },
  playPressStyle: { position: "absolute", alignSelf: "center", top: 90 },
  itemHeaderTxt: {
    fontSize: 16,
    fontFamily: CPFonts.semiBold,
    color: CPColors.secondary,
    marginTop: 20,
    marginBottom: 10,
  },
  headerStyle: { backgroundColor: CPColors.white },
});
