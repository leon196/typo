
uniform float time;

varying vec4 vColor;
varying vec2 vUV;

void main () {
	if (random(vUV+fract(time)) > vColor.a) discard;
	if (length(vUV) > 1.) discard;
	gl_FragColor = vColor;
}