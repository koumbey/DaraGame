import {DianDara} from "./dianDara";
import MainGame from "../gameRules/MainGame";
import React from "react";
import pierreJeton from '../images/pierreJeton.svg';
import tigeJeton from '../images/tigeJetons.svg'
export default class PlayerView extends React.Component{

    constructor(){
        super();
        this.state = {
            login:"",
            jetonType: ""
        }
    }
    render(){
        return (<div className="PlayerView">
             <form>
                 <div className="form-group">
                     <div className="row">
                         <label htmlFor="login"className="col-md-4">Player Name:</label>
                         <div className="col-md-8">
                            <input type="text" id="login" htmlFor="login" className="form-control"/>
                         </div>
                     </div>
                 </div>
                 <div className="form-group">
                     <div className="row">
                         <div className="col-sm-4">
                             Jeton type:
                         </div>
                         <div className="col-sm-4">
                             <input type="radio" htmlFor="jetonType"/>
                             <label htmlFor="jetonType" style={{height:"50px", width:"50px"}}><img src={pierreJeton}/></label>
                         </div>
                         <div className="col-sm-4">
                             <input type="radio" htmlFor="jetonType"/>
                             <label htmlFor="jetonType" style={{height:"50px", width:"50px"}}><img src={tigeJeton}/></label>
                         </div>
                     </div>
                 </div>
             </form>
        </div>)
    }
}