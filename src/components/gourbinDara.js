import React from 'react'
import Proptypes from 'prop-types'
import pierreJeton from '../images/pierreJeton.svg';
import tigeJeton from '../images/tigeJetons.svg'
import Cell from "../gameRules/Cell";

const cellTypeLogo={
    [Cell.ValueEnum.TIGE]: tigeJeton,
    [Cell.ValueEnum.PIERRE]: pierreJeton
};

class GourbinDara extends React.Component{
    constructor(props){
        super(props);
       this.allDrop = this.allDrop.bind(this);
    }

    static propTypes ={
        jetonId: Proptypes.string.isRequired,
        jetonType: Proptypes.oneOf(Object.values(Cell.ValueEnum)).isRequired,
        onDragStart: Proptypes.func,
        onDrop: Proptypes.func
    };

    allDrop(event){
        event.preventDefault();
    }

    render(){
        let Logo = cellTypeLogo[this.props.jetonType];
        return (
            <div id={this.props.jetonId+"-container"} style={{width:"100px", height:"100px", border:"3px solid"}} onDrop={this.props.onDrop} onDragOver={this.allDrop}>
                {Logo &&
                <img
                    id={this.props.jetonId}
                    src={Logo}
                    className="Cell-logo"
                    alt={this.props.jetonType}
                    onDrag={this.props.onDragStart}
                    draggable={true}/>
                }
            </div>
        );
    }
}

export {
    GourbinDara
}