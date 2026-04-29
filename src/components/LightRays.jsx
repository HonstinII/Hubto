import { useRef, useEffect } from 'react';
import { Renderer, Program, Triangle, Mesh } from 'ogl';
import './LightRays.css';

const DEFAULT_COLOR = '#ffffff';

const hexToRgb = hex => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const getAnchorAndDir = (origin, w, h) => {
  const outside = 0.2;
  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case 'top-right':
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case 'left':
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case 'right':
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-center':
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-right':
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default:
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

export default function LightRays({
  raysOrigin = 'top-center',
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  className = ''
}) {
  const containerRef = useRef(null);
  const uniformsRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const meshRef = useRef(null);
  const cleanupFunctionRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      cleanupFunctionRef.current = null;
    }

    let animationId = 0;

    const initializeWebGL = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;

      if (w === 0 || h === 0) return;

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
        antialias: true
      });
      rendererRef.current = renderer;

      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(gl.canvas);

      const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

      const frag = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;
uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 rayDir, vec2 coord, float seedA, float seedB, float time) {
  vec2 sourceToCoord = coord - raySource;
  float dist = length(sourceToCoord);
  float cosAngle = dot(normalize(sourceToCoord + 0.0001), rayDir);
  
  float spreadFactor = lightSpread;
  float spread = clamp((cosAngle * spreadFactor * 0.5 + 0.5), 0.0, 1.0);
  
  float rayContribution = hash(vec2(seedA, seedB)) * 3.0 + dist * 0.003;
  float flicker = hash(vec2(floor(iTime * 0.3), seedA)) * 0.15 + 0.85;
  
  float pulse = pulsating > 0.5 ? (sin(iTime * 2.0 + seedA * 6.28) * 0.5 + 0.5) * 0.3 + 0.7 : 1.0;
  
  return max(0.0, spread * flicker * pulse) * max(0.0, 1.0 - dist / (rayLength * iResolution.y));
}

void main() {
  vec2 uv = vUv;
  uv.y = 1.0 - uv.y;
  vec2 coord = vec2(uv.x * iResolution.x, uv.y * iResolution.y);
  
  vec2 actualRayPos = rayPos;
  vec2 actualRayDir = rayDir;
  
  if (mouseInfluence > 0.0) {
    vec2 mouseScreen = vec2(mousePos.x * iResolution.x, mousePos.y * iResolution.y);
    vec2 toMouse = mouseScreen - actualRayPos;
    float distToMouse = length(toMouse);
    vec2 mouseDir = distToMouse > 1.0 ? normalize(toMouse) : actualRayDir;
    actualRayDir = mix(actualRayDir, mouseDir, mouseInfluence);
  }
  
  vec3 col = vec3(0.0);
  float totalRayStrength = 0.0;
  
  int NUM_RAYS = 18;
  for (int i = 0; i < 18; i++) {
    float fi = float(i);
    float seedA = hash(vec2(fi, 0.0));
    float seedB = hash(vec2(fi, 1.0));
    totalRayStrength += rayStrength(actualRayPos, vec2(1.0, 0.0), actualRayDir, coord, fi + iTime * raysSpeed * 0.1, fi * 100.0 + iTime * raysSpeed * 0.05, iTime);
  }
  
  float noise = noiseAmount > 0.0 ? hash(uv * 500.0 + iTime) * noiseAmount : 0.0;
  float wave = distortion > 0.0 ? sin(uv.y * 20.0 + iTime * 2.0) * distortion : 0.0;
  
  float finalStrength = clamp(totalRayStrength / float(NUM_RAYS) + noise + wave, 0.0, 1.0);
  
  float fadeDist = fadeDistance * iResolution.y;
  float dist = length(coord - actualRayPos);
  float fade = 1.0 - clamp(dist / fadeDist, 0.0, 1.0);
  finalStrength *= fade;
  
  vec3 saturatedColor = mix(vec3(finalStrength), raysColor * finalStrength, saturation);
  col += saturatedColor;
  
  gl_FragColor = vec4(col, col.r * 0.6);
}`;

      const program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: [w, h] },
          rayPos: { value: [0, 0] },
          rayDir: { value: [0, 1] },
          raysColor: { value: hexToRgb(raysColor) },
          raysSpeed: { value: raysSpeed },
          lightSpread: { value: lightSpread },
          rayLength: { value: rayLength },
          pulsating: { value: pulsating ? 1.0 : 0.0 },
          fadeDistance: { value: fadeDistance },
          saturation: { value: saturation },
          mousePos: { value: [0.5, 0.5] },
          mouseInfluence: { value: followMouse ? mouseInfluence : 0.0 },
          noiseAmount: { value: noiseAmount },
          distortion: { value: distortion }
        }
      });

      uniformsRef.current = program.uniforms;

      const geometry = new Triangle(gl);
      const mesh = new Mesh(gl, { geometry, program });
      meshRef.current = mesh;

      const resize = () => {
        if (!containerRef.current) return;
        const { clientWidth: newW, clientHeight: newH } = containerRef.current;
        if (newW === 0 || newH === 0) return;
        
        renderer.setSize(newW, newH);
        if (uniformsRef.current) {
          uniformsRef.current.iResolution.value = [newW, newH];
          const { anchor, dir } = getAnchorAndDir(raysOrigin, newW, newH);
          uniformsRef.current.rayPos.value = anchor;
          uniformsRef.current.rayDir.value = dir;
        }
      };

      resize();
      window.addEventListener('resize', resize);

      let prevTime = performance.now();

      const animate = (now) => {
        animationId = requestAnimationFrame(animate);
        const dt = (now - prevTime) / 1000;
        prevTime = now;

        if (uniformsRef.current) {
          uniformsRef.current.iTime.value += dt * raysSpeed;

          smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.05;
          smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.05;
          uniformsRef.current.mousePos.value = [smoothMouseRef.current.x, 1.0 - smoothMouseRef.current.y];
        }

        renderer.render({ scene: mesh });
      };

      animationId = requestAnimationFrame(animate);

      const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = (e.clientX - rect.left) / rect.width;
        mouseRef.current.y = (e.clientY - rect.top) / rect.height;
      };

      if (followMouse) {
        window.addEventListener('mousemove', handleMouseMove);
      }

      cleanupFunctionRef.current = () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resize);
        if (followMouse) {
          window.removeEventListener('mousemove', handleMouseMove);
        }
        if (containerRef.current && gl.canvas.parentNode === containerRef.current) {
          containerRef.current.removeChild(gl.canvas);
        }
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      };
    };

    initializeWebGL();

    return () => {
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
      }
    };
  }, [raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, pulsating, fadeDistance, saturation, followMouse, mouseInfluence, noiseAmount, distortion]);

  return (
    <div
      ref={containerRef}
      className={`light-rays-container ${className}`}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    />
  );
}