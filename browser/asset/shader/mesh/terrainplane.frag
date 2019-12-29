
uniform float time;
uniform sampler2D biotopemap;

varying vec4 vColor;
varying vec3 vNormal, vView;
varying vec2 vUV;

void main () {
	// if (length(vUV) > 1.0) discard;
	// if (random(vUV+fract(time)) > 0.5) discard;
	vec2 uv = vUV;
	vec4 color = vColor;
	vec3 normal = normalize(vNormal);
	// vec3 view = normalize(vView);
	color.rgb = normal;//texture2D(biotopemap, uv).rgb;
	color.a = length(vView);
	// // color.rgb *= dot(normal, view) * .5 + .5;
	gl_FragColor = color;
}