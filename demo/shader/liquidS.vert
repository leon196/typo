precision mediump float;

attribute vec3 position, anchor, quantity, uv;

uniform sampler2D positionmap, datamap, velocitymap;
uniform mat4 viewProjection;
uniform float time, size, dimension;
uniform vec2 resolution;
uniform vec3 camera;

const float PI = 3.1415;

varying vec2 vUv;
varying vec3 vNormal, vView;
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

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main () {
	vec3 pos = position;
	vec2 pivot = anchor.xy;

	pos = vec3(0);
	vec2 uvmap = vec2(mod(quantity.y,dimension)/dimension, floor(quantity.y/dimension)/dimension);
	vec4 data = texture2D(positionmap, uvmap);
	vec3 velocity = texture2D(velocitymap, uvmap).xyz;
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
	fade += elapsed*20.;
	fade *= smoothstep(1.0,0.9,elapsed);
	// fade *= .5+.5*pow(random(uvmap), 0.5);

	vColor = vec4(1);
	// vColor.rgb = mix(vec3(0.517, 0.901, 0.984), vec3(1), elapsed);
	vColor.rgb = hsv2rgb(vec3(.05, 1.-elapsed, 1.1));
	// vColor.rgb = 1.-(normalize(velocity)*.5+.5);
	// vColor.rgb = mix(vec3(0.560, 0.360, 0.098), vec3(0.556, 0.705, 0.192), leaf);
	// vColor *= smoothstep(0.0,hello,elapsed)*goodbye;

	float distCam = length(camera-pos);
	vec3 forward = normalize(camera-pos);//mix(camera-pos, velocity, goodbye));
	// vec3 forward = normalize(velocity);//mix(camera-pos, velocity, goodbye));
	vec3 right = normalize(cross(vec3(0,1,0), forward));
	vec3 up = cross(right, forward);
	float radius = 0.001 * fade;
	// radius *= smoothstep(1.1,2.5,distCam)*smoothstep(6.,3.,distCam)*smoothstep(1.5,1.,length(pos));
	vUv = anchor.xy;
	// pos += (pivot.x * right + pivot.y * forward) * radius;
	pos += (pivot.x * right + pivot.y * up) * radius;
	gl_Position = viewProjection * vec4(pos, 1);
	vView = (pos-camera);
	vNormal = (velocity);
	// pivot.x *= resolution.y/resolution.x;
	// pivot.y *= -1.;
	// gl_Position.xy += pivot.xy * radius;
}