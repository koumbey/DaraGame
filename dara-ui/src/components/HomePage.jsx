import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import logo  from "../images/haussaLogo.svg"
import pierre from "../images/pierreJeton.svg"
import tige from "../images/tigeJetons.svg"
import AccountCircle from "@material-ui/icons/AccountCircle"
import Create from "@material-ui/icons/Create"
import Button from '@material-ui/core/Button';
import {GourabounDara} from "./gourabounDara";
import Grid from "../gameRules/Grid";


class HomePage extends React.Component{


    render(){
        let cellState = (new Grid()).getAllStates();
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
                        <Button style={{color:"white",fontSize: "20px", fontWeight: "bold" , marginLeft:"20px", marginRight: "20px" , marginTop: "10px"}}>
                            <AccountCircle style={{fontSize:"40px"}}/> Shigadda kanka
                        </Button>
                        <Button style={{color:"white",fontSize: "20px", fontWeight: "bold" , marginLeft:"20px", marginRight: "20px" , marginTop: "10px"}}>
                            <Create style={{fontSize:"40px"}}/> Sabon Dan wasa
                        </Button>
                    </div>
                </div>
            </AppBar>
            <div className="container jumbotron">
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
                <p> A cikin wanan wasa na na-ura mai ƙwaƙwalwa ko waya zamani, Ana anfami da
                    duwacuna babbaƙu kamar haka : <br/>
                    <div style={{textAlign: "center"}}>
                        <img src={pierre} alt="duci" style={{height: "100px", width: "100px"}}/> <br/>
                    </div>
                    dan kamanta duwacuna. <br/>
                    Da kuma ɗiyan korkoro ɗanyan cawa kamar haka: <br/>
                    <div  style={{textAlign: "center"}}>
                        <img src={tige} alt="korkwaro" style={{height: "100px", width: "100px"}}/>
                    </div>
                </p>
                <p>
                    Gurabu dara kuma mu anfani da griyaji mai gida talatin (30) kamar haka:
                    <div style={{textAlign: "center", marginLeft: "250px", marginTop: "10px"}}>
                        <GourabounDara cellsState={cellState}/>
                    </div>
                </p>
                <h1 style={{textAlign: "center"}}>Sharuɗɗan Wasa</h1>
                <p></p>
            </div>

        </div>;
    }
}

export {
    HomePage
}