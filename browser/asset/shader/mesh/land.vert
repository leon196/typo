
attribute vec2 anchor, quantity;
uniform vec3 cameraPos, cameraTarget, Points, Scratching, Dust;
uniform vec2 resolution;
uniform float time;
varying vec2 vUV;
varying vec4 vColor;
varying vec3 vNormal, vView;

void main () {

	vec3 seed = position;

	float radius = quantity.x * 10.;
	float angle = quantity.x * PI * 120.;
	float size = .09+radius*0.007;//+.1*pow(abs(seed.y), 4.0);
	// vec3 pos = vec3(seed.x, 0., seed.z) * 10.;
	vec3 pos = vec3(cos(angle), 0., sin(angle)) * radius;
	pos.y = calculateElevation(pos.xz+vec2(0,time));
	vec3 normal = calculateNormal(pos.xz+vec2(0,time));
	vec3 forward = (normal);//normalize(cameraPos - pos);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	size *= smoothstep(.5,1.,length(pos-cameraPos));
	pos += (anchor.x * right - anchor.y * up) * size;

	vColor = vec4(1);
	vColor.rgb = vec3(0.415, 0.541, 0.337);
	vColor.rgb = mix(vColor.rgb, vec3(0.427, 0.4, 0.050), seed.y*.25+.5);
	vUV = anchor;
	vNormal = normal;
	vView = cameraPos - pos;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
