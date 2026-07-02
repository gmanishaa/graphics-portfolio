// Ported from opengl-2022/src/{vshader,fshader}.glsl (GLSL 150 -> GLSL ES 300 / WebGL2).
// Two behavioural changes from the original:
//  - `sunset` (bool) became `sunsetBlend` (float 0..1) so day/sunset is a continuous mix.
//  - added an `aspect` uniform to correct for non-square canvases; the original ran in a
//    fixed 512x512 window so it never needed it.

// no #version pragma here — CloudsMesh sets glslVersion={THREE.GLSL3} on the
// material, which makes three.js inject "#version 300 es" itself; adding it
// here too duplicates the directive and fails to compile.
export const vertexShader = /* glsl */ `
in vec3 position;

out vec2 v_uv;

void main() {
  v_uv = position.xy;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const fragmentShader = /* glsl */ `
precision highp float;
precision highp int;

in vec2 v_uv;

// uniforms
uniform float animationIndex;
uniform int maxOctaves;
uniform bool perlinNoise;
uniform float sunsetBlend; // 0 = day, 1 = sunset
uniform float aspect;

out vec4 fColor;

// constants
const int MAX_STEPS = 50;
const float STEP_SIZE = 0.08;
const int MAX_STEPS_LIGHT = 5;
const float STEP_SIZE_LIGHT = 0.6;

const vec3 CAMERA = vec3(0.0, 0.0, -3.0);
const vec3 WIND = vec3(0.7, 0.2, -0.5);

const vec3 SUN_COLOUR_SUNSET = vec3(1.8, 1.1, 0.6);
const vec3 SUN_COLOUR_DAY = vec3(1.5, 1.3, 0.9);
const vec3 SUN = normalize(vec3(1.5, 1.0, 1.0));

const vec3 SKY_TOP_DAY = vec3(0.2, 0.4, 0.8);
const vec3 SKY_BOTTOM_DAY = vec3(0.7, 0.85, 1.0);
const vec3 SKY_TOP_SUNSET = vec3(0.15, 0.30, 0.60);
const vec3 SKY_BOTTOM_SUNSET = vec3(0.85, 0.45, 0.30);

// globals
// (GLSL ES requires global initializers to be constant expressions, unlike desktop
// GLSL 150 — extinctionCoeff can't be initialized from the two globals above. It's
// recomputed every pixel in setSceneVariables() anyway, so the literal here is moot.)
float scatteringCoeff = 1.5;
float absorptionCoeff = 0.4;
float extinctionCoeff = 1.9;
vec3 sunColour = SUN_COLOUR_DAY;

//  Simplex 3D Noise
//  by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//  Used under MIT license
vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}
vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  //  x0 = x0 - 0. + 0.0 * C
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  // Permutations
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients
  // ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0 / 7.0; // N=7
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);    // mod(j,N)

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

//  Classic Perlin 3D Noise
//  by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//  Used under MIT license
vec3 fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

// fractal brownian motion
float octaves(in vec3 p) {
  float f = 0.0;
  float amp = 0.5;
  float freq = 2.0;

  for (int i = 0; i < maxOctaves; i++) {
    float noise = perlinNoise ? cnoise(p) : snoise(p);
    f += amp * noise;
    p *= freq; // add gap between frequencies (lacunarity)
    freq += 0.20;
    amp *= 0.5;
  }

  return f;
}

// signed distance function for sphere
// returns point inside sphere
float sdfSphere(in vec3 p, in float r) {
  float dist = length(p) - r;
  return -dist;
}

float henyeyGreenstien(in float cosTheta) {
  // forward scattering
  float g1 = 0.7;
  float denom1 = 1.0 + g1 * g1 - 2.0 * g1 * cosTheta;
  float forward = (1.0 - g1 * g1) / pow(denom1, 1.5);

  // backward scattering
  float g2 = -0.2;
  float denom2 = 1.0 + g2 * g2 - 2.0 * g2 * cosTheta;
  float backward = (1.0 - g2 * g2) / pow(denom2, 1.5);

  return mix(forward, backward, 0.4) * 0.4;
}

// calculates a gradient sky colour, blending day <-> sunset
vec3 calculateSkyColour(in vec3 rayDir) {
  float screenRange = clamp(rayDir.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 skyTop = mix(SKY_TOP_DAY, SKY_TOP_SUNSET, sunsetBlend);
  vec3 skyBottom = mix(SKY_BOTTOM_DAY, SKY_BOTTOM_SUNSET, sunsetBlend);

  return mix(skyBottom, skyTop, screenRange);
}

// sets correct globals, blending day <-> sunset
void setSceneVariables() {
  scatteringCoeff = mix(1.2, 1.5, sunsetBlend);
  absorptionCoeff = mix(0.2, 0.4, sunsetBlend);
  sunColour = mix(SUN_COLOUR_DAY, SUN_COLOUR_SUNSET, sunsetBlend);
  extinctionCoeff = scatteringCoeff + absorptionCoeff;
}

void march(in vec3 e, in vec3 s, out vec3 colour) {
  vec3 rayDir = normalize(s - e);

  vec3 sky = calculateSkyColour(rayDir);
  colour = vec3(0.0);
  setSceneVariables();

  // outer loop, ray from viewer to position
  float transmittance = 1.0;
  float t = 0.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = e + t * rayDir; // current position

    float dist = sdfSphere(p, 2.0);

    // distance bigger than 0 (inside sphere)
    if (dist > 0.0) {
      float density = clamp(octaves(p + animationIndex * WIND), 0.0, 1.0);
      density *= smoothstep(0.0, 1.0, dist);

      // early exit if density very low
      if (density < 0.01) {
        t += STEP_SIZE;
        continue;
      }

      // inner loop, ray from position toward sun
      float transmittanceLight = 1.0;
      float tLight = 0.0;
      for (int j = 0; j < MAX_STEPS_LIGHT; j++) {
        vec3 pLight = p + tLight * SUN;
        float densityLight = clamp(octaves(pLight + animationIndex * WIND), 0.0, 1.0);

        transmittanceLight *= exp(-densityLight * extinctionCoeff * STEP_SIZE_LIGHT * 1.5); // beer-lambert

        // early exit
        if (transmittanceLight < 0.05) break;

        tLight += STEP_SIZE_LIGHT;
      }

      // phase function
      float phase = henyeyGreenstien(dot(rayDir, SUN));

      vec3 ambient = sky * 0.7; // blend sky colour
      vec3 scattered = ((sunColour * transmittanceLight * phase * 6.0) + ambient) * scatteringCoeff;

      colour += transmittance * density * scattered * STEP_SIZE;

      transmittance *= exp(-density * extinctionCoeff * STEP_SIZE * 1.5); // beer-lambert

      // early exit
      if (transmittance < 0.01) break;
    }

    t += STEP_SIZE;

    // early exit
    if (t > 20.0) break;
  }
  colour += transmittance * sky;
}

void main() {
  vec2 uv = v_uv;
  uv.x *= aspect;

  vec3 s = vec3(uv, CAMERA.z + 1.0);
  vec3 colour = vec3(0.0);

  march(CAMERA, s, colour);

  fColor = vec4(colour, 1.0);
}
`
