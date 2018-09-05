// Fragment shader:

float PI = 3.1415926535897932384626433832795;

// Material
uniform vec3 baseColor;
uniform float subsurface;
uniform float metallic;
uniform float specular;
uniform float specularTint;
uniform float roughness;
uniform float anisotropic;
uniform float sheen;
uniform float sheenTint;
uniform float clearcoat;
uniform float clearcoatGloss;

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
varying vec3 x;
varying vec3 y;

float clampdot(vec3 N, vec3 L) {return max(dot(N, L), 0.0);}

// Generalized-Trowbridge-Reitz distribution
// Distribución Generalized-Trowbridge-Reitz
float DGTR1(float alpha, float dotNH)
{
	float a2 = alpha*alpha;
	float cos2th = dotNH*dotNH;
	float den = (1.0+(a2-1.0)*cos2th);

	return (a2-1.0)/(PI*log(a2)*den);
}

float DGTR2(float alpha, float dotNH)
{
	float a2 = alpha*alpha;
	float cos2th = dotNH*dotNH;
	float den = (1.0+(a2-1.0)*cos2th);

	return a2/(PI*den*den);
}

float DGTR2_aniso(float dotHX, float dotHY, float dotNH, float ax, float ay)
{
	float deno = dotHX*dotHX/(ax*ax)+dotHY*dotHY/(ay*ay)+dotNH*dotNH;
	return 1.0/(PI*ax*ay*deno*deno);
}

// Schlick approximation for frenel term
// Aproximación de Schlick para el término Fresnel
float fresnel_schlick(float RF0, float cosalpha)
{return (RF0+(1.0-RF0)*pow((1.0-cosalpha), 5.0));}

// Diffuse term of Principled
// Término difuso del modelo Principled
vec3 fdiff(float dotHV, float dotLN, float dotVN)
{
    float FD90 = 0.5 + 2.0*pow(dotHV, 2.0)*roughness;
	float d = (1.0+(FD90-1.0)*pow(1.0-dotLN, 5.0))*(1.0+(FD90-1.0)*pow(1.0-dotVN, 5.0));
    return (baseColor/PI)*d;
}

// Subsurface model
// Modelo subsurface
vec3 fss(float dotHV, float dotLN, float dotVN)
{
	float FSS90 = dotHV*dotHV*roughness;
	float ss = (1.0+(FSS90-1.0)*pow(1.0-dotLN, 5.0))*(1.0+(FSS90-1.0)*pow(1.0-dotVN, 5.0));
	return (baseColor/PI)*1.25*(ss*(1.0/(dotLN*dotVN) -0.5)+0.5);
}

float F(float dotVH)
{
	// Linear conversion from range [0.0, 0.08] to ior ranges [1.0, 1.8]
    // Conversión lineal entre rango [0.0, 0.08] a rangos ior [1.0, 1.8]
    float ior = (specular * 0.8) + 1.0 ;

	// Compute RF(0º) using IOR
    // Calcular RF(0º) usando IOR
    float RF0 = pow((ior-1.0)/(ior+1.0), 2.0);

    return fresnel_schlick(RF0, dotVH);
}

// Derived G function for GGX
// Función G derivada para GGX
float smithG_GGX_aniso(float dotVN, float dotVX, float dotVY, float ax, float ay)
{
    return 1.0 / (dotVN + sqrt( pow(dotVX*ax, 2.0) + pow(dotVY*ay, 2.0) + pow(dotVN, 2.0) ));
}

// G GGX function for clearcoat
// Función G GGX para la capa clearcoat
float GGX_G(float dotVN, float alphag)
{
    float a = alphag*alphag;
    float b = dotVN*dotVN;
    return 1.0/(dotVN + sqrt(a + b - a*b));
}

// Specular term of Principled
// Término especular del modelo Principled
float fspec(vec3 L, vec3 H, vec3 V, float dotNH, float dotHV, float dotLN, float dotVN)
{
	float r2 = roughness*roughness;
	float aspect = sqrt(1.0-anisotropic*0.9);
    float ax = max(0.001, r2/aspect);
    float ay = max(0.001, r2*aspect);
    float alphag = pow((0.5 + roughness/2.0), 2.0);

    return DGTR2_aniso(dot(H, x), dot(H, y), dotNH, ax, ay)*F(dotHV)*smithG_GGX_aniso(dotVN, dot(V,x), dot(V,y), ax, ay)*smithG_GGX_aniso(dotLN, dot(L,x), dot(L,y), ax, ay);
}

// Clearcoat
// Capa clearcoat
float fccoat(float dotNH, float dotHV, float dotLN, float dotVN)
{
	// IOR is fixed to 1.5 for clearcoat -> RF0=0.04
	// Roughness is 0.25 fo G GGX for clearcoat
	// El IOR está fijado en 1.5 para esta capa -> RF0=0.04
	// Rugosidad de 0.25 para esta capa con función G GGX

	// El parámetro clearcoatGloss controla la rugosidad de la distrubución
    return DGTR1(mix(0.1, 0.001, clearcoatGloss), dotNH)*fresnel_schlick(0.04, dotHV)*GGX_G(dotLN, 0.25)*GGX_G(dotVN, 0.25);
}

// Sheen
// Capa sheen
vec3 fsheen(float dotHV)
{ return mix(vec3(1.0,1.0,1.0), baseColor, sheenTint)*pow(1.0-dotHV, 5.0); }

vec3 f(vec3 V, vec3 N, vec3 L)
{
	float dotVN = dot(V, N);
	float dotLN = dot(L, N);
	if (dotLN < 0.00000001 || dotVN < 0.00000001) return vec3(0.0, 0.0, 0.0);
	vec3 H = normalize(V+L);
	float dotNH = dot(N, H);
	float dotHV = dot(V, H);

	vec3 diff = fdiff(dotHV, dotLN, dotVN);
	vec3 ss = fss(dotHV, dotLN, dotVN);
	float spec = fspec(L, H, V, dotNH, dotHV, dotLN, dotVN);

	vec3 dielectric = mix(diff, ss, subsurface)+sheen*fsheen(dotHV)+mix(vec3(1.0, 1.0, 1.0), baseColor, specularTint)*spec;
	vec3 metal = baseColor*spec;
	vec3 ccoat = vec3(1.0, 1.0, 1.0)*fccoat(dotNH, dotHV, dotLN, dotVN);
	
    return mix(dielectric, metal, metallic)+0.25*clearcoat*ccoat;
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

	f_color += ambientLightColor*baseColor;
	
	gl_FragColor = vec4(f_color,1);
}