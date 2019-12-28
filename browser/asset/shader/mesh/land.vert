
attribute vec2 anchor, quantity;
uniform sampler2D terrainmap;
uniform vec3 cameraPos, cameraTarget;
uniform vec2 resolution, terraincell;
uniform float time;
varying vec2 vUV;
varying vec4 vColor;
varying vec3 vNormal, vView;

void main () {

	vec3 seed = position;
	
	float dimension = 256.;
	float range = 10.;
	float minsize = 0.05;
	float extrasize = 0.3;
	float peak = 4.0;
	float size = minsize+extrasize*pow(seed.y, peak);
	float weight = clamp((size-minsize)/extrasize, 0., 1.);
	float jitter = 0.01;

	vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension);
	
	pos.xz = mod(pos.xz-terraincell, 1.)*2.-1.;

	vec2 uv = pos.xz;
	uv /= 3.;
	// uv += 1./3.;
	uv += fract(terraincell)*2./3.;
	// float x = time*.02;
	// uv.x = mod(x+uv.x, 1.);
	// pos.x -= mod(x, 1.);
	uv = uv * 0.5 + 0.5;
	vec4 terrain = texture2D(terrainmap, uv);
	vec3 normal = normalize(terrain.yzw);
	// normal.y *= 3.;
	float elevation = terrain.x;
	float shouldGrass = smoothstep(0.4, 0.9, dot(normal, vec3(0,1,0)));
	float shouldWater = smoothstep(0.002, 0.0, elevation);

	pos.xz += vec2(cos(seed.x*TAU), sin(seed.x*TAU)) * jitter;
	pos.y = elevation*3.;
	pos *= range;
	pos -= normal * weight * .1;

	vec2 pivot = anchor;
	pivot *= rotation(shouldGrass * sin(time + seed.y*TAU) * (1.-weight)); 

	vec3 right = normalize(cross(normal, vec3(0,1,0)));
	vec3 up = normalize(cross(right, normal));
	size *= smoothstep(.1,1.,length(pos-cameraPos));
	pos += (pivot.x * right - pivot.y * up) * size;
	

	pos += shouldWater * right * sin(time+seed.y*TAU) * .1;
	pos.y += shouldWater * sin(time-length(pos.xz)*1.) * .1;
	pos.y += shouldGrass * sin(time+length(pos.xz)*.5) * .02;

	vColor = vec4(1);

	float shadeGrain = seed.z;
	vColor.rgb = mix(
		vec3(0.89, 0.89, 0.60), // light whity ground
		vec3(0.243, 0.368, 0.133), // dark green ground
		shouldGrass + shadeGrain*.2);

	vColor.rgb = mix(
		vColor.rgb, // light whity ground
		vec3(0.760, 0.960, 0.980), // dark green ground
		shouldWater + shadeGrain*.1);

	vColor.rgb = mix(vColor.rgb, vColor.rgb*.5, weight*.25+.5);
	vColor.rgb *= 0.9+0.1*(-anchor.y*0.5+0.5);

	vUV = anchor;
	vNormal = normal;
	vView = cameraPos-pos;
	gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(pos,1);
}
