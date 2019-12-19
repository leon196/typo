precision mediump float;

attribute vec4 position;
attribute vec3 color;

uniform mat4 viewProjection;
uniform float time, expansion, growth, timeRotation;
uniform vec2 resolution;

const float PI = 3.1415;

varying vec4 vColor;

mat2 rotation (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float random (in vec2 st) { return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123); }

void main () {
	vColor = vec4(color.rgb, 1);
	gl_Position = viewProjection * position;
	gl_PointSize = 4.;
}