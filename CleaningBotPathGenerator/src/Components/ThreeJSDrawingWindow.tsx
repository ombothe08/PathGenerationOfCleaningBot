import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Controls from "./Controls";
import { GridManager } from "../helpers/GridManager";
import { BotSimulator } from "../helpers/BotSimulator";
import { Cell } from "../data/Cell";

const ThreeJSDrawingWindow = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSketching, setIsSketching] = useState(false);
  const [startCleaning, setStartCleaning] = useState(false);
  const points = useRef<THREE.Vector3[]>([]);
  const line = useRef<THREE.Line>();
  const [path, setPath] = useState<Cell[]>([]);
  const scene = new THREE.Scene();

  useEffect(() => {
    if (!mountRef.current) return;
    // Create scene, camera, and renderer
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("black");
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 5, 10);
    camera.lookAt(scene.position);

    // Add lights
    scene.add(new THREE.AmbientLight(0x404040));
    scene.add(new THREE.DirectionalLight(0xffffff, 1));

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize, false);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Function to handle mouse click event for drawing
    const addPoint = (event: MouseEvent) => {
      if (!isSketching) return;
      const mouse = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

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
          scene.add(line.current);
        } else {
          line.current.geometry.setFromPoints(points.current);
        }
      }
    };

    // Close the shape by connecting the last point to the first point
    const closeShape = () => {
      if (points.current.length > 2) {
        // Add the first point to the end to close the shape
        points.current.push(points.current[0].clone());
        if (line.current) {
          line.current.geometry.setFromPoints(points.current);
        }
      }
    };

    // Start/stop drawing
    const toggleDrawing = () => {
      if (isSketching) {
        // Add event listeners to allow drawing
        window.addEventListener("click", addPoint);
        if (mountRef.current) {
          mountRef.current.style.cursor = "crosshair";
        }
      } else {
        // Remove event listeners to prevent further drawing
        window.removeEventListener("click", addPoint);
        if (mountRef.current) {
          mountRef.current.style.cursor = "crosshair";
        }
        // Close the shape when stopping sketching
        closeShape();
      }
    };
    toggleDrawing();

    // Dispose of resources on cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("click", addPoint); // Remove the click event listener

      if (!isSketching) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isSketching]);

  useEffect(() => {
    const createBoxes = () => {
      path.forEach((point) => {
        // Create box geometry
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const box = new THREE.Mesh(geometry, material);

        // Position the box at the point's coordinates
        box.position.set(point.x, 0, point.z);

        scene.add(box);
      });
    };

    // Check if cleaning process should start
    if (startCleaning) {
      createBoxes();
    }
  }, [path, startCleaning]);

  const handleStartSketching = () => {
    setIsSketching(true);
  };

  const handleStopSketching = () => {
    setIsSketching(false);
  };

  const handleStartCleaning = () => {
    const gridManager = new GridManager(points.current, 1);
    const botSimulator = new BotSimulator(gridManager);
    const newPath = botSimulator.simulate();
    setPath(newPath);
    setStartCleaning(true);
  };

  return (
    <>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>
      <Controls
        onStartSketching={handleStartSketching}
        onStopSketching={handleStopSketching}
        onPlaceChargingPoint={() => {}}
        onStartCleaning={handleStartCleaning}
        onStopCleaning={() => {}}
        isSketching={isSketching}
      />
    </>
  );
};

export default ThreeJSDrawingWindow;
