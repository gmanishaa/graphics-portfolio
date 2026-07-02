import { Link } from 'react-router-dom'
import './Nav.css'

function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <span>gmanishaa/</span>graphics-projects
        </Link>
      </div>
    </header>
  )
}

export default Nav
