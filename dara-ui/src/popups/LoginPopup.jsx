import getStore from '../dynamicPopup/PopupStore'
import React from 'react'
import {TextField, Button} from "@material-ui/core";
import {DaraApi, DaraSocket} from '../server/DaraApi'
import base64 from 'base-64'
import Proptypes from 'prop-types'


export default class LoginPopup extends React.Component {
    static popupDefinition = {
        key: "LoginPopup",
        title: "Sign in"
    }
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
        let login = this.state.login;
        DaraApi.get("/users/authenticate", {headers: {Authorization: userInfo}}).then(res => {
            res = callback(res.data);
            DaraSocket.send(JSON.stringify({joinUser:login}));
            if (res){
                let popup_store = getStore();
                popup_store.close(LoginPopup.popupDefinition.key)
            }
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
                    label="Pseudo"
                    fullWidth={true}
                    value={this.state.login}
                    onChange={value =>this.handleStateChange("login", value)}
                />
                </div>
                <div>
                <TextField
                    id="password"
                    label="Mot de passe"
                    fullWidth={true}
                    type="password"
                    value={this.state.password}
                    onChange={value =>this.handleStateChange("password", value)}
                />
                </div>
                <div style={{marginTop: "50px"}}>
                    <Button variant="contained" color="primary" onClick={this.login}>
                        Soumettre
                    </Button>
                </div>
            </form>
        </div>
    }
    static show = function (callback, afterClose) {
        let popup_store = getStore();
        if (!popup_store.isRegistered(LoginPopup.popupDefinition.key)){
            popup_store.register(
                LoginPopup.popupDefinition.key,
                LoginPopup,
                LoginPopup.popupDefinition.title,
                {callback: callback},
                afterClose
            )
        }
        popup_store.show(LoginPopup.popupDefinition.key)
    }
}
