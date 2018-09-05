// Vertex shader: Cook-Torrance BRDF

varying vec3 f_positionEye;
varying vec3 f_viewDirection;
varying vec3 f_normal;

void main()
{
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	f_positionEye = (modelViewMatrix * vec4(position, 1.0)).xyz;
	f_viewDirection = -f_positionEye;
	f_normal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
}
