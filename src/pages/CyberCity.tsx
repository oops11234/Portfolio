import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import PoliceCar from '../assets/models/PoliceCar.glb?url'
import SportsCar from '../assets/models/SportsCar.glb?url'
import ToyotaAE86 from '../assets/models/ToyotaAE86.glb?url'
import NeonCarGLB from '../components/NeonCity/NeonCarGLB'
import NeonRoad from '../components/NeonCity/NoneRoad'
import tronCity from '../assets/models/Troncity.glb?url'
import ModelLoader from '../components/NeonCity/ModelLoader'

const CyberScene = () => {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [0, 0.8, 1], fov: 60 }}
      >
        {/* 環境光與背景霧氣 */}
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 10, 30]} />

        {/* 鏡頭與控制 */}
        <PerspectiveCamera makeDefault position={[0, 2, 10]} />
        <OrbitControls
          enableZoom={true}
          maxPolarAngle={Math.PI / 2 + 0.04} 
        />

        {/* 環境貼圖（夜晚城市感） */}
        <Environment preset="night" />
        <NeonRoad />


        {/* <NeonSign text="CYBER PARK" position={[0, 5, -2]} fontSize={1.5} color="#ff00ff" />
        <NeonSign text="BLACKJACK" position={[-4, 3, 1]} fontSize={0.8} color="#00ffff" rotation={[0, Math.PI / 4, 0]} />
        <NeonSign text="CRYPTO" position={[4, 6, 2]} fontSize={1} color="#ff4444" /> */}

        <ModelLoader
          path={tronCity}
          scale={0.05}
          position={[0, -1.49, 1]}
          rotation={[0, Math.PI, 0]}
        />
        {/* 車輛 */}
        <NeonCarGLB modelPath={PoliceCar} lane={0.5} offsetZ={-30} direction="forward" scale={0.25} />
        <NeonCarGLB modelPath={SportsCar} lane={-0.5} offsetZ={-15} direction="backward" scale={0.25} />
        <NeonCarGLB modelPath={ToyotaAE86} lane={0.5} offsetZ={-10} direction="forward" scale={0.05} />

        {/* 模擬城市建築 */}

        {/* 光源 */}
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 5]} intensity={1.2} color="#0ff" castShadow />
        <spotLight position={[-5, 10, 5]} angle={0.3} penumbra={0.2} intensity={2} castShadow />

        {/* Bloom 特效 */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default CyberScene
