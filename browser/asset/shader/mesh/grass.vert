
attribute vec2 anchor, quantity;
uniform sampler2D terrainmap, biotopemap;
uniform vec3 cameraPos, cameraTarget, Audio;
uniform vec2 resolution, terraincell;
uniform float time;
varying vec2 vUV;
varying vec4 vColor;
varying vec3 vNormal, vView;

void main () {

	vec3 seed = position;

	float speed = 0.1;
	float range = 10.;
	float minsize = 0.05;
	float extrasize = .05;
	float thin = .1;
	float height = 1.;
	float peak = 1.;
	float size = minsize+extrasize*pow(seed.y, peak);
	float weight = clamp((size-minsize)/extrasize, 0., 1.);

	float dimension = 512.;
	float jitter = 0.02;
	float t = time*speed;
	float y = anchor.y-1.;
	vec2 offset = vec2(0, t*2.);

	vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension);

	pos.xz = mod(pos.xz-terraincell, 1.) * 2. - 1.;

	float fade = 1.;
	fade *= smoothstep(1.,0.5,abs(pos.x));
	fade *= smoothstep(1.,0.5,abs(pos.z));
	size *= 1.-Audio.x;

	vec2 uv = pos.xz;
	uv /= 2.;
	uv -= 1./2.;
	uv += fract(terraincell);
	uv = uv * 0.5 + 0.5;
	vec4 terrain = texture2D(terrainmap, uv);
	vec4 biotope = texture2D(biotopemap, uv);
	float elevation = terrain.x;
	vec3 normal = normalize(terrain.yzw);
	float shouldGrass = smoothstep(0.4, 0.9, dot(normal, vec3(0,1,0)));
	float shouldWater = smoothstep(0.002, 0.0, elevation);

	pos.xz += vec2(cos(seed.x*TAU), sin(seed.x*TAU)) * jitter;
	pos.y = elevation * 2.;
	pos *= range;
	// pos.y -= random(seed.xz)*0.1;
	// pos += normal * size;

	normal = mix(normal, vec3(0,1,0), 0.25);

	vec3 forward = normal;//normalize(cameraPos - pos);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	size *= smoothstep(.01,.1,length(pos-cameraPos));
	// size *= smoothstep(0.0,0.1,ratio)*smoothstep(1.0,0.9,ratio);
	// size *= smoothstep(1.2,0.6,calculatePath(pos.xz+offset));
	size *= shouldGrass * (1.-shouldWater);
	vec2 pivot = anchor;
	// pivot.x = 0.;
	pivot.y -= 1.;
	// pivot *= rotation(-anchor.x*PI+TAU*seed.x);
	// pivot.y += 1.0;
	pos += (pivot.x*right*thin - pivot.y*normal*height) * size;

	vColor = vec4(1);
	// vColor.rgb = vec3(0.364, 0.698, 0.062);
	vColor.rgb = mix(vec3(0.364, 0.698, 0.062), vec3(0.243, 0.368, 0.133), seed.y*.5+.5)*1.5;
	// vColor.rgb *= .5+.5*(1.-(anchor.y*.5+.5));
	vColor.rgb = mix(biotope.rgb, vColor.rgb, (1.-(anchor.y*.5+.5)));
	vColor.rgb = mix(vColor.rgb, vColor.rgb*.5, weight*.25+.5);
	// vColor.a = 0.5;

	vUV = anchor;
	vNormal = normal;
	vView = cameraPos - pos;

	vec3 skyColor = vec3(.4,.5,1.);
	skyColor = mix(skyColor, vec3(0.243, 0.368, 0.133)*.5, smoothstep(0.4,0.6,dot(normalize(vView), vec3(0,1,0))*.5+.5));
	vColor.rgb = mix(skyColor, vColor.rgb, fade);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
