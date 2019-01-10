import GamePlayer from "./GamePlayer";
import MainGame from "./MainGame";
import Grid from "./Grid";
export default class IntelligentPlayer extends GamePlayer{
    constructor(mainGame, jetonType, id){
        if(mainGame instanceof MainGame) {
            super(mainGame.grid, id, jetonType, "IA");
            this.currentJeton = 0;
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
        if(grid.setState(pos, this.jetonType)){
            return { candidate: true, pos: pos, quality: grid.evaluateQality(this.jetonType, this.opponent.jetonType)}
        }else{
            return {candidate: false};
        }
    }

    getPlacementPosition(){
         let pos = 0;
         let quality = 0;
         for(let ind =0; ind < Grid.CellNumber; ind++){
             let posQuatiy = this.getQuality(ind);
             //console.log(posQuatiy.pos + "=" +posQuatiy.quality);
             if(posQuatiy.quality > quality){
                 quality = posQuatiy.quality;
                 pos = ind;
             }
         }
         return pos;
    }

    automaticPlay(){
        if(this.IsStarted && this.currentJeton < 12 && this.tour){
            let pos = this.getPlacementPosition();
            let dragInfo = {
                pos:this.currentJeton,
                type: this.jetonType,
                from: 'out'
            };
            let dropInfo = {
                pos: pos,
                type: this.jetonType,
                from: 'in'
            };
            this.mainGame.playGame(dragInfo, dropInfo);
            this.currentJeton +=1;
        }
    }

}