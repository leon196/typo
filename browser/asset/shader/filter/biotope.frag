
uniform sampler2D terrainmap;
uniform float time;
uniform vec2 terraincell, terraincellID;

varying vec2 vUV;
const float dimension = 256.*3.;

vec3 moda (vec2 p, float count) {
    float an = TAU/count;
    float a = atan(p.y,p.x)+an*.5;
    float c = floor(a/an);
    a = mod(a,an)-an*.5;
    c = mix(c,abs(c),step(count*.5,abs(c)));
    return vec3(vec2(cos(a),sin(a))*length(p),c);
}

float calculatePath (vec2 pos) {
    float path = 1.0;
    pos = pos * 2. - 1.;
    pos.x += sin(pos.y*.25) * 2.;
    path = smoothstep(.3,0., abs(pos.x));
    return path;
}

void main () {
	vec2 uv = vUV;
    // vec4 frame = texture2D(terrainmap, uv);
    // elevation = mix(elevation, frame.x, 0.9);
	gl_FragColor = vec4(0,0,1,1);
}