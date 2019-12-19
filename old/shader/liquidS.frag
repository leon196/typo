precision mediump float;

uniform float time;
uniform sampler2D fontmap;

varying vec2 vUv;
varying vec3 vNormal, vView;
varying vec4 vColor;

void main() {
	if (length(vUv) > 1.) discard;
	vec3 normal = normalize(vNormal);
	vec3 view = normalize(vView);
	float shade1 = dot(normal, -view) * .5 + .5;
	float shade2 = dot(normal, -view) * .5 + .5;
	vec3 color = vec3(1);
	color *= .9+.1*(1.-clamp(length(vUv+vec2(0.,1.))*.4,0.,1.));
	// color = 1.-(normal*.5+.5);
	// color += mix(vec3(0.517, 0.901, 0.984), vec3(1), shade1);
	// color *= shade2;
	gl_FragColor = vec4(color, 1) * vColor;
}