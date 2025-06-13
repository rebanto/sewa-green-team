import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense } from 'react'
import AnimatedWavyPlane from './AnimatedWavyPlane'

const HeroCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 3, 6], fov: 65 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={3000} factor={4} fade />
      <Suspense fallback={null}>
        <AnimatedWavyPlane />
      </Suspense>
      <OrbitControls enableZoom={false} enableRotate={false} />
    </Canvas>
  )
}

export default HeroCanvas
