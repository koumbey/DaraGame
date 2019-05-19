import getStore from '../dynamicPopup/PopupStore'
import React from 'react'
import {TextField} from "@material-ui/core";


export default class LoginPopup extends React.Component{

    render() {
        return <div className="jumbotron">
            <form>
                <TextField id="login" label="Sunan dan wasa"/>
            </form>
            Here the form to login !!!!!!!!!!!!!
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
