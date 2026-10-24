import * as THREE from 'three';

export function createHeartShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Starting at the bottom cleft tip
  shape.moveTo(0, -0.6);
  // Left bottom curve upward
  shape.bezierCurveTo(-0.6, -0.2, -1.1, 0.4, -0.7, 0.9);
  // Left top cusp
  shape.bezierCurveTo(-0.4, 1.2, 0, 0.9, 0, 0.45);
  // Right top cusp
  shape.bezierCurveTo(0, 0.9, 0.4, 1.2, 0.7, 0.9);
  // Right bottom curve back down to cleft
  shape.bezierCurveTo(1.1, 0.4, 0.6, -0.2, 0, -0.6);

  return shape;
}

export function createHeartGeometry(depth = 0.35, scale = 1): THREE.BufferGeometry {
  const shape = createHeartShape();
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 2,
    depth: depth,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 8,
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();
  geom.scale(scale, scale, scale);
  geom.computeVertexNormals();
  return geom;
}
