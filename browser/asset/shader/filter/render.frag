
uniform sampler2D framebuffer, frametarget, terrainmap;
uniform vec2 resolution, mouse, terraincell;
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
  vec2 p = uv;
  p.x *= resolution.x/resolution.y;
  p *= 3.;

  // normal
  // color.rgb = mix(color.rgb, abs(texture2D(terrainmap, p).yzw), step(p.x, 1.0)*step(p.y, 1.0));
  // p.y -= 1.;

  // elevation
  color.rgb *= mix(1., .5+.5*fract(sin(texture2D(terrainmap, p).r*80.)), step(p.x, 1.0)*step(p.y, 1.0)*step(0.,p.y));

  // cell
  p -= 1./3.;
  p -= fract(terraincell)/3.;
  color.rgb = mix(color.rgb, vec3(.8), step(abs(length(p)), 0.02));
  color.rgb = mix(color.rgb, vec3(.8), step(abs(p.y), 1./3.)*step(abs(abs(p.x)-1./3.), 3./resolution.y));
  color.rgb = mix(color.rgb, vec3(.8), step(abs(p.x), 1./3.)*step(abs(abs(p.y)-1./3.), 3./resolution.y));

	gl_FragColor = color;
}