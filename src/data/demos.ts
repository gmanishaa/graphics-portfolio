export interface Demo {
  slug: string
  title: string
  tagline: string
  tags: string[]
  hasWriteup: boolean
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
    tags: ['WebGL', 'Ray Marching', 'GLSL'],
    hasWriteup: true,
  },
]
