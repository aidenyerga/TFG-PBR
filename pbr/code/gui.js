/* GUI
*  This file contains all the code to generate the GUIs for all scenes.
*  -------------------------------
*  Este fichero contiene todo el código necesario para generar las interfaces de usuario para todas las escenas.
*/

gui = new dat.GUI();
var fpsstats = new Stats();
fpsstats.showPanel(0);
document.body.appendChild(fpsstats.dom);
var msstats = new Stats();
msstats.showPanel(1);
msstats.dom.style = "position: fixed; top: 50px; left: 0px; cursor: pointer; opacity: 0.9; z-index: 10000;";
document.body.appendChild(msstats.dom);
var bgcolor = {Background: "#000000"};
var resDisp = {Resolution: "", Vertices: "", Faces: ""};
var res; var verts; var faces;
var guilights;
var guiobjs;
var objparams;

	// Controls generation functions:
	function genAmbiLightControls(folder, light){
		folder.add(light, "visible");
		a = light.color.toArray();
		var color = {color: [a[0]*255.,a[1]*255.,a[2]*255.]};
		folder.addColor(color, "color").onChange(function(){light.color.setRGB(color.color[0]/255., color.color[1]/255., color.color[2]/255.);});
	}
	function genDirLightControls(folder, dl, helper) {
		var dchelper;
		folder.add(dl, "visible").onChange(function(val){helper.visible=val;dchelper.updateDisplay();});
		a = dl.color.toArray();
		var color = {color: [a[0]*255.,a[1]*255.,a[2]*255.]};
		folder.addColor(color, "color").onChange(function(){dl.color.setRGB(color.color[0]/255., color.color[1]/255., color.color[2]/255.);helper.update();});
		dhelper = folder.addFolder("Helper");
		dchelper = dhelper.add(helper, "visible");
		dlpos = folder.addFolder("Position");
		dlpos.add(dl.position, "x").onChange(function(){helper.update()});
		dlpos.add(dl.position, "y").onChange(function(){helper.update()});
		dlpos.add(dl.position, "z").onChange(function(){helper.update()});
		dlpos.open();
		dlt = folder.addFolder("Target");
		dlt.add(dl.target.position, "x").onChange(function(){helper.update()});
		dlt.add(dl.target.position, "y").onChange(function(){helper.update()});
		dlt.add(dl.target.position, "z").onChange(function(){helper.update()});
		dlt.open();
	}
	function genPointLightControls(folder, p, helper) {
		var pchelper;
		folder.add(p, "visible").onChange(function(val){helper.visible=val;pchelper.updateDisplay();});
		a = p.color.toArray();
		var color = {color: [a[0]*255.,a[1]*255.,a[2]*255.]};
		folder.addColor(color, "color").onChange(function(){p.color.setRGB(color.color[0]/255., color.color[1]/255., color.color[2]/255.);helper.update();});
		phelper = folder.addFolder("Helper");
		pchelper = phelper.add(helper, "visible");
		ppos = folder.addFolder("Position");
		ppos.add(p.position, "x").onChange(function(){helper.update()});
		ppos.add(p.position, "y").onChange(function(){helper.update()});
		ppos.add(p.position, "z").onChange(function(){helper.update()});
		ppos.open();
	}
	function genSpotLightControls(folder, sp, helper) {
		var spchelper;
		folder.add(sp, "visible").onChange(function(val){helper.visible=val;spchelper.updateDisplay();});
		a = sp.color.toArray();
		var color = {color: [a[0]*255.,a[1]*255.,a[2]*255.]};
		folder.addColor(color, "color").onChange(function(){sp.color.setRGB(color.color[0]/255., color.color[1]/255., color.color[2]/255.);helper.update();});
		sphelper = folder.addFolder("Helper");
		spchelper = sphelper.add(helper, "visible");
		sppos = folder.addFolder("Position");
		sppos.add(sp.position, "x").onChange(function(){helper.update()});
		sppos.add(sp.position, "y").onChange(function(){helper.update()});
		sppos.add(sp.position, "z").onChange(function(){helper.update()});
		sppos.open();
		spt = folder.addFolder("Target");
		spt.add(sp.target.position, "x").onChange(function(){helper.update()});
		spt.add(sp.target.position, "y").onChange(function(){helper.update()});
		spt.add(sp.target.position, "z").onChange(function(){helper.update()});
		spt.open();
		folder.add(sp, "distance").onChange(function(){helper.update()});;
		var angle = {angle: THREE.Math.radToDeg(sp.angle)};
		folder.add(angle, "angle", 0, 360, 0.1).onChange(function(){sp.angle = THREE.Math.degToRad(angle.angle);helper.update();});
	}
	function genObjControls(folder, obj, name, shader=null){
		var objgui = folder.addFolder(name);
		var position = objgui.addFolder("Position");
		position.add(obj.position, "x");
		position.add(obj.position, "y");
		position.add(obj.position, "z");
		position.open();
		var rotation = objgui.addFolder("Rotation");
		rotation.add(obj.rotation, "x");
		rotation.add(obj.rotation, "y");
		rotation.add(obj.rotation, "z");
		rotation.open();
		var scale = objgui.addFolder("Scale");
		scale.add(obj.scale, "x");
		scale.add(obj.scale, "y");
		scale.add(obj.scale, "z");
		scale.open();
        var material = objgui.addFolder("Material");
        // Add controls for different material types
        if (shader=="cook-torrance")
        {
            a = obj.material.uniforms.matcolor.value;
            var color = {color: [a.x*255.,a.y*255.,a.z*255.]};
            material.addColor(color, "color").onChange(function(){
                obj.material.uniforms.matcolor.value.x = color.color[0]/255.;
                obj.material.uniforms.matcolor.value.y = color.color[1]/255.;
                obj.material.uniforms.matcolor.value.z = color.color[2]/255.;
            });
            var mat = {kd: obj.material.uniforms.kd.value.valueOf(), metallic: obj.material.uniforms.metallic.value.valueOf(), roughness: obj.material.uniforms.roughness.value.valueOf(), ior: obj.material.uniforms.ior.value.valueOf()};
            material.add(mat, "kd", 0, 1, 0.01).onChange(function(){obj.material.uniforms.kd.value=mat.kd});
            material.add(mat, "metallic", 0, 1, 1.0).onChange(function(){obj.material.uniforms.metallic.value=mat.metallic});
            material.add(mat, "roughness", 0, 1, 0.01).onChange(function(){obj.material.uniforms.roughness.value=mat.roughness});
            material.add(mat, "ior").onChange(function(){obj.material.uniforms.ior.value=mat.ior});
        }
        if (shader=="principled")
        {
            a = obj.material.uniforms.baseColor.value;
            var color = {baseColor: [a.x*255.,a.y*255.,a.z*255.]};
            material.addColor(color, "baseColor").onChange(function(){
                obj.material.uniforms.baseColor.value.x = color.baseColor[0]/255.;
                obj.material.uniforms.baseColor.value.y = color.baseColor[1]/255.;
                obj.material.uniforms.baseColor.value.z = color.baseColor[2]/255.;
            });
            var mat = {
                subsurface: obj.material.uniforms.subsurface.value.valueOf(),
                metallic: obj.material.uniforms.metallic.value.valueOf(), 
                specular: obj.material.uniforms.specular.value.valueOf(),
                specularTint: obj.material.uniforms.specularTint.value.valueOf(), 
                roughness: obj.material.uniforms.roughness.value.valueOf(),
                anisotropic: obj.material.uniforms.anisotropic.value.valueOf(),
                sheen: obj.material.uniforms.sheen.value.valueOf(),
                sheenTint: obj.material.uniforms.sheenTint.value.valueOf(),
                clearcoat: obj.material.uniforms.clearcoat.value.valueOf(),
                clearcoatGloss: obj.material.uniforms.clearcoatGloss.value.valueOf()
            };
            material.add(mat, "subsurface", 0, 1, 0.1).onChange(function(){obj.material.uniforms.subsurface.value=mat.subsurface});
            material.add(mat, "metallic", 0, 1, 0.1).onChange(function(){obj.material.uniforms.metallic.value=mat.metallic});
            material.add(mat, "specular", 0, 1.0, 0.01).onChange(function(){obj.material.uniforms.specular.value=mat.specular});
            material.add(mat, "specularTint", 0, 1, 0.1).onChange(function(){obj.material.uniforms.specularTint.value=mat.specularTint});
            material.add(mat, "roughness", 0, 1.0, 0.01).onChange(function(){obj.material.uniforms.roughness.value=mat.roughness});
            material.add(mat, "anisotropic", 0, 1, 0.1).onChange(function(){obj.material.uniforms.anisotropic.value=mat.anisotropic});
            material.add(mat, "sheen", 0, 1, 0.1).onChange(function(){obj.material.uniforms.sheen.value=mat.sheen});
            material.add(mat, "sheenTint", 0, 1, 0.1).onChange(function(){obj.material.uniforms.sheenTint.value=mat.sheenTint});
            material.add(mat, "clearcoat", 0, 1, 0.1).onChange(function(){obj.material.uniforms.clearcoat.value=mat.clearcoat});
            material.add(mat, "clearcoatGloss", 0, 1, 0.1).onChange(function(){obj.material.uniforms.clearcoatGloss.value=mat.clearcoatGloss});
        }
		material.open();
	}

var adderToScene = {LightName: "", LightType: "", ObjectName: "", ObjectType: "", Shader: ""};
var adderOBJParams = {width: 1.0, height: 1.0, radius: 1.0, segments: 8.0, depth: 1.0, radialSegments: 8.0, heightSegments: 1.0, radiusTop: 1.0, radiusBottom: 1.0, tube: 0.4, tubularSegments: 6.0, widthSegments: 8.0, heightSegments: 6.0};
var sceneAdder = new function(){
	this.addNewLight = function(){
		if (adderToScene.LightName == "")
		{	alert("Name cannot be empty."); return;	}
		if (typeof guilights.__folders[adderToScene.LightName] == "object")
		{	alert("A light with the name \""+adderToScene.LightName+"\" already exists!"); return;	}
		if (adderToScene.LightType == "")
		{	alert("Please select a light type."); return;	}
		if (adderToScene.LightType == "dir")
		{
			var newl = new THREE.DirectionalLight(0xffffff, 1.0);
			scene.add(newl);
			scene.add(newl.target);
			var newlh = new THREE.DirectionalLightHelper(newl, 1.0);
			scene.add(newlh);
			var newf = guilights.addFolder(adderToScene.LightName);
			genDirLightControls(newf, newl, newlh);
		}
		if (adderToScene.LightType == "point")
		{
			var newl = new THREE.PointLight(0xffffff, 1, 100);
			scene.add(newl);
			var newlh = new THREE.PointLightHelper(newl, 1.0);
			scene.add(newlh);
			var newf = guilights.addFolder(adderToScene.LightName);
			genPointLightControls(newf, newl, newlh);
		}
		if (adderToScene.LightType == "spot")
		{
			var newl = new THREE.SpotLight(0xffffff, 1.0, 6);
			scene.add(newl);
			scene.add(newl.target);
			var newlh = new THREE.SpotLightHelper(newl, 1.0);
			scene.add(newlh);
			var newf = guilights.addFolder(adderToScene.LightName);
			genSpotLightControls(newf, newl, newlh);
		}
	};
	this.addNewObject = function(){
		if (adderToScene.ObjectName == "")
		{	alert("Name cannot be empty."); return;	}
		if (typeof guiobjs.__folders[adderToScene.ObjectName] == "object")
		{	alert("An object with the name \""+adderToScene.ObjectName+"\" already exists!"); return;	}
		if (adderToScene.ObjectType == "")
		{	alert("Please select an object type."); return;	}
		if (adderToScene.Shader == "")
		{	alert("Please select a shader for the object."); return; }
		var newobjmaterial;
		if (adderToScene.Shader == "cook-torrance") newobjmaterial = materials.cook_torrance.void.clone();
		if (adderToScene.Shader == "principled") newobjmaterial = materials.principled.void.clone();
		var newobj;
		if (adderToScene.ObjectType == "plane")
		{
			newobj = new THREE.Mesh( new THREE.PlaneBufferGeometry(adderOBJParams.width, adderOBJParams.height), newobjmaterial);
		}
		if (adderToScene.ObjectType == "circle")
		{
			newobj = new THREE.Mesh( new THREE.CircleBufferGeometry(adderOBJParams.radius, adderOBJParams.segments), newobjmaterial);
		}
		if (adderToScene.ObjectType == "cube")
		{
			newobj = new THREE.Mesh( new THREE.BoxBufferGeometry(adderOBJParams.width, adderOBJParams.height, adderOBJParams.depth), newobjmaterial);
		}
		if (adderToScene.ObjectType == "cone")
		{
			newobj = new THREE.Mesh( new THREE.ConeBufferGeometry(adderOBJParams.radius, adderOBJParams.height, adderOBJParams.radialSegments, adderOBJParams.heightSegments), newobjmaterial);
		}
		if (adderToScene.ObjectType == "cylinder")
		{
			newobj = new THREE.Mesh( new THREE.CylinderBufferGeometry(adderOBJParams.radiusTop, adderOBJParams.radiusBottom, adderOBJParams.height, adderOBJParams.radialSegments, adderOBJParams.heightSegments), newobjmaterial);
		}
		if (adderToScene.ObjectType == "torus")
		{
			newobj = new THREE.Mesh( new THREE.TorusBufferGeometry(adderOBJParams.radius, adderOBJParams.tube, adderOBJParams.radialSegments, adderOBJParams.tubularSegments), newobjmaterial);
		}
		if (adderToScene.ObjectType == "sphere")
		{
			newobj = new THREE.Mesh( new THREE.SphereBufferGeometry(adderOBJParams.radius, adderOBJParams.widthSegments, adderOBJParams.heightSegments), newobjmaterial);
		}
		scene.add(newobj);
		if (adderToScene.Shader == "principled") THREE.BufferGeometryUtils.computeTangents(newobj.geometry);
		genObjControls(guiobjs, newobj, adderToScene.ObjectName, adderToScene.Shader);
	};
};
// Full GUI gen for scene
function generateGUIforScene(lights, objects){
    // Rendering
	res = gui.add(resDisp, "Resolution");
	verts = gui.add(resDisp, "Vertices");
	faces = gui.add(resDisp, "Faces");
	gui.add(renderprops, "Resolution_Scale", 0.01, 3, 0.01).onChange(function(){renderer.setSize(window.innerWidth, window.innerHeight);renderer.setSize(renderprops.Resolution_Scale*window.innerWidth, renderprops.Resolution_Scale*window.innerHeight, false);});

    //BG
    gui.addColor(bgcolor, "Background").onChange(function(){scene.background.setStyle(bgcolor.Background);});

    guilights = gui.addFolder("Lights");
    ambient = guilights.addFolder('Ambient Light');
    genAmbiLightControls(ambient, lights.ambient);
    for(i=0; i<lights.directional.lights.length; i++){
    dl = guilights.addFolder(lights.directional.names[i]);
    genDirLightControls(dl, lights.directional.lights[i], lights.directional.helpers[i]);}
    for(i=0; i<lights.point.lights.length; i++){
    pl = guilights.addFolder(lights.point.names[i]);
    genPointLightControls(pl, lights.point.lights[i], lights.point.helpers[i]);}
    for(i=0; i<lights.spot.lights.length; i++){
    sp = guilights.addFolder(lights.spot.names[i]);
    genSpotLightControls(sp, lights.spot.lights[i], lights.spot.helpers[i]);}
    guiobjs = gui.addFolder("Objects");
	for (i = 0; i<objects.objs.length; i++){ genObjControls(guiobjs, objects.objs[i], objects.names[i], objects.shaders[i]);}
	addgui = gui.addFolder("Add to scene...");
	addlight = addgui.addFolder("Add a light...");
	addlight.add(adderToScene, "LightName");
	addlight.add(adderToScene, "LightType", {DirectionalLight: "dir", PointLight: "point", SpotLight: "spot"});
	addlight.add(sceneAdder, "addNewLight").name("Add new light");
	addobj = addgui.addFolder("Add an object...")
	addobj.add(adderToScene, "ObjectName");
	addobj.add(adderToScene, "ObjectType", {Plane: "plane", Circle: "circle", Cube: "cube", Cone: "cone", Cylinder: "cylinder", Torus: "torus", Sphere: "sphere"}).onChange(function(){refreshObjParams();});
	objparams = addobj.addFolder("Parameters");
	addobj.add(adderToScene, "Shader", {Cook_TorranceBRDF: "cook-torrance", PrincipledBRDF: "principled"});
	addobj.add(sceneAdder, "addNewObject").name("Add new object");
    gui.add(imageSaver, "saveAsImage").name("Save screenshot");
}

function refreshObjParams(){
	adderOBJParams = {width: 1.0, height: 1.0, radius: 1.0, segments: 8.0, depth: 1.0, radialSegments: 8.0, heightSegments: 1.0, radiusTop: 1.0, radiusBottom: 1.0, tube: 0.4, tubularSegments: 6.0, widthSegments: 8.0, heightSegments: 6.0};
	lenremove=objparams.__controllers.length;
	for (i=0; i<lenremove; i++){objparams.__controllers[0].remove();}
	if (adderToScene.ObjectType == "plane")
	{
		objparams.add(adderOBJParams, "width");
		objparams.add(adderOBJParams, "height");
	}
	if (adderToScene.ObjectType == "circle")
	{
		objparams.add(adderOBJParams, "radius");
		objparams.add(adderOBJParams, "segments", 3.0);
	}
	if (adderToScene.ObjectType == "cube")
	{
		objparams.add(adderOBJParams, "width");
		objparams.add(adderOBJParams, "height");
		objparams.add(adderOBJParams, "depth");
	}
	if (adderToScene.ObjectType == "cone")
	{
		objparams.add(adderOBJParams, "radius");
		objparams.add(adderOBJParams, "height");
		objparams.add(adderOBJParams, "radialSegments");
		objparams.add(adderOBJParams, "heightSegments");
	}
	if (adderToScene.ObjectType == "cylinder")
	{
		objparams.add(adderOBJParams, "radiusTop");
		objparams.add(adderOBJParams, "radiusBottom");
		objparams.add(adderOBJParams, "height");
		objparams.add(adderOBJParams, "radialSegments");
		objparams.add(adderOBJParams, "heightSegments");
	}
	if (adderToScene.ObjectType == "torus")
	{
		objparams.add(adderOBJParams, "radius");
		objparams.add(adderOBJParams, "tube");
		objparams.add(adderOBJParams, "radialSegments");
		objparams.add(adderOBJParams, "tubularSegments");
	}
	if (adderToScene.ObjectType == "sphere")
	{
		objparams.add(adderOBJParams, "radius");
		objparams.add(adderOBJParams, "widthSegments", 3.0);
		objparams.add(adderOBJParams, "heightSegments", 2.0);
	}
}