precision mediump float;

attribute vec3 position, anchor, quantity, uv;

uniform sampler2D positionmap, datamap, velocitymap;
uniform mat4 viewProjection;
uniform float time;
uniform vec2 resolution, grid;
uniform vec3 camera;

const float PI = 3.1415;
const float TAU = 6.283;

varying vec2 vUv;
varying vec4 vColor;

mat2 rotation (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float random (in vec2 st) { return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123); }

vec3 curve (float ratio) {
	vec3 p = vec3(ratio,sin(ratio*TAU*2.),0);
	p.xz *= rotation(ratio*4.157);
	p.yx *= rotation(ratio*23.0274);
	p.yz *= rotation(ratio*10.4768);
	return p;
}

vec3 paragraph (float ratio) {
	vec3 p = vec3(0);
	float lign = 10.;
	p.x = mod(ratio*lign, 1.);
	p.y = -floor(ratio*lign)/lign/2.;
	return p;
}

void main () {
	float radius = 0.02;

	vec3 pos = position;
	vec2 pivot = anchor.xy;

	pos = vec3(0);
	pos = paragraph(uv.z);

	vColor = vec4(1);

	float distCam = length(camera-pos);
	vec3 forward = normalize(camera-pos);//mix(camera-pos, velocity, goodbye));
	vec3 right = normalize(cross(vec3(0,1,0), forward));
	vec3 up = cross(right, forward);
	vUv = (anchor.xy*.5+.5)/grid+uv.xy;
	pos += (pivot.x * right + pivot.y * up) * radius;

	gl_Position = viewProjection * vec4(pos, 1);
}