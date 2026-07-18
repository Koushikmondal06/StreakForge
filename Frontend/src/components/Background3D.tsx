import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function Particles({ count = 500 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!)

  const [positions, colors] = useMemo(() => {
    const rand = seededRandom(42)
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const accentColor = new THREE.Color('#6366f1')
    const streakColor = new THREE.Color('#f97316')

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 20
      pos[i * 3 + 1] = (rand() - 0.5) * 20
      pos[i * 3 + 2] = (rand() - 0.5) * 20

      const color = rand() > 0.5 ? accentColor : streakColor
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }
    return [pos, col]
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.03
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null!)

  const orbs = useMemo(() => {
    const rand = seededRandom(123)
    return Array.from({ length: 6 }, (_, i) => ({
      position: [
        (rand() - 0.5) * 12,
        (rand() - 0.5) * 8,
        (rand() - 0.5) * 10 - 3,
      ] as [number, number, number],
      scale: rand() * 1.5 + 0.5,
      speed: rand() * 0.5 + 0.3,
      offset: rand() * Math.PI * 2,
      color: i % 2 === 0 ? '#6366f1' : '#f97316',
    }))
  }, [])

  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        const orb = orbs[i]
        child.position.y =
          orb.position[1] + Math.sin(state.clock.elapsedTime * orb.speed + orb.offset) * 1.5
        child.position.x =
          orb.position[0] + Math.cos(state.clock.elapsedTime * orb.speed * 0.7 + orb.offset) * 0.8
      })
    }
  })

  return (
    <group ref={group}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.scale, 32, 32]} />
          <meshStandardMaterial
            color={orb.color}
            transparent
            opacity={0.15}
            emissive={orb.color}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

function WireframeSphere() {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.1
      mesh.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <mesh ref={mesh} position={[0, 0, -5]}>
      <icosahedronGeometry args={[3, 1]} />
      <meshStandardMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  )
}

export default function Background3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <Particles count={600} />
        <FloatingOrbs />
        <WireframeSphere />
      </Canvas>
    </div>
  )
}
