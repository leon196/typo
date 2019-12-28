
uniform float time;

varying vec3 vNormal, vView;
varying vec2 vUV;

void main () {
	// if (length(vUV) > 1.0) discard;
	// if (random(vUV+fract(time)) > 0.5) discard;
	vec4 color = vec4(.4,.5,1.,1);
	vec3 normal = normalize(vNormal);
	vec3 view = normalize(vView);
	color.rgb = mix(color.rgb, vec3(0.243, 0.368, 0.133)*.5, smoothstep(0.4,0.6,dot(view, vec3(0,1,0)) * .5 + .5));
	// // color.rgb *= dot(normal, view) * .5 + .5;
	gl_FragColor = color;
}