
attribute vec2 anchor, quantity;
uniform sampler2D terrainmap, biotopemap, craftmap;
uniform vec3 cameraPos, cameraTarget;
uniform vec2 resolution, terraincell;
uniform float time;
varying vec2 vUV;
varying vec4 vColor;
varying vec3 vNormal, vView;

void main () {

	vec3 seed = position;
	
	float dimension = 512.;
	float range = 10.;
	float minsize = 0.1;
	float extrasize = 0.2;
	float peak = 4.0;
	float size = minsize+extrasize*pow(random(seed.xz), peak);
	float weight = clamp((size-minsize)/extrasize, 0., 1.);
	float jitter = 0.01;
	float count = 20.;

	vec3 pos = vec3(0);	
	float i = floor(quantity.x*count)/count;
	float r = random(vec2(i,0.123));
	float a = random(vec2(i,8.845))*TAU;
	vec2 offset = vec2(cos(a),sin(a))*r;

	pos.xz = mod(pos.xz+offset-terraincell, 1. )*2.-1.;

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
	vec4 craft = texture2D(craftmap, uv);
	float elevation = terrain.x;
	float path = craft.x;
	float shouldGrass = smoothstep(0.4, 0.9, dot(normal, vec3(0,1,0)));
	float shouldWater = smoothstep(0.002, 0.0, elevation);
	float shouldCiment = smoothstep(0.0, 1.0, path);

	pos *= range;
	pos.y += 3.0;
	pos += seed*1.;

	vec2 pivot = anchor;
	vec3 front = normalize(cameraPos-pos);
	vec3 right = normalize(cross(front, vec3(0,1,0)));
	vec3 up = normalize(cross(right, front));
	size *= smoothstep(.1,1.,length(pos-cameraPos));
	// size *= fade;
	pos += (pivot.x * right - pivot.y * up) * size;

	vColor = vec4(1);

	vUV = anchor;
	vNormal = normal;
	vView = cameraPos-pos;

	gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(pos,1);
}
