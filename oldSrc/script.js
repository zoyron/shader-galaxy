import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();
gui.close();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {};
parameters.count = 40000;
parameters.size = 0.01;
parameters.radius = 4;
parameters.branches = 4;
parameters.spin = 1;
parameters.randomNess = 0.682;
parameters.insideColor = '#ff6060';
parameters.outsideColor = '#1b3984';

let geometry = null;
let positions = null;
let material = null;
let particles = null;
let colors = null;
const generateGalaxy = () => {
  // destroy old galaxy
  if(particles != null){
    geometry.dispose();
    material.dispose();
    scene.remove(particles);
  }


  geometry = new THREE.BufferGeometry();
  positions = new Float32Array(parameters.count * 3);
  colors = new Float32Array(parameters.count * 3);
  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);


  // filling up the co-ordinates of the particles of the geometry
  for (let i = 0; i < parameters.count ; i++) {
    const i3 = i*3;

    const radius = Math.random() * parameters.radius;
    const branchesAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
    const spinAngle = radius * parameters.spin;
    const randomX = (Math.random() - 0.5) * parameters.randomNess; 
    const randomY = (Math.random() - 0.5) * parameters.randomNess /2; 
    const randomZ = (Math.random() - 0.5) * parameters.randomNess; 

    positions[i3] = Math.cos(branchesAngle + spinAngle) * radius + (randomX / radius);
    positions[i3+1] = randomY / radius;
    positions[i3+2] = Math.sin(branchesAngle + spinAngle) * radius + (randomZ / radius);

    // colors
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius/parameters.radius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // creating the material for the geometry
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });

  // creating the particles
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
};
generateGalaxy();
gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.1).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(12).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomNess').min(0).max(5).step(0.0001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 3;
camera.position.y = 4;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  particles.rotation.y = elapsedTime * 0.05;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
