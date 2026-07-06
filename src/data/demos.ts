export interface Demo {
  slug: string
  title: string
  tagline: string
  tags: string[]
  /** GitHub repo of the original (pre-web) implementation, if public */
  repo?: string
}

export function invariant(message: string): never {
  throw new Error(message)
}

export const demos: Demo[] = [
  {
    slug: 'volumetric-clouds',
    title: 'Volumetric Clouds',
    tagline:
      'Real-time ray-marched clouds with procedural noise and single-scattering illumination.',
    tags: ['OpenGL', 'Ray Marching', 'GLSL'],
    repo: 'https://github.com/gmanishaa/volumetric-rendering',
  },
  {
    slug: 'twisted-cylinder',
    title: 'Twisted Cylinder',
    tagline:
      'A vertex-shader deforms a cylinder through sine, spiral, and growing-spiral twists.',
    tags: ['OpenGL', 'Vertex Shader', 'GLSL'],
  },
]
