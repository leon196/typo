precision mediump float;

attribute vec3 position, color, normal, anchor, quantity;

uniform mat4 viewProjection;
uniform float time, expansion, growth, timeRotation;
uniform vec2 resolution;
uniform vec3 camera;

const float PI = 3.1415;

varying vec4 vColor;
varying vec2 vUV;

mat2 rotation (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float random (in vec2 st) { return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123); }

void main () {
	vColor = vec4(color.rgb, 1);
	vec3 pos = position;
	float distCam = length(camera-pos);
	vec3 forward = normalize(normal);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = cross(forward, right);
	float radius = 0.03;
	radius *= smoothstep(1.1,2.5,distCam)*smoothstep(6.,3.,distCam)*smoothstep(1.5,1.,length(pos));
	vUV = anchor.xy;
	pos += (anchor.x * right + anchor.y * up) * radius;
	gl_Position = viewProjection * vec4(pos, 1);
	gl_PointSize = 4.;
}