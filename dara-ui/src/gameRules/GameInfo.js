import {Player} from "./Player";
import GameGrid from "./GameGrid";


function GameInfo(playerTige, playerPierre){

    this.playerTige = playerTige;
    this.playerPierre = playerPierre;

    this.placement = true;
    this.move = false;
    this.endPart = false;
    this.playerPierre.setOppenent(this.playerTige);

    this.getGameStates = function(){
        let result = {};
        result.gridStates = Player.getGameGrid().getAllStates();
       let playerTigeInfo = this.playerTige.getPlayerInfo();
       let playerPierreInfo = this.playerPierre.getPlayerInfo();
       result = {...result, ...playerPierreInfo.states, ...playerTigeInfo.states};
       if(this.playerPierre.tour){
           result = {...result, ...playerPierreInfo.gameInfos}
       }else{
           result = {...result, ...playerTigeInfo.gameInfos}
       }
       result.tigePoint = playerTigeInfo.states.playerPoint;
       result.pierrePoint = playerPierreInfo.states.playerPoint;
       return result;
    };

    this.initialiseGameInfo = function(){
        Player.setGameGrid(new GameGrid());
        this.placement = true;
        this.move = false;
        this.endPart = false;
        // exchange jeton
        let tige = this.playerTige.jeton;
        let pierre = this.playerPierre.jeton;
        let tour = this.playerPierre.hasWonPart();
        this.playerTige.prepareNextPart(pierre);
        this.playerPierre.prepareNextPart(tige);
        this.playerPierre.setTour(tour);
        this.playerTige.setTour(!tour);
    };

    this.getWhoPlay = function(state){
        if(this.playerPierre.tour && this.playerPierre.isJeton(state)){
            return this.playerPierre
        }
        if(this.playerTige.tour && this.playerTige.isJeton(state)){
            return this.playerTige
        }
    };

    this.getWinner = function(){
        if(this.isPartEnded()){
            if (this.playerPierre.hasWonPart()){
                return this.playerPierre;
            }else{
                return this.playerTige;
            }
        }
    };

    this.getWinnerPlayer = function(){
        if(this.playerTige.hasWonJeton()){
            return this.playerTige;
        }
        if(this.playerPierre.hasWonJeton()){
           return this.playerPierre;
        }
    };

    this.placeJetons = function(dragInfo, dropInfo){
        let result = false;
        let to = dropInfo.pos;
        let from = dragInfo.pos;
        let player = this.getWhoPlay(dragInfo.type);
        if(player && player && dragInfo.from === "out"){
            result = player.putJetonInGame(from, to);
        }
        return result;
    };

    this.moveJeton =function(dragInfo, dropInfo){
        let result = false;
        let to = dropInfo.pos;
        let from = dragInfo.pos;
        let player = this.getWhoPlay(dragInfo.type);
        if(player && player){
            result = player.moveJeton(from, to);
        }else{
           result = this.getJeton(dragInfo, dropInfo)
        }
        return result;
    };

    this.getJeton = function(dragInfo, dropInfo){
        let to = dropInfo.pos;
        let from = dragInfo.pos;
        let player = this.getWinnerPlayer();
        if(player && player){
            this.endPart = player.winJeton(from, to, dragInfo.type);
        }

    };

    this.isPartEnded = function(){
        return (this.playerTige.hasWonPart() || this.playerPierre.hasWonPart())
    };

    this.playGame = function(dragInfo, dropInfo){
        if(this.placement){
            this.placeJetons(dragInfo, dropInfo);
            this.placement =  (this.playerPierre.inGameJetons + this.playerTige.inGameJetons !==24);
            if(!this.placement){
                this.move = true;
            }
        }else if (this.move){
            this.moveJeton(dragInfo, dropInfo);
        }
    };
    return this;
}

export default GameInfo;