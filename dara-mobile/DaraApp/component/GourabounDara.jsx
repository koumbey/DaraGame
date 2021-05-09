import React from 'react'
import {Dimensions, View} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Proptypes from "prop-types";
import Cell from "../js/gameRules/Cell";

class GourabounDara extends React.Component{
    static propTypes={
        top: Proptypes.number,
        left: Proptypes.number
    };
    static defaultProps={
        top: 0
    }

    render() {
        let grid = [1, 2, 3, 4, 5].map(i => new Array(6).fill(0))
        let shadow = {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 10,
            },
            shadowOpacity: 0.51,
            shadowRadius: 13.16,
            elevation: 20
        }
        let gridStyle = {
            top: this.props.top,
            borderStyle: "solid",
            flexDirection: "column",
            marginLeft: 60,
            marginRight:46,
            height: 250,
            marginTop:10, ...shadow
        }
        return (<View style={gridStyle}>
            {grid.map((row, idx)=>{
                return(<View key={idx} style={{flexDirection: "row"}}>
                    {row.map(function (item, idy) {
                        return(<LinearGradient
                                key={idy}
                                colors={[ 'beige', 'sandybrown']}
                                angle={-45}
                            >
                                <View style={{borderWidth:3, borderStyle: "solid", height:50, width: 50, borderColor: "green"}}></View>
                            </LinearGradient>
                        )
                    })}
                </View>)
            })}
        </View>)
    }


}

export {
    GourabounDara
}
