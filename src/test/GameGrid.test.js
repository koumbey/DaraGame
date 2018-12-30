import GameGrid from "../gameRules/GameGrid";

describe("Game Grid should", function(){
    test("change a given cell state", function(){
      let grid = new GameGrid();
      grid.setState(0, 0, "tige");
      expect(grid.getState(0,0)).toEqual("tige");

    });

    test("return a number of successive state in a horizontal left from a given position", function(){
        let grid = new GameGrid();
        let x =2, y=2;
        expect(grid.getHorizontalStateNumber(x, y, "tige", -1)).toBe(0);
        grid.setState(x-1, y, "tige");
        expect(grid.getHorizontalStateNumber(x, y, "tige", -1)).toBe(1);
        grid.setState(x-2, y, "tige");
        expect(grid.getHorizontalStateNumber(x, y, "tige", -1)).toBe(2);

    });

 test("return a number of successive state in a vertical top from a given position", function(){
        let grid = new GameGrid();
        let x =2, y=2;
        expect(grid.getVerticalStateNumber(x, y, "tige", -1)).toBe(0);
        grid.setState(x, y-1, "tige");
        expect(grid.getVerticalStateNumber(x, y, "tige", -1)).toBe(1);
        grid.setState(x, y-2, "tige");
        expect(grid.getVerticalStateNumber(x, y, "tige", -1)).toBe(2);

    });

    test("return a number of successive state in a horizontal right from a given position", function(){
        let grid = new GameGrid();
        let x =2, y=2;
        expect(grid.getHorizontalStateNumber(x, y, "tige", 1 )).toBe(0);
        grid.setState(x+1, y, "tige");
        expect(grid.getHorizontalStateNumber(x, y, "tige", 1)).toBe(1);
        grid.setState(x+2, y, "tige");
        expect(grid.getHorizontalStateNumber(x, y, "tige", 1)).toBe(2);

    });

    test("return a number of successive state in a Vertical bottom from a given position", function(){
        let grid = new GameGrid();
        let x =2, y=2;
        expect(grid.getVerticalStateNumber(x, y, "tige",1 )).toBe(0);
        grid.setState(x, y+1, "tige");
        expect(grid.getVerticalStateNumber(x, y, "tige",1)).toBe(1);
        grid.setState(x, y+2, "tige");
        expect(grid.getVerticalStateNumber(x, y, "tige",1)).toBe(2);

    });

    test("return a number of successive state in a horizontal from a given position", function(){
        let grid = new GameGrid();
        let x =2, y=2;
        expect(grid.getHorizontalStateNumber(x, y, "tige", 0)).toBe(1);
        grid.setState(x+1, y, "tige"); grid.setState(x-2, y, "tige");
        expect(grid.getHorizontalStateNumber(x, y, "tige", 0)).toBe(2);
        grid.setState(x+2, y, "tige"); grid.setState(x-1, y, "tige");
        expect(grid.getHorizontalStateNumber(x, y, "tige", 0)).toBe(5);

    });
    test("return a number of successive state in a vertical from a given position", function(){
        let grid = new GameGrid();
        let x =2, y=2;
        expect(grid.getVerticalStateNumber(x, y, "tige", 0)).toBe(1);
        grid.setState(x, y-2, "tige");
        expect(grid.getVerticalStateNumber(x, y, "tige", 0)).toBe(1);
        grid.setState(x, y+1, "tige"); grid.setState(x, y-1, "tige");
        expect(grid.getVerticalStateNumber(x, y, "tige", 0)).toBe(4);

    });

    test("return true if a placement is possible", function(){
        let grid = new GameGrid();
        let x =2, y=2;
        expect(grid.isPossibleStateChange(x, y, "tige")).toEqual(true)
        grid.setState(x-1, y, "pierre");
        grid.setState(x+1, y, "pierre");
        expect(grid.isPossibleStateChange(x, y, "tige")).toEqual(true);
        grid.setState(x, y-1, "tige");
        expect(grid.isPossibleStateChange(x, y, "tige")).toEqual(true)
    });

    test("return false if a placement is not possible", function(){
        let grid = new GameGrid();
        let x =2, y=2;
        grid.setState(x, y, "tige");
        expect(grid.isPossibleStateChange(x, y, "tige")).toEqual(false);
        grid.setState(x, y, "empty");
        grid.setState(x+1, y, "tige");
        grid.setState(x-1, y, "tige");
        expect(grid.isPossibleStateChange(x, y, "tige")).toEqual(false);
        grid.setState(x-1, y, "empty");
        grid.setState(x+2, y, "tige");
        expect(grid.isPossibleStateChange(x, y, "tige")).toEqual(false)
    });

    test("return horizontal movement info", function(){
        let grid = new GameGrid();
        let x =2, y=3;
        grid.setState(x, 0, "tige");
        grid.setState(x, 1, "tige");
        grid.setState(x, 2, "pierre");
        grid.setState(x+1, y, "tige");
        let moveInfo = grid.getMovementInfo([x+1, y], [x, y]);
        expect(moveInfo.third).toEqual(false);
        expect(moveInfo.move).toEqual(true);
    });

    test("return vertical movement info", function(){
        let grid = new GameGrid();
        let x =2, y=0;
        grid.setState(0, y, "tige");
        grid.setState(1, y, "tige");
        grid.setState(2, y, "empty");
        grid.setState(3, y, "tige");
        let moveInfo = grid.getMovementInfo([3, 0], [2, 0]);
        expect(moveInfo.third).toEqual(true);
        expect(moveInfo.move).toEqual(true);
    });

    test("return number of neighbord with the same state", function(){
        let grid = new GameGrid();
        grid.setState(2, 2, "tige");
        grid.setState(3, 2, "tige");
        grid.setState(4, 1, "tige");
        expect(grid.neighbordHasState(4,2, "tige")).toEqual(2);
        expect(grid.neighbordHasState(1,2, "tige")).toEqual(1);
    })
});