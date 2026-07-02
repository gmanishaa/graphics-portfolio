export const vertexShader = /* glsl */ `
in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float twistAmount;
uniform float dist;
uniform int twistMode; // 0 = none, 1 = sine, 2 = spiral, 3 = growing spiral

void sine(out vec3 newCenter, out vec3 tangentVector) {
  float stretch = 3.0;

  float y = position.y;

  float offset = sin(y * stretch + dist) * twistAmount;

  newCenter = vec3(offset, y, 0.0);

  float derivative = stretch * cos(stretch * y + dist) * twistAmount;

  tangentVector = normalize(vec3(derivative, 1.0, 0.0));
}

void spiral(out vec3 newCenter, out vec3 tangentVector) {
  float rad = 0.2;
  float spiralWidth = 13.0;

  float y = position.y;

  float derivativeX = -1.0 * rad * spiralWidth * sin(spiralWidth * y + dist) * twistAmount;
  float derivativeZ = rad * spiralWidth * cos(spiralWidth * y + dist) * twistAmount;

  newCenter = vec3(rad * cos(spiralWidth * y + dist) * twistAmount, y, rad * sin(spiralWidth * y + dist) * twistAmount);

  tangentVector = normalize(vec3(derivativeX, 1.0, derivativeZ));
}

void growingSpiral(out vec3 newCenter, out vec3 tangentVector) {
  float rad = 0.2;
  float spiralWidth = 13.0;

  float y = position.y;

  float derivativeX = -1.0 * rad * spiralWidth * sin(spiralWidth * y + dist) * twistAmount * y;
  float derivativeZ = rad * spiralWidth * cos(spiralWidth * y + dist) * twistAmount * y;

  newCenter = vec3(rad * cos(spiralWidth * y + dist) * twistAmount * y, y, rad * sin(spiralWidth * y + dist) * twistAmount * y);

  tangentVector = normalize(vec3(derivativeX, 1.0, derivativeZ));
}

void main() {
  // no twist, just a regular cylinder
  if (twistMode == 0) {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    return;
  }

  vec3 newCenter, tangentVector;

  float x = position.x;
  float z = position.z;

  if (twistMode == 1) {
    sine(newCenter, tangentVector);
  } else if (twistMode == 2) {
    spiral(newCenter, tangentVector);
  } else if (twistMode == 3) {
    growingSpiral(newCenter, tangentVector);
  }

  // find plane perpendicular to the tangent vector, and place the vertex on it
  vec3 normal1 = normalize(cross(tangentVector, vec3(0.0, 0.0, 1.0)));
  vec3 normal2 = normalize(cross(tangentVector, normal1));

  vec3 newPos = newCenter + x * normal1 + z * normal2;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
`

export const fragmentShader = /* glsl */ `
precision highp float;

uniform vec4 color;

out vec4 fColor;

void main() {
  fColor = color;
}
`
