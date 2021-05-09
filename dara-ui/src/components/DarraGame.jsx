import React from 'react';
import Proptypes from 'prop-types'
import {DianDara} from "./DianDara";
import {GourabounDara} from "./GourabounDara";
import Popup from 'react-popup';
import MainGame from "../gameRules/MainGame";
import AppBar from "@material-ui/core/AppBar";
import logo from "../images/haussaLogo.svg";
import Button from "@material-ui/core/Button";
import LoginPopup from "../popups/LoginPopup";
import AccountCircle from "@material-ui/icons/AccountCircle"


class DarraGame extends React.Component{
    constructor(props) {
        super(props);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.afterComputerPlayed = this.afterComputerPlayed.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.gameInfo = new MainGame(this.props.player, this.props.opponent);
        this.drapInfo = {IsEmpty: true};
        this.state = this.gameInfo.getGameStates();
    }

    static propTypes={
        player: Proptypes.shape({
            name: Proptypes.string,
            start: Proptypes.bool,
            jeton : Proptypes.string,
            type: Proptypes.oneOf([MainGame.PlayerType.COMPUTER, MainGame.PlayerType.HUMAN]),
            score: Proptypes.string
        }),
        opponent: Proptypes.shape({
            name: Proptypes.string,
            start: Proptypes.bool,
            jeton : Proptypes.string,
            type: Proptypes.oneOf([MainGame.PlayerType.COMPUTER, MainGame.PlayerType.HUMAN])
        })
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
     return (
         <div className="game-page">
             <AppBar position="static" style={{backgroundColor: "green"}}>
                 <div className="row">
                     <div className="col-lg-4">
                         <img src={logo} className="App-logo" alt="logo"/>
                         <img src={logo} className="App-logo" alt="logo"/>
                         <img src={logo} className="App-logo" alt="logo"/>
                     </div>
                     <div className="col-lg-4">
                                <span  style={{fontSize: "40px", fontWeight: "bold" , marginLeft:"20px", marginRight: "20px" , marginTop: "10px"}}>
                                WASAN DARA HAUSAWA
                            </span>
                     </div>
                     <div className="col-lg-4">
                         <Button style={{color:"white",fontSize: "20px", fontWeight: "bold" , marginLeft:"20px", marginRight: "20px" , marginTop: "10px"}}>
                             <AccountCircle style={{fontSize:"40px"}}/> {this.props.player.name}
                         </Button>
                         <Button style={{color:"white",fontSize: "20px", fontWeight: "bold" , marginLeft:"20px", marginRight: "20px" , marginTop: "10px"}}
                                 onClick={LoginPopup.show}>
                             <AccountCircle style={{fontSize:"40px"}}/> Hutar dan kanka
                         </Button>
                     </div>
                 </div>
             </AppBar>
             <div style={{marginRight: "50px", marginLeft: "50px"}}>
                <div className={"row"}>
                    <div className={"col-lg-4"} style={{marginTop:"10px", marginBottom:"10px"}}>
                        <DianDara
                            cellsState={this.state[MainGame.playerId.PLAYER]}
                            onDrop={this.onDrop}
                            onDragStart={this.onDragStart}
                            playerName={this.props.player.name}
                            playerPoint={this.state.playerPoint}
                        />
                    </div>
                    <div className={"col-lg-4"} style={{marginTop:"10px", marginBottom:"10px"}}>
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
                    <div className={"col-lg-4"}  style={{marginTop:"10px", marginBottom:"10px"}}>
                        <DianDara
                            cellsState={this.state[MainGame.playerId.OPPONENT]}
                            onDrop={this.onDrop}
                            onDragStart={this.onDragStart}
                            playerName={this.props.opponent.name}
                            playerPoint={this.state.opponentPoint}
                        />
                    </div>
                </div>
            </div>
         </div>)
    }

}

export default DarraGame;