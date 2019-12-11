precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D buffermap, datamap;

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
	vec4 data = texture2D(buffermap, uv);
	vec3 target = texture2D(datamap, uv).xyz;
	vec3 pos = data.xyz;
	float elapsed = data.w;
	vec3 seed = pos + target;
	seed.xz *= rotation(time*.1);
	seed.yz *= rotation(time*.1);
	vec3 curl = (vec3(
		noise(seed), noise(seed+vec3(64.5,91.57,7.52)), noise(seed+vec3(1.25,8.54,45.54))
		)*2.-1.);
	// pos += normalize(-pos) * smoothstep(0.1, 0.3, length(pos)) * 0.1;
	pos += curl * 0.1;
	elapsed += .001;
	pos = mix(pos, vec3(0), step(1.0, elapsed));
	elapsed = fract(elapsed);
	gl_FragColor = vec4(pos, elapsed);
	// gl_FragColor = texture2D(datamap, uv);
}