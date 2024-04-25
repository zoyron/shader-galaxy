uniform float uSize;
attribute float aScale;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // size of the particles
  gl_PointSize = uSize * aScale;
  
  // applying the particle attenuation formula
  gl_PointSize *= (1.0 / - viewPosition.z);
}
