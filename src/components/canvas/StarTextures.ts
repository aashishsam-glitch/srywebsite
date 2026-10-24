import * as THREE from 'three';

// Procedural high-fidelity celestial star textures (100% canvas-generated, zero network assets)

let starSpriteTexture: THREE.CanvasTexture | null = null;
let coronaTexture: THREE.CanvasTexture | null = null;
let diffractionSpikeTexture: THREE.CanvasTexture | null = null;

export function getStarSpriteTexture(): THREE.CanvasTexture {
  if (starSpriteTexture) return starSpriteTexture;
  if (typeof document === 'undefined') return new THREE.CanvasTexture({} as HTMLCanvasElement);

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.15, 'rgba(255, 245, 235, 0.9)');
  gradient.addColorStop(0.35, 'rgba(243, 165, 199, 0.45)');
  gradient.addColorStop(0.65, 'rgba(183, 165, 247, 0.12)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  starSpriteTexture = new THREE.CanvasTexture(canvas);
  starSpriteTexture.needsUpdate = true;
  return starSpriteTexture;
}

export function getCoronaTexture(): THREE.CanvasTexture {
  if (coronaTexture) return coronaTexture;
  if (typeof document === 'undefined') return new THREE.CanvasTexture({} as HTMLCanvasElement);

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Smooth atmospheric corona glow
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 215, 230, 0.8)');
  gradient.addColorStop(0.45, 'rgba(243, 165, 199, 0.35)');
  gradient.addColorStop(0.75, 'rgba(183, 165, 247, 0.08)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  coronaTexture = new THREE.CanvasTexture(canvas);
  coronaTexture.needsUpdate = true;
  return coronaTexture;
}

export function getDiffractionSpikeTexture(): THREE.CanvasTexture {
  if (diffractionSpikeTexture) return diffractionSpikeTexture;
  if (typeof document === 'undefined') return new THREE.CanvasTexture({} as HTMLCanvasElement);

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const cx = 128;
  const cy = 128;

  ctx.clearRect(0, 0, 256, 256);

  // Draw 4-point cross diffraction spikes with soft feathered edges
  const drawSpike = (angle: number, length: number, thickness: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const grad = ctx.createLinearGradient(-thickness / 2, 0, thickness / 2, 0);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;

    // Linear falloff along the spike length
    const lenGrad = ctx.createLinearGradient(0, -length, 0, length);
    lenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    lenGrad.addColorStop(0.35, 'rgba(255, 240, 248, 0.6)');
    lenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
    lenGrad.addColorStop(0.65, 'rgba(255, 240, 248, 0.6)');
    lenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = lenGrad;
    ctx.fillRect(-thickness / 2, -length, thickness, length * 2);

    ctx.restore();
  };

  // Primary horizontal & vertical spikes
  drawSpike(0, 115, 3.5);
  drawSpike(Math.PI / 2, 115, 3.5);

  // Subtle diagonal micro-flares
  drawSpike(Math.PI / 4, 45, 1.8);
  drawSpike(-Math.PI / 4, 45, 1.8);

  // Center warm core flare
  const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
  centerGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  centerGrad.addColorStop(0.3, 'rgba(255, 235, 245, 0.8)');
  centerGrad.addColorStop(1, 'rgba(243, 165, 199, 0)');
  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fill();

  diffractionSpikeTexture = new THREE.CanvasTexture(canvas);
  diffractionSpikeTexture.needsUpdate = true;
  return diffractionSpikeTexture;
}
