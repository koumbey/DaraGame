import getStore from '../dynamicPopup/PopupStore'
import React from 'react'
import {TextField, Button} from "@material-ui/core";
import DaraApi from '../server/DaraApi'
import base64 from 'base-64'
import Proptypes from 'prop-types'

export default class LoginPopup extends React.Component{

    static propTypes = {
        callback: Proptypes.func
    };

    constructor(props){
        super(props);
        this.state = {password:"", login: ""};
        this.login =  this.login.bind(this)
    }

    handleStateChange(key, event){
        if (event && event.target) {
            this.setState({[key]: event.target.value})
        }
    }

    login() {
        let userInfo = "Basic " + base64.encode(this.state.login + ":" + this.state.password);
        let callback  = this.props.callback;
        DaraApi.get("/users/authenticate", {headers: {Authorization: userInfo}}).then(res => {
            callback(res.data)
        }, err =>{
            debugger;
            console.log(err)
        })
    }

    render() {
        return <div >
            <form>
                <div>
                <TextField
                    id="login"
                    label="Sunan dan wasa"
                    fullWidth={true}
                    value={this.state.login}
                    onChange={value =>this.handleStateChange("login", value)}
                />
                </div>
                <div>
                <TextField
                    id="password"
                    label="Kalmonin shirri"
                    fullWidth={true}
                    type="password"
                    value={this.state.password}
                    onChange={value =>this.handleStateChange("password", value)}
                />
                </div>
                <div style={{marginTop: "50px"}}>
                    <Button variant="contained" color="primary" onClick={this.login}>
                        Shigar da kanka
                    </Button>
                </div>
            </form>
            <div>{this.state.signUpMessage}</div>
        </div>
    }
    static show = function () {
        let popup_store = getStore();
        if (!popup_store.isRegistered("Login_Popup")){
            popup_store.register("Login_Popup", LoginPopup , "Sign in")
        }
        popup_store.show("Login_Popup")
    }
}
