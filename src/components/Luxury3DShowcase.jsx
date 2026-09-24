import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { FiStar, FiEye } from 'react-icons/fi';

function RoyalJewelMesh() {
  const meshRef = useRef();

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25;
      meshRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.8}>
        <torusKnotGeometry args={[1, 0.32, 128, 32, 2, 3]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.15}
          metalness={0.92}
          emissive="#2a1f05"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

export default function Luxury3DShowcase() {
  const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <section className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden border-y border-white/10">
      <div className="absolute inset-0 bg-radial from-luxury-gold/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Editorial Description */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold text-[10px] tracking-[0.25em] uppercase font-semibold">
            <FiStar size={12} />
            <span>Interactive 3D Craftsmanship</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-white leading-tight">
            Artistry in Every Angle.
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
            From heavy bullion zardozi on antique raw silks to 22-karat uncut polki jewels, our creations embody centuries of Old Delhi artisanal royalty. Rotate the imperial medallion in 3D to appreciate our bespoke finish.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs tracking-widest uppercase text-gray-400">
            <div className="border-l-2 border-luxury-gold pl-3">
              <span className="text-white font-bold block text-sm">450+ Hours</span>
              <span>Hand Embroidery</span>
            </div>
            <div className="border-l-2 border-luxury-gold pl-3">
              <span className="text-white font-bold block text-sm">Pure Silk & Velvet</span>
              <span>Imperial Textiles</span>
            </div>
            <div className="border-l-2 border-luxury-gold pl-3">
              <span className="text-white font-bold block text-sm">Bespoke Fit</span>
              <span>Complimentary Fitting</span>
            </div>
          </div>

          <div className="pt-4">
            <a
              href="#catalog"
              className="inline-block px-8 py-3.5 bg-luxury-gold text-black hover:bg-white hover:text-black transition-all text-xs tracking-[0.2em] uppercase font-bold shadow-lg"
            >
              Explore Bridal Repertory
            </a>
          </div>
        </div>

        {/* Right Column: 3D Interactive Canvas */}
        <div className="lg:col-span-7 relative h-[420px] sm:h-[500px] w-full bg-radial from-zinc-900 to-black rounded-lg border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            onPointerDown={() => setHasInteracted(true)}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[10, 10, 5]} intensity={2.5} color="#fff8e7" />
            <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#c8a951" />
            <pointLight position={[0, 3, 2]} intensity={2} color="#ffe599" />
            
            <Suspense fallback={null}>
              <RoyalJewelMesh />
            </Suspense>

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={!hasInteracted}
              autoRotateSpeed={1.8}
            />
          </Canvas>

          {/* Interactive Hint */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
            <span className="px-3 py-1 bg-black/70 backdrop-blur-sm border border-white/20 rounded-full text-[10px] uppercase tracking-widest text-gray-300 flex items-center gap-1.5 shadow-sm">
              <FiEye size={12} className="text-luxury-gold" />
              <span>Drag to rotate 360° • Royal Emblem</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
