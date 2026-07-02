import { Link } from 'react-router-dom'
import './DemoLayout.css'

function DemoLayout({ title, tags = [], slug, hasWriteup, children }) {
  return (
    <div className="demo-layout">
      <div className="demo-layout-header">
        <Link to="/" className="back-link">
          ← All demos
        </Link>
        <div className="demo-layout-heading">
          <h1>{title}</h1>
          {hasWriteup && (
            <Link to={`/${slug}/writeup`} className="writeup-link">
              Read the write-up →
            </Link>
          )}
        </div>
        <ul className="demo-tags">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
      <div className="demo-canvas-frame">{children}</div>
    </div>
  )
}

export default DemoLayout
