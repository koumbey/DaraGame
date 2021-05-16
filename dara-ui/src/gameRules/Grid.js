const {GridCell} = require("./GridCell");
const {CellPosition} = require("./CellPoint");


class Grid {
    static CellNumber = 30;
    constructor(){
        this.cellArray = []
        for (let index = 0; index < Grid.CellNumber; index++){
            this.cellArray.push(new GridCell(index));
        }
        this.actionHistory = []
        this.stoneNumber =  {[GridCell.ValueEnum.TIGE]:0 ,[GridCell.ValueEnum.PIERRE]: 0}
        this.stoneAvailablePlaces = {[GridCell.ValueEnum.TIGE]: Grid.CellNumber, [GridCell.ValueEnum.PIERRE]: Grid.CellNumber}
        this.mobileStones = {[GridCell.ValueEnum.TIGE]: 0, [GridCell.ValueEnum.PIERRE]: 0}
        this.isFilled = false
    }

    getCellByPosition(row, col=null){
        let index = row
        if (col !== null){
            index = (row * CellPosition.MAX_COL) + col
        }
        return this.cellArray[index]
    }

    clone(){
        let result =  new Grid();
        for (let index = 0; index < Grid.CellNumber; index++){
            result.cellArray[index] = this.cellArray[index]
        }
        result.stoneNumber = {...this.stoneNumber}
        result.mobileStones = {...this.mobileStones}
        result.stoneAvailablePlaces = {...this.stoneAvailablePlaces}
        result.isFilled = this.isFilled
        return result;
    }

    setGridCellState(state, row, col=null){
        let targetCell =  this.getCellByPosition(row, col)
        let result = targetCell.setState(state)
        if (result){
            this.setNeighbourStateChange(targetCell, state, GridCell.ValueEnum.EMPTY);
            this.stoneNumber[state] += 1
            this.stoneAvailablePlaces[state] -= 1
            this.actionHistory.push({action:"setGridCellState", state: state, position: {row: row, col: col}})
            this.isFilled = this.stoneNumber[GridCell.ValueEnum.TIGE] + this.stoneNumber[GridCell.ValueEnum.PIERRE] === 24
            this.updateMobileStone(row, col)
            this.updateNeighbourMobileState(targetCell)
        }
        return result
    }

    setNeighbourStateChange(targetCell, state, previewState) {
        let configState = (state !== GridCell.ValueEnum.EMPTY)? state: previewState
        for (const [key, value] of Object.entries(targetCell.position)) {
            if (GridCell.ORIENTATION.hasOwnProperty(key)) {
                for (const [index, pos] of value.entries()) {
                    let neighbour = this.getCellByPosition(pos.row, pos.col)
                    let canBeSetBefore = neighbour.canStateBeSet(configState)
                    let oppositeOrient = GridCell.ORIENTATION[key].opposite
                    neighbour.neighbourState[oppositeOrient][index] = state
                    neighbour.setConfiguration(configState)
                   this.updateAvailableStone(neighbour, canBeSetBefore, state, previewState)
                }
            }
        }
    }

    updateAvailableStone(targetCell, canBeSetBefore, state, previewState){
        if (!this.isFilled) {
            if ( targetCell.isEmpty && previewState === GridCell.ValueEnum.EMPTY && canBeSetBefore && !targetCell.canStateBeSet(state)) {
                this.stoneAvailablePlaces[state] -= 1
            } else if (previewState !== GridCell.ValueEnum.EMPTY &&  !canBeSetBefore && targetCell.canStateBeSet(previewState)) {
                this.stoneAvailablePlaces[previewState] += 1
            }
        }
    }

    changeGridCellState(state, row, col=null){
        let targetCell =  this.getCellByPosition(row, col)
        let previewState = targetCell.state
        let result = targetCell.changeState(state)
        if (result){
            this.setNeighbourStateChange(targetCell, state, previewState);
            if (this.stoneNumber.hasOwnProperty(state)) {
                this.stoneNumber[state] += 1
            }else{
                this.stoneNumber[previewState] -= 1
            }
            this.actionHistory.push({action:"changeGridCellState", state: state, previewState:previewState, position: {row: row, col: col}})
            this.updateMobileStone(row, col)
            this.updateNeighbourMobileState(targetCell)
        }
        return result
    }

    updateMobileStone(row, col=null){
        let targetCell =  this.getCellByPosition(row, col)
        if (targetCell.state !== GridCell.ValueEnum.EMPTY){
            const iterator = Object.entries(targetCell.position)
            let isFound = false
            let index = 0
            while (! isFound && index < iterator.length){
                let [key, value] = iterator[index]
                if (value.length !==0 && GridCell.ORIENTATION.hasOwnProperty(key)) {
                    let pos = value[0]
                    let neighbour = this.getCellByPosition(pos.row, pos.col)
                    if (neighbour.canStateBeChanged(targetCell.state)){
                        isFound = true
                    }
                }
                index += 1
            }
            if (!targetCell.isMobile && isFound){
                this.mobileStones[targetCell.state] += 1
            }else if (targetCell.isMobile && !isFound){
                this.mobileStones[targetCell.state] -= 1
            }
            targetCell.isMobile = isFound
        }
    }

    updateNeighbourMobileState(targetCell){
        for (const [key, value] of Object.entries(targetCell.position)) {
            if (value.length !==0 && GridCell.ORIENTATION.hasOwnProperty(key)) {
                let pos = value[0]
                this.updateMobileStone(pos.row, pos.col)
            }
        }
    }

    rollback(){
        if (this.actionHistory.length > 0){
            let lastAction =  this.actionHistory.pop()
            let previewState =  GridCell.ValueEnum.EMPTY
            if (lastAction.hasOwnProperty("previewState")){
                previewState = lastAction.previewState
            }
            let targetCell =  this.getCellByPosition(lastAction.position.row, lastAction.col)
            let currentState =  targetCell.state
            let result = targetCell.changeState(previewState)
            if (result){
                this.setNeighbourStateChange(targetCell, previewState, currentState);
                if (this.stoneNumber.hasOwnProperty(previewState)) {
                    this.stoneNumber[previewState] += 1
                }else{
                    this.stoneAvailablePlaces[currentState] += 1
                    this.stoneNumber[currentState] -= 1
                    this.mobileStones[currentState] -= 1
                }
                this.isFilled = this.stoneNumber[GridCell.ValueEnum.TIGE] + this.stoneNumber[GridCell.ValueEnum.PIERRE] === 24
                this.updateNeighbourMobileState(targetCell)
            }
            return result
        }
    }

    getRemainCellRate(){
        let rate = (this.stoneNumber[GridCell.ValueEnum.PIERRE]) / (this.stoneNumber[GridCell.ValueEnum.TIGE])
        if(rate  >= 2){
            return {rate: rate, end: true, winner: GridCell.ValueEnum.PIERRE}
        }else if((1/rate) >= 2){
            return {rate: rate, end: true, winner: GridCell.ValueEnum.TIGE}
        }else{
            return {rate: rate, end: false};
        }
    }

    moveStone(from, to){
        let fromCell = this.getCellByPosition(from)
        let targetCell = this.getCellByPosition(to)
        let state = fromCell.state
        if (!fromCell.isEmpty && targetCell.isEmpty &&fromCell.position.isNeighbour(to) && targetCell.canStateBeChanged(state)){
            let rep = this.changeGridCellState(GridCell.ValueEnum.EMPTY, from)
            if (rep){
                return this.changeGridCellState(state, to)
            }
            return rep
        }
        return false
    }

    getAllStates() {
        let res = [];
        for (let i = 0; i < CellPosition.MAX_ROW; i++) {
            let row = [];
            for (let j = 0; j < CellPosition.MAX_COL; j++) {
                let pos = (i * CellPosition.MAX_COL) + j;
                row.push({pos: pos, state: this.cellArray[pos].state});
            }
            res.push(row);
        }
        return res;
    }

}
module.exports = {
    Grid
}