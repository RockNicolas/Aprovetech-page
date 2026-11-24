'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Lightformer, RoundedBox } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Escudo da marca (mesmo desenho do logo), extrudado em 3D.
function shieldShape() {
  const k = 0.034;
  const p = (x: number, y: number) => [(x - 200) * k, -(y - 105) * k] as const;
  const s = new THREE.Shape();
  s.moveTo(...p(200, 30));
  s.lineTo(...p(262, 52));
  s.lineTo(...p(262, 108));
  s.bezierCurveTo(...p(262, 144), ...p(236, 166), ...p(200, 180));
  s.bezierCurveTo(...p(164, 166), ...p(138, 144), ...p(138, 108));
  s.lineTo(...p(138, 52));
  s.closePath();
  return s;
}

const k = 0.034;
const pt = (x: number, y: number): [number, number] => [(x - 200) * k, -(y - 105) * k];

function Bar({
  a,
  b,
  r,
  z,
  children,
}: {
  a: [number, number];
  b: [number, number];
  r: number;
  z: number;
  children: React.ReactNode;
}) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  return (
    <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z]} rotation={[0, 0, ang - Math.PI / 2]}>
      <capsuleGeometry args={[r, len, 10, 28]} />
      {children}
    </mesh>
  );
}

function Shield() {
  const shape = useMemo(shieldShape, []);
  const depth = 0.5;
  const front = depth / 2 + 0.14;
  const orange = (
    <meshPhysicalMaterial
      color="#ff7a3d"
      emissive="#ff5a14"
      emissiveIntensity={0.55}
      roughness={0.28}
      clearcoat={1}
      clearcoatRoughness={0.15}
    />
  );
  return (
    <group>
      {/* aro laranja atrás */}
      <mesh position={[0, 0, -depth / 2 - 0.08]} scale={1.045}>
        <extrudeGeometry
          args={[shape, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.07, bevelSegments: 4, curveSegments: 28 }]}
        />
        {orange}
      </mesh>
      {/* corpo grafite */}
      <mesh position={[0, 0, -depth / 2]}>
        <extrudeGeometry
          args={[shape, { depth, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.1, bevelSegments: 4, curveSegments: 28 }]}
        />
        <meshPhysicalMaterial
          color="#2d2d34"
          metalness={0.55}
          roughness={0.22}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </mesh>
      {/* o check */}
      <Bar a={pt(172, 104)} b={pt(192, 124)} r={0.2} z={front}>
        {orange}
      </Bar>
      <Bar a={pt(192, 124)} b={pt(229, 78)} r={0.2} z={front}>
        {orange}
      </Bar>
      <mesh position={[...pt(192, 124), front]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        {orange}
      </mesh>
      <mesh position={[...pt(172, 104), front]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        {orange}
      </mesh>
      <mesh position={[...pt(232, 74), front + 0.02]}>
        <sphereGeometry args={[0.31, 32, 32]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.18} clearcoat={1} emissive="#ffffff" emissiveIntensity={0.12} />
      </mesh>
    </group>
  );
}

type DocData = { title: string; supplier: string; value: string; badge: string; tone: string };

function useDocTexture(d: DocData) {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 768;
    c.height = 512;
    const g = c.getContext('2d')!;
    g.fillStyle = '#2b2b32';
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = d.tone;
    g.fillRect(0, 0, 14, c.height);
    g.fillStyle = '#b1b0b7';
    g.font = '700 34px Inter, Segoe UI, sans-serif';
    g.fillText(d.title.toUpperCase(), 52, 82);
    g.fillStyle = '#f6f5f2';
    g.font = '700 46px Inter, Segoe UI, sans-serif';
    g.fillText(d.supplier, 52, 170);
    g.fillStyle = '#b1b0b7';
    g.font = '500 32px Inter, Segoe UI, sans-serif';
    g.fillText('Valor para aprovar', 52, 280);
    g.fillStyle = '#ffffff';
    g.font = '800 80px Inter, Segoe UI, sans-serif';
    g.fillText(d.value, 52, 372);
    // A pílula acompanha a largura do texto (30 px de folga de cada lado), para nenhum selo vazar.
    g.font = '800 30px Inter, Segoe UI, sans-serif';
    const badgeW = Math.ceil(g.measureText(d.badge).width) + 60;
    g.fillStyle = d.tone;
    g.beginPath();
    g.roundRect(52, 412, badgeW, 60, 30);
    g.fill();
    g.fillStyle = '#1e1e22';
    g.fillText(d.badge, 82, 454);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [d]);
}

function DocCard({ data, position, rotation, speed }: { data: DocData; position: [number, number, number]; rotation: [number, number, number]; speed: number }) {
  const tex = useDocTexture(data);
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.1} position={position} rotation={rotation}>
      <RoundedBox args={[1.5, 1, 0.07]} radius={0.07} smoothness={6}>
        <meshPhysicalMaterial color="#2b2b32" roughness={0.35} metalness={0.2} clearcoat={0.6} />
      </RoundedBox>
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[1.5, 1]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </Float>
  );
}

function Coin({ position, speed, scale = 1 }: { position: [number, number, number]; speed: number; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });
  const gold = (
    <meshPhysicalMaterial color="#ffa565" metalness={0.75} roughness={0.2} clearcoat={1} emissive="#ff6a1a" emissiveIntensity={0.25} />
  );
  return (
    <Float speed={1.6} floatIntensity={1.4} position={position} scale={scale}>
      <group rotation={[0.25, 0, 0.35]}>
        <group ref={ref} rotation={[0, 0.6, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.08, 64]} />
            {gold}
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <torusGeometry args={[0.22, 0.022, 16, 64]} />
            {gold}
          </mesh>
          <mesh position={[0, 0, -0.045]}>
            <torusGeometry args={[0.22, 0.022, 16, 64]} />
            {gold}
          </mesh>
        </group>
      </group>
    </Float>
  );
}

const DOCS: DocData[] = [
  { title: 'Pedido · 4821', supplier: 'Concreto Aurora', value: 'R$ 38.420', badge: 'ALTA PRIORIDADE', tone: '#f2c979' },
  { title: 'Medição · 112', supplier: 'Terraplenagem', value: 'R$ 126.900', badge: 'AGUARDANDO', tone: '#ff8c51' },
  { title: 'Contrato · 309', supplier: 'Elétrica Horizonte', value: 'R$ 84.500', badge: 'APROVADO', tone: '#7edbb6' },
];

function Rig({
  pointer,
  scroll,
  onReady,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  scroll: React.RefObject<number>;
  onReady: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const frames = useRef(0);
  const { viewport, size } = useThree();
  // Só no desktop a tela cobre o hero inteiro; no celular e tablet ela vira um bloco baixo.
  const wide = size.width > 1000 && size.height > 480;
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    // Os primeiros quadros compilam os shaders e podem engasgar; só avisa que está pronto depois deles.
    if (frames.current < 3 && ++frames.current === 3) onReady();
    const px = pointer.current?.x ?? 0;
    const py = pointer.current?.y ?? 0;
    const s = scroll.current ?? 0;
    const t = 1 - Math.exp(-dt * 3.5);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, px * 0.42 + s * 0.9, t);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -py * 0.22, t);
    g.position.y = THREE.MathUtils.lerp(g.position.y, s * 1.2, t);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, px * 0.35, t);
    state.camera.lookAt(0, 0, 0);
  });
  // Desktop: a cena ocupa a coluna da direita. Celular: fica num bloco próprio acima do texto.
  const ax = wide ? Math.min(viewport.width * 0.24, 3.1) : 0;
  const sc = wide ? Math.min(0.92, viewport.height / 6.2) : Math.min(0.85, viewport.width / 6);
  return (
    <group position={[ax, wide ? -0.15 : 0, 0]} scale={sc}>
      <group ref={group}>
        <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
          <group scale={0.66} rotation={[0.04, -0.18, 0.02]}>
            <Shield />
          </group>
        </Float>
        <DocCard data={DOCS[0]} position={[1.6, 1.55, 0.9]} rotation={[0.12, -0.42, 0.1]} speed={1.5} />
        <DocCard data={DOCS[1]} position={[1.5, -1.15, 1.2]} rotation={[-0.06, -0.5, -0.08]} speed={1.2} />
        <DocCard data={DOCS[2]} position={[-1.55, -1.4, 1.1]} rotation={[0.08, 0.45, -0.12]} speed={1.7} />
        <Coin position={[-1.45, 1.7, 0.6]} speed={1.1} />
        <Coin position={[0.3, -2.4, 1.4]} speed={0.9} scale={0.8} />
        <Coin position={[2.55, 0.3, 0.2]} speed={1.4} scale={0.65} />
        <Coin position={[-2.2, 0.15, 0.4]} speed={1.2} scale={0.6} />
      </group>
    </group>
  );
}

export default function Hero3D({ active, onReady }: { active: boolean; onReady: () => void }) {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 9], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#ff7a3d" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={4} position={[0, 5, -4]} scale={[12, 3, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={3} position={[-6, 1, -1]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#ff7a3d" />
        <Lightformer form="rect" intensity={2} position={[6, 0, 1]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#ffd9c4" />
        <Lightformer form="ring" intensity={2.5} position={[0, -3, 4]} scale={5} color="#ffffff" />
      </Environment>
      <Rig pointer={pointer} scroll={scroll} onReady={onReady} />
    </Canvas>
  );
}
