import { useState } from 'react'
import { LevaPanel, button, useControls, useCreateStore } from 'leva'
import DemoLayout from '../components/DemoLayout'
import TwistedCylinderCanvas from '../demos/twisted-cylinder/TwistedCylinderCanvas'
import { demos, invariant } from '../data/demos'

const demo =
  demos.find((d) => d.slug === 'twisted-cylinder') ??
  invariant('Missing demo metadata for twisted-cylinder')

const CONTROL_NOTES: Array<{ name: string; description: string }> = [
  {
    name: 'drag canvas',
    description:
      'Orbits the camera around the cylinder. The original picked a rotation axis per mouse button and spun it indefinitely — a single drag is the more natural web equivalent.',
  },
  {
    name: 'play sequence',
    description:
      'Cycles the cylinder through all three twists — sine, spiral, and growing spiral — pausing briefly between each.',
  },
  {
    name: 'reset',
    description: 'Snaps the twist back to a plain cylinder and resets the camera.',
  },
]

function TwistedCylinder() {
  const store = useCreateStore()
  const [resetToken, setResetToken] = useState(0)
  const [playing, setPlaying] = useState(false)
  useControls(
    'Twist',
    () => ({
      'play sequence': button(() => setPlaying(true)),
      reset: button(() => setResetToken((t) => t + 1)),
    }),
    { store },
  )

  return (
    <DemoLayout
      title={demo.title}
      tags={demo.tags}
      controls={
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
      }
    >
      <TwistedCylinderCanvas
        controls={{ playing, resetToken }}
        onSequenceComplete={() => setPlaying(false)}
      />
    </DemoLayout>
  )
}

export default TwistedCylinder
