import GameGrid from "./GameGrid";
import {ComputerPlayer} from "./ComputerPlayer";

function Player(id, jeton, name, isFirst=false){
    if(Player.JetonTypes.includes(jeton)){
        this.name = name;
        this.point = 0;
        this.id = id;
        this.tour = isFirst;
        this.jeton = jeton;
        this.playerJetons = new Array(4);
        this.earnedJeton = {
            number: 0, winJeton: false
        };
        this.inGameJetons = 0;
        for(let i=0; i<4; i++){
            this.playerJetons[i] = [jeton, jeton, jeton];
        }
    }

    this.prepareNextPart = function(newJeton){
        this.tour = this.hasWonPart();
        this.jeton = newJeton;
        this.playerJetons = new Array(4);
        this.earnedJeton ={
            number: 0, winJeton: false
        };
        this.inGameJetons = 0;
        for(let i=0; i<4; i++){
            this.playerJetons[i] = [newJeton, newJeton, newJeton];
        }
    };

    this.setOppenent = function(oppt){
        if (oppt instanceof Player || oppt instanceof ComputerPlayer){
            this.oppenent = oppt;
            oppt.oppenent = this;
        }
    };

    this.hasWonJeton = function(){
        return this.earnedJeton.winJeton;
    };

    this.hasWonPart = function(){
        return (this.getEarnedJeton() ===10);
    };

    this.setTour = function(tour){
        this.tour = tour;
    };

    this.putJetonInGame = function(from, to){
        let result = false;
        if(this.tour && this.oppenent
            && Player.gameGrid.isPossibleStateChange(to[0], to[1], this.jeton)) {
            this.inGameJetons +=1;
            this.tour = false;
            Player.gameGrid.setState(to[0], to[1], this.jeton);
            this.playerJetons[from[0]][from[1]] = "empty";
            //end play
            this.oppenent.setTour(true);
            result = true;
        }
        return result;
    };

    this.moveJeton = function(from, to){
        let result = false;
        if(this.tour && this.oppenent){
            let moveInfo = Player.gameGrid.getMovementInfo(from, to);
            if(moveInfo.move){
                Player.gameGrid.setState(from[0], from[1], "empty");
                Player.gameGrid.setState(to[0], to[1], this.jeton);
                if(!moveInfo.third){
                    this.tour =false;
                    this.oppenent.setTour(true);
                }else{
                    this.earnedJeton.winJeton = moveInfo.third;
                }
                result = true;
            }
        }

        return result;
    };

    this.getName = function(){
        return this.name;
    }

    this.winJeton = function(from, to, jeton){
        let partEnded = false;
        if(jeton !== this.jeton
            && this.earnedJeton.winJeton
            && this.playerJetons[to[0]][to[1]] === "empty") {
            this.playerJetons[to[0]][to[1]] = jeton;
            Player.gameGrid.setState(from[0], from[1], "empty");
            this.earnedJeton.number +=1;
            this.earnedJeton.winJeton =false;
            this.tour = false;
            if(this.hasWonPart()){
               partEnded = true;
               this.addWonPoint();
            }else {
                this.oppenent.setTour(true);
            }
        }
        return partEnded
    };

    this.getEarnedJeton = function(){
        return this.earnedJeton.number;
    };

    this.getPlayerInfo = function(){
        let result ={states: {}};
        result.states[this.id]=this.playerJetons;
        if(this.tour){
            result.gameInfos={
                playerTour: this.name+"(" +this.jeton + ")",
                winJeton : this.earnedJeton.winJeton
            }
        }
        result.states.playerPoint = this.getPoint();
        return result;
    };

    this.isJeton = function(jeton){
        return jeton === this.jeton;
    };

    this.getPoint = function(){
        return this.point;
    };

    this.addWonPoint = function(){
        if(this.oppenent.getPoint() === 0) {
            this.point += 1;
            if(this.oppenent.earnedJeton.number ===0){
                this.point +=1;
            }
        }
        this.tour = true;
        this.oppenent.point =0;
    };

    return this;
}

Player.setGameGrid = function(gameGrid){
    Player.gameGrid = gameGrid;
};

Player.getGameGrid =function(){
    return Player.gameGrid;
};

Player.JetonTypes = ["tige", "pierre"];
Player.TotalJeton = 12;
Player.gameGrid = new GameGrid();

export {
    Player
}