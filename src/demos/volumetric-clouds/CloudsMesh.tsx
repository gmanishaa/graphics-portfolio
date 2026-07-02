import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { fragmentShader, vertexShader } from './shaders'

// oversized fullscreen triangle (covers clip space [-1,1] with one triangle, no seam)
const TRIANGLE_POSITIONS = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0])

export interface CloudsControls {
  octaves: number
  usePerlinNoise: boolean
  sunsetBlend: number
  speed: number
  paused: boolean
}

interface CloudsMeshProps {
  controls: CloudsControls
}

function CloudsMesh({ controls }: CloudsMeshProps) {
  const animationIndex = useRef(0)
  const size = useThree((state) => state.size)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(TRIANGLE_POSITIONS, 3))
    return geo
  }, [])

  // Constructed once here so `material.uniforms.x.value` mutations below hit the
  // exact GPU-bound object — a declarative `uniforms={...}` prop would leave
  // updates to react-three-fiber's prop diffing instead.
  const material = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader,
        fragmentShader,
        uniforms: {
          animationIndex: { value: 0 },
          maxOctaves: { value: controls.octaves },
          perlinNoise: { value: controls.usePerlinNoise },
          sunsetBlend: { value: controls.sunsetBlend },
          aspect: { value: size.width / size.height },
        },
      }),
    // constructed once; kept in sync with controls via the effects below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useEffect(() => {
    material.uniforms.maxOctaves.value = controls.octaves
  }, [controls.octaves, material])

  useEffect(() => {
    material.uniforms.perlinNoise.value = controls.usePerlinNoise
  }, [controls.usePerlinNoise, material])

  useEffect(() => {
    material.uniforms.sunsetBlend.value = controls.sunsetBlend
  }, [controls.sunsetBlend, material])

  useEffect(() => {
    material.uniforms.aspect.value = size.width / size.height
  }, [size.width, size.height, material])

  useFrame((_state, delta) => {
    if (!controls.paused) {
      animationIndex.current += delta * controls.speed
    }
    material.uniforms.animationIndex.value = animationIndex.current
  })

  return <mesh geometry={geometry} material={material} frustumCulled={false} />
}

export default CloudsMesh
