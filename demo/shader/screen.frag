precision mediump float;

uniform sampler2D frame, frameBlur, fontmap, buffermap, datamap;
uniform vec2 resolution;
uniform float time, fade;

varying vec2 texcoord;

const float PI = 3.14159;
const float TAU = 6.28318;
#define lod(p,r) (floor(p*r)/r)

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
	vec2 p = (uv*2.-1.)*vec2(resolution.x/resolution.y,1.);
	vec4 blur = texture2D(frameBlur, vec2(uv.x,1.-uv.y));
	float dither = random(uv);
	vec4 background = vec4(0);
	background.rgb = mix(vec3(1.,0.2,0.2), vec3(0.9,0.9, .9), uv.y+20.*dither/resolution.y);
	float blend = clamp(smoothstep(1.0,2.,abs(p.x))+smoothstep(0.5,1.5,abs(p.y)),0.,1.);
	gl_FragColor = texture2D(frame, uv);
	// gl_FragColor = abs(mix(texture2D(buffermap, uv), texture2D(datamap, uv), step(0.5,uv.y)));
	// gl_FragColor = mix(gl_FragColor, blur, blend);
	// gl_FragColor.rgb = 1.-clamp(gl_FragColor.rgb,0.,1.);
	// gl_FragColor += background;
	// gl_FragColor = blur;
	// gl_FragColor = texture2D(fontmap, uv);
}