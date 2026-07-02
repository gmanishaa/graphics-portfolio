import DemoLayout from '../components/DemoLayout.jsx'
import { demos } from '../data/demos.js'

const demo = demos.find((d) => d.slug === 'volumetric-clouds')

function VolumetricClouds() {
  return (
    <DemoLayout
      title={demo.title}
      tags={demo.tags}
      slug={demo.slug}
      hasWriteup={demo.hasWriteup}
    >
      <div className="demo-placeholder">
        Shader canvas goes here — wiring up the react-three-fiber version
        next.
      </div>
    </DemoLayout>
  )
}

export default VolumetricClouds
