import Cell from "./Cell";
//import Grid from "./Grid";

export default class GamePlayer {

    static jetonNumber = 12;

    constructor(grid,id, jetonType, name) {
        Object.defineProperty(this, "id", {value: id});
        Object.defineProperty(this, "name", {value: name});
        Object.defineProperty(this, "grid", {value: grid});

        this.jetonType = jetonType;
        this.tour = false;
        this.hasEarnJeton = false;

        Object.defineProperty(this, 'playerJeton', {value: []});
        for(let i = 0; i < GamePlayer.jetonNumber; i++ ){
            this.playerJeton.push(jetonType);
        }

        this.giveUp = false;
        this.point = 0;
        this.IsStarted = false;
        this.IsWinner = false;
    }

    setTour(tour){
        this.tour = tour;
    }

    setOpponent(oppt){
        if(oppt instanceof GamePlayer) {
            Object.defineProperty(this, "opponent", {value: oppt});
            Object.defineProperty(oppt, "opponent", {value:this});
        }else{
            throw new Error("An instance of GamePlayer is needed");
        }
    }

    getEarnedJon(){
        let res = 0;
        this.playerJeton.forEach(item =>{
             if(item !== Cell.ValueEnum.EMPTY && item !== this.jetonType){
                 res += 1;
             }
        });

        return res;
    }

    hasWonPart() {
        if(!this.opponent.giveUp) {
            let rateInfo = this.grid.getRemainCellRate();
            let freeCell = this.grid.getMobileCellNumber(this.opponent.jetonType);
            let myFreeCell = this.grid.getMobileCellNumber(this.jetonType);
            this.IsStarted = ((myFreeCell !==0 && freeCell ===0) || (rateInfo.end && rateInfo.winner === this.jetonType));
            this.IsWinner = this.IsStarted
        }else {
            this.IsWinner = true;
        }
        return this.IsWinner;
    }


    prepareNextPart(newType){
        this.jetonType = newType;
        this.hasEarnJeton  = false;
        //this.setTour(this.hasWonPart());
        for(let i = 0; i < GamePlayer.jetonNumber; i++ ){
            this.playerJeton[i] = newType;
        }
    };


    putJetonInGame(from, to){
        let result = false;
        if(this.tour && this.opponent && this.grid.setState(to, this.jetonType)) {
            this.tour = false;
            this.playerJeton[from] = Cell.ValueEnum.EMPTY;
            //end play
            this.opponent.setTour(true);
            result = true;
        }
        return result;
    };

    winJeton(from, to, jeton){
        let partEnded = false;
        if(jeton !== this.jetonType
            && this.hasEarnJeton
            && this.playerJeton[to] === Cell.ValueEnum.EMPTY) {
            this.playerJeton[to] = jeton;
            this.grid.setState(from,  Cell.ValueEnum.EMPTY);
            this.hasEarnJeton =false;
            this.tour = false;
            if(this.hasWonPart()){
                partEnded = true;
                this.addWonPoint();
            }else {
                this.opponent.setTour(true);
            }
        }
        return partEnded
    };

    getOutGameState(){
        let res = new Array(4);
        let numberRepartition = [1, 2, 2, 3, 4];
        let numPos = 0;
        for(let i=0; i<5; i++){
            res[i] = [];
            let nb = numberRepartition[i];
            for (let j=0; j<4; j++) {
                if (nb > 0) {
                    res[i].push({pos:numPos, state:this.playerJeton[numPos]});
                    numPos +=1;
                    nb -=1;
                }
            }
        }
        return res;
    }

    addWonPoint(){
        if(this.opponent.point === 0) {
            this.point += 1;
            if(this.opponent.getEarnedJon() ===0){
                this.point +=1;
            }
        }
        this.setTour( true );
        this.opponent.point =0;
    };

    moveJeton(from, to){
        let result = false;
        if(this.tour && this.opponent){
            let moveInfo = this.grid.moveState(from, to);
            if(moveInfo.moved){
                if(!moveInfo.thirdLined){
                    this.tour = false;
                    this.opponent.setTour(true);
                }else{
                    this.hasEarnJeton = moveInfo.thirdLined;
                }
                result = true;
            }
        }

        return result;
    };

    getPlayerInfo(){
        let result ={states: {}};
        result.states[this.id] = this.getOutGameState();
        if(this.tour){
            result.gameInfos={
                playerTour: this.name+"(" + Cell.getStateString(this.jetonType) + ")",
                winJeton : this.hasEarnJeton
            }
        }
        result.states.playerPoint = this.point;
        return result;
    };

    isJeton(jeton){
        return jeton === this.jetonType;
    };

    start(){
        this.IsStarted = true;
    }

}