import * as THREE from "three";

//Function to check that bot is inside the boundry box or outside
export const isPointInsidePolygon = (
    point: THREE.Vector3,
    polygon: THREE.Vector3[]
  ) => {
    let intersections = 0;
 
    // Iterate over each pair of consecutive points in the polygon
    for (let i = 0; i < polygon.length; i++) {
      const p1 = polygon[i];
      const p2 = polygon[(i + 1) % polygon.length];
 
      if (p1.y > point.y !== p2.y > point.y) {
        const intersectionX =
          ((p2.x - p1.x) * (point.y - p1.y)) / (p2.y - p1.y) + p1.x;
 
        if (point.x < intersectionX) {
          intersections++;
        }
      }
    }
 
    // If the number of intersections is odd, the point is inside the polygon
    return intersections % 2 === 1;
  };
 