import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
}

// Generate texture from the leaf emoji 🎋 or 🍃 or 🍂
function createEmojiTexture(emoji: string, size = 128) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.font = `${size * 0.8}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.clearRect(0, 0, size, size)
  ctx.fillText(emoji, size / 2, size / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

function Leaf({ index, total }: { index: number; total: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  const texture = useMemo(() => createEmojiTexture('🥬', 128), [])

  // Swirl parameters (wider, not taller)
  const baseRadius = 2.0       // slightly larger base radius for more spread
  const radiusVariation = 1.2  // bigger radius variation to avoid clumping

  // Randomized parameters per leaf for uniqueness
  const speed = useMemo(() => 2 + Math.random() * 1.5, [])
  const verticalAmplitude = useMemo(() => 0.5 + Math.random() * 0.7, [])
  const swirlFrequency = useMemo(() => 0.7 + Math.random() * 0.8, [])
  const flutterSpeedX = useMemo(() => 3 + Math.random() * 3, [])
  const flutterSpeedY = useMemo(() => 2 + Math.random() * 3, [])
  const flutterSpeedZ = useMemo(() => 4 + Math.random() * 4, [])
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  // **New:** add a random angle offset per leaf so they start at different points
  const angleOffset = useMemo(() => Math.random() * Math.PI * 2, [])
  // **New:** add a random radius offset to spread leaves radially
  const radiusOffset = useMemo(() => Math.random() * 0.8, [])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()

    // Use randomized angle offset to spread start points, plus index-based spacing
    const angle = (index / total) * Math.PI * 2 + t * speed + angleOffset

    // Add radiusOffset to baseRadius for per-leaf radial spread
    const radius = baseRadius + radiusOffset + radiusVariation * Math.sin(t * swirlFrequency + phase + index)

    const x = Math.cos(angle) * radius * 1.35
    const y = Math.sin(angle) * radius * 0.5 + Math.sin(t * 3 + phase) * verticalAmplitude
    const z = Math.sin(t * 2.5 + phase) * 0.25

    // Slight jitter on x/y to avoid perfect circular paths overlapping
    const jitterX = 0.15 * Math.sin(t * 5 + phase * 7 + index)
    const jitterY = 0.15 * Math.cos(t * 4 + phase * 9 + index)

    mesh.current.position.set(x + jitterX, y + jitterY, z)

    // Flutter rotation with random speed and amplitude
    mesh.current.rotation.x = 0.5 * Math.sin(t * flutterSpeedX + phase)
    mesh.current.rotation.y = 0.4 * Math.cos(t * flutterSpeedY + phase * 1.3)
    mesh.current.rotation.z = angle + Math.sin(t * flutterSpeedZ + phase) * 0.7
  })

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
  )
}



function LeafCluster() {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    // Slight group swirl
    group.current.rotation.z = t * 0.7
    group.current.rotation.x = Math.sin(t / 3) * 0.08
    group.current.rotation.y = Math.cos(t / 3) * 0.08
  })

  const totalLeaves = 10
  return (
    <group ref={group} position={[0, 0, 0]}>
      {[...Array(totalLeaves)].map((_, i) => (
        <Leaf key={i} index={i} total={totalLeaves} />
      ))}
    </group>
  )
}

const ImpactSection = () => {
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

      <div className="w-full max-w-6xl mx-auto h-[28rem] mb-14 flex items-center justify-center">
        <Canvas shadows camera={{ position: [0, 0, 11], fov: 50 }} style={{ width: '100%', height: '100%' }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 5, 5]} intensity={1.1} castShadow />
          <LeafCluster />
        </Canvas>
      </div>

      <Link
        to="/get-involved"
        className="inline-block bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl hover:bg-green-700 transition-transform transform hover:scale-105 focus-visible:outline-green-500 focus:outline-2 focus:outline-offset-2"
      >
        Join the Team →
      </Link>
    </motion.section>
  )
}

export default ImpactSection
