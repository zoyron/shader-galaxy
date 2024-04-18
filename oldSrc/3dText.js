import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'



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
const textTexture = textureLoader.load('./textures/matcaps/4.png' );
const oneTexture = textureLoader.load('./textures/matcaps/8.png');
textTexture.colorSpace = THREE.SRGBColorSpace;
oneTexture.colorSpace = THREE.SRGBColorSpace;


/*
 * RGBELoader for the environment mapping
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});




/*
 * Fonts
*/
// one fontLoader can load multiple fonts
const fontLoader = new FontLoader();
let donut = [];
fontLoader.load(
  './fonts/helvetiker_regular.typeface.json',
  // this function will be triggered once the font is loaded
  (font) => {
    const textGeometry = new TextGeometry('sarlloc', {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4
    });
    textGeometry.computeBoundingBox();
    console.log(textGeometry.boundingBox)
    const textMaterial = new THREE.MeshMatcapMaterial({matcap: textTexture});
    //textMaterial.wireframe = true;
    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);
    text.position.x = -0.85;

    const donutGeometry = new THREE.TorusGeometry(0.25, 0.125, 16, 32);
    const donutMaterial = new THREE.MeshMatcapMaterial({matcap: oneTexture});
    //let donut = [];
    for(let i = 0;i<300;i++){
      // this is an unoptimized code, since we can reuse the geometry and material again and again to create new meshes we can put the
      // follow 2 lines of code outside the loop to make out code faster, we dont have to create geometry and material again and again
      //const donutGeometry = new THREE.TorusGeometry(0.25, 0.125, 16, 32);
      //const donutMaterial = new THREE.MeshMatcapMaterial({matcap: oneTexture});
      const scale = Math.random();
      donut[i] = new THREE.Mesh(donutGeometry, donutMaterial);
      console.log(typeof(donut[i]));
      donut[i].position.x = (Math.random() - 0.5) * 10;
      donut[i].position.y = (Math.random() - 0.5) * 10;
      donut[i].position.z = (Math.random() - 0.5) * 10;
      donut[i].rotation.x = Math.random() * Math.PI;
      donut[i].rotation.y = Math.random() * Math.PI;
      donut[i].scale.x = scale;
      donut[i].scale.y = scale;
      donut[i].scale.z = scale;
      scene.add(donut[i]);
    }
    tick();
  }
);



/**
 * Object
 */
//const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
//const material = new THREE.MeshBasicMaterial({ map: oneTexture });
////material.wireframe = true;
//const sphere = new THREE.Mesh(sphereGeometry, material);
//sphere.position.y = -0.5;
//scene.add(sphere);

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
camera.position.y = 1;
camera.position.z = 6;
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
  for(let i = 0; i < 300 ; i++){
    let rot = 0.5 * elapsedTime;
    donut[i].rotation.y = Math.sin(rot);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

//tick();
