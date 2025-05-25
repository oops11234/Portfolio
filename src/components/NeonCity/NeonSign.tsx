import { Text } from '@react-three/drei'

type NeonSignProps = {
  text: string
  position?: [number, number, number]
  color?: string
  fontSize?: number
  rotation?: [number, number, number]
}

const NeonSign = ({
  text,
  position = [0, 2, 0],
  color = '#0ff',
  fontSize = 1,
  rotation = [0, 0, 0],
}: NeonSignProps) => {
  return (
    <Text
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      rotation={rotation}
      outlineColor={color}
      outlineWidth={0.01}
    >
      {text}
    </Text>
  )
}

export default NeonSign