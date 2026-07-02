import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './DemoLayout.css'

interface DemoLayoutProps {
  title: string
  tags?: string[]
  controls?: ReactNode
  writeup?: ReactNode
  children: ReactNode
}

function DemoLayout({
  title,
  tags = [],
  controls,
  writeup,
  children,
}: DemoLayoutProps) {
  return (
    <div className="demo-layout">
      <div className="demo-layout-header">
        <Link to="/" className="back-link">
          ← All demos
        </Link>
        <div className="demo-layout-heading">
          <h1>{title}</h1>
        </div>
        <ul className="demo-tags">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
      <div className="demo-canvas-frame">{children}</div>
      {controls && <section className="demo-controls">{controls}</section>}
      {writeup && <section className="demo-writeup">{writeup}</section>}
    </div>
  )
}

export default DemoLayout
