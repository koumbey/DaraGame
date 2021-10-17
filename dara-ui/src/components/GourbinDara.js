import React from 'react'
import Proptypes from 'prop-types'
import pierreJeton from '../images/pierreJeton.svg';
import tigeJeton from '../images/tigeJetons.svg'
const {GridCell} = require( "../gameRules/GridCell");

const cellTypeLogo={
    [GridCell.ValueEnum.TIGE]: tigeJeton,
    [GridCell.ValueEnum.PIERRE]: pierreJeton
};

class GourbinDara extends React.Component{


    static propTypes ={
        stoneId: Proptypes.string.isRequired,
        stoneType: Proptypes.oneOf(Object.values(GridCell.ValueEnum)).isRequired,
        onDragStart: Proptypes.func,
        onDrop: Proptypes.func,
        onMouseEnter: Proptypes.func,
        stateClassName :Proptypes.string.isRequired,
        col: Proptypes.number,
        row: Proptypes.number
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
        let cellInfo = this.props.stoneId.split("-");
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
        let Logo = cellTypeLogo[this.props.stoneType];
        return (
            <div id={this.props.stoneId+"-container"}
                 className={this.state.stateClassName}
                 key={this.props.key}
                 onDrop={this.handleDrop}
                 onDragOver={this.handleMouseEnter}
                 onDragLeave={this.onDragLeave}
                 style={{"grid-column": this.props.col, "grid-row": this.props.row}}
            >
                {Logo &&
                <img
                    id={this.props.stoneId}
                    src={Logo}
                    className="Cell-logo"
                    alt={this.props.stoneType}
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
