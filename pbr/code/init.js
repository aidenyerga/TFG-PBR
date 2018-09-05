/* INIT
*  This file contains the code to initialize the renderer and the camera. It also prepares some functions for handling window resizes and for rendering.
*  --------------------------
*  Este fichero contiene el código para inicializar el renderizador y la cámara. También prepara unas funciones para encargarse de cuando se redimensione la ventana y para el renderizado.
*/

var container = document.getElementById('container');
var renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild(renderer.domElement);
var canvas = renderer.domElement;
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
controls = new THREE.OrbitControls(camera, renderer.domElement);
var renderprops = {Resolution_Scale: 1.0};
var materials;

window.addEventListener('resize', function(event){
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setSize(parseInt(renderprops.Resolution_Scale*window.innerWidth), parseInt(renderprops.Resolution_Scale*window.innerHeight), false);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
});

var render = function (scene)
{
	renderer.render(scene, camera);
};