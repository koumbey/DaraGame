import Cell from "./Cell";

export default class Grid {

    static ColumnNumber = 6;

    static RowNumber = 5;

    static CellNumber = 30;

    constructor(){
        Object.defineProperty(this, "cellArray", {value :[]});
        for (let index = 0; index < Grid.CellNumber; index++){
            this.cellArray.push(new Cell(this, index));
        }
    }

    clearGrid(){
        for (let index = 0; index < Grid.CellNumber; index++){
            this.cellArray[index].setState(Cell.ValueEnum.EMPTY);
        }
    }

    clone(){
        let result =  new Grid();
        for (let index = 0; index < Grid.CellNumber; index++){
            result.cellArray[index].setState(this.getCellState(index));
        }
        return result;
    }

    setState(pos, state){
        if(state === Cell.ValueEnum.EMPTY){
            this.cellArray[pos].setState(state);
            return true;
        }
        if(this.cellArray[pos].verifyPlacementRule(state)) {
            this.cellArray[pos].setState(state);
            return true;
        }
        return false;
    }

    getCellState(pos){
        return this.cellArray[pos].state;
    }

    moveState(from , to){
        let state = this.cellArray[from].state;
        if(state !== Cell.ValueEnum.EMPTY) {
            let isOpt = this.cellArray[to].getOpportunityCells(state);
            if(! isOpt.mobileCells.includes(from) && this.getOpportunityNumber(state) !== 0){
                return {moved: false, reason: "has opportiny", ThirdLined: []}
            }
            if (this.cellArray[to].verifyDeplacementRule(from)) {
                this.cellArray[to].setState(state);
                this.cellArray[from].setState(Cell.ValueEnum.EMPTY);
                return {moved:true, ThirdLined : isOpt.ThirdLined};
            }
        }
        return {moved :false, reason: "move forbiden", ThirdLined: false};
    }

    getMobileCellNumber(state){
        let res = 0;
        this.cellArray.forEach(cell =>{
            if(cell.state === state){
              let emptyNeighbord = cell.getEmptyNeighbords();
              let from = cell.pos;
              if(emptyNeighbord && emptyNeighbord.some(to => this.cellArray[to].verifyDeplacementRule(from))){
                  res += 1;
              }
            }
        });
        return res;
    }

    getFullCellNumber(state){
        let res = 0;
        this.cellArray.forEach(cell =>{
            if(cell.state === state){
                res += 1;
            }
        });
        return res;
    }

    getRemainCellRate(){
       let rate = (this.getFullCellNumber(Cell.ValueEnum.PIERRE))/ (this.getFullCellNumber(Cell.ValueEnum.TIGE));
       if(rate  >= 2){
           return {rate: rate, end: true, winner: Cell.ValueEnum.PIERRE}
       }else if((1/rate) >= 2){
           return {rate: rate, end: true, winner: Cell.ValueEnum.TIGE}
       }else{
           return {rate: rate, end: false};
       }
    }


    getGridCell(pos){
        return this.cellArray[pos];
    }

    getAllStates(){
        let res = [];
        for (let i =0; i<Grid.RowNumber; i++){
            let row =[];
            for(let j=0; j<Grid.ColumnNumber; j++){
                let pos = i*Grid.ColumnNumber +j;
                row.push({pos: pos, state:this.cellArray[pos].state});
            }
            res.push(row);
        }
        return res;
    }

    getOpportunityNumber(state){
        let res = 0;
        this.cellArray.forEach(cell =>{
            if(cell.isEmpty() && cell.getOpportunityCells(state).IsThird){
                res +=1;
            }
        });
       return res;
    }

    hasPosition(pos){
        return 0 <= pos && pos < Grid.CellNumber;
    }

    getVerticalNeighbord(pos, way){
        if(way) {
            let res = [], step = way * Grid.ColumnNumber;
            for (let i = pos + step; this.hasPosition(i); i += step) {
                res.push(i);
            }
            return res;
        }else{
            throw new Error("A way is needed")
        }
    }

    getHorizontalNeighbord(pos, way){
        if(way) {
            let res = [], col = Math.trunc(pos /Grid.ColumnNumber);
            let step = way * 1, i = pos + step;
            while ( -1 < i && i < Grid.CellNumber && Math.trunc(i / Grid.ColumnNumber) === col) {
                res.push(i);
                i += step;
            }
            return res;
        }else {
            throw new Error("A way is needed");
        }
    }

    getFulledCellNumber(){
        let res = 0;
        this.cellArray.forEach(cell =>{
            if(!cell.isEmpty()){
                res += 1;
            }
        });
        return res;
    }

    getInGameJeton(jetonType){
        let res = 0;
        this.cellArray.forEach(cell =>{
            if(cell.state === jetonType){
                res += 1;
            }
        });
        return res;
    }

    getEmptyCellNumber(){
        let res = 0 ;
        this.cellArray.forEach(cell =>{
            if(cell.isEmpty() &&
                (cell.verifyPlacementRule(Cell.ValueEnum.PIERRE)
                    || cell.verifyPlacementRule(Cell.ValueEnum.TIGE))){
                res += 1;
            }
        });
        return res;

    }

    IsGridFull(){
        return (this.getEmptyCellNumber() ===0 && this.getFullCellNumber() < 24)
    }

    evaluateQality(state, oppositeState){
        let res = 0, nb = 0;
        this.cellArray.forEach(cell =>{
            if(cell.isEmpty()){
                let z = cell.getZoneValue();
                let d = cell.getDangerousValue(oppositeState);
                let o = cell.getProximity(state);
                res += (z*d*o);
                nb += 1;
            }
        });

        return res/nb;
    }

}
