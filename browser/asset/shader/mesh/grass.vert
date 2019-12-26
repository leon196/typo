
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
	float range = 18.;
	float radius = pow(quantity.x, 0.5) * range;
	// float angle = quantity.x * PI * 880.;
	float angle = seed.x*TAU;
	float size = 0.1;//+.1*pow(abs(seed.y), 4.0);
	// vec3 pos = vec3(seed.x, 0., seed.z) * 10.;
	float thin = anchor.y*.45+.65;
	float jitter = 0.02;
	float curler = 0.1;
	float t = time*speed;
	float y = anchor.y-1.;
	float height = 4.+seed.y*2.;
	// vec3 pos = vec3(seed.x, 0., seed.z) * radius;
	// vec3 pos = vec3(cos(angle), 0., sin(angle)) * radius;
	// pos.z += time/range;
	float dimension = 128.;
	vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension)*2.-1.;
	pos.xz += vec2(cos(angle), sin(angle)) * jitter;
	// angle = TAU * noise(pos.xz*.2)*10.;
	// pos.xz += vec2(cos(angle), sin(angle)) * curler;
	float ratio = mod(t/range+pos.z, 1.0);
	pos.z = -(ratio*2.-1.);
	pos *= range;
	vec2 offset = vec2(0, t*2.);
	// vec2 offset = vec2(0, floor(time/range+seed.z)*range*2.);
	pos.y = calculateElevation(pos.xz+offset);
	vec3 normal = normalize(calculateNormal(pos.xz+offset));
	normal = mix(normal, vec3(0,1,0), 0.5);
	// pos.z -= (mod(time/range+seed.z, 1.) * 2. - 1.) * range;
	// height *= smoothstep(0.9,0.8,dot(normal, vec3(0,1,0))*.5+.5);
	vec3 forward = normalize(cameraPos - pos);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	size *= smoothstep(.5,1.,length(pos-cameraPos));
	size *= smoothstep(0.0,0.1,ratio)*smoothstep(1.0,0.9,ratio);
	size *= smoothstep(1.2,0.6,calculatePath(pos.xz+offset));
	// size *= smoothstep(0.1,0.9,noise((pos.xz+offset)*.8));
	// height *= smoothstep(range+1., 0., radius);
	pos += (anchor.x*right*thin/2. - y*normal*height) * size;

	vColor = vec4(1);
	vColor.rgb = vec3(0.364, 0.698, 0.062);
	vColor.rgb = mix(vColor.rgb, vec3(0.243, 0.368, 0.133), seed.y*.5+.5);
	vColor.rgb *= .5+.5*(1.-(anchor.y*.5+.5));
	vColor.a = 0.5;
	vUV = anchor;
	vNormal = normal;
	vView = cameraPos - pos;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	// gl_Position.z += -.01+seed.z*.001; // z fighting hack fix
}
