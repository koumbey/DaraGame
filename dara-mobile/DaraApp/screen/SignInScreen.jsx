import React, {Component} from 'react'
import {Input, Button, Text} from 'react-native-elements';
import {View, StyleSheet} from 'react-native'
import {DaraApi, DaraSocket} from '../server/DaraApi'
import HaussaLogo from '../images/haussaLogo.svg'
import base64 from 'react-native-base64'


const styleContainer = StyleSheet.create({
    headerContainer: {flexDirection: "row", height: 50, backgroundColor: "green"},
    icons:{width: 50}
})


export default class SignInScreen extends Component{

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
                popup_store.close("Login_Popup")
            }
        }, err =>{
            debugger;
            console.log(err)
        })
    }

    render() {
      return (<View>
          <View style={styleContainer.headerContainer}>
              <View style={styleContainer.icons}>
              <HaussaLogo height={150} width={150}/>
              </View>
              <View style={styleContainer.icons}>
              <HaussaLogo height={150} width={150}/>
              </View>
              <View style={{ width:210, justifyContent: "center"}}>
              <Text h4 style={{color: "white"}}> Dara Ukku</Text>
              </View>
              <View style={styleContainer.icons}>
             <HaussaLogo  height={150} width={150}/>
              </View>
              <View style={styleContainer.icons}>
             <HaussaLogo  height={150} width={150}/>
              </View>
          </View>
          <View>
              <Text h4> Sign in</Text>
              <Input placeholder="Login" onChange={value =>this.handleStateChange("login", value)}/>
              <Input secureTextEntry={true} placeholder="password" onChange={value =>this.handleStateChange("password", value)}/>
              <Button title={"Submit"} onPress={this.login}/>
          </View>
        </View>)
    }
}
