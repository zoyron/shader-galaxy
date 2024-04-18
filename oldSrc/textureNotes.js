import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import imageSource from "../static/textures/minecraft.png"

/*
 * Textures
 */
//{{ const image = new Image();
//
//// we can't use the image directly, first we have to convert it to a texture. It(Texture) is a class in threejs that converts an image
//// to something more GPU friendly(i.e. a texture), also, enabling textures would give us move features
//
//const texture = new THREE.Texture(image);
//texture.colorSpace = THREE.SRGBColorSpace;
//// we use the texture on the material, so instead of a color we can also give a texture to cover the geometry with
//
//// when the image is being loaded, the function inside the object "image" will be triggered
//image.onload = () => {
//  this.exture.needsUpdate = true;
//};
//image.src = imageSource; }}

/*the above was a long way using texture in threejs, now we will see a shorter way
 * we did the above method to know what goes behind the scene of texture loading
*/
const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);
loadingManager.onStart = () => {
  console.log('onStart');
}
loadingManager.onLoad = () => {
  console.log('onLoad');
}
loadingManager.onError = () => {
  console.log('onError');
}
const colorTexture = textureLoader.load(imageSource);

// one texture loader can load multiple textures
colorTexture.colorSpace = THREE.SRGBColorSpace;
// the above three lines are working just as fine to make texture as the big ass fat arrow function we made earlier

// right now we are usign just one texture and one textureLoader, but later on we will be using multiple textures, models, fonts
// to keep a track of all that we will need a loadingManager, so we will use one like below
//colorTexture.repeat.x = 2; // this means how many times the image should be used as a texture on the geometry in x-direction 
//colorTexture.repeat.y = 3; // this means how many times the image should be used as a texture on the geometry in y-direction 
//// the 'repeat' method is of the type 'Vetor2'
////the following 2 methods bring the upper 2 methods to frutation
//colorTexture.wrapS = THREE.MirroredRepeatWrapping; 
//colorTexture.wrapT = THREE.MirroredRepeatWrapping;
colorTexture.magFilter = THREE.NearestFilter;
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
//const geometry = new THREE.BoxGeometry(0.45, 0.45, 0.45, 3, 3, 3);
const geometry = new THREE.TorusGeometry(0.5,0.17,32,50);
//const geometry = new THREE.SphereGeometry(0.5,32,32);
const material = new THREE.MeshBasicMaterial({ map: colorTexture, wireframe: !false });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
