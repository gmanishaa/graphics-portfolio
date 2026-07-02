import { Canvas } from '@react-three/fiber'
import CloudsMesh, { type CloudsControls } from './CloudsMesh'
import './VolumetricCloudsCanvas.css'

interface VolumetricCloudsCanvasProps {
  controls: CloudsControls
  onTogglePause: () => void
}

function VolumetricCloudsCanvas({
  controls,
  onTogglePause,
}: VolumetricCloudsCanvasProps) {
  return (
    <div className="clouds-canvas" onClick={onTogglePause}>
      <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
        <CloudsMesh controls={controls} />
      </Canvas>
    </div>
  )
}

export default VolumetricCloudsCanvas
