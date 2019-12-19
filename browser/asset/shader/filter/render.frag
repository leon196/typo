
uniform sampler2D framebuffer, frametarget, frameedge, bloom, blur, textTexture, creditTexture, cookieTexture, jobsTexture;
uniform vec2 resolution, mouse;
uniform vec3 Scratch, Texting, Bloom, ExtraBloom, Circle, Circle2, Circle3, TextingScreen, Credits, Cookie, Rideau;
uniform float time;
varying vec2 vUv;

float fbm (vec3 p) {
  float amplitude = .5;
  float result = 0.0;
  for (float index = 0.0; index <= 5.0; ++index) {
    result += noise(p / amplitude) * amplitude;
    amplitude /= 2.;
  }
  return result;
}

void main () {

	vec2 uv = vUv;
	vec4 color = texture2D(frametarget, uv);
	vec4 blu = texture2D(blur, uv) * (Bloom.y + ExtraBloom.y);
	vec4 edgy = texture2D(frameedge, uv);

	gl_FragColor = color;
}