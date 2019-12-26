
attribute vec2 anchor, quantity;
uniform vec3 cameraPos, cameraTarget, Points, Scratching, Dust;
uniform vec2 resolution;
uniform float time;
varying vec2 vUV;
varying vec4 vColor;
varying vec3 vNormal, vView;

void main () {

	vec3 seed = position;

	float range = 8.;
	float radius = pow(quantity.x, 0.5) * range;
	float angle = quantity.x * PI * 880.;
	float size = 0.05;//+.1*pow(abs(seed.y), 4.0);
	// vec3 pos = vec3(seed.x, 0., seed.z) * 10.;
	vec2 offset = vec2(0,time);
	float thin = anchor.y*.45+.65;
	float height = 10.+seed.y*5.;
	// vec3 pos = vec3(seed.x, 0., seed.z) * radius;
	vec3 pos = vec3(cos(angle), 0., sin(angle)) * radius;
	pos.y = calculateElevation(pos.xz+offset);
	vec3 normal = normalize(calculateNormal(pos.xz+offset));
	vec3 forward = normalize(cameraPos - pos);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	size *= smoothstep(.5,1.,length(pos-cameraPos));
	height *= smoothstep(range+1., 0., radius);
	pos += (anchor.x*right*thin - anchor.y*normal*height) * size;

	vColor = vec4(1);
	vColor.rgb = vec3(0.364, 0.698, 0.062);
	vColor.rgb = mix(vColor.rgb, vec3(0.243, 0.368, 0.133), seed.y*.25+.5);
	vUV = anchor;
	vNormal = normal;
	vView = cameraPos - pos;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
