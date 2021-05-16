const {CellPosition} = require("./CellPoint");


class GridCell {

    static ValueEnum = {TIGE:"T", PIERRE:"P", EMPTY:"E"};

    static ORIENTATION = {
        top: {axis: "horizontal", opposite: "bottom"},
        bottom: {axis: "horizontal", opposite: "top"},
        left: {axis: "vertical", opposite: "right"},
        right: {axis: "vertical", opposite: "left"}
    }

    static getOppositeState = function(state){
        if(state ===  GridCell.ValueEnum.EMPTY){
            return null
        }
        return (state === GridCell.ValueEnum.PIERRE)?GridCell.ValueEnum.TIGE:GridCell.ValueEnum.PIERRE
    };

    static getStateString(state){
        for (let key in this.ValueEnum){
            if(this.ValueEnum[key] === state){
                return key;
            }
        }
        throw new Error(state +" is wrong");
    }

    constructor(row, col=null){
        Object.defineProperty(this, "state",{value:GridCell.ValueEnum.EMPTY, writable:true})
        Object.defineProperty(this, "position", {value: new CellPosition(row, col), writable: false})
        Object.defineProperty(this, "isEmpty", {value: true, writable: true})
        let neighbourState = {}
        for (const [key, value] of Object.entries(this.position)) {
            let stateList = value.map(() => GridCell.ValueEnum.EMPTY)
            Object.defineProperty(neighbourState, key, {value: stateList, enumerable: true})
        }
        let configuration = {
            [GridCell.ValueEnum.TIGE]: {horizontal: 0, vertical: 0},
            [GridCell.ValueEnum.PIERRE]: {horizontal: 0, vertical: 0}
        }
        Object.defineProperty(this, "neighbourState",{value: neighbourState, writable: true} )
        Object.defineProperty(this, "configuration", {value: configuration, writable: true})
        this.isMobile = false
    }

    setState(newState) {
        /**
         * set state rule:
         * - horizonal lined < 2
         * - vertical lined < 2
         * @type {{horizontal: number, vertical: number}}
         */

        if (this.canStateBeSet(newState)) {
            this.state = newState;
            this.isEmpty = false
            return true
        }
        return false
    }

    changeState(newState){
        if (this.canStateBeChanged(newState)){
            this.state = newState;
            this.isEmpty = newState === GridCell.ValueEnum.EMPTY
            if (this.isEmpty) this.isMobile = false
            return true
        }
        return false
    }

    setConfiguration(state){
        let horizontal = 0
        let vertical = 0
        if (this.configuration.hasOwnProperty(state)) {
            for (const [key, stateList] of Object.entries(this.neighbourState)) {
                let currentState = state
                let index = -1
                while (currentState === state && index < stateList.length) {
                    index += 1
                    currentState = stateList[index]
                }
                if (GridCell.ORIENTATION.hasOwnProperty(key)) {
                    if (GridCell.ORIENTATION[key].axis === "vertical") vertical += index
                    if (GridCell.ORIENTATION[key].axis === "horizontal") horizontal += index
                }
            }
            this.configuration[state].horizontal = horizontal
            this.configuration[state].vertical = vertical
        }
    }

    canStateBeSet(newState){
        if (this.isEmpty && this.configuration.hasOwnProperty(newState)) {
            let linedStates = this.configuration[newState]
            return linedStates.horizontal < 2 && linedStates.vertical < 2
        }
        return false
    }

    canStateBeChanged(newState){
        if ((!this.isEmpty) && (newState === GridCell.ValueEnum.EMPTY)){
            return true
        }else if (this.isEmpty && this.configuration.hasOwnProperty(newState)) {
            let linedStates = this.configuration[newState]
            return this.isEmpty && linedStates.horizontal < 4 && linedStates.vertical < 4
        }
        return false
    }

    hasThirdAlignedStones(){
        if (!this.isEmpty) {
            let config = this.configuration[this.state]
            return (config.horizontal + 1 === 3) || (config.vertical + 1 === 3)
        }
        return false
    }
}

module.exports = {
    GridCell
}