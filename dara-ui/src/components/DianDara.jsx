import React from 'react';
import Proptypes from 'prop-types'
import {GourbinDara} from "./GourbinDara";
import Badge from "@material-ui/core/Badge";
import {ListItem} from "@material-ui/core";

class DianDara extends React.Component{
    constructor(props){
        super(props);
        this.createTable = this.createTable.bind(this)
    }

    static propTypes={
        player: Proptypes.shape({
            name: Proptypes.string.isRequired,
            tour: Proptypes.bool.isRequired,
            point: Proptypes.number.isRequired,
            stoneType: Proptypes.string,
            stoneInGame: Proptypes.number.isRequired,
            mobileStones: Proptypes.number.isRequired,
            availablePlaces: Proptypes.number.isRequired
        }).isRequired,
        onDragStart: Proptypes.func,
        onDrop: Proptypes.func,
        cellsState:Proptypes.arrayOf(Proptypes.arrayOf(Proptypes.object))
    };


    createTable(){
        let onDrag = this.props.onDragStart;
        let onDrop = this.props.onDrop;
        return (
            <div>
            {this.props.cellsState.map(function (row, idx) {
                let size = 2*(4 - row.length);
                return(<div className="row" key={idx} style={{marginLeft: size+"vw"}}>
                    {row.map(function (item, idy) {
                        let id = 'out-' + item.state+ "-" +item.pos;
                        return(
                            <GourbinDara
                                stoneType={item.state}
                                stoneId={id}
                                onDragStart={onDrag}
                                onDrop={onDrop}
                                stateClassName="out-game"
                                key={idy}
                            />
                        )
                    })}
                </div>)
            })}
            </div>
        )
    }

    render(){
        const className = "jumbotron" +((this.props.player.tour)?" player-tour":"")
        return <div className="container" >
            <div className={className}>
                <ListItem>
                    <Badge badgeContent={this.props.player.point} showZero={true} color="primary">
                        <h5><span> Point </span></h5>
                    </Badge>
                </ListItem>
                <ListItem>
                    <Badge badgeContent={this.props.player.availablePlaces} showZero={true} color="primary">
                        <span> Cases disponibles </span>
                    </Badge>
                </ListItem>
                <ListItem>
                    <Badge badgeContent={this.props.player.mobileStones} showZero={true} color="primary">
                        <span> Jetons mobiles </span>
                    </Badge>
                </ListItem>
                <ListItem>
                    <Badge badgeContent={this.props.player.stoneInGame} showZero={true} color="primary">
                        <span> Jetons en jeux </span>
                    </Badge>
                </ListItem>
            </div>
            <div className="jumbotron">
                {this.createTable()}
            </div>
        </div>
    }
}

export {
    DianDara
}
