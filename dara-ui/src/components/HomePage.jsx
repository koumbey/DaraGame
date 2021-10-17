import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import logo  from "../images/haussaLogo.svg"
import pierre from "../images/pierreJeton.svg"
import tige from "../images/tigeJetons.svg"
import AccountCircle from "@material-ui/icons/AccountCircle"
import Create from "@material-ui/icons/Create"
import Button from '@material-ui/core/Button';
import {GourabounDara} from "./GourabounDara";
import EndPartyPopup from "../popups/EndPartiePopup";
import LoginPopup from "../popups/LoginPopup";
import FindPlayer from "./FindPlayer";
import getStore from "../dynamicPopup/PopupStore";
import {DianDara} from "./DianDara";
import {ListItem} from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import {DaraSocket} from "../server/DaraApi";
import SubscribePopup from "../popups/SubscribePopup";
const {MainGame} = require("../gameRules/MainGame");
const {GridCell} = require("../gameRules/GridCell");
const {Grid} = require("../gameRules/Grid");


class HomePage extends React.Component{
    static show = function () {
        let popup_store = getStore();
        if (!popup_store.isRegistered("Login_Popup")){
            popup_store.register("Login_Popup", LoginPopup , "Sign in")
        }
        popup_store.show("Login_Popup")
    };

    static getDragDropInfo = function(id){
        let cellInfo = id.split("-");
        return {
            pos:parseInt(cellInfo[2],10),
            type: cellInfo[1],
            from: cellInfo[0]
        }
    };

    constructor(props){
        super(props);
        this.state = {
            isConnected: false,
            hasOpponent: false
        };

        this.afterLogin = this.afterLogin.bind(this);
        this.startGame =  this.startGame.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.initiatePart = this.initiatePart.bind(this)
    }

    componentDidMount() {
        DaraSocket.subscribe("play", this.onDrop)
        DaraSocket.subscribe("init", this.initiatePart)
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
            let dragInfo = HomePage.getDragDropInfo(event.target.id);
            if (dragInfo.type === this.state.player.stoneType || this.gameInfo.player.hasAlignedThree) {
                this.dragInfo =  dragInfo;
                this.dragInfo.IsEmpty = false;
            }
        }
    }

    onDrop(event){
        let isPlayed = false;
        if(event && event.target && event.target.id && this.dragInfo && !this.dragInfo.IsEmpty) {
            let dropInfo = HomePage.getDragDropInfo(event.target.id);
            isPlayed = this.gameInfo.playGame(this.dragInfo, dropInfo);
            if (isPlayed) DaraSocket.send(JSON.stringify({to:this.state.opponent.name, action:[this.dragInfo, dropInfo], topic: "play"}))

        }else if (event && event.action){
            let action = event.action;
            isPlayed = this.gameInfo.playGame(action[0], action[1]);
        }
        if (isPlayed) {
            let updateState = this.gameInfo.getGameStates();
            if (this.gameInfo.isPartEnded()) {
                let winner = this.gameInfo.getWinner();
                EndPartyPopup.show(
                    {name:this.gameInfo.player.name, IsWinner: this.gameInfo.player.IsWinner},
                    this.initiatePart
                )
                DaraSocket.send(JSON.stringify({to: this.state.opponent.name, topic: "init"}))
            }
            this.dragInfo = {IsEmpty: true};
            this.setState(updateState);
        }
    }

    initiatePart() {
        let updateState = this.gameInfo.getGameStates();
        this.gameInfo.initialiseGameInfo();
        let player = this.state.player;
        player.stoneType = this.gameInfo.getPlayerStoneByName(player.name);
        let opponent = this.state.opponent;
        opponent.stoneType = this.gameInfo.getPlayerStoneByName(opponent.name);
        updateState.player = player;
        updateState.opponent = opponent;
    }

    afterLogin(data){
        let connectedUser = {
            name: data.Pseudo,
            start: true,
            stoneType: GridCell.ValueEnum.PIERRE,
            type:MainGame.PlayerType.HUMAN
        };
        let opponent = {
            name: "?",
            start: false,
            stoneType: GridCell.ValueEnum.TIGE,
            type:MainGame.PlayerType.HUMAN
        };
        this.gameInfo = new MainGame(connectedUser, opponent);
        this.drapInfo = {IsEmpty: true};
        let newState = this.gameInfo.getGameStates();
        newState.isConnected = true;
        newState.player = connectedUser;
        newState.opponent = opponent;
        this.setState(newState);
        localStorage.setItem("token", data.token);
        return true
    }

    startGame(connectedUser, opponent){
        this.gameInfo = new MainGame(connectedUser, opponent);
        this.drapInfo = {IsEmpty: true};
        let newState = this.gameInfo.getGameStates();
        newState.isConnected = true;
        newState.player = connectedUser;
        newState.opponent = opponent;
        newState.hasOpponent = this;
        this.setState(newState);
        return true
    }

    rendUser(){
        if (this.state.isConnected && this.state.hasOpponent){
            let player = this.gameInfo.player
            return <div style={{marginRight: "5%", marginLeft: "5%"}}>
                <div className={"row"}>
                    <div className={"col-lg-6 square-box"}>
                        <GourabounDara
                            cellsState={this.state.gridStates}
                            onDrop={this.onDrop}
                            onDragStart={this.onDragStart}
                            onMouseEnter={this.onMouseEnter}
                            gameInfos={{
                                playerTour:this.state.playerTour,
                                winStone:this.state.winStone,
                                alignedStone:this.state.alignedStone
                            }}
                        />
                    </div>
                    <div className={"col-lg-3"}>
                        <DianDara
                            cellsState={this.state[player.id]}
                            onDrop={this.onDrop}
                            onDragStart={this.onDragStart}
                            player={{
                              name:player.name,
                              tour:player.tour,
                              point: player.point,
                              ...player.getGameStonesInfos()
                            }}
                        />
                    </div>
                </div>
            </div>
        }

    }

    renderPlayerFinder(){
        if (this.state.isConnected && ! this.state.hasOpponent){
            return <div style={{marginRight: "5%", marginLeft: "5%"}}>
                <div className={"row"}>
                    <div className={"col-lg-3"}>
                        <div className="jumbotron">
                            <ListItem>
                                <h5>
                                    <img style={{height:"30px"}} src={logo} className="App-logo" alt="logo"/>
                                    {" " + this.state.player.name + " "}
                                    <img style={{height:"30px"}} src={logo} className="App-logo" alt="logo"/>
                                </h5>
                            </ListItem>
                            <ListItem>
                                <img style={{height:"30px"}} src={logo} className="App-logo" alt="logo"/>
                                <Badge badgeContent={this.state.playerPoint} showZero={true} color="secondary">
                                    <h5><span> Point </span></h5>
                                </Badge>
                                <img style={{height:"30px", marginLeft:"1%"}} src={logo} className="App-logo" alt="logo"/>
                            </ListItem>
                        </div>
                    </div>
                    <div className={"col-lg-6 square"}>
                        <GourabounDara
                            cellsState={this.state.gridStates}
                            onDrop={this.onDrop}
                            onDragStart={this.onDragStart}
                            onMouseEnter={this.onMouseEnter}
                            gameInfos={{
                                playerTour:this.state.playerTour,
                                winStone:this.state.winStone,
                                alignedStone:this.state.alignedStone
                            }}
                        />
                    </div>
                    <div className={"col-lg-3"} >
                       <FindPlayer playerName={this.state.player.name} callback={this.startGame}/>
                    </div>
                </div>
            </div>
        }

    }

    renderHelp(){
        let cellState = (new Grid()).getAllStates();
        if (!this.state.isConnected) {
            return (<div className="container jumbotron">
                <h1 style={{textAlign: "center"}}>LE JEU D'ALIGNEMENT DE TROIS PIONS</h1>
                <p>Le jeu d'alignement de trois pions est un jeu qui se joue à deux.
                    Chaque joueur possède au depart 12 pions. Le jeu se joue en deux phases:
                </p>
                <p>
                    <strong> - La phase placement. </strong>
                    Pendant cette phase, les joueurs placent tour à tour les pions (un à fois) sur un plateau de jeu
                    compose de 30 cases (5 lignes x 6 colonnes). Les joueurs n'ont le droit d'aligner trois (3) pions que ce soit
                    en ligne ou en colonne.
                </p>
                <p>
                    <strong>- La phase de deplacement </strong>
                    Une fois placement terminé, les joueurs deplace tour à tour leurs pions. le but de deplacement est d'aligner trois pions
                    (alignement en ligne ou en colonne, pas en diagonal). Lorsqu'un joueur arrive à aligner trois de ses pions, il récupère
                    un pion au choix de son adversaire.
                </p>
                <p>
                    Le jeu se termine lorsqu'un des joueur abondonne ou n'a plus de pion. Ce dernier la parties.
                    Le joueur gagnant à: <br/>
                    <strong> - 1 point </strong> s'il a perdu au moins un de ses pions lors de la partie<br/>
                    <strong>- 2 points </strong> s'il n'a perdu aucun de ses pions.<br/>
                </p>
                <div>
                    <h1 style={{textAlign: "center"}}>Les pions du jeu </h1>
                    <img src={pierre} alt="duci" style={{height: "100px", width: "100px"}}/> <br/>
                    <img src={tige} alt="korkwaro" style={{height: "100px", width: "100px"}}/>
                </div>
                <div>
                    <h1 style={{textAlign: "center"}}>Le plateau du jeu</h1>
                    <div style={{textAlign: "center", marginLeft: "250px", marginTop: "10px", Height: "100px"}}>
                        <GourabounDara cellsState={cellState}/>
                    </div>
                </div>

            </div>)
        }
    }

    render(){
        return <div className="homepage">
            <AppBar position="static" style={{backgroundColor: "green"}}>
                <div className="row">
                    <div className="col-lg-3">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <img src={logo} className="App-logo" alt="logo"/>
                        <img src={logo} className="App-logo" alt="logo"/>
                    </div>
                    <div className="col-lg-4">
                        <span  style={{fontSize: "2vw", fontWeight: "bold" , marginLeft:"1vw", marginRight: "1vw" , marginTop: "1vw"}}>
                            WASAN DARA HAUSAWA
                        </span>
                    </div>
                    <div className="col-lg-5">
                        <Button style={{color:"white",fontSize: "1vw", fontWeight: "bold" , marginLeft:"1vw", marginRight: "1vw" , marginTop: "0.5vw"}}
                        onClick={() => LoginPopup.show(this.afterLogin, null)}>
                            <AccountCircle style={{fontSize:"2vw"}}/> { this.state.isConnected? this.state.player.name:"se connecter"}
                        </Button>
                        <Button style={{color:"white",fontSize: "1vw", fontWeight: "bold" , marginLeft:"0.5vw", marginRight: "1vw" , marginTop: "0.5vw"}}
                        onClick={()=>SubscribePopup.show(this.afterLogin, null)}>
                            <Create style={{fontSize:"2vw"}}/> Créer un compte
                        </Button>
                    </div>
                </div>
            </AppBar>

            {this.renderHelp()}
            {this.renderPlayerFinder()}
            {this.rendUser()}
        </div>;
    }
}

export {
    HomePage
}
