
attribute vec2 anchor, quantity;
uniform sampler2D terrainmap;
uniform vec3 cameraPos, cameraTarget, Points, Scratching, Dust;
uniform vec2 resolution;
uniform float time;
varying vec2 vUV;
varying vec4 vColor;
varying vec3 vNormal, vView;

void main () {

	vec3 seed = position;

	float speed = 0.1;
	float range = 18.;
	float minsize = 0.1;
	float extrasize = .2;
	float peak = 1.;
	float size = minsize+extrasize*pow(seed.y, peak);
	float weight = clamp((size-minsize)/extrasize, 0., 1.);

	float dimension = 32.;
	float jitter = 0.02;
	float t = time*speed;
	float y = anchor.y-1.;
	vec2 offset = vec2(0, t*2.);

	vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension)*2.-1.;
	pos.xz += vec2(cos(seed.x*TAU), sin(seed.x*TAU)) * jitter;
	float ratio = mod(t+pos.z, 1.0);
	pos.z = -(ratio*2.-1.);

	vec4 terrain = texture2D(terrainmap, pos.xz*.5+.5);
	float elevation = terrain.x;
	vec3 normal = normalize(terrain.yzw);
	pos.y = elevation;
	pos *= range;
	pos.y -= random(seed.xz)*0.1;
	pos += normal * size;

	normal = mix(normal, vec3(0,1,0), 0.5);

	vec3 forward = normalize(cameraPos - pos);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	size *= smoothstep(.5,1.,length(pos-cameraPos));
	size *= smoothstep(0.0,0.1,ratio)*smoothstep(1.0,0.9,ratio);
	// size *= smoothstep(1.2,0.6,calculatePath(pos.xz+offset));
	vec2 pivot = anchor;
	pivot.x = 0.;
	pivot.y += 1.;
	pivot *= rotation(-anchor.x*PI+TAU*seed.x);
	// pivot.y += 1.0;
	pos += (pivot.x*right - pivot.y*up) * size;

	vColor = vec4(1);
	// vColor.rgb = vec3(0.364, 0.698, 0.062);
	vColor.rgb = mix(vec3(0.364, 0.698, 0.062), vec3(0.243, 0.368, 0.133), seed.y*.5+.5);
	// vColor.rgb *= .5+.5*(1.-(anchor.y*.5+.5));
	vColor.rgb = mix(vColor.rgb, vColor.rgb*.5, weight*.25+.5);
	vColor.a = 0.5;

	vUV = anchor;
	vNormal = normal;
	vView = cameraPos - pos;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
