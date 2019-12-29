
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
	float count = 20.;
	float range = 10.;
	float minsize = 0.05;
	float extrasize = 0.1;
	float peak = 2.0;
	float size = minsize+extrasize*pow(seed.z, peak);
	float weight = clamp((size-minsize)/extrasize, 0., 1.);
	float jitter = 0.01;
	float y = (anchor.y+1.);
	float thin = 0.04;

	vec3 pos = vec3(0);	
	float i = floor(quantity.x*count)/count;
	float r = random(vec2(i,0.123));
	float a = random(vec2(i,8.845))*TAU;
	vec2 offset = vec2(cos(a),sin(a))*r;

	pos.xz = mod(pos.xz+offset-terraincell, 1. )*2.-1.;

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

	thin *= 1.-.9*(y*.5);

	float trunkout = smoothstep(0.0, 1.0, anchor.y);
	// float branchout = smoothstep(0.5, 1.0, anchor.y);

	float idx = mod(quantity.y, count)/count;

	vec3 pivot = vec3(1, y, 0);
	pivot.xz *= rotation(-anchor.x * PI);
	pos.y += y * size;
	// pos.xz += fract(terraincell);
	pos.xz = vec2(0);
	// pos.xz = pos.xz * 0.5 + 0.5;
	// pos.xz = mod(pos.xz-offset+terraincell, 1. );
	pos.xy *= rotation(trunkout*(y*.1+sin(anchor.y*2.+idx*TAU*8.84)*.1));
	// pos.xy *= rotation(branchout*(y*.1+sin(anchor.y*2.+idx*TAU*8.84)*.1));

	pos.xz *= rotation(idx*PI*5.846);
	pos.xz += pivot.xz * size * thin;
	pos.xz = (pos.xz+mod(offset-terraincell, 1. ))*2.-1.;

	pos.y += elevation*2.;
	pos *= 10.;
	// pos.y += quantity.y*size*2.;

	// vec3 front = normalize(cameraPos-pos);
	// vec3 right = normalize(cross(front, vec3(0,1,0)));
	// vec3 up = normalize(cross(right, front));
	// size *= smoothstep(.1,1.,length(pos-cameraPos));
	// size *= fade;
	// pos += (anchor.x * right - anchor.y * up) * size;

	vColor = vec4(1);
	// vColor.rgb *= trunkout;
	vColor.rgb *= abs(sin(anchor.x*PI));

	vUV = anchor;
	vNormal = normal;
	vView = cameraPos-pos;

	gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(pos,1);
}
