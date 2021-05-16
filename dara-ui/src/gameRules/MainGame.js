const {Grid} = require("./Grid");
const {GamePlayer}  = require("./GamePlayer");
const {IntelligentPlayer} = require("./IntelligentPlayer");


class MainGame {

    static playerId = {PLAYER: "1", OPPONENT: "2"};

    static PlayerType = {HUMAN: 1, COMPUTER:2};

    constructor(player, opponent){
        this.grid  = new Grid();
        if(player.type === MainGame.PlayerType.COMPUTER) {
            this.player = new IntelligentPlayer(this, player.stoneType, MainGame.playerId.PLAYER);
        }else{
            this.player = new GamePlayer(this.grid, MainGame.playerId.PLAYER, player.stoneType, player.name)
        }
        if(opponent.type === MainGame.PlayerType.COMPUTER){
            this.opponent = new IntelligentPlayer(this, opponent.stoneType, MainGame.playerId.OPPONENT);
        }else {
            this.opponent = new GamePlayer(this.grid, MainGame.playerId.OPPONENT, opponent.stoneType, opponent.name);
        }
        this.endPart = false;
        this.player.setOpponent(this.opponent);
        this.player.setTour(player.start);
        this.opponent.setTour(!player.start);
        this.player.start();
        this.opponent.start();
    }

    getPlayerIdAndPoint(playerName){
        if (this.player.name === playerName){
            return { id: this.player.id, point: this.player.point}
        }else{
            return { id: this.opponent.id, point: this.opponent.point}
        }
    }

    getPlayerStoneByName(playerName) {
        return (this.player.name === playerName) ? this.player.stoneType : this.opponent.stoneType;
    }

    getGameStates(){
        let result = {};
        result.gridStates = this.grid.getAllStates();
        let playerInfo = this.player.getPlayerInfo();
        let opponentInfo = this.opponent.getPlayerInfo();
        result = {...result, ...playerInfo.states, ...opponentInfo.states};
        if(this.player.tour){
            result = {...result, ...playerInfo.gameInfos}
        }else{
            result = {...result, ...opponentInfo.gameInfos}
        }
        result.playerPoint = playerInfo.states.playerPoint;
        result.opponentPoint = opponentInfo.states.playerPoint;
        return result;
    };

    initialiseGameInfo(){
        this.endPart = false;
        // exchange stones
        let opponentStoneType = this.player.stoneType;
        let playerStoneType = this.opponent.stoneType
        let tour = this.player.IsWinner;
        this.grid  = new Grid();
        this.player.prepareNextPart(playerStoneType);
        this.opponent.prepareNextPart(opponentStoneType);
        this.player.setTour(tour);
        this.player.grid =  this.grid
        this.opponent.grid =  this.grid
        this.opponent.setTour(!tour);

    };

    getWhoPlay(state){
        if(this.player.tour && this.player.stoneType === state){
            return this.player
        }
        else if(this.opponent.tour && this.opponent.stoneType === state){
            return this.opponent;
        }else{
            return null;
        }
    };

    getWinner(){
        if(this.isPartEnded()){
            if (this.player.IsWinner){
                return this.player;
            }else{
                return this.opponent;
            }
        }
    };


    isPartEnded(){
        if(this.grid.isFilled) {
            return (this.player.IsWinner || this.opponent.IsWinner);
        }
        return false;
    };

    putStoneInGame(dragInfo, dropInfo){
        let result = false;
        let to = dropInfo.pos;
        let from = dragInfo.pos;
        let player = this.getWhoPlay(dragInfo.type);
        if(player && dragInfo.from === "out" && dropInfo.from === "in"){
            result = player.putStoneInGame(from, to);
        }
        return result;
    };

    moveStone(dragInfo, dropInfo){
        let result;
        let to = dropInfo.pos;
        let from = dragInfo.pos;
        let player = this.getWhoPlay(dragInfo.type);
        if(player){
            result = player.moveStone(from, to);
        }else{
            result = this.getOpponentStone(dragInfo, dropInfo)
        }
        return result;
    };

    getOpponentStone(dragInfo, dropInfo){
        let to = dropInfo.pos;
        let from = dragInfo.pos;
        let result = false
        if (this.player.hasAlignedThree){
            [this.endPart, result] = this.player.takeOffOpponentStone(from, to, dragInfo.type)
        }else if (this.opponent.hasAlignedThree){
            [this.endPart, result] = this.opponent.takeOffOpponentStone(from, to, dragInfo.type)
        }
        return result
    };

    playGame(dragInfo, dropInfo){
        if(!this.grid.isFilled){
            return this.putStoneInGame(dragInfo, dropInfo);
        }else{
            return this.moveStone(dragInfo, dropInfo);
        }
    };

    IsChangePossible(dragInfo, dropPos){
        if(this.grid.isFilled){
            return this.grid.cellArray[dropPos].canStateBeSet(dragInfo.type);
        }else{
            return this.grid.cellArray[dropPos].canStateBeChanged(dragInfo.type);
        }
    }

}

module.exports = {
    MainGame
}
