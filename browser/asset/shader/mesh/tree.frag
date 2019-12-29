
uniform float time;

varying vec4 vColor;
varying vec3 vNormal, vView, vPos;
varying vec2 vUV;
varying float vFade;

void main () {
	// if (length(vUV) > 1.0) discard;
	// if (random(vUV+fract(time)) > vColor.a) discard;
	vec4 color = vColor;

	float slices = 32.;
	vec2 yy = floor(vUV.yy*slices)/slices;
	slices = 8.;
	vec2 xy = floor(vec2(1.,10.)*vUV.xy*slices)/slices;
	float shadeWood = .5+.5*sin(random(yy)*3.+2.*random(xy));

	color.rgb *= mix(1., mix(
		0.3,
		0.8,
		shadeWood), vFade);
	// vec3 normal = normalize(vNormal);
	// vec3 view = normalize(vView);
	// color.rgb *= dot(normal, view) * .5 + .5;
	// color.rgb += 1.-(dot(normal, view) * .5 + .5);
	gl_FragColor = color;
}