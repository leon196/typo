
attribute vec2 anchor, quantity;
uniform sampler2D framebuffer, terrainmap, biotopemap, craftmap;
uniform vec3 cameraPos, cameraTarget;
uniform vec2 resolution, terraincell;
uniform float time;
varying vec2 vUV;
varying vec4 vColor;
varying vec3 vNormal, vView;

void main () {

	vec3 seed = position;
	float size = 0.002;

	vec3 pos = position;
	// pos *= 10.;

	vec2 uv = pos.xy*0.5+0.5;
	// vec4 frame = texture2D(framebuffer, uv);
	// size = .01/frame.a;

	// vec3 front = cameraPos-pos;
	// vec3 right = normalize(cross(front, vec3(0,1,0)));
	// vec3 up = normalize(cross(right, front));
	// pos += (anchor.x*right - anchor.y*up) * size;
	pos.xy += anchor * size;
	// pos.x *= -1.;

	vColor = vec4(1);
	vUV = anchor;
	vNormal = normal;
	vView = cameraPos-pos;

	gl_Position = vec4(pos,1);
}
