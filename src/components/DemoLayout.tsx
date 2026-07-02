import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './DemoLayout.css'

gsap.registerPlugin(ScrollTrigger)

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

      gsap.utils
        .toArray<HTMLElement>('.demo-controls, .demo-writeup')
        .forEach((section) => {
          gsap.from(section, {
            opacity: 0,
            y: 32,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            },
          })
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
