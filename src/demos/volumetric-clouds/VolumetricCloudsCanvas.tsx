import { Canvas } from '@react-three/fiber'
import { useControls } from 'leva'
import CloudsMesh from './CloudsMesh'
import './VolumetricCloudsCanvas.css'

function VolumetricCloudsCanvas() {
  const { octaves, noise, sunset, speed, paused } = useControls('Clouds', {
    octaves: { value: 3, min: 1, max: 5, step: 1 },
    noise: { value: 'Simplex', options: ['Simplex', 'Perlin'] },
    sunset: { value: 0, min: 0, max: 1, step: 0.01, label: 'day ↔ sunset' },
    speed: { value: 0.6, min: 0, max: 2, step: 0.05 },
    paused: { value: false },
  })

  return (
    <div className="clouds-canvas">
      <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
        <CloudsMesh
          controls={{
            octaves,
            usePerlinNoise: noise === 'Perlin',
            sunsetBlend: sunset,
            speed,
            paused,
          }}
        />
      </Canvas>
    </div>
  )
}

export default VolumetricCloudsCanvas
