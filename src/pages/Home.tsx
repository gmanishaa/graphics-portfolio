import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { demos } from '../data/demos'
import './Home.css'

function Home() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.intro', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
      gsap.from('.demo-card', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        delay: 0.15,
        stagger: 0.08,
        ease: 'power2.out',
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const bounceCardIn = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { y: -8, duration: 0.5, ease: 'back.out(3)' })
  }

  const bounceCardOut = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { y: 0, duration: 0.4, ease: 'power2.out' })
  }

  return (
    <div className="home" ref={rootRef}>
      <section className="intro">
        <h1>Graphics Demos</h1>
        <p>
          A handful of real-time rendering demos, originally written in C/C++ with 
          OpenGL and rebuilt here in WebGL so they run straight in the browser. A 
          focused sample of the graphics/systems work — click on one below!
        </p>
      </section>

      <div className="demo-grid">
        {demos.map((demo) => (
          <Link
            key={demo.slug}
            to={`/${demo.slug}`}
            className="demo-card"
            onMouseEnter={bounceCardIn}
            onMouseLeave={bounceCardOut}
          >
            <div className="demo-card-preview" aria-hidden="true" />
            <h2>{demo.title}</h2>
            <p>{demo.tagline}</p>
            <ul className="demo-tags">
              {demo.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </Link>
        ))}

        <div
          className="demo-card demo-card-placeholder"
          onMouseEnter={bounceCardIn}
          onMouseLeave={bounceCardOut}
        >
          <h2>More coming soon</h2>
          <p>Additional OpenGL projects will land here.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
