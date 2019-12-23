precision mediump float;

attribute vec3 position, anchor, quantity, uv;

uniform sampler2D buffermap, datamap, velocitymap, plycolor, plyposition;
uniform float plydimension, plycount;
uniform mat4 viewProjection;
uniform float time;
uniform vec2 resolution;
uniform vec3 camera;

const float PI = 3.1415;

varying vec2 vUv;
varying vec4 vColor;

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
	vec4 data = texture2D(buffermap, vec2(uv.z,0));
	vec3 velocity = texture2D(velocitymap, vec2(uv.z,0)).xyz;
	pos = data.xyz;
	float range = 1.;
	// pos.x += (uv.z*2.-1.)*range;
	float x = pos.x / 2. / range;
	float wave = abs(sin(time - x));
	// pivot *= rotation((wave*2.-1.)*PI);
	// pivot.x *= 1.+.5*smoothstep(0.1,0.0,wave);
	// pos.y += (pow(wave, .5)*2.-1.)/2.;
	// pos = curve(uv.z*1.);
	float fade = 1.0;
	fade *= smoothstep(0.0, 0.5, data.w);

	float ciao = 0.8;
	fade += smoothstep(ciao,1.0,data.w)*2.;

	float i = mod(quantity.x * plydimension * plydimension, plycount);
	vec2 uvi = vec2(mod(i, plydimension)/plydimension, floor(i/plydimension)/plydimension);
	vec4 color = texture2D(plycolor, uvi);
	vColor = color*vec4(smoothstep(1.0,ciao,data.w));

	float distCam = length(camera-pos);
	vec3 forward = normalize(camera-pos);
	// vec3 forward = normalize(velocity);
	vec3 right = normalize(cross(vec3(0,1,0), forward));
	vec3 up = cross(right, forward);
	float radius = 0.04 * fade;
	// radius *= smoothstep(1.1,2.5,distCam)*smoothstep(6.,3.,distCam)*smoothstep(1.5,1.,length(pos));
	vUv = (anchor.xy*.5+.5)/6.+uv.xy;
	pos += (pivot.x * right + pivot.y * up) * radius;
	gl_Position = viewProjection * vec4(pos, 1);
}