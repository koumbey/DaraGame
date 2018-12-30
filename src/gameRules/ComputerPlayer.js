import {Player} from "./Player";

function ComputerPlayer(id, jeton, callback, isFirst=false){
    Player.call(this, id, jeton, "computer", isFirst);
    this.afterPlayed = callback;

    this.computerWinJeton = function(){
        let jeton = this.oppenent.jeton;
        let nb = this.getEarnedJeton();
        let to = [parseInt(nb/ 2, 10), nb % 2];
        let candidateToRemove = Player.gameGrid.getGivenStatePositions(jeton);
        let pos = Math.floor(Math.random() * Math.floor(candidateToRemove.length));
        let from = candidateToRemove[pos];
        this.winJeton(from, to, jeton)

    };

    this.computerPlacment = function() {
        let nb = this.inGameJetons;
        let from = [parseInt(nb/2, 10), nb % 2];
        let cellsPossibles = this.placementLevelOne();
        let pos = Math.floor(Math.random() * Math.floor(cellsPossibles.length));
        let to = cellsPossibles[pos].pos;
        this.putJetonInGame(from, to);
    };

    this.computerMovement = function(){
        let movePossible = this.moveLevelOne();
        let pos = Math.floor(Math.random() * Math.floor(movePossible.length));
        let movePosition = movePossible[pos];
        this.moveJeton(movePosition.from, movePosition.to);
        if(this.hasWonJeton()){
            this.computerWinJeton();
        }
    };

    this.setTour = function(tour){
        if (tour){
            this.tour = tour;
            if(this.inGameJetons !==12){
                this.computerPlacment.call(this);
            }else{
                this.computerMovement();
            }
            if (typeof this.afterPlayed === "function") {
                this.afterPlayed();
            }
        }
    };


    this.placementLevelOne = function(){
        let placementList = [], max = 0;
        for(let i = 0 ; i< 6; i++){
            for(let j = 0; j<5; j++){
                if(Player.gameGrid.isPossibleStateChange(i, j, this.jeton)){
                    let priority = this.computePriority(Player.gameGrid, i, j);
                    let pos = {pos: [i,j], priority: priority};
                    if(max < priority){
                        max = priority;
                    }
                    placementList.push(pos)
                }
            }
        }
        return placementList.filter(item => item.priority === max);
    };

    this.moveLevelOne = function(){
        let placementList = [], max = 0;
        for(let i = 0 ; i< 6; i++){
            for(let j = 0; j<5; j++){
                let from = [i, j];
                let cell = Player.gameGrid.getGameCell(i, j);
                if(cell.getState() === this.jeton) {
                    let neighbords = cell.getNeighbords();
                    for (let ind=0; ind < neighbords.length; ind++){
                        let to = neighbords[ind];
                        let move = {from: from, to:to};
                        move.priority = this.computeMovePrioriy(Player.gameGrid, from, to);
                        if(max < move.priority){
                            max = move.priority;
                        }
                        placementList.push(move)
                    }
                }
            }
        }
        return placementList.filter(item => item.priority === max);
    };

    this.computePriority = function(gameGrid, i, j){
        let priority = 0;
        if(gameGrid.neighbordHasState(i, j, this.jeton) !==0){
            priority =+1;
        }
        if(!Player.gameGrid.isPossibleStateChange(i, j, this.oppenent.jeton)){
            priority += (2+gameGrid.neighbordHasState(i,j, this.oppenent.jeton));
        }

        return priority;
    };

    this.computeMovePrioriy = function(gameGrid, from, to){
        let priority = 0;
        let info = gameGrid.getMovementInfo(from, to);
        if(info.third){
            priority +=5
        }else if( info.move){
            let new_grid = gameGrid.copyGrid();
            new_grid.setState(from[0],from[1], "empty");
            if(new_grid.isPossibleWinJeton(from)){
                priority +=-1;
            }else if (new_grid.isPossibleWinJeton(to)){
                priority +=3;
            }else{
                let state = gameGrid.getState(from[0], from[1]);
                new_grid.setState(to[0], to[1], state);
                if(new_grid.isPossibleWinJeton(from)){
                    priority +=2;
                }else {
                    priority +=1;
                }
            }
        }
        return priority;
    };


    this.getJetonPriority = function(){

    };

    return this;
}

export{
    ComputerPlayer
}