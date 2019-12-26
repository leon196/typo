
uniform vec3 cameraPos, cameraTarget;
uniform vec2 resolution;
uniform float time;
varying vec2 vUV;
varying vec3 vNormal, vView;

void main () {

	vec3 pos = position;
	vUV = uv;
	vNormal = -pos;
	vView = cameraPos-pos;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
