import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import VolumetricClouds from './pages/VolumetricClouds.jsx'
import VolumetricCloudsWriteup from './pages/VolumetricCloudsWriteup.jsx'
import NotFound from './pages/NotFound.jsx'
import './App.css'

function App() {
  return (
    <div className="shell">
      <Nav />
      <main className="shell-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/volumetric-clouds" element={<VolumetricClouds />} />
          <Route
            path="/volumetric-clouds/writeup"
            element={<VolumetricCloudsWriteup />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
