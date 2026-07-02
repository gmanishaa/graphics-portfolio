import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { demos } from '../data/demos.js'
import './Home.css'

function Home() {
  const gridRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.demo-card', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
      })
    }, gridRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="home">
      <section className="intro">
        <h1>Graphics Sandbox</h1>
        <p>
          A collection of real-time rendering experiments — ray marching,
          procedural noise, and shader-driven simulation. Pick a demo below
          and play with the controls.
        </p>
      </section>

      <div className="demo-grid" ref={gridRef}>
        {demos.map((demo) => (
          <Link key={demo.slug} to={`/${demo.slug}`} className="demo-card">
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

        <div className="demo-card demo-card-placeholder">
          <h2>More coming soon</h2>
          <p>Additional OpenGL projects will land here.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
