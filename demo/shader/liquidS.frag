precision mediump float;

uniform float time;
uniform sampler2D fontmap;

varying vec2 vUv;
varying vec4 vColor;

void main() {
	if (length(vUv) > 1.) discard;
	gl_FragColor = vColor;
}