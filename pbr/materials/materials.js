/* MATERIALS
*  All predefined materials for the application are contained in this file.
*  ----------------------
*  Los materiales predefinidos para la aplicación están contenidos en este fichero.
*/

materials = {
cook_torrance:
{
    void: new THREE.ShaderMaterial({  
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], 
        {  
            matcolor: new THREE.Uniform(new THREE.Vector3(0.0, 0.0, 0.0)),
            kd: new THREE.Uniform(new Number(0.0)),
            metallic: new THREE.Uniform(new Number(0.0)),
            roughness: new THREE.Uniform(new Number(0.0)),
            ior: new THREE.Uniform(new Number(0.0)),
        }]),
        lights: true,
        vertexShader: shaders.cook_torrance_BRDF.vert,
        fragmentShader: shaders.cook_torrance_BRDF.frag
    }),

    gold: new THREE.ShaderMaterial({  
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], 
        {  
            matcolor: new THREE.Uniform(new THREE.Vector3(1.0, 0.86, 0.48)),
            kd: new THREE.Uniform(new Number(0.75)),
            metallic: new THREE.Uniform(new Number(1.0)),
            roughness: new THREE.Uniform(new Number(0.05)),
            ior: new THREE.Uniform(new Number(0.27732)),
        }]),
        lights: true,
        vertexShader: shaders.cook_torrance_BRDF.vert,
        fragmentShader: shaders.cook_torrance_BRDF.frag
    }),
    
    aluminium: new THREE.ShaderMaterial({  
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], 
        {  
            matcolor: new THREE.Uniform(new THREE.Vector3(0.95,0.95,0.96)),
            kd: new THREE.Uniform(new Number(0.75)),
            metallic: new THREE.Uniform(new Number(1.0)),
            roughness: new THREE.Uniform(new Number(0.2)),
            ior: new THREE.Uniform(new Number(1.1978)),
        }]),
        lights: true,
        vertexShader: shaders.cook_torrance_BRDF.vert,
        fragmentShader: shaders.cook_torrance_BRDF.frag
    }),
    
    lowplastic: new THREE.ShaderMaterial({  
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], 
        {  
            matcolor: new THREE.Uniform(new THREE.Vector3(0.95,0.95,0.96)),
            kd: new THREE.Uniform(new Number(0.75)),
            metallic: new THREE.Uniform(new Number(0.0)),
            roughness: new THREE.Uniform(new Number(0.1)),
            ior: new THREE.Uniform(new Number(1.4613)),
        }]),
        lights: true,
        vertexShader: shaders.cook_torrance_BRDF.vert,
        fragmentShader: shaders.cook_torrance_BRDF.frag
    }),
    
    plastic: new THREE.ShaderMaterial({  
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], 
        {  
            matcolor: new THREE.Uniform(new THREE.Vector3(0.2, 0.2, 0.2)),
            kd: new THREE.Uniform(new Number(0.75)),
            metallic: new THREE.Uniform(new Number(0.0)),
            roughness: new THREE.Uniform(new Number(0.8)),
            ior: new THREE.Uniform(new Number(1.4813)),
        }]),
        lights: true,
        vertexShader: shaders.cook_torrance_BRDF.vert,
        fragmentShader: shaders.cook_torrance_BRDF.frag
    })
},

principled: 
{
    void: new THREE.ShaderMaterial({  
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], 
        {  
            baseColor: new THREE.Uniform(new THREE.Vector3(0.0, 0.0, 0.0)),
            subsurface: new THREE.Uniform(new Number(0.0)),
            metallic: new THREE.Uniform(new Number(0.0)),
            specular: new THREE.Uniform(new Number(0.0)),
            specularTint: new THREE.Uniform(new Number(0.0)),
            roughness: new THREE.Uniform(new Number(0.0)),
            anisotropic: new THREE.Uniform(new Number(0.0)),
            sheen: new THREE.Uniform(new Number(0.0)),
            sheenTint: new THREE.Uniform(new Number(0.0)),
            clearcoat: new THREE.Uniform(new Number(0.0)),
            clearcoatGloss: new THREE.Uniform(new Number(0.0)),
        }]),
        lights: true,
        vertexShader: shaders.principled_BRDF.vert,
        fragmentShader: shaders.principled_BRDF.frag
    }),

    gold: new THREE.ShaderMaterial({  
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], 
        {  
            baseColor: new THREE.Uniform(new THREE.Vector3(1.0, 0.86, 0.48)),
            subsurface: new THREE.Uniform(new Number(0.0)),
            metallic: new THREE.Uniform(new Number(1.0)),
            specular: new THREE.Uniform(new Number(0.45)),
            specularTint: new THREE.Uniform(new Number(0.0)),
            roughness: new THREE.Uniform(new Number(0.10)),
            anisotropic: new THREE.Uniform(new Number(0.0)),
            sheen: new THREE.Uniform(new Number(0.0)),
            sheenTint: new THREE.Uniform(new Number(0.0)),
            clearcoat: new THREE.Uniform(new Number(0.0)),
            clearcoatGloss: new THREE.Uniform(new Number(0.0)),
        }]),
        lights: true,
        vertexShader: shaders.principled_BRDF.vert,
        fragmentShader: shaders.principled_BRDF.frag
    }),
    
    aluminium: new THREE.ShaderMaterial({  
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], 
        {  
            baseColor: new THREE.Uniform(new THREE.Vector3(0.95,0.95,0.96)),
            subsurface: new THREE.Uniform(new Number(0.0)),
            metallic: new THREE.Uniform(new Number(1.0)),
            specular: new THREE.Uniform(new Number(0.81)),
            specularTint: new THREE.Uniform(new Number(0.0)),
            roughness: new THREE.Uniform(new Number(0.25)),
            anisotropic: new THREE.Uniform(new Number(0.0)),
            sheen: new THREE.Uniform(new Number(0.0)),
            sheenTint: new THREE.Uniform(new Number(0.0)),
            clearcoat: new THREE.Uniform(new Number(0.0)),
            clearcoatGloss: new THREE.Uniform(new Number(0.0)),
        }]),
        lights: true,
        vertexShader: shaders.principled_BRDF.vert,
        fragmentShader: shaders.principled_BRDF.frag
    }),
    
    lowplastic: new THREE.ShaderMaterial({  
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], 
        {  
            baseColor: new THREE.Uniform(new THREE.Vector3(0.95,0.95,0.96)),
            subsurface: new THREE.Uniform(new Number(0.0)),
            metallic: new THREE.Uniform(new Number(0.0)),
            specular: new THREE.Uniform(new Number(0.55)),
            specularTint: new THREE.Uniform(new Number(0.0)),
            roughness: new THREE.Uniform(new Number(0.25)),
            anisotropic: new THREE.Uniform(new Number(0.0)),
            sheen: new THREE.Uniform(new Number(0.0)),
            sheenTint: new THREE.Uniform(new Number(0.0)),
            clearcoat: new THREE.Uniform(new Number(0.0)),
            clearcoatGloss: new THREE.Uniform(new Number(0.0)),
        }]),
        lights: true,
        vertexShader: shaders.principled_BRDF.vert,
        fragmentShader: shaders.principled_BRDF.frag
    }),
    
    plastic: new THREE.ShaderMaterial({  
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], 
        {  
            baseColor: new THREE.Uniform(new THREE.Vector3(0.2, 0.2, 0.2)),
            subsurface: new THREE.Uniform(new Number(0.0)),
            metallic: new THREE.Uniform(new Number(0.0)),
            specular: new THREE.Uniform(new Number(0.04)),
            specularTint: new THREE.Uniform(new Number(0.0)),
            roughness: new THREE.Uniform(new Number(0.65)),
            anisotropic: new THREE.Uniform(new Number(0.0)),
            sheen: new THREE.Uniform(new Number(0.0)),
            sheenTint: new THREE.Uniform(new Number(0.0)),
            clearcoat: new THREE.Uniform(new Number(0.0)),
            clearcoatGloss: new THREE.Uniform(new Number(0.0)),
        }]),
        lights: true,
        vertexShader: shaders.principled_BRDF.vert,
        fragmentShader: shaders.principled_BRDF.frag
    }),

    cloth_floor: new THREE.ShaderMaterial({  
        uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], 
        {  
            baseColor: new THREE.Uniform(new THREE.Vector3(0.2588, 0.2588, 0.2588)),
            subsurface: new THREE.Uniform(new Number(0.0)),
            metallic: new THREE.Uniform(new Number(0.0)),
            specular: new THREE.Uniform(new Number(0.0)),
            specularTint: new THREE.Uniform(new Number(0.0)),
            roughness: new THREE.Uniform(new Number(0.74)),
            anisotropic: new THREE.Uniform(new Number(0.0)),
            sheen: new THREE.Uniform(new Number(1.0)),
            sheenTint: new THREE.Uniform(new Number(0.6)),
            clearcoat: new THREE.Uniform(new Number(0.0)),
            clearcoatGloss: new THREE.Uniform(new Number(0.0)),
        }]),
        lights: true,
        vertexShader: shaders.principled_BRDF.vert,
        fragmentShader: shaders.principled_BRDF.frag
    })
}
};