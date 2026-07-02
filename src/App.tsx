import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import VolumetricClouds from './pages/VolumetricClouds'
import TwistedCylinder from './pages/TwistedCylinder'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <div className="shell">
      <Nav />
      <main className="shell-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/volumetric-clouds" element={<VolumetricClouds />} />
          <Route path="/twisted-cylinder" element={<TwistedCylinder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
