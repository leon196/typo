
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
	vec3 pos = position;

	vec2 p = uv*2.-1.;
	p /= 2.;
	p -= 1./2.;
	p += fract(terraincell);
	p = p * 0.5 + 0.5;

	vec4 terrain = texture2D(terrainmap, p);
	vec3 normal = normalize(terrain.yzw);
	vec4 craft = texture2D(craftmap, p);
	float elevation = terrain.x;

	// pos.xz += vec2(cos(seed.x*TAU), sin(seed.x*TAU)) * jitter;
	pos.xz = (uv*2.-1.);
	pos.x *= -1.;
	pos.y = elevation;
	pos *= 10.;

	vColor = vec4(1);
	// vColor.rgb = texture2D(biotopemap, p).rgb;

	vUV = p;
	vNormal = normal;
	vView = cameraPos-pos;

	gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(pos,1);
}
