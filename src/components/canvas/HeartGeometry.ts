import * as THREE from 'three';

export function createHeartShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Bottom graceful cleft
  shape.moveTo(0, -0.65);
  // Left lower arc
  shape.bezierCurveTo(-0.35, -0.35, -0.85, 0.05, -0.85, 0.52);
  // Left upper lobe
  shape.bezierCurveTo(-0.85, 0.92, -0.42, 1.08, 0, 0.65);
  // Right upper lobe
  shape.bezierCurveTo(0.42, 1.08, 0.85, 0.92, 0.85, 0.52);
  // Right lower arc back to cleft
  shape.bezierCurveTo(0.85, 0.05, 0.35, -0.35, 0, -0.65);

  return shape;
}

export function createHeartGeometry(depth = 0.3, scale = 1): THREE.BufferGeometry {
  const shape = createHeartShape();
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    curveSegments: 64, // Silky smooth perimeter
    steps: 4,
    depth: depth,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.12,
    bevelOffset: 0,
    bevelSegments: 20, // Rounded pillowy bevel
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();
  geom.scale(scale, scale, scale);
  geom.computeVertexNormals();
  return geom;
}
