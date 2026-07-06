import { useState } from 'react'
import { LevaPanel, useControls, useCreateStore } from 'leva'
import DemoLayout from '../components/DemoLayout'
import VolumetricCloudsCanvas from '../demos/volumetric-clouds/VolumetricCloudsCanvas'
import { demos, invariant } from '../data/demos'

const demo =
  demos.find((d) => d.slug === 'volumetric-clouds') ??
  invariant('Missing demo metadata for volumetric-clouds')

const CONTROL_NOTES: Array<{ name: string; description: string }> = [
  {
    name: 'octaves',
    description:
      'Number of noise layers combined together — more octaves add fine detail to the clouds at the cost of performance.',
  },
  {
    name: 'noise',
    description: 'Which procedural noise function generates the cloud shapes.',
  },
  {
    name: 'day ↔ sunset',
    description:
      'Blends the lighting between a midday blue sky and a golden-hour sunset.',
  },
  {
    name: 'speed',
    description: 'How quickly the cloud noise animates over time.',
  },
  {
    name: 'click canvas',
    description: 'Pauses or resumes the animation on its current frame.',
  },
]

function VolumetricClouds() {
  const store = useCreateStore()
  const { octaves, noise } = useControls(
    'Clouds',
    {
      octaves: { value: 3, min: 1, max: 5, step: 1 },
      noise: { value: 'Perlin', options: ['Simplex', 'Perlin'] },
    },
    { store },
  )
  const { sunset, speed } = useControls(
    'Background and Animation',
    {
      sunset: { value: 0.5, min: 0, max: 1, step: 0.01, label: 'day ↔ sunset' },
      speed: { value: 0.35, min: 0, max: 1, step: 0.05 },
    },
    { store },
  )
  const [paused, setPaused] = useState(false)

  return (
    <DemoLayout
      title={demo.title}
      tags={demo.tags}
      controls={
        <>
          <div className="demo-controls-body">
            <div className="demo-controls-panel">
              <LevaPanel store={store} fill titleBar={{ title: 'Controls' }} />
            </div>
            <div>
              <h2>How do the controls work?</h2>
            <ul className="demo-controls-list">
              {CONTROL_NOTES.map(({ name, description }) => (
                <li key={name}>
                  <strong>{name}</strong>
                  {description}
                </li>
              ))}
            </ul>
            </div>
            
          </div>
        </>
      }
    >
      <VolumetricCloudsCanvas
        controls={{
          octaves,
          usePerlinNoise: noise === 'Perlin',
          sunsetBlend: sunset,
          speed,
          paused,
        }}
        onTogglePause={() => setPaused((p) => !p)}
      />
    </DemoLayout>
  )
}

export default VolumetricClouds
