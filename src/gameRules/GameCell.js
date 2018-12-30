function GameCell(x, y, state = "empty"){
    if(GameCell.XYmin <= x && x <= GameCell.Xmax
       && GameCell.XYmin <= y && y <= GameCell.Ymax
       && GameCell.stateValues.includes(state)){
        this.x = x;
        this.y = y;
        this.state = state;
        this.info ={
            minDistance: 30,
        }
    }else{
        throw new Error("Invalid constructor parameters");
    }
    this.getTopNeighbord = function(){
        if(this.y <4) {
            return [this.x, this.y + 1];
        }else{
            return []
        }
    };

    this.getBottomNeighbord = function(){
        if(this.y > 0){
            return [this.x, this.y-1]
        }else{
            return []
        }
    };

    this.getRightNeighbord = function(){
        if(this.x <5){
            return [this.x+1, this.y]
        }else{
            return []
        }
    };

    this.getLeftNeighbord = function(){
        if(this.x >0){
            return [this.x-1, this.y]
        }else{
            return []
        }
    };

    this.getNeighbords = function(){
        let all= [this.getTopNeighbord(),
            this.getBottomNeighbord(),
            this.getRightNeighbord(),
            this.getLeftNeighbord()];
        return all.filter(item => item.length ===2);
    };


    this.setState = function(state){
        if(GameCell.stateValues.includes(state)) {
            this.state = state;
        }else{
            throw new Error("Invalid State");
        }
    };

    this.getState = function(){
        return this.state;
    };

    this.isNeighbord = function(otherGameCell){
        return (Math.abs(this.x- otherGameCell.x)
               + Math.abs(this.y- otherGameCell.y)) ===1
    };

    this.isEqual = function(otherGameCell){
        return (otherGameCell instanceof GameCell && this.x === otherGameCell.x && this.y === otherGameCell.y);
    };

    this.isEmpty = function(){
        return this.state === "empty";
    };
    return this;
}

GameCell.stateValues=["empty", "tige", "pierre"];
GameCell.Xmax = 5;
GameCell.Ymax = 4;
GameCell.XYmin = 0;

export default GameCell