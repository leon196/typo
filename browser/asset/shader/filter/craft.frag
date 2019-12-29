
uniform sampler2D terrainmap, biotopemap;
uniform float time;
uniform vec2 terraincell, terraincellID;

varying vec2 vUV;
const float dimension = 256.*2.;

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
    pos += terraincellID/2.;
    pos = pos * 2. - 1.;
    pos.x += sin(pos.y) * .5;
    path = smoothstep(.3,0., abs(sin(pos.x)));
    return path;
}

void main () {
	vec2 uv = vUV;
    vec4 terrain = texture2D(terrainmap, uv);
    vec3 normal = normalize(terrain.yzw);
    float path = calculatePath(uv);
	gl_FragColor = vec4(path,0,0,1);
}