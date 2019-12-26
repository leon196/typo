
uniform sampler2D framebuffer, frametarget;
uniform vec2 resolution, mouse;
uniform float time;
varying vec2 vUv;

void main () {

	vec2 uv = vUv;
	vec4 color = texture2D(frametarget, uv);
  vec4 frame = texture2D(framebuffer, uv);
	gl_FragColor = mix(color, frame, 0.9);
}