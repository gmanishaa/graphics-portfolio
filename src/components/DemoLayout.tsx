import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import './DemoLayout.css'

interface DemoLayoutProps {
  title: string
  tags?: string[]
  repoUrl?: string
  controls?: ReactNode
  writeup?: ReactNode
  children: ReactNode
}

function DemoLayout({
  title,
  tags = [],
  repoUrl,
  controls,
  writeup,
  children,
}: DemoLayoutProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.demo-layout-header', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
      gsap.from('.demo-canvas-frame', {
        opacity: 0,
        duration: 0.6,
        delay: 0.1,
        ease: 'power2.out',
      })

      gsap.from('.demo-controls, .demo-writeup', {
        opacity: 0,
        y: 32,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="demo-layout" ref={rootRef}>
      <div className="demo-layout-header">
        <Link to="/" className="back-link">
          ← All demos
        </Link>
        <div className="demo-layout-heading">
          <h1>{title}</h1>
          {repoUrl && (
            <a
              href={repoUrl}
              className="demo-repo-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              original repo
            </a>
          )}
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
