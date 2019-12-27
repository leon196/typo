
attribute vec2 anchor, quantity;
uniform sampler2D terrainmap;
uniform vec3 cameraPos, cameraTarget;
uniform vec2 resolution;
uniform float time;
varying vec2 vUV;
varying vec4 vColor;

void main () {

	vec3 seed = position;

	float speed = 0.1;
	float range = 18.;
	float minsize = 0.04;
	float extrasize = 0.4;
	float peak = 4.0;
	float size = minsize+extrasize*pow(seed.y, peak);
	float weight = clamp((size-minsize)/extrasize, 0., 1.);
	float jitter = 0.01;
	float dimension = 128.;
	float t = time*speed;

	vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension)*2.-1.;
	pos.xz += vec2(cos(seed.x*TAU), sin(seed.x*TAU)) * jitter;
	float ratio = mod(t+pos.z, 1.0);
	// pos.z = -(ratio*2.-1.);

	vec4 terrain = texture2D(terrainmap, pos.xz*.5+.5);
	float elevation = terrain.x;
	vec3 normal = normalize(terrain.yzw);
	pos.y = elevation;
	pos *= range;
	// pos.y -= random(seed.xz)*0.1;
	pos -= normal * weight;
	// pos.y -= .1/weight;
	// vec3 normal = normalize(cameraPos-pos);//vec3(0,0,1);//normalize(calculateNormal(pos.xz+offset));
	// normal = normalize(cameraPos-pos);
	vec3 right = normalize(cross(normal, vec3(0,1,0)));
	vec3 up = normalize(cross(right, normal));
	vec2 pivot = anchor;
	pivot.x = 0.;
	pivot.y += 1.;
	pivot *= rotation(-anchor.x*PI);
	size *= smoothstep(.5,3.,length(pos-cameraPos));
	// size *= smoothstep(0.0,0.05,ratio)*smoothstep(1.0,0.95,ratio);
	pos += (pivot.x * right - pivot.y * up) * size;

	vColor = vec4(1);
	vColor.rgb = vec3(0.427, 0.4, 0.050)*2.;
	vColor.rgb = mix(vColor.rgb, vec3(.61,.6,.6), 0.5);
	vColor.rgb = mix(vColor.rgb, vec3(0.243, 0.368, 0.133), smoothstep(0.4,0.9,dot(normal, vec3(0,1,0))));
	// vColor.rgb = abs(normal);
	// vColor.rgb = mix(vColor.rgb, vec3(.6), smoothstep(.8,1.1,calculatePath(pos.xz+offset)));
	vColor.rgb = mix(vColor.rgb, vColor.rgb*.5, weight*.25+.5);
	// vColor.rgb = mix(vColor.rgb, vColor.rgb*.5, seed.y*.25+.5);

	vUV = anchor;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
