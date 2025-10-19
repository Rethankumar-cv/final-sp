import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

function ShieldObject() {
  const shieldRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (shieldRef.current) {
      shieldRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
      shieldRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group>
      {/* Main Shield */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={shieldRef}>
          {/* Shield Base */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[2, 2.2, 0.3, 6]} />
            <meshStandardMaterial
              color="#1a1a2e"
              metalness={0.9}
              roughness={0.1}
              emissive="#3b82f6"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Shield Inner Glow */}
          <mesh position={[0, 0, 0.05]}>
            <cylinderGeometry args={[1.7, 1.9, 0.1, 6]} />
            <meshStandardMaterial
              color="#3b82f6"
              metalness={1}
              roughness={0}
              emissive="#60a5fa"
              emissiveIntensity={0.8}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Shield Center Emblem */}
          <mesh position={[0, 0, 0.2]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial
              color="#3b82f6"
              metalness={1}
              roughness={0}
              emissive="#60a5fa"
              emissiveIntensity={1.2}
            />
          </mesh>

          {/* Shield Edges */}
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0.1]}
                rotation={[0, 0, angle]}
              >
                <boxGeometry args={[0.4, 0.15, 0.15]} />
                <meshStandardMaterial
                  color="#60a5fa"
                  metalness={1}
                  roughness={0.2}
                  emissive="#3b82f6"
                  emissiveIntensity={0.5}
                />
              </mesh>
            );
          })}
        </group>
      </Float>

      {/* Orbiting Energy Rings */}
      {[...Array(3)].map((_, i) => (
        <Float key={`ring-${i}`} speed={2 + i * 0.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh rotation={[Math.PI / 2 + i * 0.3, 0, 0]} position={[0, 0, 0]}>
            <torusGeometry args={[2.5 + i * 0.7, 0.03, 16, 100]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#60a5fa"
              emissiveIntensity={1.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}

      {/* Particle Field */}
      <group ref={particlesRef}>
        {[...Array(30)].map((_, i) => {
          const angle = (i / 30) * Math.PI * 2;
          const radius = 4 + Math.random() * 2;
          const height = (Math.random() - 0.5) * 4;
          return (
            <Float key={`particle-${i}`} speed={1 + Math.random() * 2} rotationIntensity={0.5} floatIntensity={1}>
              <mesh position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshStandardMaterial
                  color="#60a5fa"
                  emissive="#60a5fa"
                  emissiveIntensity={2}
                />
              </mesh>
            </Float>
          );
        })}
      </group>

      {/* Energy Beams */}
      {[...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <Float key={`beam-${i}`} speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh position={[Math.cos(angle) * 3, 0, Math.sin(angle) * 3]} rotation={[0, angle, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
              <meshStandardMaterial
                color="#3b82f6"
                emissive="#60a5fa"
                emissiveIntensity={1.5}
                transparent
                opacity={0.4}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export const Scene3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0a0a']} />
        
        {/* Dramatic Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 5]} intensity={2} color="#3b82f6" />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#60a5fa" />
        <pointLight position={[-5, 5, 5]} intensity={1.5} color="#3b82f6" />
        <pointLight position={[0, -5, 0]} intensity={1} color="#1e40af" />
        <spotLight
          position={[0, 10, 5]}
          angle={0.5}
          penumbra={1}
          intensity={2}
          color="#60a5fa"
        />

        <ShieldObject />
        
        {/* Interactive Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
};
