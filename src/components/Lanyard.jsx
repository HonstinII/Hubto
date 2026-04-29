import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './Lanyard.css';

function Card({ texture, gravity }) {
  const meshRef = useRef();
  const { viewport } = useThree();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // 简单的摆动动画
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2, 0]}>
      <planeGeometry args={[3, 4.5]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function String({ gravity }) {
  const lineRef = useRef();
  const points = [];
  const segments = 20;
  
  for (let i = 0; i <= segments; i++) {
    points.push(new THREE.Vector3(0, i * 0.2, 0));
  }
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  useFrame((state) => {
    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position.array;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = Math.sin(state.clock.elapsedTime * 0.5 + t * 2) * 0.1 * t;
        positions[i * 3] = x;
      }
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <line ref={lineRef} geometry={geometry} position={[0, 2, 0]}>
      <lineBasicMaterial color="#333" linewidth={2} />
    </line>
  );
}

function LanyardScene({ gravity, fov }) {
  const texture = useTexture('https://i.postimg.cc/KYVjfVRw/logo-single-(1)-1.png');
  
  // 将纹理改为黑白
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);

  return (
    <>
      <perspectiveCamera fov={fov} position={[0, 0, 30]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <String gravity={gravity} />
      <Card texture={texture} gravity={gravity} />
    </>
  );
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 45,
}) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 300, height: 400 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setSize({ width, height: width * 1.33 });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div ref={containerRef} style={{ width: '300px', height: '400px' }}>
      <Canvas
        camera={{ position, fov }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <LanyardScene gravity={gravity} fov={fov} />
      </Canvas>
    </div>
  );
}
