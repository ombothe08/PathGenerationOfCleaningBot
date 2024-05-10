import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Controls from "./Controls";

const CanvasContainer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSketching, setIsSketching] = useState(false);
  const points = useRef<THREE.Vector3[]>([]);
  const line = useRef<THREE.Line>();
 
  useEffect(() => {
    if (!mountRef.current) return;
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
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
        line.current.geometry.setFromPoints(points.current);
      }
    };
 
    // Start/stop drawing
    const toggleDrawing = () => {
      if (isSketching) {
        // Add event listeners to allow drawing
        window.addEventListener("click", addPoint);
        mountRef.current.style.cursor = "crosshair";
      } else {
        // Remove event listeners to prevent further drawing
        window.removeEventListener("click", addPoint);
        mountRef.current.style.cursor = "default";
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
 
  // Handlers to start/stop sketching
  const handleStartSketching = () => {
    setIsSketching(true);
  };
 
  const handleStopSketching = () => {
    setIsSketching(false);
  };
 
  return (
    <>
      <Controls
        onStartSketching={handleStartSketching}
        onPlaceChargingPoint={() => {}}
        onStartCleaning={() => {}}
        onStopCleaning={() => {}}
        isSketching={isSketching}
        onStopSketching={handleStopSketching}
      />
      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
    </>
  );
};
 
export default CanvasContainer;
 