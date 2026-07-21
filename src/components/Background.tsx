import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { motion } from "motion/react";

function Particles() {
  const count = 300;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="#FF5722" transparent opacity={0.3} />
    </instancedMesh>
  );
}

export function Background() {
  return (
    <>
      <div className="fixed inset-0 z-0 bg-grid-pattern pointer-events-none" />
      
      <motion.div 
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          rotate: [0, 120, 240, 360]
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity
        }}
        className="fixed top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 87, 34, 0.15) 0%, transparent 40%)'
        }}
      />
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
          <Particles />
        </Canvas>
      </div>
    </>
  );
}
