import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import CylinderMesh, { type TwistControls } from './CylinderMesh'
import './TwistedCylinderCanvas.css'

interface TwistedCylinderCanvasProps {
  controls: TwistControls
  onSequenceComplete: () => void
}

// OrbitControls (drag to orbit) instead of manual rotation — since the
// shading here is flat/unlit, an orbiting camera looks identical to a
// spinning object, so it's the simplest way to view the twist from any angle.
function TwistedCylinderCanvas({
  controls,
  onSequenceComplete,
}: TwistedCylinderCanvasProps) {
  const orbitRef = useRef<OrbitControlsImpl>(null)

  useEffect(() => {
    if (controls.resetToken === 0) return
    orbitRef.current?.reset()
  }, [controls.resetToken])

  return (
    <div className="cylinder-canvas">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45, near: 0.5, far: 10 }}>
        <color attach="background" args={['white']} />
        <CylinderMesh controls={controls} onSequenceComplete={onSequenceComplete} />
        <OrbitControls ref={orbitRef} enablePan={false} enableDamping />
      </Canvas>
    </div>
  )
}

export default TwistedCylinderCanvas
