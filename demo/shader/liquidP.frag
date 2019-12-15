precision mediump float;

uniform float time, count;
uniform sampler2D positionmap, datamap, velocitymap;

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
	vec3 pos = data.xyz;
	float elapsed = data.w;
	float variation = random(uv+vec2(.8946));
	vec3 follow = vec3(0,0,0);//vec3(sin(uv.x*TAU),cos(uv.x*TAU),0)*2.;
	vec3 avoid = vec3(0,1,0);
	// follow.x += sin(time)*.1;
	// follow.xz *= rotation(time*.2);
	// follow.yz *= rotation(time*.2);
	pos += texture2D(velocitymap, uv).xyz;
	// pos = normalize(pos-avoid) * max(1.0,length(pos-avoid));
	elapsed += .001 + .01 * variation;
	// elapsed = fract(time*.1+variation*3.145);
	// float elapsed2 = fract(time*(.01+.1*random(uv+vec2(5.54)))+variation*8.145);
	// pos = min(abs(pos), vec3(0.4)) * sign(pos);
	pos = mix(pos, target*.001+vec3(sin(time)*.5,0,0), step(1.0, elapsed+.001));
	elapsed = fract(elapsed);
	gl_FragColor = vec4(pos, elapsed);
}