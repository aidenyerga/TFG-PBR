// Fragment shader: Cook-Torrance BRDF

float PI = 3.1415926535897932384626433832795;

// Material
uniform vec3 matcolor;
uniform float kd;
uniform float metallic;
uniform float roughness;
uniform float ior;

struct DirectionalLight {
  vec3 color;
  vec3 direction;
};

struct PointLight {
	vec3 color;
	vec3 position;
};

struct SpotLight {
	vec3 color;
	vec3 position;
	vec3 direction;
	float coneCos;
	float penumbraCos;
	float decay;
};

uniform vec3 ambientLightColor;

#if NUM_DIR_LIGHTS > 0
uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];
#endif
#if NUM_POINT_LIGHTS > 0
uniform PointLight pointLights[NUM_POINT_LIGHTS];
#endif
#if NUM_SPOT_LIGHTS > 0
uniform SpotLight spotLights[NUM_SPOT_LIGHTS];
#endif

varying vec3 f_positionEye;
varying vec3 f_viewDirection;
varying vec3 f_normal;

float clampdot(vec3 N, vec3 L) {return max(dot(N, L), 0.0);}

// Schlick approximation for frenel term
// Aproximación de Schlick para el término Fresnel
float fresnel_schlick(float cosalpha)
{
	float RF0 = pow((ior-1.0)/(ior+1.0), 2.0);
	return (RF0+(1.0-RF0)*pow((1.0-cosalpha), 5.0));
}

// Beckmann distribution
// Distribución Beckmann
float D(float dotNH)
{
	float expo = (pow(dotNH, 2.0)-1.0)/(pow(dotNH, 2.0)*pow(roughness, 2.0));
	return exp(expo)/(PI*pow(roughness, 2.0)*pow(dotNH, 4.0));
}

// Diffuse term of Cook-Torrance model
// Término difuso del modelo Cook-Torrance
vec3 fdiff()
{return matcolor/PI;}

// Specular term of Cook-Torrance model
// Término especular del modelo Cook-Torrance
float fspec(vec3 V, vec3 N, vec3 L)
{
	float dotVN = clampdot(V, N);
	float dotLN = clampdot(L, N);
	vec3 H = normalize(V+L);
	float dotNH = clampdot(N, H);
	float dotHV = clampdot(V, H);

	float g_f = 2.0*dotNH/dotHV;

	// Geometrical attenuation term (Cook-Torrance)
	// Término de atenuación geométrica (Cook-Torrance)
	float G = min(1.0, min(g_f*dotVN, g_f*dotLN));
	float fresnelR = fresnel_schlick(dotHV);
	return max((D(dotNH)*fresnelR*G), 0.0)/max(4.0*dotLN*dotVN, 0.000001);
}

//BRDF Cook-Torrance
vec3 f(vec3 V, vec3 N, vec3 L)
{
	float fspec = fspec(V, N, L);
	vec3 fdiff = fdiff();

	return mix(mix(fspec*vec3(1.0, 1.0, 1.0), fdiff, kd), fspec*matcolor, metallic);
}

void main()
{
	vec3 f_color = vec3(0.0, 0.0, 0.0);
	vec3 N, L, V;

	V = normalize(f_viewDirection); //V is the vector from the pixel to the camera | V es el vector del píxel a la cámara
	N = normalize(f_normal); //N is the normal of the pixel | N es la normal de píxel
	//L will be the vector from the pixel to the light | L será el vector del píxel a la luz

	#if NUM_DIR_LIGHTS > 0
	for(int i=0; i < NUM_DIR_LIGHTS; ++i) {
		L = normalize(directionalLights[i].direction); //Ligth direction vector | Es el vector direccional (no tiene posición)
		f_color += f(V, N, L)*directionalLights[i].color*clampdot(N, L);
	}
	#endif

	#if NUM_POINT_LIGHTS > 0
	for(int i=0; i < NUM_POINT_LIGHTS; ++i) {
		L = normalize(pointLights[i].position-f_positionEye);
		f_color += f(V, N, L)*pointLights[i].color*clampdot(N, L);
	}
	#endif

	#if NUM_SPOT_LIGHTS > 0
	for (int i=0; i < NUM_SPOT_LIGHTS; ++i) {
		L = normalize(spotLights[i].position-f_positionEye);
		float cosls = dot(L, normalize(spotLights[i].direction));
		float cspot = 0.0;
		if (cosls > 0.000001) cspot = pow(cosls, spotLights[i].decay);
		if (!(cspot < 0.000001 || cosls <= spotLights[i].coneCos)) // cos is smaller <=> angle is greater than
		{
			f_color += cspot*f(V, N, L)*spotLights[i].color*clampdot(N, L);
		}
	}
	#endif

	f_color += ambientLightColor*matcolor;
	
	gl_FragColor = vec4(f_color,1);
}