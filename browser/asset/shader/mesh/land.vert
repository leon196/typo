
attribute vec2 anchor, quantity;
uniform vec3 cameraPos, cameraTarget;
uniform vec2 resolution;
uniform float time;
varying vec2 vUV;
varying vec4 vColor;
varying vec3 vNormal, vView;

void main () {

	vec3 seed = position;

	float speed = 0.5;
	float range = 18.;
	float radius = quantity.x * range;
	float angle = seed.x*TAU;
	float size = .4;//+.1*pow(abs(seed.y), 4.0);
	float jitter = 0.01;
	float t = time*speed;
	// vec3 pos = vec3(seed.x, 0., seed.z) * 10.;
	float dimension = 128.;
	vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension)*2.-1.;
	pos.xz += vec2(cos(angle), sin(angle)) * jitter;
	float ratio = mod(t/range+pos.z, 1.0);
	pos.z = -(ratio*2.-1.);
	pos *= range;
	vec2 offset = vec2(0, t*2.);
	// vec2 offset = vec2(0, floor(t/range)*range*2.);

	pos.y = calculateElevation(pos.xz+offset);
	vec3 normal = normalize(calculateNormal(pos.xz+offset));
	// pos.z -= (mod(t/range+seed.z, 1.) * 2. - 1.) * range;
	vec3 forward = (normal);//normalize(cameraPos - pos);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	size *= smoothstep(.5,5.,length(pos-cameraPos));
	size *= smoothstep(0.0,0.05,ratio)*smoothstep(1.0,0.95,ratio);
	pos += (anchor.x * right - anchor.y * up) * size;

	vColor = vec4(1);
	vColor.rgb = vec3(0.427, 0.4, 0.050)*2.;
	vColor.rgb = mix(vColor.rgb, vec3(.61,.6,.6), 0.5);
	vColor.rgb = mix(vColor.rgb, vColor.rgb*.5, seed.y*.5+.5);
	vColor.rgb = mix(vColor.rgb, vec3(0.243, 0.368, 0.133), smoothstep(0.4,0.9,dot(normal, vec3(0,1,0))));
	vUV = anchor;
	vNormal = normal;
	vView = cameraPos - pos;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	// gl_Position.z += -.001+seed.z*.001; // z fighting hack fix
}
