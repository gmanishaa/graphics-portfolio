import { Link } from 'react-router-dom'
import './Writeup.css'

function VolumetricCloudsWriteup() {
  return (
    <article className="writeup">
      <Link to="/volumetric-clouds" className="back-link">
        ← Back to demo
      </Link>
      <h1>Volumetric Clouds — Write-up</h1>
      <p className="writeup-placeholder">
        Paper content goes here — downsize the COMP 4490 write-up into
        sections covering ray marching, FBM noise, and the single-scattering
        illumination model.
      </p>
    </article>
  )
}

export default VolumetricCloudsWriteup
