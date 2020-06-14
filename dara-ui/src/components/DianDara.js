import React from 'react';
import Proptypes from 'prop-types'
import {GourbinDara} from "./GourbinDara";
import logo from "../images/haussaLogo.svg";
import Badge from "@material-ui/core/Badge";
import {ListItem} from "@material-ui/core";

class DianDara extends React.Component{
    constructor(props){
        super(props);
        this.createTable = this.createTable.bind(this)
    }

    static propTypes={
        playerName: Proptypes.string,
        playerPoint: Proptypes.number,
        onDragStart: Proptypes.func,
        onDrop: Proptypes.func,
        cellsState:Proptypes.arrayOf(Proptypes.arrayOf(Proptypes.object))
    };


    createTable(){
        let onDrag = this.props.onDragStart;
        let onDrop = this.props.onDrop;
        return (
            <div>
            {this.props.cellsState.map(function (row, idx) {
                let size = 2*(4 - row.length);
                return(<div className="row" key={idx} style={{marginLeft: size+"vw"}}>
                    {row.map(function (item, idy) {
                        let id = 'out-' + item.state+ "-" +item.pos;
                        return(
                            <div key={idy}>
                            <GourbinDara
                                jetonType={item.state}
                                jetonId={id}
                                onDragStart={onDrag}
                                onDrop={onDrop}
                                stateClassName="out-game"
                            />
                            </div>
                        )
                    })}
                </div>)
            })}
            </div>
        )
    }

    render(){
        return <div className="container" >
            <div className="jumbotron">
                <ListItem>
                    <h5>
                        <img style={{height:"30px"}} src={logo} className="App-logo" alt="logo"/>
                         {" " + this.props.playerName + " "}
                        <img style={{height:"30px"}} src={logo} className="App-logo" alt="logo"/>
                    </h5>
                </ListItem>
                <ListItem>
                    <img style={{height:"30px"}} src={logo} className="App-logo" alt="logo"/>
                    <Badge badgeContent={this.props.playerPoint} showZero={true} color="secondary">
                        <h5><span style={{margin:"10px"}}> Point </span></h5>
                    </Badge>
                    <img style={{height:"30px", marginLeft:"10px"}} src={logo} className="App-logo" alt="logo"/>
                </ListItem>
            </div>
            <div className="jumbotron">
                {this.createTable()}
            </div>
        </div>
    }
}

export {
    DianDara
}
