import React, {Component} from 'react'
import {GourbinDara} from './component/GourbinDara'

import Cell from "./js/gameRules/Cell";
import {View} from 'react-native';
import {GourabounDara} from "./component/GourabounDara";
import {DianDara} from "./component/DianDara";

class ApplicationContainer extends Component{
    render() {
        return <View>
            <DianDara jetonType={Cell.ValueEnum.PIERRE}/>
            <GourabounDara top={100}/>
            <DianDara jetonType={Cell.ValueEnum.TIGE} startY={120}/>
        </View>
    }
}
export {
    ApplicationContainer
}
