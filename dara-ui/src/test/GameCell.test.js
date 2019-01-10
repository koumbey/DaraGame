import GameCell from "../gameRules/GameCell";

describe("Game Cell should", function() {
    test("throw Exception when at least one of constructor parameter is bag", function(){
        // test with x bad parameter
        expect(() =>new GameCell(-1,0)).toThrow( "Invalid constructor parameters");
        expect(() =>new GameCell(6,0)).toThrow( "Invalid constructor parameters");
        //test with y bad parameter
        expect(() =>new GameCell(0,-1)).toThrow( "Invalid constructor parameters");
        expect(() =>new GameCell(0,7)).toThrow( "Invalid constructor parameters");
        // test with state bad parameter
        expect(() =>new GameCell(0,0, "toto")).toThrow( "Invalid constructor parameters");
    });

    test("change a given cell state", function () {
        let cell = new GameCell(0, 0);
        cell.setState("tige");
        expect(cell.getState()).toEqual("tige")
    });

    test("throw Exception when setState receive a bad paramater", function(){
        let cell = new GameCell(0, 0);
        expect(() =>{cell.setState("toto")}).toThrow("Invalid State")
    });

})