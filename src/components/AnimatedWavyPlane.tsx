import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const AnimatedWavyPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime()
      const positions = meshRef.current.geometry.attributes.position.array
      const count = positions.length / 3

      for (let i = 0; i < count; i++) {
        const x = positions[i * 3]
        const y = positions[i * 3 + 1]
        const wave = Math.sin(x * 2 + time * 2) * 0.2 + Math.cos(y * 2 + time) * 0.2
        positions[i * 3 + 2] = wave
      }

      meshRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10, 64, 64]} />
      <meshStandardMaterial
        color="#22c55e"
        emissive="#22c55e"
        emissiveIntensity={0.3}
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default AnimatedWavyPlane
