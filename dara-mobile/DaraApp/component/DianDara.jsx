import React from 'react';
import Proptypes from 'prop-types'
import {GourbinDara} from "./GourbinDara";
import {View} from "react-native";
import Cell from "../js/gameRules/Cell";

class DianDara extends React.Component{
    static propTypes={
        onDragStart: Proptypes.func,
        onDrop: Proptypes.func,
        jetonType: Proptypes.oneOf(Object.values(Cell.ValueEnum)).isRequired,
        startY: Proptypes.number
    };

    render(){
        let grid = [1, 2].map(i => new Array(6).fill(0))
        let jetonType = this.props.jetonType
        let posy = this.props.startY || 0
        return (
            grid.map(function(row, idx){
                return(<View key={idx} style={{flexDirection: "row"}}>
                    {row.map(function (item, idy) {
                        return(<GourbinDara
                                key={idy}
                                jetonType={jetonType}
                                stateClassName={"ddd"}
                                posY={posy+(42*idx)+10}
                                posX={42*(idy+1)+30}
                            />
                        )
                    })}
                </View>)
            })
        )
    }
}

export {
    DianDara
}
