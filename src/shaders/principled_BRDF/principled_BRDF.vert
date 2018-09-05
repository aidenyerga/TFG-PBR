// Vertex shader: Principled BRDF

attribute vec4 tangent;

varying vec3 f_positionEye;
varying vec3 f_viewDirection;
varying vec3 f_normal;
varying vec3 x;
varying vec3 y;

void main()
{
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	f_positionEye = (modelViewMatrix * vec4(position, 1.0)).xyz;
	f_viewDirection = -f_positionEye;
	f_normal = (modelViewMatrix * vec4(normal, 0.0)).xyz;

	// Calculate tangent in model space
	// Calcular vector tangente en espacio del modelo
	vec3 t = normalize(normalMatrix*tangent.xyz);
	// Re-orthogonalize T (Gram-Schmidt process)
	// Re-ortogonalizar T (proceso Gram-Schmidt)
	x = normalize(t - dot(t, f_normal) * f_normal);
	// Calculate bitangent
	// Calcular bitangente
	y = normalize(cross(f_normal, t));
}