import React from 'react';
import Proptypes from 'prop-types'
import {GourbinDara} from "./gourbinDara";

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
        return (<table>
            <tbody>
            {this.props.cellsState.map(function (row, idx) {
                return(<tr key={idx}>
                    {row.map(function (item, idy) {
                        let id = 'out-' + item.state+ "-" +item.pos;
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
                <h5>Player Name: {this.props.playerName}</h5>
                <h5>Player Point: {this.props.playerPoint}</h5>
            </div>
            <div>
                {this.createTable()}
            </div>
        </div>
    }
}

export {
    DianDara
}