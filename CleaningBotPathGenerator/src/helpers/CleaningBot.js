import React from 'react';
import * as THREE from 'three';

const CleaningBot = ({ position }) => {
    console.log("in cleaning bot");
  // Here you can define the geometry and material for your cleaning bot
  const radius = 32;
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 'white' });
  const cleaningBot = new THREE.Mesh(geometry, material);
  cleaningBot.position.copy(position);

  return cleaningBot; // Note: This is not a JSX component
};

export default CleaningBot;