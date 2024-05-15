import { GridManager } from "./GridManager";
import { Cell } from "../data/Cell";
import * as THREE from "three";

class BotSimulator {
  private currentPosition: Cell;
  private visitedCells: Set<number>;
  path: Cell[] = [];

  constructor(
    private gridManager: GridManager,
    initialPosition?: THREE.Vector3
  ) {
    if (!initialPosition) {
      // If no initial position is provided, start from the first cell in the inside grid
      const insideGrid = this.gridManager.getInsideGrid();
      if (insideGrid.length === 0) {
        throw new Error(
          "Cannot start simulation without any cells inside the bounding box."
        );
      }
      this.currentPosition = insideGrid[0];
    } else {
      // Find the nearest grid cell to the initial position provided
      this.currentPosition = this.findNearestGridCell(initialPosition);
    }
    this.visitedCells = new Set([this.currentPosition.index!]);
  }

  //Finding Starting Position of the bot
  private findNearestGridCell(point: THREE.Vector3): Cell {
    const insideGrid = this.gridManager.getInsideGrid();
    let nearestCell: Cell | null = null;
    let minDistance = Number.MAX_VALUE;

    for (const cell of insideGrid) {
      const distance = Math.sqrt(
        Math.pow(cell.x - point.x, 2) + Math.pow(cell.z - point.z, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestCell = cell;
      }
    }

    if (!nearestCell) {
      throw new Error("No cells found in the grid.");
    }

    return nearestCell;
  }

  //Function to move the bot to next cell
  private moveBot() {
    const adjacentCells = this.findAdjacentCells(this.currentPosition);

    if (adjacentCells.length > 0) {
      const nextCell = adjacentCells[0];
      this.currentPosition = nextCell;

      if (nextCell.index !== undefined && nextCell.index !== null) {
        this.visitedCells.add(nextCell.index);
      }
    } else {
      // No adjacent cells found, find the nearest unvisited cell from insideGrid
      const insideGrid = this.gridManager.getInsideGrid();
      let nearestCell: Cell | null = null;
      let minDistance = Number.MAX_VALUE;

      for (const cell of insideGrid) {
        if (
          cell.index !== undefined &&
          typeof cell.index === "number" &&
          !this.visitedCells.has(cell.index)
        ) {
          const distance =
            Math.abs(cell.x - this.currentPosition.x) +
            Math.abs(cell.z - this.currentPosition.z);
          if (distance < minDistance) {
            minDistance = distance;
            nearestCell = cell;
          }
        }
      }

      if (nearestCell) {
        this.currentPosition = nearestCell;
        if (nearestCell.index !== undefined && nearestCell.index !== null) {
          this.visitedCells.add(nearestCell.index);
        }
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
