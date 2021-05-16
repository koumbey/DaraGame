const {GridCell} = require("./GridCell")
const {Grid} =  require("./Grid")

class GamePlayer {
    static stoneNumber = 12;

    constructor(grid, id, stoneType, name) {
        if (grid instanceof Grid){
            this.grid = grid
        }else {
            throw new Error("An instance of Grid is Required")
        }
        this.id = id
        this.name = name
        this.stoneType = stoneType
        this.tour = false;
        this.hasAlignedThree = false;
        this.alignedStone = [];
        this.stones = []
        for(let i = 0; i < GamePlayer.stoneNumber; i++ ){
            this.stones.push(stoneType);
        }
        this.giveUp = false;
        this.point = 0;
        this.IsStarted = false;
        this.IsWinner = false;
        this.opponent = null
        this.earnedStone = 0
    }

    setTour(tour){
        this.tour = tour;
    }

    getGameStonesInfos(){
        return {
            stoneInGame: this.grid.stoneNumber[this.stoneType],
            mobileStones: this.grid.mobileStones[this.stoneType],
            availablePlaces: this.grid.stoneAvailablePlaces[this.stoneType] - this.grid.stoneNumber[this.opponent.stoneType]
        }
    }

    setOpponent(opponent){
        if(opponent instanceof GamePlayer) {
            this.opponent = opponent
            opponent.opponent = this
        }else{
            throw new Error("An instance of GamePlayer is needed");
        }
    }

    hasWonPart() {
        /**
         * - opponent give up or
         */
        if(!this.opponent.giveUp) {
            let rateInfo = this.grid.getRemainCellRate();
            let opponentFreeCell = this.grid.mobileStones[this.opponent.stoneType]
            let freeCell = this.grid.mobileStones[this.stoneType]
            this.IsStarted = ((opponentFreeCell !==0 && freeCell ===0) || (rateInfo.end && rateInfo.winner === this.stoneType));
            this.IsWinner = this.IsStarted
        }else {
            this.IsWinner = true;
        }
        return this.IsWinner;
    }

    putStoneInGame(from, to){
        let result = false;
        if(this.tour && this.opponent && this.grid.setGridCellState(this.stoneType, to)) {
            this.tour = false;
            this.stones[from] = GridCell.ValueEnum.EMPTY;
            this.opponent.setTour(true);
            result = true;
        }
        return result;
    }

    takeOffOpponentStone(from, to, stoneType){
        let partEnded = false;
        let result = false
        if(stoneType === this.opponent.stoneType
            && this.hasAlignedThree
            && this.stones[to] === GridCell.ValueEnum.EMPTY
            && this.grid.changeGridCellState(GridCell.ValueEnum.EMPTY, from)) {
            this.stones[to] = stoneType;
            this.hasAlignedThree = false;
            this.alignedStone = [];
            this.tour = false;
            this.earnedStone += 1
            if(this.hasWonPart()){
                partEnded = true;
                this.addWonPoint();
            }else {
                this.opponent.setTour(true);
            }
            result = true
        }
        return [partEnded, result]
    }

    addWonPoint(){
        if(this.opponent.point === 0) {
            this.point += 1;
            if(this.opponent.earnedStone ===0){
                this.point +=1;
            }
        }
        this.setTour( true );
        this.opponent.point =0;
    };

    moveStone(from, to){
        let result = false;
        let fromCellState = this.grid.getCellByPosition(from).state
        if(this.tour && this.opponent && this.stoneType === fromCellState && this.grid.moveStone(from, to)){
            if(this.grid.getCellByPosition(to).hasThirdAlignedStones()){
                this.hasAlignedThree = true;
                // TO BE COMPLETED
                this.alignedStone = []
            }else{
                this.tour = false;
                this.opponent.setTour(true);
                this.alignedStone = []
            }
            result = true;

        }
        return result;
    }

    getOutGameState(){
        let res = new Array(4);
        let numberRepartition = [1, 2, 2, 3, 4];
        let numPos = 0;
        for(let i=0; i<5; i++){
            res[i] = [];
            let nb = numberRepartition[i];
            for (let j=0; j<4; j++) {
                if (nb > 0) {
                    res[i].push({pos:numPos, state:this.stones[numPos]});
                    numPos +=1;
                    nb -=1;
                }
            }
        }
        return res;
    }

    getPlayerInfo(){
        let result ={states: {}};
        result.states[this.id] = this.getOutGameState();
        if(this.tour){
            result.gameInfos={
                playerTour: this.name+"(" + GridCell.getStateString(this.stoneType) + ")",
                winStone : this.hasAlignedThree,
                alignedStone: this.alignedStone
            }
        }
        result.states.playerPoint = this.point;
        return result;
    };

    prepareNextPart(newType){
        this.stoneType = newType;
        this.hasAlignedThree  = false;
        for(let i = 0; i < GamePlayer.stoneNumber; i++ ){
            this.stones[i] = newType;
        }
    };

    start(){
        this.IsStarted = true;
    }
}

module.exports = {
    GamePlayer
}