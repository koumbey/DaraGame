import React from 'react'
import {GourbinDara} from "./GourbinDara";
import Proptypes from 'prop-types'


class GourabounDara extends React.Component{
    constructor(props){
        super(props);
        this.createTable = this.createTable.bind(this)
    }

    static propTypes={
        cellsState: Proptypes.arrayOf(Proptypes.arrayOf(Proptypes.object)),
        onDragStart: Proptypes.func,
        onDrop :Proptypes.func,
        onMouseEnter: Proptypes.func,
        gameInfos:Proptypes.shape({
            playerTour: Proptypes.string,
            winStone: Proptypes.bool,
            alignedStone: Proptypes.arrayOf(Proptypes.string)
        })
    };


    createTable(){
        let onDrag = this.props.onDragStart;
        let onDrop = this.props.onDrop;
        let func = this.props.onMouseEnter;
        let alignedStone = this.props.gameInfos? this.props.gameInfos.alignedStone: []
        return (<table key="body" style={{border: "3px solid", boxShadow: "10px 10px 8px 10px #888888"}}>
            <tbody>
            {this.props.cellsState.map(function (row, idx) {
                return(<tr key={idx} >
                    {row.map(function (item, idy) {
                        let id = 'in-'+item.state+"-"+item.pos;
                        let className = alignedStone.includes(item.pos) ? "third-lined": "in-game"
                        return(<td key={idy} style={{border: "3px solid"}}>
                            <GourbinDara
                                stoneType={item.state}
                                stoneId={id}
                                onDragStart={onDrag}
                                onDrop={onDrop}
                                onMouseEnter={func}
                                stateClassName={className}
                            />
                        </td>)
                    })}
                </tr>)
            })}
            </tbody>
        </table>)
    }

    render_player(){
        return(
            <div key="head" style={{width: "100%", backgroundColor: "sandybrown", color: "white"}}>
                <h5>Player Tour: {this.props.gameInfos.playerTour}</h5>
                {
                    this.props.gameInfos.winStone
                    && <h5 style={{color: "green"}}>
                        {this.props.gameInfos.playerTour + " "} WIN STONE !
                    </h5>
                }
            </div>)
    }

    render() {
            return  (<div className="jumbotron square-content" style={{width: "100%", height: "100%"}}>
                {this.props.gameInfos && this.render_player()}
                {this.createTable()}
            </div>)
    }


}

export {
    GourabounDara
}
