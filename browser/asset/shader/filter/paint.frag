
uniform sampler2D framebuffer, frametarget, framealpha;
uniform vec2 resolution, mouse;
uniform float time;
varying vec2 vUV;

void main () {

	vec2 uv = vUV;
	vec4 color = texture2D(frametarget, uv);
  vec4 frame = texture2D(framebuffer, uv);
  vec4 alpha = texture2D(framealpha, uv);
	gl_FragColor = mix(alpha, frame, 0.95);
}