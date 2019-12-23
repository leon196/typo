precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D positionmap, datamap, velocitymap, plycolor, plyposition;
uniform float plydimension, plycount;

varying vec2 texcoord;

const float PI = 3.1415;
const float TAU = 6.283;

mat2 rotation (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
float random(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
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
float fbm (vec3 p, float falloff) {
	float amplitude = 0.5;
	float result = 0.0;
	for (int index = 1; index <= 4; ++index) {
		// float i = index / countinfo.y;
		// i = mod(i-time*.01, 1.);
		// float fade = pow(sin(i*PI), 0.5);
		// amplitude = pow(0.5, i*falloff);
		// result += noise(p / amplitude) * amplitude;
		result += (1.-pow(abs(sin(noise(p / amplitude)*TAU*2.)), 1.0)) * amplitude;
		amplitude /= falloff;
		// result += fade * (1.-abs(sin(noise(p / amplitude)*TAU*2.))) * amplitude;
	}
	return result;
}

void main() {
	vec2 uv = texcoord;
	vec4 data = texture2D(positionmap, uv);
	vec3 target = texture2D(datamap, uv).xyz;
	float i = mod(uv.x * plydimension * plydimension, plycount);
	vec2 uvi = vec2(mod(i, plydimension)/plydimension, floor(i/plydimension)/plydimension);
	vec3 plypos = texture2D(plyposition, uvi).xyz;
	vec3 pos = data.xyz;
	float elapsed = data.w;
	float variation = random(uv+vec2(.8946));
	float angle = uv.x*TAU;
	vec3 follow = vec3(sin(angle),cos(angle),0)*2.;
	float index = uv.x*TAU*2.;
	follow.xz *= rotation(time*.8);
	follow.yz *= rotation(time*.8);
	pos += texture2D(velocitymap, uv).xyz;
	elapsed += .001 + .001 * variation;
	pos = mix(pos, plypos, step(1.0, elapsed));
	elapsed = fract(elapsed);
	gl_FragColor = vec4(pos, elapsed);
}