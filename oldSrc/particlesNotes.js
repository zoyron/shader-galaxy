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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('./textures/particles/11.png');

/*
 * Particles
 */
//const particleGeometry = new THREE.SphereGeometry(1, 64, 64);
const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true, // here we create perspective, i.e. if the particle is far is should seem small, and large if it's near
  color: 'pink',
  transparent: true,
  alphaMap: particleTexture,
  // The alphaTest is a value between 0 and 1 that enables webgl/gpu to know when not to render the pixel according to that pixel's
  // transparency. by default the value is 0 means that pixel will be rendered anyway
  alphaTest: 0.001,
  depthWrite: false
});
//each individual particle is a plane, so it has only 2 triangles. having plane as an individual particle we put a lot less stress on gpu

/*
 * particles geometry(custom made)
*/
const particleGeometry = new THREE.BufferGeometry();
const count = 5000;

const positions = new Float32Array(count * 3);

// filling the co-ordinate array, i.e. positions with random co-ordinates for the new geometry
for(let i = 0; i< count * 3 ; i++){
  positions[i] = (Math.random() - 0.5) * 4; // setting random positions in the range [-3, 3]

}
// jo particleGeometry karke banaya hai humne, usme hume ab ek attribute daalna hai. following is how that happens
particleGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3), // yaha three ka matlab hai ki ek jo attribute method hai usme kitni entry honi chaiye
  // let's say you made an attribute by the name coordinate. here 3 means ki coordinate attribute me 3 values pass kari jayengi
  // jaise ki ek predefined 'position.set' attribute me bhi 3 pass kar sakte hai hum
)

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// sphere particles
const particleSphereGeometry = new THREE.SphereGeometry(0.5, 50, 50);
const particleSpherematerial = new THREE.PointsMaterial({
  size: 0.01
});
const particleSphere = new THREE.Points(particleSphereGeometry, particleSpherematerial);
scene.add(particleSphere);

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
camera.position.z = 3;
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
  particles.rotation.y = -elapsedTime * 0.05;
  particles.rotation.z = -elapsedTime * 0.05;
  particles.rotation.x = -elapsedTime * 0.05;
  particleSphere.rotation.y = elapsedTime * 0.5;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
