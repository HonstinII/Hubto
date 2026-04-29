import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './BreathingLight.css';

const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uSize;
uniform float uBlur;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  // 呼吸动画 (速度降低一半)
  float breathe = sin(uTime * 1.0) * 0.5 + 0.5;
  float breathe2 = sin(uTime * 0.75 + 1.0) * 0.5 + 0.5;
  
  // 核心光点 (缩小10倍，更集中)
  float core = exp(-length(uv) * length(uv) * 80.0) * (0.8 + breathe * 0.2);
  
  // 外层光晕 (缩小10倍)
  float halo = exp(-length(uv) * length(uv) * 30.0) * (0.4 + breathe2 * 0.3);
  
  // 烟雾效果 (缩小10倍)
  float smoke = exp(-length(uv) * length(uv) * 15.0) * (0.15 + breathe * 0.1);
  
  // 边缘模糊 (扩大10倍范围)
  float edge = smoothstep(1.0, 0.0, length(uv) * 0.15);
  
  vec3 color = uColor * (core + halo * 0.6 + smoke * 0.3);
  float alpha = (core + halo + smoke) * edge;
  
  // 透明度5%
  gl_FragColor = vec4(color, alpha * 0.05);
}
`;

export default function BreathingLight({
  color = '#9d82f5',
  size = 100,
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const uniformsRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const w = size;
    const h = size;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
      antialias: true,
      width: w,
      height: h,
    });
    rendererRef.current = renderer;

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.width = w + 'px';
    gl.canvas.style.height = h + 'px';

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(gl.canvas);

    const hexToRgb = (hex) => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return m
        ? [
            parseInt(m[1], 16) / 255,
            parseInt(m[2], 16) / 255,
            parseInt(m[3], 16) / 255,
          ]
        : [1, 1, 1];
    };

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [w, h] },
        uColor: { value: hexToRgb(color) },
        uSize: { value: size },
        uBlur: { value: 0.5 },
      },
    });

    uniformsRef.current = program.uniforms;

    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    let animationId = 0;
    let prevTime = performance.now();

    const animate = (now) => {
      animationId = requestAnimationFrame(animate);
      const dt = (now - prevTime) / 1000;
      prevTime = now;

      if (uniformsRef.current) {
        uniformsRef.current.uTime.value += dt;
      }

      renderer.render({ scene: mesh });
    };

    animationId = requestAnimationFrame(animate);

    cleanupRef.current = () => {
      cancelAnimationFrame(animationId);
      if (containerRef.current && gl.canvas.parentNode === containerRef.current) {
        containerRef.current.removeChild(gl.canvas);
      }
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    };

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [color, size]);

  return (
    <div
      ref={containerRef}
      style={{
        width: size + 'px',
        height: size + 'px',
        position: 'relative',
        pointerEvents: 'none',
      }}
    />
  );
}
