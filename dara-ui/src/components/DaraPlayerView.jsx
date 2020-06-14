import React from 'react'
import Proptypes from "prop-types";
import MainGame from "../gameRules/MainGame";
import {DianDara} from "./DianDara";


export default class DaraPlayerView extends React.Component{
    static propTypes = {
        name: Proptypes.string,
        start: Proptypes.bool,
        jeton : Proptypes.string,
        type: Proptypes.oneOf([MainGame.PlayerType.COMPUTER, MainGame.PlayerType.HUMAN])
    };

    constructor(props) {
        super(props);

    }


    render() {
       return (<div className={"col-lg-3"} style={{marginTop:"10px", marginBottom:"10px"}}>
            <DianDara
                cellsState={this.state[MainGame.playerId.PLAYER]}
                onDrop={this.onDrop}
                onDragStart={this.onDragStart}
                playerName={this.props.player.name}
                playerPoint={this.state.playerPoint}
            />
        </div>)
    }
}