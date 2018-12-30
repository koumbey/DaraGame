import React from 'react'
import {GourbinDara} from "./gourbinDara";
import Proptypes from 'prop-types'


class GourabounDara extends React.Component{
    constructor(){
        super();
        this.createTable = this.createTable.bind(this)
    }

    static propTypes={
        cellsState: Proptypes.arrayOf(Proptypes.arrayOf(Proptypes.object)),
        onDragStart: Proptypes.func,
        onDrop :Proptypes.func,
        gameInfos:Proptypes.shape({
            playerTour: Proptypes.string,
            winJeton: Proptypes.bool
        })
    };


    createTable(){
        let onDrag = this.props.onDragStart;
        let onDrop = this.props.onDrop;
        return (<table style={{border: "3px solid", boxShadow: "10px 10px 8px 10px #888888"}}>
            <tbody>
            {this.props.cellsState.map(function (row, idx) {
                return(<tr key={idx}>
                    {row.map(function (item, idy) {
                        let id = 'in-'+item.state+"-"+item.pos;
                        return(<td key={idy}>
                            <GourbinDara jetonType={item.state} jetonId={id} onDragStart={onDrag} onDrop={onDrop}/>
                        </td>)
                    })}
                </tr>)
            })}
            </tbody>
        </table>)
    }
    render(){
        return <div>
            <div>
                <h5>Player Tour: {this.props.gameInfos.playerTour}</h5>
                {this.props.gameInfos.winJeton
                && <h5 style={{color: "green"}}>
                    {this.props.gameInfos.playerTour + " "} win jeton !
                 </h5>
                }
            </div>
            {this.createTable()}
        </div>
    }
}

export {
    GourabounDara
}