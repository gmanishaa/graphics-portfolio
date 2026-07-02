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
      slug={demo.slug}
      hasWriteup={demo.hasWriteup}
    >
      <VolumetricCloudsCanvas />
    </DemoLayout>
  )
}

export default VolumetricClouds
