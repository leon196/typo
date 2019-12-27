
attribute vec2 anchor, quantity;
uniform sampler2D terrainmap;
uniform vec3 cameraPos, cameraTarget;
uniform vec2 resolution;
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

	vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension)*2.-1.;

	// float speed = 0.1;
	// float t = time*speed;
	// float ratio = mod(t+pos.z, 1.0);
	// pos.z = -(ratio*2.-1.);

	vec4 terrain = texture2D(terrainmap, pos.xz*.5+.5);
	float elevation = terrain.x;
	vec3 normal = normalize(terrain.yzw);

	pos.xz += vec2(cos(seed.x*TAU), sin(seed.x*TAU)) * jitter;
	pos.y = elevation;
	pos *= range;
	pos -= normal * weight * .1;

	vec3 right = normalize(cross(normal, vec3(0,1,0)));
	vec3 up = normalize(cross(right, normal));
	size *= smoothstep(.5,3.,length(pos-cameraPos));
	// size *= smoothstep(0.0,0.05,ratio)*smoothstep(1.0,0.95,ratio);
	pos += (anchor.x * right - anchor.y * up) * size;

	vColor = vec4(1);


	float shadeFertile = smoothstep(0.4, 0.9, dot(normal, vec3(0,1,0)));
	float shadeGrain = seed.z*.2;
	vColor.rgb = mix(
		vec3(0.89, 0.89, 0.60), // light whity ground
		vec3(0.243, 0.368, 0.133), // dark green ground
		shadeFertile + shadeGrain);

	// global variation
	vColor.rgb = mix(vColor.rgb, vColor.rgb*.5, weight*.25+.5);

	vUV = anchor;
	vNormal = normal;
	vView = cameraPos-pos;
	gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(pos,1);
}
