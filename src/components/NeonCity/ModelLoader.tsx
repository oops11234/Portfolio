import { useGLTF } from '@react-three/drei'
import { useEffect, useRef  } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'


type Props = {
  path: string
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

const ModelLoader = ({
  path,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: Props) => {
  const neonMaterialsRef = useRef<Map<string, THREE.MeshStandardMaterial[]>>(new Map())
  const { scene } = useGLTF(path)
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const name = mesh.name.toLowerCase()

        const neonColorMap: Record<string, string> = {
          'highrise_12-mesh_0': '#f00',
          'highrise_12-mesh_1': '#00f',
          'highrise_12-mesh_2': '#ff0',
          'highrise_12-mesh_3': '#0f0',
          'highrise_12-mesh_4': '#0ff',
          'highrise_12-mesh_5': '#f0f',
          'highrise_12-mesh_6': '#0f0',
          'highrise_12-mesh_7': '#ff0',
          'highrise_12-mesh_8': '#f80',
          'highrise_12-mesh_9': '#0cf',
          'highrise_12-mesh_10': '#f0c',
          'highrise_12-mesh_11': '#c0f',
          'highrise_12-mesh_12': '#f80',
          'highrise_12-mesh_13': '#f0f0f0',
          'highrise_12-mesh_14': '#0ff',
        }

        const neonColor = neonColorMap[name]
        if (neonColor) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material]

          const validMats: THREE.MeshStandardMaterial[] = []

          materials.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.emissive = new THREE.Color(neonColor)
              mat.emissiveIntensity = 2.5
              mat.color = new THREE.Color('#222')
              validMats.push(mat)
            }
          })

          neonMaterialsRef.current.set(name, validMats)
        }
      }
    })
  }, [scene])
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    neonMaterialsRef.current.forEach((materials, meshName) => {
      const base = 1.5
      const amplitude = 1.2
      const speed = 1.5 // 越小越慢
      const breath = base + Math.sin(time * speed + meshName.length) * amplitude

      materials.forEach((mat) => {
        mat.emissiveIntensity = breath
      })
    })
  })
  return (
    <primitive
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  )
}

export default ModelLoader