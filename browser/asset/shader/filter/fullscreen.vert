
varying vec2 vUV;

void main () {
	vUV = uv;
	gl_Position = vec4(uv * 2. - 1., 0., 1.);
}