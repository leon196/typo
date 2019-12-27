
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
	float range = 20.;
	float radius = pow(quantity.x, 0.5) * range;
	float angle = seed.x*TAU;
	float minsize = 1.;
	float extrasize = 4.;
	float peak = 4.0;
	float size = minsize+extrasize*pow(random(seed.xy), peak);
	float weight = clamp((size-minsize)/extrasize, 0., 1.);
	float thin = anchor.y*.45+.65;
	float jitter = 1.0;
	float t = time*speed;
	float dimension = 16.;
	float height = 10.;
	float heightVariation = 1.;

	// vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension)*2.-1.;
	vec3 pos = position;
	pos.xz += vec2(cos(angle), sin(angle)) * jitter;
	float ratio = mod(t/range+pos.z, 1.0);
	// pos.z = -(ratio*2.-1.);
	pos *= range;

	pos.y = height+heightVariation*random(seed.xz);
	// float fall = smoothstep(30.,50.,length(pos.xz));
	// pos.y -= 10.*fall;

	vec3 forward = normalize(cameraPos - pos);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	vec2 pivot = anchor;
	pivot *= rotation(random(seed.zy)*TAU);
	size *= smoothstep(.5,1.,length(pos-cameraPos));
	// size *= 1.+smoothstep(2.,1.,length(pos.xz));
	// size *= smoothstep(0.0,0.3,ratio)*smoothstep(1.0,0.6,ratio);
	// size *= smoothstep(height, height+2., pos.y);
	pos += (pivot.x*right - pivot.y*up) * size;
	pos -= forward*size*2.;

	vColor = vec4(1);
	vColor.rgb = mix(vColor.rgb*.75, vColor.rgb, (weight)*.25+.75);
	vColor.rgb *= 0.9+0.1*(-pivot.y*0.5+0.5);
	// vColor.a = 0.5;

	vUV = anchor;
	vNormal = normal;
	vView = cameraPos - pos;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
