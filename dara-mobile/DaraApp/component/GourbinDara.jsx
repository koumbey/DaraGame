import React from 'react'
import Proptypes from 'prop-types'
import pierreJeton from '../images/pierreJeton.svg';
import tigeJeton from '../images/tigeJetons.svg'
import Cell from "../js/gameRules/Cell";
import Draggable from 'react-native-draggable';
import {View} from 'react-native';
import HaussaLogo from '../images/haussaLogo.svg';

const cellTypeLogo={
    [Cell.ValueEnum.TIGE]: tigeJeton,
    [Cell.ValueEnum.PIERRE]: pierreJeton
};

class GourbinDara extends React.Component{

    static propTypes ={
        jetonType: Proptypes.oneOf(Object.values(Cell.ValueEnum)).isRequired,
        onDragStart: Proptypes.func,
        onDrop: Proptypes.func,
        onMouseEnter: Proptypes.func,
        stateClassName :Proptypes.string.isRequired,
        posY: Proptypes.number,
        posX: Proptypes.number
    };


    constructor(props){
        super(props);
        this.state = {
            stateClassName: this.props.stateClassName
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    handleMouseEnter(event){
        event.preventDefault();
        let cellInfo = this.props.jetonId.split("-");
        if(typeof this.props.onMouseEnter === "function"){
            let styleClass = this.props.onMouseEnter(parseInt(cellInfo[2],10));
            if(styleClass && styleClass.change) {
                this.setState({stateClassName: styleClass.className});
            }
        }
    }

    handleDrop(event){
        event.preventDefault();
        if(typeof this.props.onDrop === "function"){
            this.props.onDrop(event);
            this.setState({stateClassName: this.props.stateClassName})
        }
    }

    onDragLeave(event){
        event.preventDefault();
        this.setState({stateClassName: this.props.stateClassName});
    }

    render(){
        let Logo = cellTypeLogo[this.props.jetonType];
        let h = (this.props.jetonType === Cell.ValueEnum.TIGE)?140:40
        let w = (this.props.jetonType === Cell.ValueEnum.TIGE)?140:40
        return (
            <Draggable
                x={this.props.posX}
                y={this.props.posY}
                onLongPress={()=>console.log('long press')}
                onShortPressRelease={()=>console.log('press drag')}
                onPressIn={()=>console.log('in press')}
                onPressOut={()=>console.log('out press')}
                z={100}
                >
                <View><Logo height={h} width={w}/></View>
            </Draggable>
        );
    }
}


export {
    GourbinDara
}
