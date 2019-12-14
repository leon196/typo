precision mediump float;

attribute vec3 position, anchor, quantity, uv;

uniform sampler2D positionmap, datamap, velocitymap;
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
	vec4 data = texture2D(positionmap, vec2(uv.z,0));
	vec3 velocity = texture2D(velocitymap, vec2(uv.z,0)).xyz;
	pos = data.xyz;
	float elapsed = data.w;
	float range = 1.;
	// pos.x += (uv.z*2.-1.)*range;
	float x = pos.x / 2. / range;
	float wave = abs(sin(time - x));
	// pivot *= rotation((wave*2.-1.)*PI);
	// pivot.x *= 1.+.5*smoothstep(0.1,0.0,wave);
	// pos.y += (pow(wave, .5)*2.-1.)/2.;
	// pos = curve(uv.z*1.);
	float fade = 1.0;
	float hello = 0.2;
	float ciao = 0.9;
	float goodbye = smoothstep(1.0,ciao,elapsed);
	float leaf = smoothstep(0.5,1.0,elapsed);
	// fade += smoothstep(hello, 0.0, elapsed) * 4.;
	// fade += smoothstep(ciao,1.0,elapsed)*8.;

	vColor = vec4(1);
	vColor.rgb = 1.-(normalize(velocity)*.5+.5);
	// vColor.rgb = mix(vec3(0.560, 0.360, 0.098), vec3(0.556, 0.705, 0.192), leaf);
	// vColor *= smoothstep(0.0,hello,elapsed)*goodbye;

	float distCam = length(camera-pos);
	vec3 forward = normalize(velocity);//mix(camera-pos, velocity, goodbye));
	vec3 right = normalize(cross(vec3(0,1,0), forward));
	vec3 up = cross(right, forward);
	float radius = 0.01 * fade;
	// radius *= smoothstep(1.1,2.5,distCam)*smoothstep(6.,3.,distCam)*smoothstep(1.5,1.,length(pos));
	vUv = anchor.xy;
	pos += (pivot.x * right + pivot.y * forward) * radius;
	gl_Position = viewProjection * vec4(pos, 1);
	// pivot.x *= resolution.y/resolution.x;
	// pivot.y *= -1.;
	// gl_Position.xy += pivot.xy * radius;
}