import React from 'react';
import Proptypes from 'prop-types'
import {DianDara} from "./dianDara";
import {GourabounDara} from "./gourabounDara";
import Popup from 'react-popup';
import Cell from "../gameRules/Cell";
import MainGame from "../gameRules/MainGame";


class DarraGame extends React.Component{
    constructor(props) {
        super(props);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.afterComputerPlayed = this.afterComputerPlayed.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        let player1 = {jeton : Cell.ValueEnum.PIERRE, name: this.props.firstPlayer.playerName, start: this.props.firstPlayer.start};
        let player2 = {jeton : Cell.ValueEnum.TIGE,  name: this.props.secondPlayer.playerName, start: this.props.secondPlayer.start};
        //let player2 = {jeton : Cell.ValueEnum.TIGE,  type: MainGame.PlayerType.COMPUTER, start: this.props.secondPlayer.start};

        this.gameInfo = new MainGame(player1, player2);
        this.drapInfo = {IsEmpty: true};
        this.state = this.gameInfo.getGameStates();
    }

    static propTypes={
        firstPlayer: Proptypes.shape({
            playerName: Proptypes.string,
            start: Proptypes.bool
        }),
        secondPlayer: Proptypes.shape({
            playerName: Proptypes.string,
            start: Proptypes.bool
        })
    };

    static defaultProps={
        firstPlayer: {
            playerName:"Issoufou",
            start: true
        },
        secondPlayer: {
            playerName:"Kanta",
            start: false
        }
    };

    static getDragDropInfo = function(id){
        let cellInfo = id.split("-");
        return {
            pos:parseInt(cellInfo[2],10),
            type: cellInfo[1],
            from: cellInfo[0]
        }
    };

    afterComputerPlayed(){
        let updateState = this.gameInfo.getGameStates();
        this.setState(updateState);
    }

    onMouseEnter(pos){
        if(this.dragInfo && !(this.dragInfo.IsEmpty)) {
            if (this.gameInfo.IsChangePossible(this.dragInfo, pos)) {
                return {change: true, className: "allowed"}
            } else {
                return {change: true, className: "not-allowed"}
            }
        }
        return {change: false};

    }
    onDragStart(event){
        event.preventDefault();
        if(event && event.target && event.target.id) {
            this.dragInfo = DarraGame.getDragDropInfo(event.target.id);
            this.dragInfo.IsEmpty = false;
        }
    }

    onDrop(event){
        if(event && event.target && event.target.id) {
            let dropInfo = DarraGame.getDragDropInfo(event.target.id);
            this.gameInfo.playGame(this.dragInfo, dropInfo);

        }
        if(this.gameInfo.isPartEnded()){
            let winner = this.gameInfo.getWinner();
            Popup.alert("Game ended. \nPlayer "+ winner.name + " win !!!");
            this.gameInfo.initialiseGameInfo();
    }
        let updateState = this.gameInfo.getGameStates();
        this.dragInfo = {IsEmpty: true};
        this.setState(updateState);
    }


    render(){
     return (<div className={"container"} style={{width:"85%",height: "800px" ,marginTop:"10px", border:"15px", borderStyle:"groove groove groove groove"}}>
            <div className={"row"}>
                <div className={"col-lg-3"} style={{marginTop:"10px", marginBottom:"10px"}}>
                    <DianDara
                        cellsState={this.state[MainGame.playerId.FIRST_PLAYER]}
                        onDrop={this.onDrop}
                        onDragStart={this.onDragStart}
                        playerName={this.props.firstPlayer.playerName}
                        playerPoint={this.state.point1}
                    />
                </div>
                <div className={"col-lg-6"} style={{marginTop:"10px", marginBottom:"10px"}}>
                    <GourabounDara
                        cellsState={this.state.gridStates}
                        onDrop={this.onDrop}
                        onDragStart={this.onDragStart}
                        onMouseEnter={this.onMouseEnter}
                        gameInfos={{
                            playerTour:this.state.playerTour,
                            winJeton:this.state.winJeton
                        }}
                    />
                </div>
                <div className={"col-lg-3"}  style={{marginTop:"10px", marginBottom:"10px"}}>
                    <DianDara
                        cellsState={this.state[MainGame.playerId.SECOND_PLAYER]}
                        onDrop={this.onDrop}
                        onDragStart={this.onDragStart}
                        playerName={this.props.secondPlayer.playerName}
                        playerPoint={this.state.point2}
                    />
                </div>
            </div>
        </div>)
    }

}

export default DarraGame;