
uniform sampler2D framebuffer, frametarget, terrainmap;
uniform vec2 resolution, mouse;
uniform float time;
varying vec2 vUV;

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

	vec2 uv = vUV;
	vec4 color = texture2D(frametarget, uv);
  // color.rgb = abs(texture2D(terrainmap, uv).rgb);
	gl_FragColor = color;
}