import React, {Component} from 'react'
import {GourbinDara} from './component/GourbinDara'

import Cell from "./js/gameRules/Cell";
import {View} from 'react-native';

class ApplicationContainer extends Component{
    render() {
        return <View>
            <GourbinDara
                jetonId={"id="}
                jetonType={Cell.ValueEnum.PIERRE}
                stateClassName={"emppt"}
                posX={0}
                posY={0}
            />
        </View>

    }
}
export {
    ApplicationContainer
}
