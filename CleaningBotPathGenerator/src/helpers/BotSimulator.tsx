import { GridManager} from "./GridManager";
import { Cell } from "../data/Cell"

class BotSimulator {
  private currentPosition: Cell;
  private visitedCells: Set<number>;
  path: Cell[] = [];

  constructor(private gridManager: GridManager) {
    const insideGrid = this.gridManager.getInsideGrid();
    if (insideGrid.length === 0) {
      throw new Error(
        "Cannot start simulation without any cells inside the bounding box."
      );
    }

    this.currentPosition = insideGrid[0];
    this.visitedCells = new Set([this.currentPosition.index!]);
  }
  
  //Function to move the bot to next cell
  private moveBot() {
    const adjacentCells = this.findAdjacentCells(this.currentPosition);

    if (adjacentCells.length > 0) {
      const nextCell = adjacentCells[0];
      this.currentPosition = nextCell;

      if (nextCell.index !== undefined) {
        this.visitedCells.add(nextCell.index);
      }
    }
  }
  //Function to find adjacent cell of current cell
  private findAdjacentCells(position: Cell): Cell[] {
    const adjacentCells: Cell[] = [];
    const allCells = this.gridManager.getInsideGrid();

    for (const cell of allCells) {
      if (
        (Math.abs(cell.x - position.x) <= this.gridManager.cellSize &&
          cell.z === position.z) ||
        (Math.abs(cell.z - position.z) <= this.gridManager.cellSize &&
          cell.x === position.x)
      ) {
        adjacentCells.push(cell);
      }
    }

    return adjacentCells.filter(
      (cell) => cell.index !== undefined && !this.visitedCells.has(cell.index)
    );
  }
  
  //Function to find the path of the bot
  public simulate(): Cell[] {
    const insideGrid = this.gridManager.getInsideGrid();
    this.path.push(this.currentPosition);

    while (
      this.visitedCells.size < insideGrid.length &&
      this.path.length < insideGrid.length
    ) {
      // Move the bot to an adjacent cell
      this.moveBot();
      this.path.push(this.currentPosition);
    }
    return this.path;
  }
}

export { BotSimulator };
