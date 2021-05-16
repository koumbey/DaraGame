import React from 'react'
import {DaraApi, DaraSocket} from '../server/DaraApi'
import Proptypes from 'prop-types'
import Button from '@material-ui/core/Button';
import AccountCircle from "@material-ui/icons/AccountCircle"
const {GridCell} = require("../gameRules/GridCell");
const {MainGame} = require("../gameRules/MainGame");


export default class FindPlayer extends React.Component{

    static propTypes = {
        callback: Proptypes.func.isRequired,
        playerName: Proptypes.string.isRequired
    };

    constructor(props){
        super(props);
        this.state = {connectedUsers:{}, message:{}};
        this.onReceiveAccept =  this.onReceiveAccept.bind(this);
        this.onReceiveInvitation =  this.onReceiveInvitation.bind(this)
    }

    componentDidMount() {
        let token =  "Bearer " + localStorage.getItem("token");
        let _this = this;
        DaraSocket.subscribe("Accept", this.onReceiveAccept);
        DaraSocket.subscribe("InvitePlayer", this.onReceiveInvitation);
        DaraApi.get("/users/connectedUsers", {headers: {Authorization: token}}).then(res => {
            _this.setState({"connectedUsers": res.data});
        }, err =>{
            debugger;
            console.log(err)
        })
    }

   onReceiveInvitation(data){
        let message = this.state.message;
        message[data.from] = data;
        this.setState({message: message})
   }

    renderConnectUsers(){
        let keys = Object.keys(this.state.connectedUsers);
        let playerName = this.props.playerName;
        return (
            <div className="jumbotron">
                <h3> Chercher un adversaire :</h3>
            <table className="table">
                <tbody>
                {
                    keys.filter(k => k !== playerName).map(k => {
                        return (
                            <tr key={k}>
                                <th> <AccountCircle color="primary"/> {k}</th>
                                <th>
                                <Button onClick={() => DaraSocket.send(JSON.stringify({
                                    to: k,
                                    topic: "InvitePlayer",
                                    from: playerName
                                }))} color="primary" variant="contained">
                                    Send request
                                </Button>
                                </th>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            </div>
        )
    }

    onAcceptRequest(data){
        DaraSocket.send(JSON.stringify({to: data.from, topic: "Accept", from: data.to}));
        let connectedUser = {
            name: this.props.playerName,
            start: false,
            stoneType: GridCell.ValueEnum.TIGE,
            type:MainGame.PlayerType.HUMAN
        };
        let opponent = {
            name: data.from,
            start: true,
            stoneType: GridCell.ValueEnum.PIERRE,
            type:MainGame.PlayerType.HUMAN
        };
        this.props.callback(connectedUser, opponent)
    }

    onReceiveAccept(data){
        let connectedUser = {
            name: this.props.playerName,
            start: true,
            stoneType: GridCell.ValueEnum.PIERRE,
            type:MainGame.PlayerType.HUMAN
        };
        let opponent = {
            name: data.from,
            start: false,
            stoneType: GridCell.ValueEnum.TIGE,
            type:MainGame.PlayerType.HUMAN
        };
        this.props.callback(connectedUser, opponent)
    }

    renderReceivedRequests(){
        let receivedRequest = Object.values(this.state.message);
        if (receivedRequest.length !==0) {
            let _this =  this;
            return (
                <div className="jumbotron"> <h3> Received Request :</h3>
            <table className="table">
                <tbody>
                {receivedRequest.map((data, i) =>{
                    return (
                        <tr key={i}>
                            <th>From: {data.from} </th>
                            <th>
                                <Button color="primary" variant="contained" onClick={() => _this.onAcceptRequest(data)}>
                                    Accept
                                </Button>
                            </th>
                            <th>
                                <Button onClick={() => DaraSocket.send(JSON.stringify({
                                    to: data.from,
                                    topic: "Reject",
                                    from: data.to
                                }))} color="secondary" variant="contained">
                                    Reject
                                </Button>
                            </th>
                        </tr>
                    )
                })}
                </tbody>
            </table>
                </div>)
        }
    }

    render() {
        return <div>
            {this.renderConnectUsers()}
            {this.renderReceivedRequests()}
        </div>
    }
}
