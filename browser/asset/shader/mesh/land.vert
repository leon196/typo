
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
	float size = .3;
	float jitter = 0.01;
	float dimension = 128.;
	float t = time*speed;
	vec2 offset = vec2(0, t*2.);

	vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension)*2.-1.;
	pos.xz += vec2(cos(seed.x*TAU), sin(seed.x*TAU)) * jitter;
	float ratio = mod(t/range+pos.z, 1.0);
	pos.z = -(ratio*2.-1.);
	pos *= range;

	pos.y = calculateElevation(pos.xz+offset);
	vec3 normal = normalize(calculateNormal(pos.xz+offset));
	vec3 forward = (normal);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	size *= smoothstep(.5,5.,length(pos-cameraPos));
	size *= smoothstep(0.0,0.05,ratio)*smoothstep(1.0,0.95,ratio);
	pos += (anchor.x * right - anchor.y * up) * size;

	vColor = vec4(1);
	vColor.rgb = vec3(0.427, 0.4, 0.050)*2.;
	vColor.rgb = mix(vColor.rgb, vec3(.61,.6,.6), 0.5);
	vColor.rgb = mix(vColor.rgb, vec3(0.243, 0.368, 0.133), smoothstep(0.4,0.9,dot(normal, vec3(0,1,0))));
	vColor.rgb = mix(vColor.rgb, vec3(.6), smoothstep(.8,1.1,calculatePath(pos.xz+offset)));
	vColor.rgb = mix(vColor.rgb, vColor.rgb*.5, seed.y*.25+.5);
	vColor.a = 0.5;
	vUV = anchor;
	vNormal = normal;
	vView = cameraPos - pos;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
