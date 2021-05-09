import getStore from '../dynamicPopup/PopupStore'
import React from 'react'
import {TextField, Button} from "@material-ui/core";
import {DaraApi, DaraSocket} from '../server/DaraApi'
import base64 from 'base-64'
import Proptypes from 'prop-types'
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';


export default class SubscribePopup extends React.Component {
    static popupDefinition = {
        key: "SubscribePopup",
        title: "Sign up"
    }
    static propTypes = {
        callback: Proptypes.func
    };

    constructor(props){
        super(props);
        this.state = {password:"", login: "", showPassword: false};
        this.login =  this.login.bind(this)
    }

    handleStateChange(key, event){
        if (event && event.target) {
            this.setState({[key]: event.target.value})
        }
    }

    login() {
        let callback  = this.props.callback;
        let login = this.state.login;
        let userInfo = "Basic " + base64.encode(this.state.login + ":" + this.state.password);
        DaraApi.post("/users/create", {"user": userInfo}).then(res => {
            console.log(res)
            DaraApi.get("/users/authenticate", {headers: {Authorization: userInfo}}).then(res => {
                res = callback(res.data);
                DaraSocket.send(JSON.stringify({joinUser:login}));
                if (res){
                    let popup_store = getStore();
                    popup_store.close(SubscribePopup.popupDefinition.key)
                }
            }, err =>{
                debugger;
                console.log(err)
            })
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
                <FormControl variant="filled">
                    <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                    <FilledInput
                        id="filled-adornment-password"
                        type={this.state.showPassword ? 'text' : 'password'}
                        value={this.state.password}
                        onChange={value => this.handleStateChange("password", value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={value => this.setState({showPassword: value})}
                                    onMouseDown={event => event.preventDefault()}
                                    edge="end"
                                >
                                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <div style={{marginTop: "50px"}}>
                    <Button variant="contained" color="primary" onClick={this.login}>
                        Shigar da kanka
                    </Button>
                </div>
            </form>
        </div>
    }

    static show = function (callback, afterClose) {
        let popup_store = getStore();
        if (!popup_store.isRegistered(SubscribePopup.popupDefinition.key)){
            popup_store.register(
                SubscribePopup.popupDefinition.key,
                SubscribePopup ,
                SubscribePopup.popupDefinition.title,
                {callback: callback},
                afterClose
            )
        }
        popup_store.show(SubscribePopup.popupDefinition.key)
    }
}
