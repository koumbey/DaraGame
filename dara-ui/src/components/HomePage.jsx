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
import getStore from "../dynamicPopup/PopupStore";
import Cell from "../gameRules/Cell";
import MainGame from "../gameRules/MainGame";
import {DianDara} from "./DianDara";


class HomePage extends React.Component{
    static show = function () {
        let popup_store = getStore();
        if (!popup_store.isRegistered("Login_Popup")){
            popup_store.register("Login_Popup", LoginPopup , "Sign in")
        }
        popup_store.show("Login_Popup")
    }
    constructor(){
        super();
        this.state = {
            isConnected: false,
            hasOpponent: false
        };

        this.afterLogin = this.afterLogin.bind(this);
        this.showLogin = this.showLogin.bind(this);
    }

    showLogin() {
        let popup_store = getStore();
        if (!popup_store.isRegistered("Login_Popup")){
            popup_store.register("Login_Popup", LoginPopup , "Sign in", {callback: this.afterLogin})
        }
        popup_store.show("Login_Popup")
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
        this.setState(newState)
    }

    rendUser(){
        if (this.state.isConnected){
            return <div style={{marginRight: "50px", marginLeft: "50px"}}>
                <div className={"row"}>
                    <div className={"col-lg-4"} style={{marginTop:"10px", marginBottom:"10px"}}>
                        <DianDara
                            cellsState={this.state[MainGame.playerId.PLAYER]}
                            onDrop={this.onDrop}
                            onDragStart={this.onDragStart}
                            playerName={this.state.player.name}
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
                            playerName={this.state.opponent.name}
                            playerPoint={this.state.opponentPoint}
                        />
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
                    <div style={{textAlign: "center", marginLeft: "250px", marginTop: "10px"}}>
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
                        <Button style={{color:"white",fontSize: "20px", fontWeight: "bold" , marginLeft:"20px", marginRight: "20px" , marginTop: "10px"}}
                        onClick={this.showLogin}>
                            <AccountCircle style={{fontSize:"40px"}}/> Shigadda kanka
                        </Button>
                        <Button style={{color:"white",fontSize: "20px", fontWeight: "bold" , marginLeft:"20px", marginRight: "20px" , marginTop: "10px"}}>
                            <Create style={{fontSize:"40px"}}/> Sabon Dan wasa
                        </Button>
                    </div>
                </div>
            </AppBar>

            {this.renderHelp()}
            {this.rendUser()}
        </div>;
    }
}

export {
    HomePage
}