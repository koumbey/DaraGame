import Grid from "../gameRules/Grid";
import Cell from "../gameRules/Cell";

describe("Grid should", function () {

    it("have cell with the rigth neighbord" , function () {
        let testGrid = new Grid();
        testGrid.setState(0, Cell.ValueEnum.PIERRE);
        testGrid.setState(5, Cell.ValueEnum.PIERRE);
        testGrid.setState(10, Cell.ValueEnum.PIERRE);
        expect(testGrid.getGridCell(15).getLineNumberState(Cell.ValueEnum.PIERRE,["top", "bottom"])).toBe(3)


    })
});