precision mediump float;

attribute vec3 position, anchor, quantity, uv;

uniform sampler2D buffermap, datamap;
uniform mat4 viewProjection;
uniform float time;
uniform vec2 resolution;
uniform vec3 camera;

const float PI = 3.1415;
const float TAU = 6.283;

varying vec2 vUv;
varying vec4 vColor;

mat2 rotation (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float random (in vec2 st) { return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123); }
float hash(vec3 p) { p  = fract( p*0.3183099+.1 ); p *= 17.0; return fract( p.x*p.y*p.z*(p.x+p.y+p.z) ); }
float noise( in vec3 x ) {
	vec3 i = floor(x);
	vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	return mix(mix(mix( hash(i+vec3(0,0,0)), 
		hash(i+vec3(1,0,0)),f.x),
	mix( hash(i+vec3(0,1,0)), 
		hash(i+vec3(1,1,0)),f.x),f.y),
	mix(mix( hash(i+vec3(0,0,1)), 
		hash(i+vec3(1,0,1)),f.x),
	mix( hash(i+vec3(0,1,1)), 
		hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}

vec3 curve (float ratio) {
	vec3 p = vec3(1.5,0,0);
	p.xz *= rotation(time*.2+ratio*41.57);
	p.yx *= rotation(time*.2+ratio*230.274);
	p.yz *= rotation(time*.2+ratio*100.4768);
	return p;
}

void main () {
	
	float radius = 0.1;
	float hello = 0.2;
	float ciao = 0.5;
	float hight = 0.0;
	vec3 grany = position;
	vec3 pos = vec3(0,-1,0);
	pos.y += quantity.x*2.;
	
	float high = smoothstep(hight-0.5, hight+0.5, pos.y);
	// pos.xz += normalize(grany.xz) * high * 0.1;

	vec3 seed = pos*2.;
	float count = 1.+quantity.x*8.;//floor(8.*quantity.x);
	float variation = floor(random(quantity.xx+vec2(.987))*count)/count;
	seed.xz *= rotation(sin(variation*TAU));
	seed.yx *= rotation(sin(variation*TAU));
	seed.yz *= rotation(sin(variation*TAU));
	vec3 curl = (vec3(
		noise(seed), noise(seed+vec3(64.5,91.57,7.52)), noise(seed+vec3(1.25,8.54,45.54))
		)*2.-1.);

	// pos.xz *= rotation(sin(curl;
	pos.yz *= rotation(curl.y*high*PI);
	pos.yx *= rotation(curl.z*high*PI);
	pos.xz *= rotation(curl.x*high*TAU);
	
	pos.xz += normalize(pos.xz+.001) * high * 0.2;
	pos.y += high;

	vUv = (anchor.xy*.5+.5)/6.+uv.xy;
	vColor = vec4(1.0);

	gl_Position = viewProjection * vec4(pos, 1);

	vec2 pivot = anchor.xy * vec2(resolution.y/resolution.x, -1.);
	gl_Position.xy += pivot.xy * radius;
}