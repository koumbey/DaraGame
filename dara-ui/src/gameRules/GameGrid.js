import GameCell from "./GameCell";

function GameGrid(){
    this.GameCells = [];

    for (let i =0; i<=GameCell.Xmax; i++){
        let row =[];
        for(let j=0; j<=GameCell.Ymax; j++){
            let cell = new GameCell(i, j);
            row.push(cell);
        }
        this.GameCells.push(row);
    }

    this.setState = function(i, j, state){
        this.GameCells[i][j].setState(state)
    };

    this.getState = function(i, j){
        return this.getGameCell(i,j).getState();
    };

    this.getGameCell = function(i, j){
        if (GameCell.XYmin <= i && i <= GameCell.Xmax
            && GameCell.XYmin <= j && j <= GameCell.Ymax) {
            return this.GameCells[i][j];
        }else{
            throw new Error("Indexes out of range ("+i +"-"+j+")" );
        }
    };

    this.getAllStates = function(){
        let res = [];
        for (let i =0; i<6; i++){
            let row =[];
            for(let j=0; j<5; j++){
                row.push(this.getState(i, j));
            }
            res.push(row);
        }
        return res;
    };

    this.isPossibleStateChange = function(i, j, state){
        let res = false;
        if(this.getState(i, j) === "empty" && GameCell.stateValues.includes(state)) {
            let nbX = this.getHorizontalStateNumber(i, j, state, 0);
            let nbY = this.getVerticalStateNumber(i, j, state, 0);
            res = nbX < 3 && nbY < 3;
        }
        return res;
    };


    this.getHorizontalStateNumber = function(i,j, state, orientation=1, delta=2){
        let number = 0; let all = orientation ===0;
        let max = 0;
        let start = (i > delta-1)?i-delta:0;
        let end = (i < 6-delta)?i+delta:5;
        for(let ind = start; ind<=end; ind++) {
            if (all  || (!all && (ind - i) * orientation >= 0)) {
                if (ind ===i || this.getState(ind, j) === state) {
                    number += 1;
                } else {
                    max = (max < number) ? number : max;
                    number = 0;
                }
            }
        }
        return (max<number)?number:max;
    };

    this.getVerticalStateNumber = function(i,j, state, orientation=1, delta=2){
        let number = 0, all = orientation ===0, result = 0;
        let start = (j > delta-1)?j-delta:0;
        let end = (j<5-delta)?j+delta:4;
        for(let ind = start; ind<=end; ind++){
            if (all  || (!all && (ind - j) * orientation >= 0)) {
                if (ind === j || this.getState(i, ind) === state) {
                    number += 1;
                } else {
                    result = (result <number)?number:result;
                    number = 0;
                }
            }
        }
        return (result<number)?number:result;
    };

    this.getMovementInfo = function(from, to){
        let res = {move:false, third:false};
        let cellCandidate = this.getGameCell(to[0], to[1]);
        let cellFrom =this.getGameCell(from[0], from[1]);
        if (cellCandidate.getState() === "empty" && cellFrom.isNeighbord(cellCandidate) ){
            let nb1, nb2; let state = cellFrom.getState();
            if(Math.abs(to[0]-from[0]) === 1){
                nb1 = this.getHorizontalStateNumber(to[0], to[1], state, to[0]-from[0], 3);
                nb2 = this.getVerticalStateNumber(to[0], to[1], state, 0, 3);
            }else{
                nb1 = this.getVerticalStateNumber(to[0], to[1], state, to[1]-from[1],3);
                nb2 = this.getHorizontalStateNumber(to[0], to[1], state, 0, 3);
            }
            res.move = (nb1 < 4 && nb2 < 4);
            res.third = (nb1 ===3 || nb2 ===3);
        }
        return res;
    };

    this.getPlacementCellsCandidate = function(state){
        let res = [];
        for (let i =0; i<6; i++){
            for(let j=0; j<5; j++){
                if (this.isPossibleStateChange(i, j, state)){
                    res.push([i, j])
                }
            }

        }
        return res;
    };

    this.getMovementCellsCandidate = function(state){
        let res = [];
        for (let i =0; i<6; i++){
            for(let j=0; j<5; j++){
                let from = [i, j];
                let cell = this.getGameCell(from[0], from[1]);
                if(cell.getState() === state) {
                    let neighbords = cell.getNeighbords();
                    for (let ind=0; ind < neighbords.length; ind++){
                        let to = neighbords[ind];
                        let info = this.getMovementInfo(from, to);
                        if(info.move){
                            res.push({from: from, to:to});
                        }
                    }
                }
            }

        }
        return res;
    };

    this.getGivenStatePositions = function(state){
        let res = [];
        for (let i =0; i<6; i++){
            for(let j=0; j<5; j++){
                if (this.getState(i, j) === state){
                    res.push([i, j])
                }
            }

        }
        return res;
    };

    this.neighbordHasState = function(i,j, state){
        let neighbords = this.getGameCell(i,j).getNeighbords();
        return neighbords.filter(pos => this.getState(pos[0], pos[1])===state).length;
    };

    this.copyGrid = function(){
        let newGrid = new GameGrid();
        for (let i =0; i<=GameCell.Xmax; i++){
            for(let j=0; j<=GameCell.Ymax; j++){
               newGrid.setState(i, j, this.getState(i, j));
            }
        }
        return newGrid;
    };

    this.isPossibleWinJeton = function (from) {
        let neighborList = this.getGameCell(from[0], from[1]).getNeighbords();
        return neighborList.some(cell =>this.getMovementInfo(cell, from).third)
    };

    return this;
}

export default GameGrid;