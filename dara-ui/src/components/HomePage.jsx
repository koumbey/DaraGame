import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import logo  from "../images/haussaLogo.svg"
import pierre from "../images/pierreJeton.svg"
import tige from "../images/tigeJetons.svg"
import AccountCircle from "@material-ui/icons/AccountCircle"
import Create from "@material-ui/icons/Create"
import Button from '@material-ui/core/Button';
import {GourabounDara} from "./GourabounDara";
import Grid from "../gameRules/Grid";
import LoginPopup from "../popups/LoginPopup";
import FindPlayer from "./FindPlayer";
import getStore from "../dynamicPopup/PopupStore";
import Cell from "../gameRules/Cell";
import MainGame from "../gameRules/MainGame";
import {DianDara} from "./DianDara";
import {ListItem} from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import {DaraSocket} from "../server/DaraApi";
import SubscribePopup from "../popups/SubscribePopup";

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

    constructor(){
        super();
        this.state = {
            isConnected: false,
            hasOpponent: false
        };

        this.afterLogin = this.afterLogin.bind(this);
        this.startGame =  this.startGame.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        //this.onPlayReceive = this.onPlayReceive.bind(this)
    }

    componentDidMount() {
        DaraSocket.subscribe("play", this.onDrop)
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
            if (dragInfo.type === this.state.player.jeton || this.gameInfo.player.hasLinedThree) {
                this.dragInfo =  dragInfo;
                this.dragInfo.IsEmpty = false;
            }
        }
    }

    onDrop(event){
        if(event && event.target && event.target.id && this.dragInfo && !this.dragInfo.IsEmpty) {
            let dropInfo = HomePage.getDragDropInfo(event.target.id);
            this.gameInfo.playGame(this.dragInfo, dropInfo);
            DaraSocket.send(JSON.stringify({to:this.state.opponent.name, action:[this.dragInfo, dropInfo], topic: "play"}))

        }else if (event && event.action){
            let action = event.action;
            this.gameInfo.playGame(action[0], action[1]);
        }
        let updateState = this.gameInfo.getGameStates();
        if(this.gameInfo.isPartEnded()){
            let winner = this.gameInfo.getWinner();
            console.log("Game ended. \nPlayer "+ winner.name + " win !!!");
            this.gameInfo.initialiseGameInfo();
            let player =  this.state.player;
            player.jeton =  this.gameInfo.getPlayerJeton(player.name);
            let opponent =  this.state.opponent;
            opponent.jeton =  this.gameInfo.getPlayerJeton(opponent.name);
            updateState.player = player;
            updateState.opponent = opponent;
        }
        this.dragInfo = {IsEmpty: true};
        this.setState(updateState);
    }

    afterLogin(data){
        let connectedUser = {
            name: data.Pseudo,
            start: true,
            jeton: Cell.ValueEnum.PIERRE,
            type:MainGame.PlayerType.HUMAN
        };
        let opponent = {
            name: "?",
            start: false,
            jeton: Cell.ValueEnum.TIGE,
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
            let players = this.state.player.start? [this.state.player.name, this.state.opponent.name]: [this.state.opponent.name, this.state.player.name];
            let firstPlayerInfo = this.gameInfo.getPlayerIdAndPoint(players[0]);
            let secondPlayerInfo = this.gameInfo.getPlayerIdAndPoint(players[1]);
            return <div style={{marginRight: "5%", marginLeft: "5%"}}>
                <div className={"row"}>
                    <div className={"col-lg-3"}>
                        <DianDara
                            cellsState={this.state[firstPlayerInfo.id]}
                            onDrop={this.onDrop}
                            onDragStart={this.onDragStart}
                            playerName={players[0]}
                            playerPoint={firstPlayerInfo.point}
                        />
                    </div>
                    <div className={"col-lg-6 square-box"}>
                        <GourabounDara
                            cellsState={this.state.gridStates}
                            onDrop={this.onDrop}
                            onDragStart={this.onDragStart}
                            onMouseEnter={this.onMouseEnter}
                            gameInfos={{
                                playerTour:this.state.playerTour,
                                winJeton:this.state.winJeton,
                                linedJeton:this.state.linedJeton
                            }}
                        />
                    </div>
                    <div className={"col-lg-3"}>
                        <DianDara
                            cellsState={this.state[secondPlayerInfo.id]}
                            onDrop={this.onDrop}
                            onDragStart={this.onDragStart}
                            playerName={players[1]}
                            playerPoint={secondPlayerInfo.point}
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
                                winJeton:this.state.winJeton,
                                linedJeton:this.state.linedJeton
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
                <h1 style={{textAlign: "center"}}>Carin wasa dara jera uku</h1>
                <p>Wasa dara jera uku, wasa ce wadda ake bugawa cakanin dan wasa biyu.
                    Kamin fara wasan ana buƙata ɗiyan dara, da gidaje dara.
                    Kowane dan wasa yana buƙata ɗiyan dara goma shabiyu (12).
                    Dan wasa guda yana iya dara da ɗiyan duwacuna, ko ɗiyan goriba, ko kuma
                    wanansu abubuwa makamanta.
                    Abokin wasa shi yana iya dara da guntawyan kara haci, ko ɗiyan korkoron zaran
                    ɗumki, ko kuma abubuwa makamanta.
                    Gidajan dara gurabu talatin ne (30) a care, layi biyar har so shida (5x6).
                </p>
                <div> A cikin wanan wasa na na-ura mai ƙwaƙwalwa ko waya zamani, Ana anfami da
                    duwacuna babbaƙu kamar haka : <br/>
                    <div style={{textAlign: "center"}}>
                        <img src={pierre} alt="duci" style={{height: "100px", width: "100px"}}/> <br/>
                    </div>
                    dan kamanta duwacuna. <br/>
                    Da kuma ɗiyan korkoro ɗanyan cawa kamar haka: <br/>
                    <div style={{textAlign: "center"}}>
                        <img src={tige} alt="korkwaro" style={{height: "100px", width: "100px"}}/>
                    </div>
                </div>
                <div>
                    Gurabu dara kuma mu anfani da griyaji mai gida talatin (30) kamar haka:
                    <div style={{textAlign: "center", marginLeft: "250px", marginTop: "10px", Height: "100px"}}>
                        <GourabounDara cellsState={cellState}/>
                    </div>
                </div>
                <h1 style={{textAlign: "center"}}>Sharuɗɗan Wasa</h1>
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
                            <AccountCircle style={{fontSize:"2vw"}}/> { this.state.isConnected? this.state.player.name:"Shigadda kanka"}
                        </Button>
                        <Button style={{color:"white",fontSize: "1vw", fontWeight: "bold" , marginLeft:"0.5vw", marginRight: "1vw" , marginTop: "0.5vw"}}
                        onClick={()=>SubscribePopup.show(this.afterLogin, null)}>
                            <Create style={{fontSize:"2vw"}}/> Sabon Dan wasa
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
