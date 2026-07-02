// Ported from opengl-2022/src/assignment2.cpp's createCylinderVertices /
// createIndices / createCylinderCapVertices / createCylinderCapIndices.
// Kept as plain index math (rather than THREE.CylinderGeometry) so the vertex
// layout matches the original exactly — the twist vertex shader deforms each
// vertex from its raw local position (y running 0..HEIGHT, not centered),
// so the geometry has to keep that same coordinate convention.

export const Y_DIVISIONS = 24
export const X_DIVISIONS = 24
export const RADIUS = 0.1
export const HEIGHT = 1.5

export interface CylinderGeometryData {
  positions: Float32Array
  triangleIndices: Uint16Array
  // quad-perimeter-only edges (no diagonals) — matches drawRectangleFromGrid,
  // which draws each grid cell's 4 outer edges but never its diagonal.
  lineIndices: Uint16Array
}

export function buildBodyGeometry(): CylinderGeometryData {
  const positions: number[] = []
  for (let y = 0; y <= Y_DIVISIONS; y++) {
    for (let x = 0; x <= X_DIVISIONS; x++) {
      const theta = ((Math.PI * 2) / X_DIVISIONS) * x
      const yCoord = y * (HEIGHT / Y_DIVISIONS)
      const xCoord = RADIUS * Math.sin(theta)
      const zCoord = RADIUS * Math.cos(theta)
      positions.push(xCoord, yCoord, zCoord)
    }
  }

  const triangleIndices: number[] = []
  const lineIndices: number[] = []
  for (let y = 0; y < Y_DIVISIONS; y++) {
    for (let x = 0; x < X_DIVISIONS; x++) {
      const first = y * (X_DIVISIONS + 1) + x
      const second = first + (X_DIVISIONS + 1)

      triangleIndices.push(first, first + 1, second + 1)
      triangleIndices.push(second + 1, second, first)

      lineIndices.push(first, first + 1)
      lineIndices.push(first + 1, second + 1)
      lineIndices.push(second + 1, second)
      lineIndices.push(second, first)
    }
  }

  return {
    positions: new Float32Array(positions),
    triangleIndices: new Uint16Array(triangleIndices),
    lineIndices: new Uint16Array(lineIndices),
  }
}

export function buildCapGeometry(): CylinderGeometryData {
  // bottom center (index 0), top center (index 1), then bottom/top edge pairs
  const positions: number[] = [0, 0, 0, 0, HEIGHT, 0]
  for (let x = 0; x <= X_DIVISIONS; x++) {
    const theta = ((Math.PI * 2) / X_DIVISIONS) * x
    const xCoord = RADIUS * Math.sin(theta)
    const zCoord = RADIUS * Math.cos(theta)
    positions.push(xCoord, 0, zCoord)
    positions.push(xCoord, HEIGHT, zCoord)
  }

  const triangleIndices: number[] = []
  const lineIndices: number[] = []
  for (let i = 0; i < X_DIVISIONS; i++) {
    const bottomEdge1 = 2 + i * 2
    const bottomEdge2 = 2 + (i + 1) * 2
    triangleIndices.push(0, bottomEdge1, bottomEdge2)
    // GL_LINE_LOOP over 3 verts == a closed triangle outline
    lineIndices.push(0, bottomEdge1, bottomEdge1, bottomEdge2, bottomEdge2, 0)

    const topEdge1 = 3 + i * 2
    const topEdge2 = 3 + (i + 1) * 2
    triangleIndices.push(1, topEdge1, topEdge2)
    lineIndices.push(1, topEdge1, topEdge1, topEdge2, topEdge2, 1)
  }

  return {
    positions: new Float32Array(positions),
    triangleIndices: new Uint16Array(triangleIndices),
    lineIndices: new Uint16Array(lineIndices),
  }
}
