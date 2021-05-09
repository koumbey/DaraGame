import Grid from "./Grid";

export default class Cell{

    static ValueEnum = {TIGE:"2", PIERRE:"1", EMPTY:"0"};

    static Neighbord = ["top", "bottom", "right", "left"];

    static getOppositeState = function(state){
        if(state === Cell.ValueEnum.EMPTY){
            return null
        }
        if(state === Cell.ValueEnum.PIERRE){
            return Cell.ValueEnum.TIGE
        }else{
            return Cell.ValueEnum.PIERRE;
        }
    };

    static getStateString(state){
        for (let key in this.ValueEnum){
            if(this.ValueEnum[key] === state){
                return key;
            }
        }
        throw new Error(state +" is wrong");
    }

    static IsValidState(state){
        return (this.ValueEnum.EMPTY === state
            || this.ValueEnum.PIERRE === state
            || this.ValueEnum.TIGE === state)
    }

    constructor(grid, pos, state=Cell.ValueEnum.EMPTY){
        if(grid instanceof Grid){
            Object.defineProperty(this, "grid", {value:grid})
        }else{
            throw Error("An instance of Grid is needed to instanciate a Cell Object");
        }
        if(this.grid.hasPosition(pos)){
            Object.defineProperty(this, "pos", {value:pos});
        }else{
            throw  Error("Wrong position :"+pos.toString()+ ".Cell position is betwen 0 and 29");
        }
        if(Cell.getStateString(state)) {
            Object.defineProperty(this, "state",{value:state, writable:true})
        }else{
            throw Error("Wrong state :" + state.toString() + ". state value should be 'empty', 'pierre', 'tige'");
        }

        this.setNeghbords(pos);

    }

    setState(newState){
        if(Cell.IsValidState(newState)){
            this.state = newState;
        }else{
            throw Error("Wrong state :" + newState.toString() + ". state value should be 'empty', 'pierre', 'tige'");
        }
    }

    isEmpty(){
        return this.state === Cell.ValueEnum.EMPTY;
    }

    setNeghbords(pos ){
        let neighbords = {};
        let top =  this.grid.getVerticalNeighbord(pos, -1);
        let bottom =  this.grid.getVerticalNeighbord(pos, 1);
        let left =  this.grid.getHorizontalNeighbord(pos, -1);
        let right =  this.grid.getHorizontalNeighbord(pos, 1);

       // ===========================================================
        Object.defineProperty(neighbords, "top", {value: top, enumerable: true});
        Object.defineProperty(neighbords, "bottom", {value: bottom, enumerable: true});
        Object.defineProperty(neighbords, "left", {value: left, enumerable: true});
        Object.defineProperty(neighbords, "right", {value: right, enumerable: true});

       // ==========================================================
        Object.defineProperty(this, "neighbord", {value: neighbords});
    }

    getNearNeighbordNumber(state){
        let res = 0;
        for(let key in this.neighbord){
            let neigh = this.neighbord[key];
            if(neigh.length !==0 && this.grid.getCellState(neigh[0]) === state){
                res +=1;
            }
        }
        return res;
    }
    getMinNeighBord(){
        let min = 6;
        for (let key in this.neighbord){
            if(min > this.neighbord[key].length){
                min =  this.neighbord[key].length;
            }
        }
        return min;
    }

    getNeighbordNumber(){
        let nb = 0;
        for (let key in this.neighbord){
            if( this.neighbord[key].length > 0){
                nb += 1;
            }
        }
        return nb;
    }

    getLineNeighbordState(state, keys){
        let lined = []
        for(let i in keys){
            let neighbords = this.neighbord[keys[i]], index = 0;
            if(neighbords && neighbords.length >0) {
                while (neighbords.length > index && this.grid.getCellState(neighbords[index]) === state) {
                    lined.push(neighbords[index])
                    index += 1;
                }
            }
        }
        return lined;
    };


    getNeighbordLocation(pos){
        let neighs = this.neighbord;
        let index = Cell.Neighbord.findIndex( item =>{
           return neighs[item].indexOf(pos) === 0;
        });
        if(index !== -1){
            return Cell.Neighbord[index];
        }else{
            return false;
        }
    }

    getConfigInfoForGivenLocation(state, location){
        let nbLoc =  this.getLineNeighbordState(state, [location]);
        if( nbLoc.length !== 0 ) {
            let mobilePos = this.neighbord[location][0];
            let vertical = ["top", "bottom"].filter(item => item !== location);
            let horizontal = ["left", "right"].filter(item => item !== location);
            let nv = this.getLineNeighbordState(state, vertical) ;
            let nh = this.getLineNeighbordState(state, horizontal) ;
            let v = nv.length + 1
            let h = nh.length + 1
            let lined = []
            if (h ===3 && v <4){
                lined = lined.concat( nh)
                lined.push(this.pos)
            }
            if (h<4 && v ===3){
                lined.push(this.pos)
                lined = lined.concat(nv)
            }
            return {
                hasMobile: (h < 4 && v < 4),
                pos : mobilePos,
                ThirdLined: lined,
                total: (nbLoc + h +v)
            }
        }
        return {hasMobile: false}
    }

    getConfigInfos(state){
        return Cell.Neighbord.map(location => this.getConfigInfoForGivenLocation(state, location));
    }

    getNeighbordState(state){
        let keys = Object.keys(this.neighbord);
        return this.getLineNeighbordState(state, keys);
    }

    // the lined three same token ie forbiden
    verifyPlacementRule(state){
        let vertical = ["top", "bottom"];
        let horizontal = ["left", "right"];
        if(this.isEmpty()) {
            return (this.getLineNeighbordState(state, vertical).length < 2
                 && this.getLineNeighbordState(state, horizontal).length < 2);
        }
        return false
    }

    verifyDeplacementRule(from){
        let res = false;
        let state = this.grid.cellArray[from].state;
        let neighborLocation =  this.getNeighbordLocation(from);
        if( neighborLocation && this.isEmpty() && state !== Cell.ValueEnum.EMPTY){
            let vertical = ["top", "bottom"].filter(key => key !== neighborLocation);
            let horizontal = ["left", "right"].filter(key =>  key !== neighborLocation);
            return (this.getLineNeighbordState(state, vertical).length < 3
                && this.getLineNeighbordState(state, horizontal).length < 3);
        }
        return res;
    }

    isNeighbord(pos){
        let keys = Object.keys(this.neighbord);
        return keys.some(k => this.neighbord[k].indexOf(pos) === 0)
    }

    getOpportunityCells(state){
        let res = {IsThird: false, mobileCells: [], ThirdLined:[]};
        this.getConfigInfos(state).forEach(item =>{
            if(item.hasMobile && item.ThirdLined.length > 2){
                res.ThirdLined = item.ThirdLined;
                res.mobileCells.push(item.pos);
            }
        });
        return res;
    }

    isBeginingOpportunityCell(state){
        return this.getNeighbordState(state) === 2;
    }


    getZoneValue(){
        let min = this.getMinNeighBord();
        let nb = this.getNeighbordNumber();
        return 1 + (nb*( min + 1)/(3* (nb +min)));
    }

    getDangerousCell(state){
        let oppositeState = Cell.getOppositeState(state);
        return (this.getNeighbordState(oppositeState) +1)/(this.getNeighbordState(state) + 1);
    }

    getDangerousValue(state){
        let total = this.getLineNeighbordState(state, Cell.Neighbord);
        let opt = this.getOpportunityCells(state);
        return (1 + total * (5*opt.mobileCells.length +1))
    }

    getProximity(state){
        let total = this.getLineNeighbordState(state, Cell.Neighbord);
        let opt = this.getOpportunityCells(state);
        return total + opt.mobileCells.length +1
    }

    getEmptyNeighbords(){
        let res = [];
        for (let key in this.neighbord){
            if(this.neighbord[key].length !==0 && this.grid.getGridCell(this.neighbord[key][0]).isEmpty()){
                res.push(this.neighbord[key][0]);
            }
        }
        return res;
    }

}
