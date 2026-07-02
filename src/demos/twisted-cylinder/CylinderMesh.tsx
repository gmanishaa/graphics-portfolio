import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './shaders'
import {
  buildBodyGeometry,
  buildCapGeometry,
  HEIGHT,
  type CylinderGeometryData,
} from './geometry'

// Ported from opengl-2022/src/assignment2.cpp's update()/reset() and the
// twist state machine (START/RUN/STOP), which stretches the cylinder into a
// twist, holds it, then un-stretches before moving on to the next twist mode.
const STRETCH_STEP_PER_FRAME = 0.02 // at the original's assumed 60fps
const RUNNING_FRAMES = 180 // 180 frames @ 60fps == 3s
const DIST_SPEED_PER_FRAME = 0.05
const ASSUMED_FPS = 60
const NUM_MODES = 4 // NONE, SINE, SPIRAL, GROWING_SPIRAL

type TwistState = 'start' | 'run' | 'stop' | 'idle'

const CYAN = new THREE.Color(0.2, 0.8, 0.8)
const BLACK = new THREE.Color(0x000000)

export interface TwistControls {
  playing: boolean
  resetToken: number
}

interface CylinderMeshProps {
  controls: TwistControls
  onSequenceComplete: () => void
}

function toGeometry(data: CylinderGeometryData, indices: Uint16Array) {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
  geo.setIndex(new THREE.BufferAttribute(indices, 1))
  return geo
}

function CylinderMesh({ controls, onSequenceComplete }: CylinderMeshProps) {
  const twistState = useRef<TwistState>('start')
  const twistMode = useRef(0)
  const runningFrames = useRef(0)

  const body = useMemo(() => buildBodyGeometry(), [])
  const cap = useMemo(() => buildCapGeometry(), [])

  const bodyFillGeometry = useMemo(
    () => toGeometry(body, body.triangleIndices),
    [body],
  )
  const bodyLineGeometry = useMemo(
    () => toGeometry(body, body.lineIndices),
    [body],
  )
  const capFillGeometry = useMemo(
    () => toGeometry(cap, cap.triangleIndices),
    [cap],
  )
  const capLineGeometry = useMemo(
    () => toGeometry(cap, cap.lineIndices),
    [cap],
  )

  // Fill and line materials share the same twistAmount/dist/twistMode uniform
  // objects, so nudging one value in useFrame keeps both shapes in sync.
  const fillMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader,
        fragmentShader,
        uniforms: {
          twistAmount: { value: 0 },
          dist: { value: 0 },
          twistMode: { value: 0 },
          color: { value: new THREE.Vector4(CYAN.r, CYAN.g, CYAN.b, 1) },
        },
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        // the original never enabled GL_CULL_FACE, so both winding
        // directions always rendered — without this, the bottom cap (wound
        // the opposite way from the top) and the far side of a twisted
        // body get backface-culled, showing the wireframe through "empty" fill
        side: THREE.DoubleSide,
      }),
    [],
  )

  const lineMaterial = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        vertexShader,
        fragmentShader,
        uniforms: {
          twistAmount: fillMaterial.uniforms.twistAmount,
          dist: fillMaterial.uniforms.dist,
          twistMode: fillMaterial.uniforms.twistMode,
          color: { value: new THREE.Vector4(BLACK.r, BLACK.g, BLACK.b, 1) },
        },
      }),
    [fillMaterial],
  )

  useEffect(() => {
    return () => {
      bodyFillGeometry.dispose()
      bodyLineGeometry.dispose()
      capFillGeometry.dispose()
      capLineGeometry.dispose()
      fillMaterial.dispose()
      lineMaterial.dispose()
    }
  }, [
    bodyFillGeometry,
    bodyLineGeometry,
    capFillGeometry,
    capLineGeometry,
    fillMaterial,
    lineMaterial,
  ])

  // rising edge of `playing` — matches the original's spacebar handler, which
  // always resets the stretch/timer back to the start of the current twist
  // (or picks the first twist if it had fully cycled back to "none").
  useEffect(() => {
    if (!controls.playing) return
    twistState.current = 'start'
    runningFrames.current = 0
    fillMaterial.uniforms.twistAmount.value = 0
    fillMaterial.uniforms.dist.value = 0
    if (twistMode.current === 0) {
      twistMode.current = 1
      fillMaterial.uniforms.twistMode.value = 1
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls.playing])

  // 'r' equivalent — snaps the stretch back to zero without touching which
  // twist mode is active.
  useEffect(() => {
    if (controls.resetToken === 0) return
    twistState.current = 'start'
    runningFrames.current = 0
    fillMaterial.uniforms.twistAmount.value = 0
    fillMaterial.uniforms.dist.value = 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls.resetToken])

  useFrame((_state, delta) => {
    if (!controls.playing || twistState.current === 'idle') return

    const uniforms = fillMaterial.uniforms
    const frames = delta * ASSUMED_FPS

    switch (twistState.current) {
      case 'start': {
        const next = Math.min(
          uniforms.twistAmount.value + STRETCH_STEP_PER_FRAME * frames,
          0.8,
        )
        uniforms.twistAmount.value = next
        if (next >= 0.8) twistState.current = 'run'
        break
      }
      case 'run':
        runningFrames.current += frames
        if (runningFrames.current > RUNNING_FRAMES) {
          runningFrames.current = 0
          twistState.current = 'stop'
        }
        break
      case 'stop': {
        const next = Math.max(
          uniforms.twistAmount.value - STRETCH_STEP_PER_FRAME * frames,
          0,
        )
        uniforms.twistAmount.value = next
        if (next <= 0) {
          uniforms.dist.value = 0
          twistMode.current += 1
          if (twistMode.current >= NUM_MODES) {
            twistMode.current = 0
            twistState.current = 'idle'
            onSequenceComplete()
          } else {
            twistState.current = 'start'
          }
          uniforms.twistMode.value = twistMode.current
        }
        break
      }
    }

    uniforms.dist.value += DIST_SPEED_PER_FRAME * frames
  })

  return (
    <group position={[0, -HEIGHT / 2, 0]}>
      <mesh geometry={bodyFillGeometry} material={fillMaterial} />
      <lineSegments geometry={bodyLineGeometry} material={lineMaterial} />
      <mesh geometry={capFillGeometry} material={fillMaterial} />
      <lineSegments geometry={capLineGeometry} material={lineMaterial} />
    </group>
  )
}

export default CylinderMesh
