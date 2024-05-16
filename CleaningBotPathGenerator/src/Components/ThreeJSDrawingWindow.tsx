import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Controls from "./Controls";
import { GridManager } from "../helpers/GridManager";
import { BotSimulator } from "../helpers/BotSimulator";
import { Cell } from "../data/Cell";
import { isPointInsidePolygon } from "../helpers/PointBoundryChecker";
import CloseShape from "../helpers/CloseShape";

const ThreeJSDrawingWindow = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSketching, setIsSketching] = useState(false);
  const [startCleaning, setStartCleaning] = useState(false);
  const points = useRef<THREE.Vector3[]>([]);
  const line = useRef<THREE.Line>();
  const [path, setPath] = useState<Cell[]>([]);
  const scene = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [clickedPoint] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    // Create scene, camera, and renderer
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setClearColor("black");
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(rendererRef.current.domElement);

    // Add orbit controls
    const controls = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    cameraRef.current.position.set(0, 5, 10);
    cameraRef.current.lookAt(scene.current.position);

    // Add lights
    scene.current.add(new THREE.AmbientLight(0x404040));
    scene.current.add(new THREE.DirectionalLight(0xffffff, 1));

    // Handle window resize
    const onWindowResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", onWindowResize, false);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(scene.current, cameraRef.current);
      }
    };
    animate();

    // Dispose of resources on cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("click", addPoint); // Remove the click event listener

      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      scene.current.clear();
    };
  }, []);

  useEffect(() => {
    const toggleDrawing = (shouldSketch: boolean) => {
      if (shouldSketch) {
        window.addEventListener("click", addPoint);
        if (mountRef.current) {
          mountRef.current.style.cursor = "crosshair";
        }
      } else {
        window.removeEventListener("click", addPoint);
        if (mountRef.current) {
          mountRef.current.style.cursor = "default";
        }
        handleCloseShape();
      }
    };

    toggleDrawing(isSketching);

    return () => {
      toggleDrawing(false);
    };
  }, [isSketching]);

  useEffect(() => {
    if (!startCleaning) return;

    // Flag to determine if the effect should be cancelled
    let cancelled = false;

    const createBoxes = async () => {
      const highlightedCells = new Set();

      for (let i = 0; i < path.length; i++) {
        if (cancelled) return; // Stop execution if cancelled
        const cell = path[i];

        const geometry = new THREE.CircleGeometry(0.1, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const box: THREE.Mesh = new THREE.Mesh(geometry, material);
        box.position.set(cell.x, 0, cell.z);
        scene.current.add(box);

        // Highlight the box if it's not already highlighted
        if (!highlightedCells.has(cell.index)) {
          await highlightBox(box, () => cancelled);
          highlightedCells.add(cell.index);
        }
      }
    };
    createBoxes();

    // Set the cancelled flag to true when the component unmounts or startCleaning changes
    return () => {
      cancelled = true;
    };
  }, [startCleaning]);

  const highlightBox = (
    box: THREE.Mesh,
    isCancelled: () => boolean
  ): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (box.material instanceof THREE.MeshBasicMaterial) {
        (box.material as THREE.MeshBasicMaterial).color.set(0xff0000);
        setTimeout(() => {
          if (isCancelled()) return resolve(); // Resolve immediately if cancelled
          // Change color back to original after 1 second
          (box.material as THREE.MeshBasicMaterial).color.set(0xffffff);
          resolve();
        }, 5);
      }
    });
  };

  const addPoint = (event: MouseEvent) => {
    if (!isSketching || !rendererRef.current || !cameraRef.current) return;
    const mouse = new THREE.Vector2(
      (event.clientX / rendererRef.current.domElement.clientWidth) * 2 - 1,
      -(event.clientY / rendererRef.current.domElement.clientHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);
    if (point) {
      points.current.push(point.clone());

      if (!line.current) {
        const lineMaterial = new THREE.LineBasicMaterial({
          color: "#fff",
          linewidth: 20,
        });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(
          points.current
        );
        line.current = new THREE.Line(lineGeometry, lineMaterial);
        scene.current.add(line.current);
      } else {
        line.current.geometry.setFromPoints(points.current);
      }
    }
  };

  const handleCloseShape = () => {
    CloseShape({
      points,
      line,
    });
  };

  const handleStartSketching = () => {
    setIsSketching(true);
  };

  const handleStopSketching = () => {
    setIsSketching(false);
  };

  const handleStartCleaning = () => {
    const gridManager = new GridManager(points.current, 0.1);

    if (clickedPoint && isPointInsidePolygon(clickedPoint, points.current)) {
      const botSimulator = new BotSimulator(gridManager, clickedPoint);
      const newPath = botSimulator.simulate();
      setPath(newPath);
      setStartCleaning(true);
    } else {
      const botSimulator = new BotSimulator(gridManager);
      const newPath = botSimulator.simulate();
      setPath(newPath);
      setStartCleaning(true);
    }
  };

  const handleStopCleaning = () => {
    setStartCleaning(false);
  };

  const handlePlaceCleaningBot = () => {
    const gridManager = new GridManager(points.current, 0.1);
    const botSimulator = new BotSimulator(gridManager);
    const newPath = botSimulator.simulate();
    setPath(newPath);
    const geometry = new THREE.CircleGeometry(0.1, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow color
    const circle = new THREE.Mesh(geometry, material);

    const firstCell = newPath[0];
    circle.position.set(firstCell.x, 0, firstCell.z);
    scene.current.add(circle);

    if (rendererRef.current) {
      document.body.appendChild(rendererRef.current.domElement);
    }
  };

  return (
    <>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>
      <Controls
        onStartSketching={handleStartSketching}
        onStopSketching={handleStopSketching}
        onPlaceChargingPoint={handlePlaceCleaningBot}
        onStartCleaning={handleStartCleaning}
        onStopCleaning={handleStopCleaning}
        isSketching={isSketching}
      />
    </>
  );
};

export default ThreeJSDrawingWindow;
