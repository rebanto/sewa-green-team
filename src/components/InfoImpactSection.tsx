import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { FaLeaf, FaHandsHelping, FaGlobeAmericas } from 'react-icons/fa';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

// --- Leaves Animation ---
function createEmojiTexture(emoji: string, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.font = `${size * 0.8}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.clearRect(0, 0, size, size);
  ctx.fillText(emoji, size / 2, size / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function Leaf({ index, total }: { index: number; total: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createEmojiTexture('🥬', 128), []);

  const baseRadius = 2;
  const radiusVariation = 2.0;
  const speed = useMemo(() => 2 + Math.random() * 1.5, []);
  const verticalAmplitude = useMemo(() => 0.5 + Math.random() * 0.7, []);
  const swirlFrequency = useMemo(() => 0.7 + Math.random() * 0.8, []);
  const flutterSpeedX = useMemo(() => 3 + Math.random() * 3, []);
  const flutterSpeedY = useMemo(() => 2 + Math.random() * 3, []);
  const flutterSpeedZ = useMemo(() => 4 + Math.random() * 4, []);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const angleOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const radiusOffset = useMemo(() => Math.random() * 0.8, []);

  // Reduce animation complexity: throttle updates
  const lastUpdate = useRef(0);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    // Only update every ~2 frames
    if (t - lastUpdate.current < 0.033) return;
    lastUpdate.current = t;

    const angle = (index / total) * Math.PI * 2 + t * speed + angleOffset;
    const radius = baseRadius + radiusOffset + radiusVariation * Math.sin(t * swirlFrequency + phase + index);
    const x = Math.cos(angle) * radius * 1.35;
    const y = Math.sin(angle) * radius * 0.5 + Math.sin(t * 3 + phase) * verticalAmplitude;
    const z = Math.sin(t * 2.5 + phase) * 0.25;
    const jitterX = 0.15 * Math.sin(t * 5 + phase * 7 + index);
    const jitterY = 0.15 * Math.cos(t * 4 + phase * 9 + index);
    mesh.current.position.set(x + jitterX, y + jitterY, z);
    mesh.current.rotation.x = 0.5 * Math.sin(t * flutterSpeedX + phase);
    mesh.current.rotation.y = 0.4 * Math.cos(t * flutterSpeedY + phase * 1.3);
    mesh.current.rotation.z = angle + Math.sin(t * flutterSpeedZ + phase) * 0.7;
  });

  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <planeGeometry args={[1.1, 1.1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        depthTest={false}
      />
    </mesh>
  );
}

function LeafCluster() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.z = t * 0.7;
    group.current.rotation.x = Math.sin(t / 3) * 0.08;
    group.current.rotation.y = Math.cos(t / 3) * 0.08;
  });
  const totalLeaves = 4; // Lowered for performance
  return (
    <group ref={group} position={[0, 0, 0]}>
      {[...Array(totalLeaves)].map((_, i) => (
        <Leaf key={i} index={i} total={totalLeaves} />
      ))}
    </group>
  );
}

// --- Info Cards ---
const infoCards = [
  {
    name: 'Who We Are',
    desc: 'Learn about our mission, team, and values.',
    to: '/about',
    icon: <FaLeaf className="text-3xl text-green-600 mb-4" />,
  },
  {
    name: 'What We Do',
    desc: 'Explore our cleanups and sustainability programs.',
    to: '/initiatives',
    icon: <FaGlobeAmericas className="text-3xl text-green-600 mb-4" />,
  },
  {
    name: 'Partner With Us',
    desc: 'Want to collaborate? Let’s make it happen.',
    to: '/contact',
    icon: <FaHandsHelping className="text-3xl text-green-600 mb-4" />,
  },
];

const InfoImpactSection = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [showLeaves, setShowLeaves] = useState(true);

  // Performance check: disable leaves if FPS is too low
  useEffect(() => {
    if (!isHome) return;
    let frame = 0;
    let last = performance.now();
    let lowFpsCount = 0;
    let running = true;
    function checkFps(now: number) {
      if (!running) return;
      frame++;
      if (frame >= 20) {
        const elapsed = now - last;
        const fps = 1000 * frame / elapsed;
        if (fps < 30) {
          lowFpsCount++;
        } else {
          lowFpsCount = 0;
        }
        if (lowFpsCount >= 2) {
          setShowLeaves(false);
          running = false;
          return;
        }
        frame = 0;
        last = now;
      }
      requestAnimationFrame(checkFps);
    }
    requestAnimationFrame(checkFps);
    return () => { running = false; };
  }, [isHome]);

  return (
    <motion.section
      className="relative py-24 px-6 text-center bg-gradient-to-br from-green-50 via-green-100 to-white overflow-hidden"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-4xl font-extrabold text-green-700 mb-6 relative inline-block underline">
        The Movement is Growing 🌿
      </h2>
      <p className="text-gray-700 max-w-xl mx-auto mb-12 text-lg font-medium">
        Whether you’re a student, parent, or organization — there’s a place for you in our mission to restore and protect the planet.
      </p>
      <div className="w-full max-w-6xl mx-auto h-[28rem] mb-14 flex items-center justify-center relative">
        {/* Leaves Animation: Only on Home page and if performance is good */}
        {isHome && showLeaves && (
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <Canvas shadows camera={{ position: [0, 0, 11], fov: 50 }} style={{ width: '100%', height: '100%' }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[2, 5, 5]} intensity={1.1} castShadow />
              <LeafCluster />
            </Canvas>
          </div>
        )}

        {/* Info Cards */}
        <motion.div
          className="relative z-10 max-w-4xl w-full mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {infoCards.map((card) => (
            <motion.div
              key={card.to}
              variants={fadeUp}
              whileHover={{
                scale: 1.1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                boxShadow:
                  '0 0 24px 4px rgba(34,197,94,0.13), 0 0 0 2px rgba(34,197,94,0.18), 0 0 60px rgba(0,255,127,0.07), 0 0 120px rgba(0,255,127,0.05)',
              }}
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 20,
              }}
              className="relative rounded-3xl bg-white/10 backdrop-blur-md border border-white/40 shadow-[inset_0_0_8px_rgba(34,197,94,0.10),0_2px_16px_0_rgba(34,197,94,0.10)] overflow-hidden group min-h-[16rem] transition-all duration-500 ease-out hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]"
            >
              <Link to={card.to} className="block p-10">
                <div className="flex flex-col items-center justify-center h-full">
                  {card.icon}
                  <h3 className="text-xl font-extrabold text-green-800 mb-2 group-hover:text-green-900 transition-colors">
                    {card.name}
                  </h3>
                  <p className="text-gray-700 font-medium">{card.desc}</p>
                </div>
                <div className="absolute inset-0 rounded-3xl ring-1 ring-white/30 group-hover:ring-green-300/30 group-hover:animate-pulse pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Link
        to="/get-involved"
        className="inline-block bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl hover:bg-green-700 transition-transform transform hover:scale-105 focus-visible:outline-green-500 focus:outline-2 focus:outline-offset-2"
      >
        Join the Team →
      </Link>
    </motion.section>
  );
};

export default InfoImpactSection;
