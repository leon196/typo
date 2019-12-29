
uniform sampler2D framebuffer, frametarget, terrainmap, biotopemap, craftmap;
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
  vec2 p;

  // biotope
  p = uv;
  p.x = 1.-p.x;
  p.x *= resolution.x/resolution.y;
  p *= 3.;
  color.rgb = mix(color.rgb, texture2D(biotopemap, p).rgb, step(p.x, 1.0)*step(p.y, 1.0));

  // cell
  p -= 1./4.;
  p -= fract(terraincell)/2.;
  color.rgb = mix(color.rgb, vec3(1), step(abs(length(p)), 0.02));
  color.rgb = mix(color.rgb, vec3(1), step(abs(p.y), .5/3.)*step(abs(abs(p.x)-.5/3.), 3./resolution.y));
  color.rgb = mix(color.rgb, vec3(1), step(abs(p.x), .5/3.)*step(abs(abs(p.y)-.5/3.), 3./resolution.y));

  // craft
  // p = uv;
  // p.x = 1.-p.x;
  // p.x *= resolution.x/resolution.y;
  // p.y -= 1./3.;
  // p *= 3.;
  // color.rgb = mix(color.rgb, texture2D(craftmap, p).rgb, step(p.x, 1.0)*step(p.y, 1.0)*step(0.,p.y));

  // elevation
  // p = uv;
  // p.y = 1.-p.y;
  // p.y -= 1.-1./3.;
  // p.x *= resolution.x/resolution.y;
  // p *= 3.;
  // color.rgb *= mix(1., smoothstep(1.0, 0.5,fract(texture2D(terrainmap, p).r*60.)), step(p.x, 1.0)*step(p.y, 1.0)*step(0.,p.y));

	gl_FragColor = color;
}