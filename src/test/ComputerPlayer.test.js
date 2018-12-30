import {ComputerPlayer} from "../gameRules/ComputerPlayer";
import {Player} from "../gameRules/Player";
import GameGrid from "../gameRules/GameGrid";


describe("Computer player should", function(){

    it("should return", function(){
        let callback = jest.fn();
        let gameGrid = new GameGrid();
        gameGrid.setState(1,0,"tige");
        gameGrid.setState(1,1,"tige");
        gameGrid.setState(1,2,"pierre");
        gameGrid.setState(2,1,"pierre");
        gameGrid.setState(2,3,"pierre");
        Player.setGameGrid(gameGrid);
        let computer = new ComputerPlayer("playerTige","tige", callback, false);
        computer.setOppenent(new Player("id", "pierre", "issouf", true));
        let candidate = computer.placementLevelOne();
        expect(candidate[0].priority).toEqual(5);
        expect(candidate).toHaveLength(1);
    })
});
