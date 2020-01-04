
attribute vec2 anchor, quantity;
uniform sampler2D terrainmap;
uniform vec3 cameraPos, cameraTarget, Points, Scratching, Dust;
uniform vec2 resolution, terraincell;
uniform float time;
varying vec2 vUV;
varying vec4 vColor;
varying vec3 vNormal, vView;

void main () {

	vec3 seed = position;

	float speed = 0.5;
	float range = 25.;
	float radius = pow(quantity.x, 0.5) * range;
	float angle = seed.x*TAU;
	float minsize = 1.5;
	float extrasize = 5.5;
	float peak = 4.0;
	float size = minsize+extrasize*pow(random(seed.xy), peak);
	float weight = clamp((size-minsize)/extrasize, 0., 1.);
	float thin = anchor.y*.45+.65;
	float jitter = 1.0;
	float t = time*speed;
	float dimension = 16.;
	float height = 4.;
	float heightVariation = 2.;

	// vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension)*2.-1.;
	// vec3 pos = position;
	// pos.xz += vec2(cos(angle), sin(angle)) * jitter;
	// float ratio = mod(t/range+pos.z, 1.0);
	// pos.z = -(ratio*2.-1.);
	// pos.xz = mod(pos.xz*.5+.5-terraincell, 1.)*2.-1.;
	// pos.xz = mod(pos.xz+offset-terraincell, 1. )*2.-1.;
	vec3 pos = vec3(mod(quantity.y,dimension)/dimension,0.,floor(quantity.y/dimension)/dimension);
	pos.xz = mod(pos.xz-terraincell, 1.) * 2. - 1.;

	float fade = 1.;
	fade *= smoothstep(1.,0.8,abs(pos.x));
	fade *= smoothstep(1.,0.8,abs(pos.z));

	vec2 uv = pos.xz;
	uv /= 2.;
	uv -= 1./2.;
	uv += fract(terraincell);
	uv = uv * 0.5 + 0.5;
	vec4 terrain = texture2D(terrainmap, uv);

	pos.y = terrain.x * 2.;
	// float fall = smoothstep(30.,50.,length(pos.xz));
	// pos.y -= 10.*fall;
	pos *= range;

	pos.y += height+heightVariation*random(seed.xz);

	vec3 forward = normalize(cameraPos - pos);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	vec2 pivot = anchor;
	pivot *= rotation(random(seed.zy)*TAU);
	size *= smoothstep(.5,8.,length(pos-cameraPos));
	// size *= fade;
	// size *= 1.+smoothstep(2.,1.,length(pos.xz));
	// size *= smoothstep(0.0,0.3,ratio)*smoothstep(1.0,0.6,ratio);
	// size *= smoothstep(height, height+2., pos.y);
	pos += (pivot.x*right - pivot.y*up) * size;
	// pos -= forward*size*2.;

	vColor = vec4(1);
	vColor.rgb = mix(vColor.rgb*.75, vColor.rgb, (weight)*.25+.75);
	vColor.rgb *= 0.9+0.1*(-pivot.y*0.5+0.5);
	vColor.a = 0.1*smoothstep(1.0,0.0,length(pivot));

	vUV = anchor;
	vNormal = normal;
	vView = cameraPos - pos;

	vec3 skyColor = vec3(.4,.5,1.);
	skyColor = mix(skyColor, vec3(0.243, 0.368, 0.133)*.5, smoothstep(0.4,0.6,dot(normalize(vView), vec3(0,1,0))*.5+.5));
	vColor.rgb = mix(skyColor, vColor.rgb, fade);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
