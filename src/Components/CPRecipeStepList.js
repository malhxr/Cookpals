import React, { useRef } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import DashedLine from 'react-native-dashed-line';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Assets from '../Assets';
import CPColors from '../Utils/CPColors';
import CPFonts from '../Utils/CPFonts';
import CPImageComponent from './CPImageComponent';

const CPRecipeStepList = (props) => {

    const viewRef = useRef(null)

    const renderRecipeStep = ({ item, index }) => {
        return (
            <View style={style.recipeView}>

                <View style={style.stepView}>
                    <View
                        style={style.stepSymbol}
                    />
                    
                    <DashedLine axis='vertical' style={{ width: 1, flex: 1}} dashColor={CPColors.textInputColor} dashLength={5} />
                </View>
                <View style={style.container}>
                    <Text style={style.stepTxt}>{"Step " + (index + 1)}</Text>
                    {/* <CPImageComponent
                        style={style.imageStyle}
                        source={item.image}
                    /> */}
                    
                    <Text style={style.descriptionStyle}>{item.steps_description}</Text>
                </View>
            </View>
        )
    }
    return (
        <FlatList
            data={props.data ?? []}
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => {
                return (
                    <View style={{backgroundColor: CPColors.white}}>
                    <Text style={style.titleStyle}>{props.title}</Text>
                    </View>
                )
            }}
            renderItem={renderRecipeStep}
        />
    );
};

export default CPRecipeStepList;

const style = StyleSheet.create({
    titleStyle: { fontSize: 16, fontFamily: CPFonts.semiBold, color: CPColors.secondary, marginTop: 20, marginBottom: 10 },
    recipeView: { flexDirection: 'row' },
    stepView: { position: 'absolute', top: 2, bottom: 0, left: 0, alignItems: 'center' },
    stepSymbol: { width: 15, height: 15, borderRadius: 15, borderWidth: 3, borderColor: CPColors.primary },
    container: { paddingBottom: 20, marginLeft: 30 },
    stepTxt: { fontFamily: CPFonts.semiBold, fontSize: 14, color: CPColors.secondary },
    descriptionStyle: {fontFamily: CPFonts.regular, color: CPColors.secondaryLight, fontSize:14},
    imageStyle: { flex:1, marginVertical: 20, height: 145 }
})