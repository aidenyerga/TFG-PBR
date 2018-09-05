/* SCENE
*  This file initializes the scene and prepares some functions for adding lights and objects to the scene from a list and to call the computeTangents function if needed (Principled BRDF requires this).
*  ---------------------------
*  Este fichero inicializa la escena y prepara funciones para añadir luces y objetos a la escena desde una lista y para llamar a la función computeTangents si fuera necesario (el BRDF Principled requiere esto).
*/

var scene = new THREE.Scene();

// Scene functions
function addLightsToScene(lights){
    scene.add(lights.ambient);
    for (i=0; i<lights.directional.lights.length; i++)
    {
        scene.add(lights.directional.lights[i]);
        scene.add(lights.directional.lights[i].target);
        scene.add(lights.directional.helpers[i]);
    }
    for (i=0; i<lights.point.lights.length; i++)
    {
        scene.add(lights.point.lights[i]);
        scene.add(lights.point.helpers[i]);
    }
    for (i=0; i<lights.spot.lights.length; i++)
    {
        scene.add(lights.spot.lights[i]);
        scene.add(lights.spot.lights[i].target);
        scene.add(lights.spot.helpers[i]);
    }
}
function addObjsToScene(objects){
    for (i=0; i<objects.objs.length; i++)
    { scene.add(objects.objs[i]); }
}

//Use only with indexed BufferGeometry
function computeAllTangents(objects){
    for (i=0; i<objects.objs.length; i++)
    { THREE.BufferGeometryUtils.computeTangents(objects.objs[i].geometry); }
}