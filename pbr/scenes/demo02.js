/* DEMO 02
*  A demo scene with lights and objects using the Principled BRDF.
*  --------------------
*  Una escena demo con luces y objetos usando el BRDF Principled.
*/

document.title = "BRDF - Scene: Demo 2 [Principled BRDF]";

// Scene
scene.background = new THREE.Color(0x639ec7);
bgcolor.Background = "#639EC7"

// Camera position
camera.position.z = 5;

// Lights
var ambientlight = new THREE.AmbientLight(0x4e5155);
var directionalLight1 = new THREE.DirectionalLight(0xffe1d1, 1.0);
var pointLight = new THREE.PointLight(0xffffff, 1, 100);
var spotLight = new THREE.SpotLight(0xff0000, 1.0, 6);
var spotLight2 = new THREE.SpotLight(0x00ff00, 1.0, 6);
var spotLight3 = new THREE.SpotLight(0x0000ff, 1.0, 6);

// Default light values
directionalLight1.position.set(3, 4, 0);
directionalLight1.target.position.set(2, 3, 0);
pointLight.position.set(0, 0, 2);
spotLight.position.set(5, 1.5, 0);
spotLight.angle = THREE.Math.degToRad(25);
spotLight.distance = 2;
spotLight.target.position.set(3, 0, 0);
spotLight2.position.set(-5, 1.5, 0);
spotLight2.angle = THREE.Math.degToRad(25);
spotLight2.distance = 2;
spotLight2.target.position.set(-3, 0, 0);
spotLight3.position.set(0, 1.5, -5);
spotLight3.angle = THREE.Math.degToRad(25);
spotLight3.distance = 2;
spotLight3.target.position.set(0, 0, -3);

// Helpers
var helper1 = new THREE.DirectionalLightHelper(directionalLight1, 1);

var pointLightHelper = new THREE.PointLightHelper(pointLight, 1);

var spotLightHelper = new THREE.SpotLightHelper(spotLight);
var spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
var spotLightHelper3 = new THREE.SpotLightHelper(spotLight3);

var lights =
{
	ambient: ambientlight,
	directional:
	{
		names: ["Directional Light"],
		lights: [directionalLight1],
		helpers: [helper1]
	},
	point:
	{
		names: ["Point Light"],
		lights: [pointLight],
		helpers: [pointLightHelper]
	},
	spot:
	{
		names: ["Spot Light R", "Spot Light G", "Spot Light B"],
		lights: [spotLight, spotLight2, spotLight3],
		helpers: [spotLightHelper, spotLightHelper2, spotLightHelper3]
	}
}

addLightsToScene(lights);

// Geometry
var plane = new THREE.Mesh(new THREE.PlaneBufferGeometry( 10, 10 ), materials.principled.cloth_floor.clone() );
plane.rotation.x = THREE.Math.degToRad(-90);
plane.position.y = -1.5;
var plane2 = new THREE.Mesh(new THREE.PlaneBufferGeometry( 10, 5 ), materials.principled.cloth_floor.clone() );
plane2.position.y = 1;
plane2.position.z = -5;
var cube = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 1 ), materials.principled.gold.clone() );
var sphere = new THREE.Mesh(new THREE.SphereBufferGeometry( 0.5, 32, 32 ), materials.principled.lowplastic.clone() );
sphere.position.x += 2.0;
var cone =  new THREE.Mesh(new THREE.ConeBufferGeometry( 0.5, 1, 32 ), materials.principled.aluminium.clone() );
cone.position.x -= 2.0;

var objects =
{
	names: ["Floor", "Wall", "Cube", "Sphere", "Cone"],
	objs: [plane, plane2, cube, sphere, cone],
	shaders: ["principled", "principled", "principled", "principled", "principled"]
};

addObjsToScene(objects);
computeAllTangents(objects);
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