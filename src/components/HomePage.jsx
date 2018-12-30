import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import logo  from "../images/haussaLogo.svg"
import DarraGame from "./DarraGame";


class HomePage extends React.Component{
    static propTypes = {
    };

    render(){
        return <div className="homepage">
            <AppBar position="static" color="inherit">
                <div className="row">
                    <div className="col-lg-2"></div>
                    <div className="col-lg-8">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <img src={logo} className="App-logo" alt="logo"/>
                        <img src={logo} className="App-logo" alt="logo"/>
                        <img src={logo} className="App-logo" alt="logo"/>
                        <span  style={{fontSize: "40px", fontWeight: "bold" , marginLeft:"20px", marginRight: "20px" , marginTop: "10px"}}>
                            WASAN DARA HAUSAWA
                        </span>
                        <img src={logo} className="App-logo" alt="logo"/>
                        <img src={logo} className="App-logo" alt="logo"/>
                        <img src={logo} className="App-logo" alt="logo"/>
                        <img src={logo} className="App-logo" alt="logo"/>
                    </div>
                    <div className="col-lg-2">

                    </div>
                </div>
            </AppBar>
            <DarraGame/>
        </div>;
    }
}

export {
    HomePage
}