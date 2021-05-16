const {GamePlayer} = require("./GamePlayer");
const {MainGame} = require("./MainGame");
const {Grid} = require("./Grid");
const _ = require('lodash');


class IntelligentPlayer extends GamePlayer{
    constructor(mainGame, stoneType, id){
        if(mainGame instanceof MainGame) {
            super(mainGame.grid, id, stoneType, "IA");
            this.currentStone = 0;
            Object.defineProperty(this, "mainGame", {value: mainGame});
        }else{
            throw new Error("An instance of MainGame is needed");
        }

    }

    setTour(tour){
        super.setTour(tour);
        this.automaticPlay();
    }
    start(){
        super.start();
        this.automaticPlay();
    }

    getQuality(pos){
        let grid = this.mainGame.grid.clone();
        if(grid.setState(pos, this.stoneType)){
            return { candidate: true, pos: pos, quality: this.getPositionMetrics()}
        }else{
            return {candidate: false};
        }
    }

    getPlacementPosition(){
        let pos = 0;
        let quality = 0;
        for(let ind =0; ind < Grid.CellNumber; ind++){
            let positionMetrics = this.getQuality(ind);
            if( positionMetrics.quality > quality){
                quality =  positionMetrics.quality;
                pos = ind;
            }
        }
        return pos;
    }

    automaticPlay(){
        if(this.IsStarted && this.currentJeton < 12 && this.tour){
            let pos = this.getPlacementPosition();
            let dragInfo = {
                pos:this.currentStone,
                type: this.stoneType,
                from: 'out'
            };
            let dropInfo = {
                pos: pos,
                type: this.stoneType,
                from: 'in'
            };
            this.mainGame.playGame(dragInfo, dropInfo);
            this.currentJeton +=1;
        }
    }

    getPositionMetrics(){
        let res = 0, nb = 0;
        this.grid.cellArray.forEach(cell =>{
            if(cell.isEmpty() && cell.canStateBeSet(this.stoneType)){
                let z = this.getZoneValue(cell);
                let d = this.getDangerousValue(cell, this.opponent.stoneType);
                let o = this.getProximity(cell, this.stoneType);
                res += (z*d*o);
                nb += 1;
            }
        });
        return res/nb;
    }

    getZoneValue(cell){
        let min = _.min(Object.values(cell.position).map(array => array.length))
        let nb = cell.position.neighbour
        return 1 + (nb*( min + 1)/(3* (nb +min)));
    }

    getDangerousValue(cell, state){
        let total = _.max([cell.configuration[state].horizontal, cell.configuration[state].vertical])
        let mobileStones = this.grid.mobileStones[state]
        return (1 + total * (5*mobileStones +1))
    }
    getProximity(cell, state){
        let total = _.max([cell.configuration[state].horizontal, cell.configuration[state].vertical])
        let mobileStones = this.grid.mobileStones[state]
        return total + mobileStones +1
    }

}

module.exports = {
    IntelligentPlayer
}