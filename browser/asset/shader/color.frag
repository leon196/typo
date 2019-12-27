
uniform float time;

varying vec4 vColor;
// varying vec3 vNormal, vView;
varying vec2 vUV;

void main () {
	// if (length(vUV) > 1.0) discard;
	// if (random(vUV+fract(time)) > vColor.a) discard;
	// vec4 color = vColor;
	// vec3 normal = normalize(vNormal);
	// vec3 view = normalize(vView);
	// color.rgb *= dot(normal, view) * .5 + .5;
	gl_FragColor = vColor;
}