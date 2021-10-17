import getStore from '../dynamicPopup/PopupStore'
import React from 'react'
import {TextField, Button} from "@material-ui/core";
import {DaraApi, DaraSocket} from '../server/DaraApi'
import base64 from 'base-64'
import Proptypes from 'prop-types'


export default class EndPartyPopup extends React.Component {
    static popupDefinition = {
        key: "END_PARTIE",
        title: "FIN DE LA PARTIE"
    }
    static propTypes = {
        callback: Proptypes.func,
        player: Proptypes.shape({
            name: Proptypes.string.isRequired,
            isWinner: Proptypes.bool.isRequired
        }),
        initiateGame: Proptypes.func.isRequired
    };

    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        let message = "Vous avez " + (this.props.player.isWinner? "gagné": "perdu") + "la partie"
        let color = this.props.player.isWinner?"red":"green"
        return <div>
            <div key="head" style={{width: "100%", backgroundColor: color, color: "white"}}>
                <h5>{message}</h5>
            </div>
            <div style={{marginTop: "50px"}}>
                <Button variant="contained" color="primary" onClick={this.props.initiateGame}>
                    Refaire une nouvelle partie
                </Button>
            </div>
            <div style={{marginTop: "50px"}}>
                <Button variant="contained" color="secondary" onClick={}>
                    Arrêter
                </Button>
            </div>
        </div>
    }

    static show = function (player, initiateGame, callback, afterClose) {
        let popup_store = getStore();
        if (!popup_store.isRegistered(EndPartyPopup.popupDefinition.key)){
            popup_store.register(
                EndPartyPopup.popupDefinition.key,
                EndPartyPopup,
                EndPartyPopup.popupDefinition.title,
                {callback: callback, player:player, initiateGame:initiateGame},
                afterClose
            )
        }
        popup_store.show(EndPartyPopup.popupDefinition.key)
    }
}
