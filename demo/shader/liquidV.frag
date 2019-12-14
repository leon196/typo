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
	vec3 velocity = vec3(0);
	vec3 pos = data.xyz;
	float elapsed = data.w;

	vec3 seed = pos*12.;
	// float count = 1.+floor(12.*elapsed);
	float variation = 0.;//floor(random(uv+vec2(.987))*count)/count;
	float t = 84.;//time*.01;
	seed.xz *= rotation(sin(variation*TAU+t)*TAU);
	seed.yx *= rotation(sin(variation*TAU+t)*TAU);
	seed.yz *= rotation(sin(variation*TAU+t)*TAU);
	vec3 curl = (vec3(
		noise(seed), noise(seed+vec3(64.5,91.57,7.52)), noise(seed+vec3(1.25,8.54,45.54))
		)*2.-1.);

	vec3 grany = vec3(random(target.xy), random(target.zx), random(target.yz))*2.-1.;
	vec3 avoid = vec3(0,0,0);
	vec3 follow = vec3(0,0,0);
	float bounds = 0.4;

	vec3 collide = vec3(
		smoothstep(bounds-.1, bounds+.1, abs(pos.x)),
		smoothstep(bounds-.1, bounds+.1, abs(pos.y)),
		smoothstep(bounds-.1, bounds+.1, abs(pos.z)));

	float radius = .3*elapsed;

	const float count = 2970.;
	for (float other = 0.; other < count; ++other) {
		float index = other/count;
		if (abs(index-uv.x) > 0.01) {
			vec3 otherP = texture2D(positionmap, vec2(index,0)).xyz;
			float distOther = length(otherP-pos);
			vec3 dirOther = normalize(otherP-pos+.001);
			avoid += -dirOther * smoothstep(radius,0.0, distOther)*(1.-collide);
			follow += dirOther * smoothstep(0.1,0.5,distOther);
		}
	}

	vec3 twist = pos;
	twist.xz *= rotation(0.01);
	twist = normalize(twist-pos);

	velocity += 10. * avoid / count;
	velocity += 0.1 * follow / count;
	// velocity += normalize(follow+.001);
	// velocity += twist * .1;
	velocity += curl * .1;
	velocity += vec3(0,-1,0) * .5 * (1.-collide.y);
	velocity += normalize(-pos) * collide * 2.;
	// velocity += grany * .1;

	// velocity.x *= collide.x;
	// velocity.y *= collide.y;
	// velocity.z *= collide.z;
	// collide += abs(abs(pos.y)-0.2);
	// collide += abs(abs(pos.z)-0.5);
	// collide = 1.-smoothstep(0.0, 0.01, collide);

	float friction = 0.999;
	float speed = 0.001;
	velocity = speed*velocity + friction*texture2D(velocitymap, uv).xyz;
	velocity *= step(elapsed+.01, 1.0);
	// velocity += normalize(follow-pos) * far * 0.1 * speed;
	gl_FragColor = vec4(velocity, 1);
	// gl_FragColor = texture2D(datamap, uv);
}