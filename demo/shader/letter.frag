precision mediump float;

uniform float time;
uniform sampler2D fontmap;

varying vec2 vUv;

void main() {
	gl_FragColor = texture2D(fontmap, vUv);
}