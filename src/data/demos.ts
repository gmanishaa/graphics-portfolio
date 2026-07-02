export interface Demo {
  slug: string
  title: string
  tagline: string
  tags: string[]
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
  },
  {
    slug: 'twisted-cylinder',
    title: 'Twisted Cylinder',
    tagline:
      'A vertex-shader deforms a cylinder through sine, spiral, and growing-spiral twists.',
    tags: ['OpenGL', 'Vertex Shader', 'GLSL'],
  },
]
