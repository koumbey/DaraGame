import Cell from "./Cell";


export default  class Configuration {
    constructor(cell){
        if(cell instanceof  Cell){
            this.configCenter = cell;
        }else{
            throw new Error("A cell instance is needed");
        }
    }

    getConfiguration(state){
        return this.configCenter.getLineNumberState(state, Cell.Neighbord);
    }

    getConfigInfoForGivenLocation(state, location){
        if(this.configCenter.getLineNumberState(state, [location]) !== 0 ) {
            let mobilePos = this.configCenter.neighbord[location][0];

            let vertical = ["top", "bottom"].filter(item => item !== location);
            let horizontal = ["left", "right"].filter(item => item !== location);
            let v = this.configCenter.getLineNumberState(state, vertical) + 1;
            let h = this.configCenter.getLineNumberState(state, horizontal) + 1;
            return {hasMobile: (h < 4 && v < 4), pos : mobilePos,  canLineThird: (h ===3 && v <4) || (h<4 && v ===3)}
        }
        return {hasMobile: false}
    }
}