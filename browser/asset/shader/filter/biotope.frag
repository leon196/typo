
uniform sampler2D terrainmap, biotopemap;
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

    vec4 terrain = texture2D(terrainmap, uv);
    vec3 normal = normalize(terrain.yzw);
    // normal.y *= 3.;
    float elevation = terrain.x;
    float shouldGrass = smoothstep(0.4, 0.9, dot(normal, vec3(0,1,0)));
    float shouldWater = smoothstep(0.002, 0.0, elevation);
    float shadeGrain = random(uv);
    
    vec3 color = vec3(1);

    color = mix(
        vec3(0.89, 0.89, 0.60), // light whity ground
        vec3(0.243, 0.368, 0.133), // dark green ground
        shouldGrass + shadeGrain*.2);

    color = mix(
        color, // light whity ground
        vec3(0.760, 0.960, 0.980), // dark green ground
        shouldWater + shadeGrain*.1);

	gl_FragColor = vec4(color,1);
}