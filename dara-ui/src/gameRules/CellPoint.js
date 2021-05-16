const _ = require('lodash');


class CellPosition{
    static MAX_ROW = 5
    static MAX_COL = 6

    constructor(row, col=null) {
        let i = row
        let j = col
        if (col === null){
            j = row % CellPosition.MAX_COL
            i = (row - j) / CellPosition.MAX_COL
        }
        if (0<= i && i <CellPosition.MAX_ROW && 0 <= j && j <CellPosition.MAX_COL) {
            let top = _.range(0, i).map(item =>{ return {row:item, col: j}})
            let bottom =  _.range(_.min([i + 1, CellPosition.MAX_ROW]),CellPosition.MAX_ROW).map(item =>{ return {row:item, col: j}})
            let left =  _.range(0, j).map(item =>{ return {row:i, col: item}})
            let right =  _.range(_.min([j + 1, CellPosition.MAX_COL]),CellPosition.MAX_COL).map(item =>{ return {row:i, col: item}})
            Object.defineProperty(this, "row", {value: i, writable: false})
            Object.defineProperty(this, "col", {value: j, writable: false})
            Object.defineProperty(this, "top", {value: top.reverse() , enumerable: true, writable: false});
            Object.defineProperty(this, "bottom", {value: bottom, enumerable: true, writable: false});
            Object.defineProperty(this, "left", {value:left.reverse(), enumerable: true, writable: false});
            Object.defineProperty(this, "right", {value:right, enumerable: true, writable: false});
        }else{
            throw Error("Wrong position :" + i + "--"+ j + ". position value should between 1-5 for row and 1-6 for col");
        }
        let nb = Object.values(this).map(item => item.length!==0?1:0).reduce((a, b)=> a+b)
        Object.defineProperty(this, "neighbour", {value: nb})
    }

    getNextPosition(orient){
        let neighbour = this[orient]
        if (neighbour.length !== 0){
            return neighbour[0]
        }
    }

    isNeighbour(row, col=null){
        let i = row
        let j = col
        if (col === null){
            j = row % CellPosition.MAX_COL
            i = (row - j) / CellPosition.MAX_COL
        }
        return (this.col === j && Math.abs(this.row - i) === 1) || (this.row === i && Math.abs(this.col -j) === 1)
    }
}

module.exports = {
    CellPosition
}