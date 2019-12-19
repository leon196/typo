
uniform sampler2D textTexture;
uniform float time;
varying vec2 vUV;

void main () {
	vec2 uv = vUV;
	vec4 color = texture2D(textTexture, uv);
	gl_FragColor = color;
}