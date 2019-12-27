
uniform sampler2D terrainmap;
uniform float time;

varying vec2 vUV;
const float dimension = 128.;

float calculatePath (vec2 pos) {
    float path = 1.0;
    pos = pos * 2. - 1.;
    pos.x += sin(pos.y*.25) * 2.;
    path = smoothstep(.3,0., abs(pos.x));
    return path;
}

float calculateElevation (vec2 pos) {

    // pos.y += time * 0.1;

    float scale = 2.;
    float cycle = 1.0;
    float strength = 1.;
    float peak = 0.5;

    float elevation = 0.;
    float amplitude = 0.5;
    float falloff = 4.8;
    const int count = 3;
    for (int i = count; i > 0; --i) {
        elevation += noise(pos * scale / amplitude) * amplitude;
        amplitude /= falloff;
    }
    // elevation += noise(pos*scale);
    elevation = sin(elevation * PI * cycle);
    elevation = 1.-pow(abs(elevation), peak);
    // elevation *= .1+.9*(1.-calculatePath(pos));
    return elevation * strength;
}

vec3 calculateNormal (vec2 pos) {
    vec2 e = vec2(0.001, 0);
    vec3 north = vec3(pos.x, calculateElevation(pos+e.yx), pos.y+e.x);
    vec3 south = vec3(pos.x, calculateElevation(pos-e.yx), pos.y-e.x);
    vec3 east = vec3(pos.x+e.x, calculateElevation(pos+e.xy), pos.y);
    vec3 west = vec3(pos.x-e.x, calculateElevation(pos-e.xy), pos.y);
    return normalize(cross((north-south), (east-west)));
}

vec3 guessNormal (vec2 uv) {
    vec2 e = vec2(1./dimension, 0);
    vec3 north = vec3(uv.x, texture2D(terrainmap, uv+e.yx).x, uv.y+e.x);
    vec3 south = vec3(uv.x, texture2D(terrainmap, uv-e.yx).x, uv.y-e.x);
    vec3 east = vec3(uv.x+e.x, texture2D(terrainmap, uv+e.xy).x, uv.y);
    vec3 west = vec3(uv.x-e.x, texture2D(terrainmap, uv-e.xy).x, uv.y);
    return normalize(cross((north-south), (east-west)));
}

void main () {
	vec2 uv = vUV;
    vec4 frame = texture2D(terrainmap, uv);
	float elevation = calculateElevation(uv);
    // elevation = mix(elevation, frame.x, 0.9);
	vec3 normal = guessNormal(uv);
	gl_FragColor = vec4(elevation, normal);
}