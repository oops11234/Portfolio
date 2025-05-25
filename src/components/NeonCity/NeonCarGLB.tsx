import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type NeonCarGLBProps = {
  modelPath: string           // 車子 glb 路徑
  lane?: number               // X 軸位置
  offsetZ?: number            // 初始 Z 軸位置
  direction?: 'forward' | 'backward'
  scale?: number
}

const NeonCarGLB = ({
  modelPath,
  lane = 0,
  offsetZ = -20,
  direction = 'forward',
  scale = 1,
}: NeonCarGLBProps) => {
  const carRef = useRef<THREE.Group>(null!)
  const { scene } = useGLTF(modelPath)

  useFrame(() => {
    if (carRef.current) {
      const speed = 0.2
      const dir = direction === 'forward' ? 1 : -1
      carRef.current.position.z += speed * dir

      if (direction === 'forward' && carRef.current.position.z > 35) {
        carRef.current.position.z = -35
      } else if (direction === 'backward' && carRef.current.position.z < -35) {
        carRef.current.position.z = 35
      }
    }
  })

  return (
    <group
      ref={carRef}
      position={[lane, -1.4, offsetZ]}
      rotation={[0, direction === 'backward' ? Math.PI : 0, 0]}
      scale={scale}
    >
      <primitive object={scene} />
    </group>
  )
}

export default NeonCarGLB