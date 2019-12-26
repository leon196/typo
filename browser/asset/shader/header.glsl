
const float PI = 3.14159;
const float TAU = 6.28318;

// https://www.shadertoy.com/view/4dS3Wd
float random (in vec2 st) { return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123); }
float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(hash(i), hash(i + 1.0), u);
}
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
float noise(vec3 x) {
    const vec3 step = vec3(110, 241, 171);
    vec3 i = floor(x);
    vec3 f = fract(x);
    float n = dot(i, step);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

mat2 rotation (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

vec4 edgeSD (sampler2D bitmap, vec2 uv, vec2 dimension) {
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
    color += abs(texture2D(bitmap, uv + vec2(1, 0) / dimension) - texture2D(bitmap, uv + vec2(-1, 0) / dimension));
    color += abs(texture2D(bitmap, uv + vec2(0, 1) / dimension) - texture2D(bitmap, uv + vec2(0, -1) / dimension));
    return color / 2.;
}

vec3 rgb2hsv(vec3 c) {
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float calculateElevation (vec2 pos) {

    float scale = .1;
    float cycle = 1.0;
    float strength = 2.0;
    float peak = 2.;

    float elevation = 0.;
    float amplitude = 0.5;
    float falloff = 4.8;
    const int count = 3;
    for (int i = count; i > 0; --i) {
        elevation += noise(pos * scale / amplitude) * amplitude;
        amplitude /= falloff;
    }
    elevation = sin(elevation * PI * cycle);
    elevation = 1.-pow(abs(elevation), peak);
    return elevation * strength;
}

vec3 calculateNormal (vec2 pos) {
    vec2 e = vec2(0.1, 0);
    vec3 north = vec3(pos.x, calculateElevation(pos+e.yx), pos.y+e.x);
    vec3 south = vec3(pos.x, calculateElevation(pos-e.yx), pos.y-e.x);
    vec3 east = vec3(pos.x+e.x, calculateElevation(pos+e.xy), pos.y);
    vec3 west = vec3(pos.x-e.x, calculateElevation(pos-e.xy), pos.y);
    return (cross((north-south), (east-west)));
}