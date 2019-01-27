import Grid from "./Grid";
import GamePlayer from "./GamePlayer";
import IntelligentPlayer from "./IntelligentPlayer";


export default class MainGame {

    static playerId = {PLAYER: "1", OPPONENT: "2"};

    static PlayerType = {HUMAN: 1, COMPUTER:2};

    constructor(player, opponent){
        this.grid  = new Grid();
        if(player.type === MainGame.PlayerType.COMPUTER) {
            this.player = new IntelligentPlayer(this, player.jeton, MainGame.playerId.PLAYER);
        }else{
            this.player = new GamePlayer(this.grid, MainGame.playerId.PLAYER, player.jeton, player.name)
        }
        if(opponent.type === MainGame.PlayerType.COMPUTER){
            this.opponent = new IntelligentPlayer(this, opponent.jeton, MainGame.playerId.OPPONENT);
        }else {
            this.opponent = new GamePlayer(this.grid, MainGame.playerId.OPPONENT, opponent.jeton, opponent.name);
        }
        this.isFirstStep = true;
        this.endPart = false;
        this.player.setOpponent(this.opponent);
        this.player.setTour(player.start);
        this.opponent.setTour(!player.start);
        this.player.start();
        this.opponent.start();
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
        this.isFirstStep = true;
        this.endPart = false;
        // exchange jeton
        let state1 = this.player.jetonType;
        let state2 = this.opponent.jetonType;
        let tour = this.player.IsWinner;
        this.player.prepareNextPart(state2);
        this.opponent.prepareNextPart(state1);
        this.player.setTour(tour);
        this.opponent.setTour(!tour);

        this.grid.clearGrid();
    };

    getWhoPlay(state){
        if(this.player.tour && this.player.isJeton(state)){
            return this.player
        }
        else if(this.opponent.tour && this.opponent.isJeton(state)){
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

    getJetonWinner(){
        if(this.player.hasEarnJeton){
            return this.player;
        }
        else if(this.opponent.hasEarnJeton){
            return this.opponent;
        }else{
            return null;
        }
    };

    isPartEnded(){
        if(!this.isFirstStep) {
            return (this.player.IsWinner || this.opponent.IsWinner);
        }
        return false;
    };

    placeJetons(dragInfo, dropInfo){
        let result = false;
        let to = dropInfo.pos;
        let from = dragInfo.pos;
        let player = this.getWhoPlay(dragInfo.type);
        if(player && dragInfo.from === "out" && dropInfo.from === "in"){
            result = player.putJetonInGame(from, to);
        }
        return result;
    };

    moveJeton(dragInfo, dropInfo){
        let result = false;
        let to = dropInfo.pos;
        let from = dragInfo.pos;
        let player = this.getWhoPlay(dragInfo.type);
        if(player){
            result = player.moveJeton(from, to);
        }else{
            result = this.getJeton(dragInfo, dropInfo)
        }
        return result;
    };

    getJeton(dragInfo, dropInfo){
        let to = dropInfo.pos;
        let from = dragInfo.pos;
        let player = this.getJetonWinner();
        if(player ){
            this.endPart = player.winJeton(from, to, dragInfo.type);
        }
    };

    playGame(dragInfo, dropInfo){
        if(this.isFirstStep){
            this.placeJetons(dragInfo, dropInfo);
            this.isFirstStep =  this.grid.getFulledCellNumber() < 24;
        }else{
            this.moveJeton(dragInfo, dropInfo);
        }
    };

    IsChangePossible(dragInfo, dropPos){
        if(this.isFirstStep){
            return this.grid.cellArray[dropPos].verifyPlacementRule(dragInfo.type);
        }else{
            return this.grid.cellArray[dropPos].verifyDeplacementRule(dragInfo.pos);
        }
    }
}