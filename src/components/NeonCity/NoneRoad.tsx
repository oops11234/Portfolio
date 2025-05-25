
const NeonRoad = () => {
  const segmentCount = 30
  const segmentLength = 1
  const gap = 1
  const startZ = -((segmentCount * (segmentLength + gap)) / 2)

  return (
    <>
      {/* 中間道路面板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.49, 0]} receiveShadow>
        <planeGeometry args={[10, 60]} />
        <meshStandardMaterial
          color="#222"
          emissive="#222"
          metalness={0}
          roughness={1}
        />
      </mesh>

      {/* 左側發光線條 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, -1.48, 0]}>
        <planeGeometry args={[0.05, 60]} />
        <meshStandardMaterial
          color="#000"
          emissive="#0ff"
          emissiveIntensity={1}
          metalness={0}
          roughness={1}
        />
      </mesh>

      {/* 右側發光線條 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, -1.48, 0]}>
        <planeGeometry args={[0.05, 60]} />
        <meshStandardMaterial
          color="#000"
          emissive="#0ff"
          emissiveIntensity={1}
          metalness={0}
          roughness={1}
        />
      </mesh>

      {/* 中間虛線（車道分隔線） */}
      {Array.from({ length: segmentCount }).map((_, i) => (
        <mesh
          key={i}
          position={[0, -1.47, startZ + i * (segmentLength + gap)]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.1, segmentLength]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#fff"
            emissiveIntensity={0.5}
            metalness={0}
            roughness={1}
          />
        </mesh>
      ))}
    </>
  )
}

export default NeonRoad