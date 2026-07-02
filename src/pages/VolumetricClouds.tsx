import DemoLayout from '../components/DemoLayout'
import VolumetricCloudsCanvas from '../demos/volumetric-clouds/VolumetricCloudsCanvas'
import { demos, invariant } from '../data/demos'

const demo =
  demos.find((d) => d.slug === 'volumetric-clouds') ??
  invariant('Missing demo metadata for volumetric-clouds')

function VolumetricClouds() {
  return (
    <DemoLayout
      title={demo.title}
      tags={demo.tags}
      writeup={
        <>
          <h2>Write-up</h2>
          <p>
            Paper content goes here — downsize the COMP 4490 write-up into
            sections covering ray marching, FBM noise, and the
            single-scattering illumination model.
          </p>
        </>
      }
    >
      <VolumetricCloudsCanvas />
    </DemoLayout>
  )
}

export default VolumetricClouds
