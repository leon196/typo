precision mediump float;

attribute vec3 position, anchor, quantity, uv;

uniform mat4 viewProjection;
uniform float time;
uniform vec2 resolution;
uniform vec3 camera;

const float PI = 3.1415;

varying vec2 vUv;

mat2 rotation (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float random (in vec2 st) { return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123); }

vec3 curve (float ratio) {
	vec3 p = vec3(1.5,0,0);
	p.xz *= rotation(time*.2+ratio*41.57);
	p.yx *= rotation(time*.2+ratio*230.274);
	p.yz *= rotation(time*.2+ratio*100.4768);
	return p;
}

void main () {
	vec3 pos = position;
	vec2 pivot = anchor.xy;

	pos = vec3(0);
	pos.x += (uv.z*2.-1.)*.5;
	float wave = abs(sin(time + pos.x));
	pivot *= rotation(pos.x + time + PI/2.);
	pivot.x *= 1.+.5*smoothstep(0.1,0.0,wave);
	pos.y += wave;
	// pos = curve(uv.z*1.);

	float distCam = length(camera-pos);
	vec3 forward = normalize(camera-pos);
	vec3 right = normalize(cross(vec3(0,1,0), forward));
	vec3 up = cross(right, forward);
	float radius = 0.2;
	// radius *= smoothstep(1.1,2.5,distCam)*smoothstep(6.,3.,distCam)*smoothstep(1.5,1.,length(pos));
	vUv = (anchor.xy*.5+.5)/6.+uv.xy;
	pos += (pivot.x * right + pivot.y * up) * radius;
	gl_Position = viewProjection * vec4(pos, 1);
}