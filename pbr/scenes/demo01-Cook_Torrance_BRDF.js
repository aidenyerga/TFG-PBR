/* DEMO 01 [Cook-Torrance BRDF]
*  A demo scene with lights and objects using the Cook-Torrance BRDF.
*  --------------------
*  Una escena demo con luces y objetos usando el BRDF Cook-Torrance.
*/

document.title = "BRDF - Scene: Demo 1 [Cook-Torrance BRDF]";

// Scene
scene.background = new THREE.Color(0x000000);

// Camera position
camera.position.z = 5;

// Lights
var ambientlight = new THREE.AmbientLight(0x505050);
var directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
var directionalLight2 = new THREE.DirectionalLight(0xff0000, 1.0);
var pointLight = new THREE.PointLight(0xffffff, 1, 100);
var spotLight = new THREE.SpotLight(0xffffff, 1.0, 6);

// Default light values
directionalLight1.position.set(3, 4, 0);
directionalLight1.target.position.set(2, 3, 0);
directionalLight2.target.position.set(0, 2, 0);
directionalLight2.target.position.set(0, 0, 0);
directionalLight2.visible = false;
pointLight.position.set(0, 0, 2);
spotLight.position.set(0, 1.5, 5);
spotLight.angle = THREE.Math.degToRad(35);
spotLight.distance = 5.5;
spotLight.target.position.set(0, 0, 2);

// Helpers
var helper1 = new THREE.DirectionalLightHelper(directionalLight1, 1);

var helper2 = new THREE.DirectionalLightHelper(directionalLight2, 1);
helper2.visible = false;

var pointLightHelper = new THREE.PointLightHelper(pointLight, 1);

var spotLightHelper = new THREE.SpotLightHelper(spotLight);

var lights =
{
	ambient: ambientlight,
	directional:
	{
		names: ["Directional Light 1", "Directional Light 2"],
		lights: [directionalLight1, directionalLight2],
		helpers: [helper1, helper2]
	},
	point:
	{
		names: ["Point Light"],
		lights: [pointLight],
		helpers: [pointLightHelper]
	},
	spot:
	{
		names: ["Spot Light"],
		lights: [spotLight],
		helpers: [spotLightHelper]
	}
}

addLightsToScene(lights);

// Geometry
var plane = new THREE.Mesh(new THREE.PlaneBufferGeometry( 10, 10, 10 ), materials.cook_torrance.plastic.clone() );
plane.rotation.x = THREE.Math.degToRad(-90);
plane.position.y = -1.5;
var cube = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 1 ), materials.cook_torrance.gold.clone() );
var sphere = new THREE.Mesh(new THREE.SphereBufferGeometry( 0.5, 32, 32 ), materials.cook_torrance.lowplastic.clone() );
sphere.position.x += 2.0;
var cone =  new THREE.Mesh(new THREE.ConeBufferGeometry( 0.5, 1, 32 ), materials.cook_torrance.aluminium.clone() );
cone.position.x -= 2.0;

var objects =
{
	names: ["Floor", "Cube", "Sphere", "Cone"],
	objs: [plane, cube, sphere, cone],
	shaders: ["cook-torrance", "cook-torrance", "cook-torrance", "cook-torrance"]
};

addObjsToScene(objects);
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