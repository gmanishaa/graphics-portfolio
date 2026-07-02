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

// Ported from opengl-2022/src/assignment2.cpp's mouse()/update() spin handling.
// The original: clicking a mouse button picked an axis (left = Y, middle = X,
// right = Z) and span it at a constant rate forever, until the 's' key paused
// it or 'r' reset it. That only really makes sense with a 3-button mouse and
// a keyboard within reach, so on the web it's replaced with drei's
// OrbitControls — drag to orbit, matching the "grab and turn the object"
// intent, since with the flat/unlit shading here an orbiting camera looks
// identical to a spinning object anyway.
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
