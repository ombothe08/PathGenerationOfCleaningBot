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
    if (points[0].x !== points[points.length - 1].x || points[0].z !== points[points.length - 1].z) {
      points.push(points[0]);
    }
    const coordinates = points.map((p) => [p.x, p.z]);
    if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
      coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
    coordinates.push(coordinates[0]);
  }
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
    const buffer = 0.001; // Adjust this value as needed
    for (let x = minX + buffer; x <= maxX - buffer; x += this.cellSize) {
      for (let z = minZ + buffer; z <= maxZ - buffer; z += this.cellSize) {
        this.grid.push({ x, z, inside: false });
      }
    }
  }

  //Function to find the inside grids of shape
  private filterInsideGrid(): void {
    this.insideGrid = this.grid.filter((cell) => {
      const cellCenterX = cell.x + this.cellSize / 2;
      const cellCenterZ = cell.z + this.cellSize / 2;
      const isInside = booleanPointInPolygon(point([cellCenterX, cellCenterZ]), this.turfPolygon);
      const isOnBoundary = this.isOnBoundary(cellCenterX, cellCenterX);
    return isInside && !isOnBoundary;
  });
    // Assigning an index to each cell for easier tracking
    this.insideGrid.forEach((cell, index) => (cell.index = index));
  }

  private isOnBoundary(x: number, z: number): boolean {
    
    const polygonCoordinates = this.turfPolygon.geometry.coordinates[0]; 
    for (let i = 0; i < polygonCoordinates.length - 1; i++) {
      const startX = polygonCoordinates[i][0];
      const startY = polygonCoordinates[i][1];
      const endX = polygonCoordinates[i + 1][0];
      const endY = polygonCoordinates[i + 1][1];
  
      const determinant = (endX - startX) * (z - startY) - (x - startX) * (endY - startY);
      if (Math.abs(determinant) < 0.0001) { // Adjust this threshold as needed
        const minX = Math.min(startX, endX);
        const maxX = Math.max(startX, endX);
        const minZ = Math.min(startY, endY);
        const maxZ = Math.max(startY, endY);
        if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
          return true; 
        }
      }
    }
    return false;
  }

  public getInsideGrid(): Cell[] {
    return this.insideGrid;
  }
}

export { GridManager };
