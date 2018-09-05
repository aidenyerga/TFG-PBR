/* Scene: Empty
*  A blank scene without lights (other than ambient light) and objects. Lights and objects can be added to the scene through the UI on runtime.
*  -------------------------------
*  Una escena vacía sin luces (a excepción de la ambiental) ni objetos. Las luces y los objetos pueden añadirse a la escena mediante la IU en tiempo de ejecución.
*/

document.title = "BRDF - Scene: Empty";

// Scene
scene.background = new THREE.Color(0x000000);

// Camera position
camera.position.z = 5;

// Lights
var ambientlight = new THREE.AmbientLight(0x505050);

var lights =
{
	ambient: ambientlight,
	directional:
	{
		names: [],
		lights: [],
		helpers: []
	},
	point:
	{
		names: [],
		lights: [],
		helpers: []
	},
	spot:
	{
		names: [],
		lights: [],
		helpers: []
	}
}

addLightsToScene(lights);

// Geometry
var objects =
{
	names: [],
	objs: [],
	shaders: []
};

generateGUIforScene(lights, objects);

var animate = function () {
	resDisp.Resolution = parseInt(renderprops.Resolution_Scale*window.innerWidth)+"x"+parseInt(renderprops.Resolution_Scale*window.innerHeight); res.updateDisplay();
	resDisp.Vertices = ""+parseInt(renderer.info.render.vertices); verts.updateDisplay();
	resDisp.Faces = ""+renderer.info.render.faces; faces.updateDisplay();
	fpsstats.begin();
	msstats.begin();
	render(scene);
	msstats.end();
	fpsstats.end();
	requestAnimationFrame(animate);
};

animate();