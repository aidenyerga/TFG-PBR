// = object.matrixWorld
//uniform mat4 modelMatrix;

// = camera.matrixWorldInverse * object.matrixWorld
//uniform mat4 modelViewMatrix;

// = camera.projectionMatrix
//uniform mat4 projectionMatrix;

// = camera.matrixWorldInverse
//uniform mat4 viewMatrix;

// = inverse transpose of modelViewMatrix
//uniform mat3 normalMatrix;

// = camera position in world space
//uniform vec3 cameraPosition;

// default vertex attributes provided by Geometry and BufferGeometry
//attribute vec3 position;
//attribute vec3 normal;
//attribute vec2 uv;
//attribute vec2 uv2;

uniform vec3 color;

void main()
{
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
