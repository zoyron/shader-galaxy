import * as THREE from 'three';

// making a canvas
const canvas = document.querySelector('canvas.webgl'); // here we made an empty canvas

// now we must initiate a scene to the canvas that we just created
// scene
const scene = new THREE.Scene();

// an object consists of geometry or the outline or shape of something that we want to render, and a material that we would cover it with
// let's first define the geomerty of that object
//const redCubeGeometry = new THREE.BoxGeometry(1,1,1);

// now that we have created the geometry, let's create the material with we want to cover it with
//const meshMaterial = new THREE.MeshBasicMaterial({color:'red'});

// now that we have created the cover material and the geometry, let's join them to make the required object or mesh
//const cubeMesh = new THREE.Mesh(redCubeGeometry, meshMaterial); // this is the cube object
//scene.add(cubeMesh); // added our object to the scene
//cubeMesh.position.x = 0.7; // here 1 could be of any unit depending upon the project you're making
//cubeMesh.position.y = -0.6;
//cubeMesh.position.z = 1;
// instead of the setting position like above, we can use the set method
//cubeMesh.position.set(1.4, 0.6, 1);
// let's say you're making a house project and you decided the units should be foot, just decided it and stick to it, no need to specify
// in the code, and let's say you're building a landscape, you can just decide the units would ke in Kilometers. The catch here is to
// stick to it. So if you decided that units are in meters, and you need to use somehing in 1Km, then put value as 1000 because you have 
// stick to the unit you're decided for yourself in your mind

// rotation: this is not a vector3, this is an Euler. Read about it later on
//cubeMesh.rotation.x = 2;
//cubeMesh.rotation.z = 3.14159 * 0.5;

// and there's no need to do translation in any particular order, it doesn't has to be position before rotation or rotation before positio
// it can be any order and it won't matter and would give you the same result



//cubeMesh.scale.set(2, 0.5, 0.5);
//const axes = new THREE.AxesHelper(2);
//// since axes helper is also an object we must add it to the scene
//scene.add(axes);

// adding a group of three cubes
const group = new THREE.Group();
scene.add(group);
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({color:'red'})
);
group.add(cube1);
cube1.position.x = -2;
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({color:'green'})
);
group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({color:'blue'})
);
cube3.position.x = 2;
group.add(cube3);


const sizes ={
  width: 800,
  height: 600
} // created an object for the dimensions

// now that we have created a scene and an object, let's add a camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

// as of now, both the camera and the object are at the co-ordinates (0,0,0) in the scene, i.e. their default places after creation
// we must move either of the thing to see out object, so let's move the camera
camera.position.z = 3;
scene.add(camera); // added the camera to the scene

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);






















