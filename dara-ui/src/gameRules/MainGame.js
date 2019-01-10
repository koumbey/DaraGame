import Grid from "./Grid";
import GamePlayer from "./GamePlayer";
import IntelligentPlayer from "./IntelligentPlayer";


export default class MainGame {

    static playerId = {FIRST_PLAYER: "1", SECOND_PLAYER: "2"};

    static PlayerType = {HUMAN: 1, COMPUTER:2};

    constructor(player1, player2){
        this.grid  = new Grid();
        if(player1.type === MainGame.PlayerType.COMPUTER) {
            this.player1 = new IntelligentPlayer(this, player1.jeton, MainGame.playerId.FIRST_PLAYER);
        }else{
            this.player1 = new GamePlayer(this.grid, MainGame.playerId.FIRST_PLAYER, player1.jeton, player1.name)
        }
        if(player2.type === MainGame.PlayerType.COMPUTER){
            this.player2 = new IntelligentPlayer(this, player2.jeton, MainGame.playerId.SECOND_PLAYER);
        }else {
            this.player2 = new GamePlayer(this.grid, MainGame.playerId.SECOND_PLAYER, player2.jeton, player2.name);
        }
        this.isFirstStep = true;
        this.endPart = false;
        this.player1.setOpponent(this.player2);
        this.player1.setTour(player1.start);
        this.player2.setTour(!player1.start);
        this.player1.start();
        this.player2.start();
    }

    getGameStates(){
        let result = {};
        result.gridStates = this.grid.getAllStates();
        let playerInfo1 = this.player1.getPlayerInfo();
        let playerInfo2 = this.player2.getPlayerInfo();
        result = {...result, ...playerInfo1.states, ...playerInfo2.states};
        if(this.player1.tour){
            result = {...result, ...playerInfo1.gameInfos}
        }else{
            result = {...result, ...playerInfo2.gameInfos}
        }
        result.point1 = playerInfo1.states.playerPoint;
        result.point2 = playerInfo2.states.playerPoint;
        return result;
    };

    initialiseGameInfo(){
        this.isFirstStep = true;
        this.endPart = false;
        // exchange jeton
        let state1 = this.player1.jetonType;
        let state2 = this.player2.jetonType;
        let tour = this.player1.IsWinner;
        this.player1.prepareNextPart(state2);
        this.player2.prepareNextPart(state1);
        this.player1.setTour(tour);
        this.player2.setTour(!tour);

        this.grid.clearGrid();
    };

    getWhoPlay(state){
        if(this.player1.tour && this.player1.isJeton(state)){
            return this.player1
        }
        else if(this.player2.tour && this.player2.isJeton(state)){
            return this.player2
        }else{
            return null;
        }
    };

    getWinner(){
        if(this.isPartEnded()){
            if (this.player1.IsWinner){
                return this.player1;
            }else{
                return this.player2;
            }
        }
    };

    getJetonWinner(){
        if(this.player1.hasEarnJeton){
            return this.player1;
        }
        else if(this.player2.hasEarnJeton){
            return this.player2;
        }else{
            return null;
        }
    };

    isPartEnded(){
        if(!this.isFirstStep) {
            return (this.player1.IsWinner || this.player2.IsWinner);
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