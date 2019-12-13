precision mediump float;

uniform float time;
uniform vec2 resolution;
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
	vec3 velocity = vec3(0);
	vec3 target = texture2D(datamap, uv).xyz;
	vec3 pos = data.xyz;
	float elapsed = data.w;
	vec3 seed = pos*16.;
	float count = 1.+floor(8.*elapsed);
	float variation = floor(random(uv+vec2(.987))*count)/count;
	seed.xz *= rotation(sin(variation*TAU)*PI);
	seed.yx *= rotation(sin(variation*TAU)*PI);
	seed.yz *= rotation(sin(variation*TAU)*PI);
	vec3 curl = (vec3(
		noise(seed), noise(seed+vec3(64.5,91.57,7.52)), noise(seed+vec3(1.25,8.54,45.54))
		)*2.-1.);
	// curl.y *= 0.1;
	// float variation = random(uv+vec2(.123));
	float friction = 0.5;// + 0.045 * variation;
	float speed = 0.001;
	vec3 grany = vec3(random(target.xy), random(target.zx), random(target.yz))*2.-1.;
	vec3 avoid = vec3(0,1,0);
	vec3 follow = vec3(sin(uv.x*TAU),cos(uv.x*TAU),0)*2.;
	follow.xz *= rotation(time);
	follow.yz *= rotation(time);
	float high = smoothstep(-1.0,1.0,pos.y);
	float far = smoothstep(0.0, 0.1, length(follow-pos));
	float close = 1.-far;
	float grow = smoothstep(0.5,1.0,elapsed);
	float stop = smoothstep(1.0,0.6,elapsed);
	vec3 avoidDir = normalize(pos-avoid);
	float avoidDist = length(pos-avoid);
	float shouldAvoid = smoothstep(1.0,0.4,avoidDist);
	velocity += curl * 8. * high * (1.-grow);
	velocity.xz += normalize(pos.xz+.001) * high * (1.-grow);
	// velocity += -avoidDir * (avoidDist) * 9. * high;
	velocity += vec3(0,1,0) * 2. * (1.-grow);
	// velocity += avoidDir * shouldAvoid * 4.;
	// velocity *= grow;
	velocity += grany * (grow);
	velocity = speed*velocity*stop + friction*texture2D(velocitymap, uv).xyz;
	// velocity *= stop;
	// velocity += normalize(follow-pos) * far * 0.1 * speed;
	gl_FragColor = vec4(velocity, 1);
	// gl_FragColor = texture2D(datamap, uv);
}