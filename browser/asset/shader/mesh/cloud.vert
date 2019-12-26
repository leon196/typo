
attribute vec2 anchor, quantity;
uniform vec3 cameraPos, cameraTarget, Points, Scratching, Dust;
uniform vec2 resolution;
uniform float time;
varying vec2 vUV;
varying vec4 vColor;
varying vec3 vNormal, vView;

void main () {

	vec3 seed = position;

	float speed = 0.5;
	float range = 50.;
	float radius = pow(quantity.x, 0.5) * range;
	float angle = seed.x*TAU;
	float size = .1+2.*pow(seed.y, 2.0);
	float thin = anchor.y*.45+.65;
	float jitter = 0.02;
	float t = time*speed;
	float dimension = 64.;
	vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension)*2.-1.;
	pos.xz += vec2(cos(angle), sin(angle)) * jitter;
	float ratio = mod(t/range+pos.z, 1.0);
	pos.z = -(ratio*2.-1.);
	pos *= range;
	pos.y = 10.0+3.*seed.x;
	float fall = smoothstep(30.,50.,length(pos.xz));
	pos.y -= 10.*fall;

	vec3 forward = normalize(cameraPos - pos);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	vec2 pivot = anchor;
	pivot *= rotation(seed.z * TAU);
	size *= smoothstep(.5,1.,length(pos-cameraPos));
	size *= smoothstep(0.0,0.1,ratio)*smoothstep(1.0,0.9,ratio);
	// size *= 1.-fall;
	pos += (pivot.x*right - pivot.y*up) * size;

	vColor = vec4(1);
	vColor.a = 0.2;
	vUV = anchor;
	vNormal = normal;
	vView = cameraPos - pos;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	// gl_Position.z += -.01+seed.z*.001; // z fighting hack fix
}
