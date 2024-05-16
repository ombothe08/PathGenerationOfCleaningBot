import * as THREE from 'three';
import { BufferGeometry, Material, Object3DEventMap,NormalBufferAttributes} from 'three';

interface CloseShapeProps {
  points: React.MutableRefObject<THREE.Vector3[]>;
  line: React.MutableRefObject<THREE.Line<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap> | null | undefined>;
}

const closeShape = (props: CloseShapeProps) => {
  const { points, line } = props;

  if (points.current.length > 2) {
    // Add the first point to the end to close the shape
    points.current.push(points.current[0].clone());
    if (line && line.current) {
      line.current.geometry.setFromPoints(points.current);
    }
  }
};

export default closeShape;
