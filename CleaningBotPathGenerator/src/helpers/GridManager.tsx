import * as THREE from "three";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import { Cell } from "../data/Cell";

class GridManager {
  private grid: Cell[] = [];
  private insideGrid: Cell[] = [];
  private bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  private turfPolygon: GeoJSON.Feature<GeoJSON.Polygon>;

  constructor(points: THREE.Vector3[], public cellSize: number) {
    this.bounds = this.calculateBounds(points);
    const coordinates = points.map((p) => [p.x, p.z]);
    this.turfPolygon = polygon([coordinates]);
    this.generateGrid();
    this.filterInsideGrid();
  }

  //Function to find the boundry axis value of shape
  private calculateBounds(points: THREE.Vector3[]): {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  } {
    const xs = points.map((p) => p.x);
    const zs = points.map((p) => p.z);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minZ: Math.min(...zs),
      maxZ: Math.max(...zs),
    };
  }

  //Function to generate the grid
  private generateGrid(): void {
    const { minX, maxX, minZ, maxZ } = this.bounds;
    for (let x = minX; x <= maxX; x += this.cellSize) {
      for (let z = minZ; z <= maxZ; z += this.cellSize) {
        this.grid.push({ x, z, inside: false });
      }
    }
  }

  //Function to find the inside grids of shape
  private filterInsideGrid(): void {
    this.insideGrid = this.grid.filter((cell) =>
      booleanPointInPolygon(point([cell.x, cell.z]), this.turfPolygon)
    );
    // Assigning an index to each cell for easier tracking
    this.insideGrid.forEach((cell, index) => (cell.index = index));
  }

  public getInsideGrid(): Cell[] {
    return this.insideGrid;
  }
}

export { GridManager };
