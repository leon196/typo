
attribute vec2 anchor, quantity;
uniform sampler2D terrainmap, biotopemap;
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
	float minsize = 0.02;
	float extrasize = 0.2;
	float peak = 4.0;
	float size = minsize+extrasize*pow(seed.y, peak);
	float weight = clamp((size-minsize)/extrasize, 0., 1.);
	float jitter = 0.01;

	vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension);

	pos.xz = mod(pos.xz-terraincell, 1.)*2.-1.;

	float fade = 1.;
	fade *= smoothstep(1.,0.8,abs(pos.x));
	fade *= smoothstep(1.,0.8,abs(pos.z));

	vec2 uv = pos.xz;
	uv /= 2.;
	uv -= 1./2.;
	uv += fract(terraincell);
	uv = uv * 0.5 + 0.5;
	vec4 terrain = texture2D(terrainmap, uv);
	vec3 normal = normalize(terrain.yzw);
	// normal.y *= 3.;
	float elevation = terrain.x;
	float shouldGrass = smoothstep(0.4, 0.9, dot(normal, vec3(0,1,0)));
	float shouldWater = smoothstep(0.002, 0.0, elevation);

	pos.xz += vec2(cos(seed.x*TAU), sin(seed.x*TAU)) * jitter;
	pos.y = elevation*2.;
	pos *= range;
	pos -= normal * weight * .1;

	vec2 pivot = anchor;
	pivot *= rotation(shouldGrass * sin(time + seed.y*TAU) * (1.-weight)); 

	vec3 right = normalize(cross(normal, vec3(0,1,0)));
	vec3 up = normalize(cross(right, normal));
	size *= smoothstep(.1,1.,length(pos-cameraPos));
	// size *= fade;
	pos += (pivot.x * right - pivot.y * up) * size;
	

	pos += shouldWater * right * sin(time+seed.y*TAU) * .1;
	pos.y += shouldWater * sin(time+length(pos.xz)*.1) * .1;
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
	// vColor.rgb = texture2D(biotopemap, uv).rgb;
	vColor.rgb = mix(vColor.rgb, vColor.rgb*.5, weight*.25+.5);
	vColor.rgb *= 0.9+0.1*(-anchor.y*0.5+0.5);

	vUV = anchor;
	vNormal = normal;
	vView = cameraPos-pos;

	vec3 skyColor = vec3(.4,.5,1.);
	skyColor = mix(skyColor, vec3(0.243, 0.368, 0.133)*.5, smoothstep(0.4,0.6,dot(normalize(vView), vec3(0,1,0))*.5+.5));
	vColor.rgb = mix(skyColor, vColor.rgb, fade);

	gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(pos,1);
}
