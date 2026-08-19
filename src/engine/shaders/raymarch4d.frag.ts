/**
 * TOPOLOGICA: 4D Raymarching & Non-Euclidean SDF Fragment Shader (WebGL 2.0 GLSL 300 ES)
 */

export const RAYMARCH_4D_VERTEX_SHADER = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const RAYMARCH_4D_FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_cam_pos;
uniform vec3 u_cam_target;

// Harmonic Tensors
uniform float u_alpha; // Spatial Curvature (0.5 - 6.0)
uniform float u_beta;  // Temporal Viscosity (0.5 - 6.0)
uniform float u_gamma; // 4D Hyper-Phase Angle (0 - 2PI)

// Manifold Configuration
uniform int u_manifold_type; // 0=Gyroid, 1=Hopf, 2=Calabi, 3=Mobius, 4=Schwarzschild, 5=Tesseract, 6=Mandelbulb, 7=Omega
uniform float u_surface_distortion;
uniform float u_gravitational_warp;
uniform float u_resonance_level; // 0.0 to 1.0 (1.0 = Perfect Constructive Collapse)
uniform vec3 u_resonance_color;
uniform vec3 u_ambient_color;
uniform vec3 u_glow_color;

// Dynamic Singularities in 4D (Max 8 active)
uniform int u_singularity_count;
uniform vec4 u_singularities[8]; // xyz = pos, w = radius/intensity
uniform vec3 u_singularity_colors[8];

// Interactive Gravitational Lens (Mouse / Pointer focus)
uniform vec2 u_mouse_pos;
uniform float u_lens_active; // 0 or 1
uniform float u_lens_radius;

// Constants
const float PI = 3.14159265358979323846;
const float TWO_PI = 6.28318530717958647692;
const int MAX_STEPS = 96;
const float MAX_DIST = 40.0;
const float SURF_DIST = 0.002;

// 4D Rotation Helpers
vec4 rotateXW(vec4 p, float a) {
    float c = cos(a), s = sin(a);
    return vec4(p.x * c - p.w * s, p.y, p.z, p.x * s + p.w * c);
}

vec4 rotateYW(vec4 p, float a) {
    float c = cos(a), s = sin(a);
    return vec4(p.x, p.y * c - p.w * s, p.z, p.y * s + p.w * c);
}

vec4 rotateZW(vec4 p, float a) {
    float c = cos(a), s = sin(a);
    return vec4(p.x, p.y, p.z * c - p.w * s, p.z * s + p.w * c);
}

vec4 rotateXZ(vec4 p, float a) {
    float c = cos(a), s = sin(a);
    return vec4(p.x * c - p.z * s, p.y, p.x * s + p.z * c, p.w);
}

// Polynomial Smooth Minimum
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// 4D Gyroid Manifold
float sdGyroid4D(vec4 p, float scale, float thickness, float bias) {
    vec4 q = p * scale;
    float g = sin(q.x) * cos(q.y) + sin(q.y) * cos(q.z) + sin(q.z) * cos(q.w) + sin(q.w) * cos(q.x);
    return (abs(g - bias) - thickness) / scale;
}

// 4D Hopf Fibration (Clifford Torus nested manifold)
float sdHopf(vec4 p, float r1, float r2) {
    vec2 q1 = vec2(length(p.xy) - r1, p.z);
    vec2 q2 = vec2(length(p.zw) - r1, p.y);
    float d1 = length(q1) - r2;
    float d2 = length(q2) - r2;
    return smin(d1, d2, 0.4);
}

// 4D Calabi-Yau projection
float sdCalabiYau(vec4 p, float alpha) {
    float r = length(p);
    float angle1 = atan(p.y, p.x);
    float angle2 = atan(p.w, p.z);
    float cy = cos(alpha * angle1) * sin(alpha * angle2) * 0.4;
    return (r - 2.2 + cy) * 0.7;
}

// 4D Tesseract (Hypercube with rounded corners)
float sdTesseract(vec4 p, vec4 b, float r) {
    vec4 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, max(q.z, q.w))), 0.0) - r;
}

// 4D Mandelbulb Fractal Distance Estimator
float sdMandelbulb4D(vec4 pos) {
    vec4 z = pos;
    float dr = 1.0;
    float r = 0.0;
    float power = 4.0 + sin(u_time * 0.2) * 1.5;
    
    for (int i = 0; i < 4; i++) {
        r = length(z);
        if (r > 3.0) break;
        
        float theta = acos(z.z / max(0.0001, r));
        float phi = atan(z.y, z.x);
        float psi = atan(z.w, length(z.xyz));
        dr = pow(r, power - 1.0) * power * dr + 1.0;
        
        float zr = pow(r, power);
        theta = theta * power;
        phi = phi * power;
        psi = psi * power;
        
        z = zr * vec4(
            sin(theta) * cos(phi) * cos(psi),
            sin(theta) * sin(phi) * cos(psi),
            cos(theta) * cos(psi),
            sin(psi)
        ) + pos;
    }
    return 0.5 * log(r) * r / dr;
}

// 4D Mobius / Non-Orientable Ribbon
float sdMobius(vec4 p) {
    float u = atan(p.y, p.x);
    float r = length(p.xy) - 2.0;
    float v = p.z * cos(u * 0.5) + p.w * sin(u * 0.5);
    float w = -p.z * sin(u * 0.5) + p.w * cos(u * 0.5);
    return length(vec3(r, v, w)) - 0.25;
}

// Scene 4D Signed Distance Field Evaluator
float mapScene(vec4 p4d, out vec3 matColor, out float emissive) {
    matColor = u_ambient_color;
    emissive = 0.0;
    
    // Apply 4D hyper-rotations driven by time and user hyper-phase gamma
    float tSlow = u_time * 0.15 * u_beta;
    vec4 q4d = rotateZW(p4d, u_gamma + tSlow);
    q4d = rotateXW(q4d, u_gamma * 0.7);
    q4d = rotateXZ(q4d, tSlow * 0.5);
    
    // Surface distortion wave
    if (u_surface_distortion > 0.01) {
        q4d.xyz += sin(q4d.zxy * 3.0 + u_time) * (0.08 * u_surface_distortion);
    }
    
    float d = MAX_DIST;
    
    // 1. Base Mathematical Manifold
    if (u_manifold_type == 0) {
        // Gyroid
        d = sdGyroid4D(q4d, u_alpha * 0.8, 0.06 + u_resonance_level * 0.04, 0.0);
        matColor = mix(u_ambient_color, u_resonance_color, clamp(sin(q4d.x + q4d.w * 2.0) * 0.5 + 0.5, 0.0, 1.0));
    } else if (u_manifold_type == 1) {
        // Hopf Fibration
        d = sdHopf(q4d, 1.6, 0.25 + sin(u_time * u_beta) * 0.08);
        matColor = mix(vec3(0.1, 0.8, 0.9), u_glow_color, sin(q4d.z * 2.0) * 0.5 + 0.5);
    } else if (u_manifold_type == 2) {
        // Calabi-Yau
        d = sdCalabiYau(q4d, u_alpha);
        matColor = mix(vec3(0.6, 0.2, 0.9), vec3(0.2, 0.9, 0.8), cos(length(q4d.xyz)) * 0.5 + 0.5);
    } else if (u_manifold_type == 3) {
        // Mobius
        d = sdMobius(q4d);
        matColor = mix(vec3(0.9, 0.4, 0.2), vec3(0.2, 0.7, 1.0), sin(atan(q4d.y, q4d.x) * 3.0) * 0.5 + 0.5);
    } else if (u_manifold_type == 4) {
        // Schwarzschild Gravitational Singularity Core
        float r = length(q4d.xyz);
        float horizon = 1.2;
        float disk = max(abs(q4d.y) - 0.04, abs(r - 2.2) - 1.0);
        d = smin(r - horizon, disk, 0.2);
        matColor = mix(vec3(1.0, 0.5, 0.1), vec3(0.05, 0.05, 0.1), clamp((r - horizon) / 1.5, 0.0, 1.0));
        emissive = clamp(1.0 - (r - horizon) / 0.8, 0.0, 1.0) * 2.5;
    } else if (u_manifold_type == 5) {
        // Tesseract
        d = sdTesseract(q4d, vec4(1.0), 0.1);
        matColor = mix(vec3(0.2, 0.9, 0.6), u_resonance_color, 0.5);
    } else if (u_manifold_type == 6) {
        // Mandelbulb Fractal
        d = sdMandelbulb4D(q4d);
        matColor = mix(vec3(0.8, 0.2, 0.7), vec3(0.2, 0.8, 1.0), sin(q4d.w * 4.0) * 0.5 + 0.5);
    } else {
        // Omega Convergence (Nested Hyper-Gyroid with Core)
        float d1 = sdGyroid4D(q4d, u_alpha * 0.9, 0.08, 0.1);
        float d2 = length(q4d.xyz) - (1.1 + sin(u_time * 2.0) * 0.1);
        d = smin(d1, d2, 0.35);
        matColor = mix(u_resonance_color, u_glow_color, sin(q4d.x * 3.0 + u_time) * 0.5 + 0.5);
        emissive = u_resonance_level * 1.5;
    }
    
    // 2. Blend Active 4D Singularities
    for (int i = 0; i < 8; i++) {
        if (i >= u_singularity_count) break;
        vec4 sing = u_singularities[i];
        float singRadius = max(0.1, sing.w);
        
        // 4D distance to singularity
        vec4 diff = p4d - vec4(sing.xyz, 0.0);
        float dSing = length(diff) - singRadius;
        
        if (dSing < d) {
            float blendK = 0.3;
            float h = clamp(0.5 + 0.5 * (d - dSing) / blendK, 0.0, 1.0);
            matColor = mix(matColor, u_singularity_colors[i], h);
            emissive = mix(emissive, 1.8, h);
            d = smin(d, dSing, blendK);
        }
    }
    
    return d;
}

// Compute Normal via central finite differences in 4D space
vec3 calcNormal(vec4 p4d) {
    const float eps = 0.002;
    vec3 dummyCol;
    float dummyEm;
    float d = mapScene(p4d, dummyCol, dummyEm);
    
    float nx = mapScene(p4d + vec4(eps, 0.0, 0.0, 0.0), dummyCol, dummyEm) - d;
    float ny = mapScene(p4d + vec4(0.0, eps, 0.0, 0.0), dummyCol, dummyEm) - d;
    float nz = mapScene(p4d + vec4(0.0, 0.0, eps, 0.0), dummyCol, dummyEm) - d;
    
    return normalize(vec3(nx, ny, nz));
}

// Soft Shadow computation
float calcSoftShadow(vec4 ro, vec3 rd, float mint, float maxt, float k) {
    float res = 1.0;
    float t = mint;
    vec3 dummyCol;
    float dummyEm;
    
    for (int i = 0; i < 24; i++) {
        if (t >= maxt) break;
        vec4 p4d = ro + vec4(rd * t, 0.0);
        float h = mapScene(p4d, dummyCol, dummyEm);
        if (h < 0.001) return 0.0;
        res = min(res, k * h / t);
        t += clamp(h, 0.02, 0.25);
    }
    return clamp(res, 0.0, 1.0);
}

// ACES Filmic Tone Mapping Curve
vec3 ACESFilm(vec3 x) {
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Gravitational Lens light ray deflection from mouse pointer
    if (u_lens_active > 0.5) {
        vec2 mouseUV = (u_mouse_pos - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        vec2 toMouse = uv - mouseUV;
        float distToMouse = length(toMouse);
        if (distToMouse > 0.001 && distToMouse < u_lens_radius * 2.0) {
            float lensForce = 0.035 / (distToMouse * 4.0 + 0.15);
            uv -= normalize(toMouse) * lensForce;
        }
    }
    
    // Camera Ray Setup
    vec3 ro = u_cam_pos;
    vec3 forward = normalize(u_cam_target - ro);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, forward);
    
    // Perspective Ray Direction
    vec3 rd = normalize(forward * 1.5 + right * uv.x + up * uv.y);
    
    // Gravitational Lensing in 3D around active singularities
    if (u_gravitational_warp > 0.01) {
        for (int i = 0; i < 8; i++) {
            if (i >= u_singularity_count) break;
            vec3 singPos = u_singularities[i].xyz;
            vec3 toSing = singPos - ro;
            float projDist = dot(toSing, rd);
            if (projDist > 0.0) {
                vec3 closestPoint = ro + rd * projDist;
                vec3 bendVector = singPos - closestPoint;
                float d = length(bendVector);
                float bendStrength = (u_gravitational_warp * 0.12) / max(0.1, d * d);
                rd = normalize(rd + normalize(bendVector) * bendStrength);
            }
        }
    }
    
    // Primary 4D Raymarching Loop with Volumetric Scattering
    float t = 0.1;
    vec3 accumulatedLight = vec3(0.0);
    vec3 hitColor = vec3(0.0);
    float hitEmissive = 0.0;
    bool hit = false;
    vec4 p4d = vec4(0.0);
    
    // Volumetric photon scattering parameters
    vec3 sunDir = normalize(vec3(0.6, 0.8, -0.4));
    vec3 sunColor = vec3(1.0, 0.95, 0.85);
    
    for (int i = 0; i < MAX_STEPS; i++) {
        // 4th dimension coordinate W projected from hyper-phase and ray distance
        float wCoord = sin(u_gamma + t * 0.1) * 0.5;
        p4d = vec4(ro + rd * t, wCoord);
        
        vec3 matCol;
        float emissive;
        float d = mapScene(p4d, matCol, emissive);
        
        // Volumetric in-scattering (God rays + celestial nebula fog)
        float phaseHG = 0.25 * (1.0 + pow(max(0.0, dot(rd, sunDir)), 2.0));
        vec3 fogStep = (u_glow_color * 0.015 + sunColor * 0.01 * phaseHG) * (1.0 + emissive * 0.5);
        accumulatedLight += fogStep * (1.0 - t / MAX_DIST);
        
        if (d < SURF_DIST) {
            hit = true;
            hitColor = matCol;
            hitEmissive = emissive;
            break;
        }
        
        if (t > MAX_DIST) break;
        t += max(d * 0.75, 0.005);
    }
    
    vec3 finalColor = vec3(0.0);
    
    if (hit) {
        vec3 normal = calcNormal(p4d);
        vec3 viewDir = -rd;
        
        // PBR Cook-Torrance Specular Shading
        vec3 halfVector = normalize(sunDir + viewDir);
        float NdotL = max(dot(normal, sunDir), 0.0);
        float NdotV = max(dot(normal, viewDir), 0.001);
        float NdotH = max(dot(normal, halfVector), 0.0);
        float VdotH = max(dot(viewDir, halfVector), 0.0);
        
        // GGX Normal Distribution
        float roughness = 0.35 - u_resonance_level * 0.2;
        float alphaRough = roughness * roughness;
        float alphaSq = alphaRough * alphaRough;
        float denom = (NdotH * NdotH * (alphaSq - 1.0) + 1.0);
        float D = alphaSq / (PI * denom * denom);
        
        // Fresnel-Schlick
        vec3 F0 = mix(vec3(0.04), hitColor, 0.7);
        vec3 F = F0 + (1.0 - F0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
        
        // Geometric attenuation (Smith GGX)
        float k = (roughness + 1.0) * (roughness + 1.0) / 8.0;
        float g1L = NdotL / (NdotL * (1.0 - k) + k);
        float g1V = NdotV / (NdotV * (1.0 - k) + k);
        float G = g1L * g1V;
        
        vec3 specular = (D * F * G) / (4.0 * NdotL * NdotV + 0.0001);
        vec3 diffuse = (vec3(1.0) - F) * hitColor / PI;
        
        // Shadowing
        float shadow = calcSoftShadow(p4d + vec4(normal * 0.02, 0.0), sunDir, 0.05, 10.0, 16.0);
        
        vec3 directLighting = (diffuse + specular) * sunColor * NdotL * shadow * 3.2;
        vec3 ambientLighting = hitColor * (u_ambient_color * 0.4 + vec3(0.08));
        vec3 emissionLighting = hitColor * hitEmissive * 2.0;
        
        finalColor = directLighting + ambientLighting + emissionLighting;
        
        // Exponential Distance Fog
        float fogFactor = 1.0 - exp(-t * 0.06);
        finalColor = mix(finalColor, u_ambient_color * 0.3, fogFactor);
    } else {
        // Deep Space 4D Nebula Skybox with Celestial Cosmic Dust
        float skyNoise = sin(rd.x * 6.0 + u_time * 0.1) * cos(rd.y * 6.0) * sin(rd.z * 6.0 + u_gamma);
        vec3 cosmicNebula = mix(u_ambient_color * 0.25, u_glow_color * 0.4, skyNoise * 0.5 + 0.5);
        
        // Dynamic Stars in 4D space
        vec3 starP = floor(rd * 120.0);
        float starVal = fract(sin(dot(starP, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        if (starVal > 0.985) {
            float twinkle = sin(u_time * 4.0 + starVal * 100.0) * 0.5 + 0.5;
            cosmicNebula += vec3(1.0, 0.95, 0.9) * twinkle * 1.5;
        }
        
        finalColor = cosmicNebula;
    }
    
    // Add Volumetric Photon Scattering
    finalColor += accumulatedLight;
    
    // Constructive Resonance Bloom Glow
    if (u_resonance_level > 0.01) {
        float resonanceBloom = pow(u_resonance_level, 2.0) * 0.45;
        finalColor += u_resonance_color * resonanceBloom;
    }
    
    // Chromatic Aberration & Relativistic Lens Dispersion
    float chromAb = (0.003 + u_resonance_level * 0.008) * length(uv);
    vec3 chromColor = vec3(
        finalColor.r * (1.0 + chromAb),
        finalColor.g,
        finalColor.b * (1.0 - chromAb)
    );
    
    // ACES Filmic Tone Mapping & Color Grade
    vec3 gradedColor = ACESFilm(chromColor);
    
    // Subtle Cinematic Vignette
    float vignette = 1.0 - smoothstep(0.5, 1.4, length(uv));
    gradedColor *= vignette;
    
    fragColor = vec4(gradedColor, 1.0);
}
`;
