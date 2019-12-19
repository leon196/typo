precision mediump float;

uniform float time;
uniform sampler2D fontmap;

varying vec2 vUv;
varying vec4 vColor;

void main() {
	gl_FragColor = vColor * texture2D(fontmap, vUv).r;
}