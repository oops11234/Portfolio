import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

// Mock NeonButton component
const NeonButton = ({ children, onClick, className = "", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-6 py-3 bg-transparent border-2 border-cyan-400 text-cyan-300 
      rounded-lg font-bold uppercase tracking-wider
      hover:bg-cyan-400 hover:text-black hover:shadow-lg hover:shadow-cyan-400/50
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all duration-300
      ${className}
    `}
  >
    {children}
  </button>
);

type GameStatus = "waiting" | "betting" | "dropping" | "result";

interface DropResult {
  position: number;
  multiplier: number;
  payout: number;
}

interface Peg {
  x: number;
  y: number;
  radius: number;
}

interface BallState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
}

const GaussianDrop = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballControls = useAnimation();
  const animationRef = useRef<number>();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [withContract, setWithContract] = useState<boolean>(false);
  
  // Game state
  const [gameStatus, setGameStatus] = useState<GameStatus>("betting");
  const [betAmount, setBetAmount] = useState<number>(0.01);
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [dropResult, setDropResult] = useState<DropResult | null>(null);
  
  // Animation state
  const [showBall, setShowBall] = useState(true);
  const ballStateRef = useRef<BallState>({
    x: 250, y: 50, vx: 0, vy: 0, rotation: 0
  });
  const ballElementRef = useRef<HTMLDivElement>(null);

  const updateBallPosition = () => {
    if (ballElementRef.current) {
      const ball = ballStateRef.current;
      ballElementRef.current.style.left = `${ball.x - 8 + 6}px`;
      ballElementRef.current.style.top = `${ball.y - 8 + 6}px`;
      ballElementRef.current.style.transform = `rotate(${ball.rotation}rad)`;
    }
  };
  const [pegs] = useState(() => generatePegs());
  const [multipliers] = useState(() => generateMultipliers());

  function generatePegs(): Peg[] {
    const pegs: Peg[] = [];
    const rows = 12;
    const startY = 100;
    const rowSpacing = 40;
    
    for (let row = 0; row < rows; row++) {
      const pegsInRow = row + 3;
      const startX = 250 - (pegsInRow - 1) * 20;
      
      for (let peg = 0; peg < pegsInRow; peg++) {
        pegs.push({
          x: startX + peg * 40,
          y: startY + row * rowSpacing,
          radius: 6
        });
      }
    }
    return pegs;
  }

  function generateMultipliers(): number[] {
    return [0.2, 0.5, 1.0, 1.5, 2.0, 5.0, 10.0, 50.0, 10.0, 5.0, 2.0, 1.5, 1.0, 0.5, 0.2];
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw trail
    trailRef.current.forEach((point) => {
      ctx.globalAlpha = point.opacity;
      ctx.fillStyle = '#ff00ff';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3 * point.opacity, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    
    // Draw pegs with neon glow
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#00ffff';
    
    pegs.forEach(peg => {
      ctx.beginPath();
      ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw multiplier slots at bottom
    ctx.shadowBlur = 5;
    const slotWidth = canvas.width / multipliers.length;
    multipliers.forEach((multiplier, index) => {
      const x = index * slotWidth;
      const y = canvas.height - 60;
      
      // Slot background
      ctx.fillStyle = multiplier >= 10 ? '#ff0080' : multiplier >= 2 ? '#00ff80' : '#404040';
      ctx.fillRect(x, y, slotWidth - 2, 50);
      
      // Multiplier text
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${multiplier}x`, x + slotWidth/2, y + 30);
    });
    
    ctx.shadowBlur = 0;
  };

  const trailRef = useRef<{x: number, y: number, opacity: number}[]>([]);
  
  const updateTrail = (x: number, y: number) => {
    trailRef.current = [{x, y, opacity: 1}, ...trailRef.current.slice(0, 8)];
    trailRef.current = trailRef.current.map((point, index) => ({
      ...point,
      opacity: Math.max(0, 1 - index * 0.15)
    }));
  };

  const checkCollision = (ballX: number, ballY: number, peg: Peg): boolean => {
    const distance = Math.sqrt((ballX - peg.x) ** 2 + (ballY - peg.y) ** 2);
    return distance <= peg.radius + 8;
  };

  const simulateGaussianDrop = async (): Promise<number> => {
    return new Promise((resolve) => {
      ballStateRef.current = {
        x: 250,
        y: 50,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0,
        rotation: 0
      };
      
      const gravity = 0.10;
      const friction = 0.997;
      const bounce = 0.65;
      const ballRadius = 8;
      
      let hitPegs = new Set<string>();
      let frameCount = 0;
      
      const animate = () => {
        frameCount++;
        const ball = ballStateRef.current;
        
        // 應用重力
        ball.vy += gravity;
        
        // 更新位置
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // 旋轉效果 (更慢的旋轉)
        ball.rotation += ball.vx * 0.03;
        
        // 邊界碰撞
        if (ball.x <= ballRadius) {
          ball.x = ballRadius;
          ball.vx *= -bounce;
        } else if (ball.x >= 500 - ballRadius) {
          ball.x = 500 - ballRadius;
          ball.vx *= -bounce;
        }
        
        // 檢查與釘子的碰撞
        pegs.forEach((peg) => {
          const pegKey = `${peg.x}-${peg.y}`;
          if (!hitPegs.has(pegKey) && checkCollision(ball.x, ball.y, peg)) {
            hitPegs.add(pegKey);
            
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
              const nx = dx / distance;
              const ny = dy / distance;
              
              // 確保球移動到釘子外側
              const overlap = peg.radius + ballRadius - distance + 1;
              ball.x += nx * overlap;
              ball.y += ny * overlap;
              
              const dotProduct = ball.vx * nx + ball.vy * ny;
              ball.vx -= 2 * dotProduct * nx * bounce;
              ball.vy -= 2 * dotProduct * ny * bounce;
              
              // 溫和的碰撞後速度調整
              if (ball.vy < 0.3) ball.vy += 0.3;
              
              ball.vx += (Math.random() - 0.5) * 0.4;
              ball.vy += Math.random() * 0.2;
            }
          }
        });
        
        // 應用摩擦力 (更少的摩擦力讓球更平穩)
        ball.vx *= 0.999;
        if (ball.vy > 0) ball.vy *= 0.999;
        
        // 防止球卡住 - 溫和的防卡機制
        if (ball.y > 350 && Math.abs(ball.vy) < 0.3) {
          ball.vy += 0.4; // 溫和的向下推力
        }
        
        if (Math.abs(ball.vx) < 0.05 && Math.abs(ball.vy) < 0.05 && ball.y < 520) {
          ball.vy += 0.6;
          ball.vx += (Math.random() - 0.5) * 0.2;
        }
        
        // 更新視覺
        updateBallPosition();
        
        // 每5幀更新一次軌跡，讓動畫更平滑
        if (frameCount % 5 === 0) {
          updateTrail(ball.x, ball.y);
        }
        
        // 檢查是否到達底部槽位區域
        if (ball.y >= 555) {
          const slotWidth = 500 / multipliers.length;
          const slotIndex = Math.floor(ball.x / slotWidth);
          const finalSlot = Math.max(0, Math.min(multipliers.length - 1, slotIndex));
          
          // 讓球落入槽位更深的位置
          ball.x = (finalSlot + 0.5) * slotWidth;
          ball.y = 570;
          updateBallPosition();
          
          setTimeout(() => {
            resolve(finalSlot);
          }, 500);
          return;
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    });
  };

  const handleDrop = async () => {
    if (betAmount <= 0) {
      setModalMessage("Please enter a valid bet amount");
      setIsModalOpen(true);
      return;
    }
    
    setIsDropping(true);
    setGameStatus("dropping");
    setDropResult(null);
    trailRef.current = [];
    
    setShowBall(true);
    
    try {
      const slotIndex = await simulateGaussianDrop();
      const multiplier = multipliers[slotIndex];
      const payout = betAmount * multiplier;
      
      setDropResult({
        position: slotIndex,
        multiplier,
        payout
      });
      
      setGameStatus("result");
      
      // 結果動畫
      await ballControls.start({
        scale: 1.3,
        transition: { 
          duration: 0.3,
          type: "spring",
          stiffness: 200
        }
      });
      
      await ballControls.start({
        scale: 1,
        transition: { 
          duration: 0.3,
          type: "spring",
          stiffness: 200
        }
      });
      
    } catch (error) {
      console.error("Drop failed:", error);
      setModalMessage("Drop failed. Please try again.");
      setIsModalOpen(true);
    } finally {
      setIsDropping(false);
    }
  };

  const handleNewGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setGameStatus("betting");
    setDropResult(null);
    trailRef.current = [];
    ballStateRef.current = {
      x: 250, y: 50, vx: 0, vy: 0, rotation: 0
    };
    setShowBall(true);
    updateBallPosition();
    ballControls.set({ scale: 1 });
  };

  useEffect(() => {
    let frameId: number;
    const render = () => {
      drawCanvas();
      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [pegs, multipliers]);

  useEffect(() => {
    updateBallPosition();
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Result Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-2 border-cyan-400 rounded-xl p-6 text-center">
            <p className="text-cyan-300 mb-4">{modalMessage}</p>
            <NeonButton onClick={() => setIsModalOpen(false)}>OK</NeonButton>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
            GAUSSIAN DROP
          </h1>
          <p className="text-xl text-cyan-300 mb-2">Web3 Probability Game</p>
          <p className="text-gray-400">Drop the ball and watch it follow the laws of probability</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Canvas */}
          <div className="bg-gray-900/50 border-2 border-cyan-400 rounded-xl p-6 relative">
            <canvas
              ref={canvasRef}
              width={500}
              height={600}
              className="border border-gray-600 rounded-lg"
            />
            
            {/* Animated Ball */}
            {showBall && (
              <motion.div
                ref={ballElementRef}
                animate={ballControls}
                className="absolute w-4 h-4 rounded-full shadow-lg pointer-events-none"
                style={{
                  left: '242px',
                  top: '42px',
                  background: 'radial-gradient(circle, #ff00ff, #8800ff)',
                  boxShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff',
                  willChange: 'transform'
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-300 via-transparent to-transparent opacity-50"></div>
              </motion.div>
            )}
          </div>

          {/* Game Controls */}
          <div className="bg-gray-900/50 border-2 border-cyan-400 rounded-xl p-6 min-w-[300px]">
            <h3 className="text-2xl font-bold mb-6 text-cyan-300">Game Controls</h3>
            
            {gameStatus === "betting" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-300 mb-2">Bet Amount (ETH)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 bg-gray-800 border border-cyan-400 rounded-lg text-white focus:outline-none focus:border-cyan-300"
                    disabled={isDropping}
                  />
                </div>
                
                <NeonButton 
                  onClick={handleDrop}
                  className="w-full"
                  disabled={isDropping}
                >
                  {isDropping ? "DROPPING..." : "DROP BALL"}
                </NeonButton>
              </div>
            )}

            {gameStatus === "dropping" && (
              <div className="text-center">
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-2xl text-cyan-300 mb-4"
                >
                  Ball is dropping...
                </motion.div>
                <div className="text-gray-400">
                  Watch the realistic physics in action!
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Y position: {Math.round(ballStateRef.current.y)} / Target: 555+
                </div>
              </div>
            )}

            {gameStatus === "result" && dropResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="text-center border border-cyan-400 rounded-lg p-4">
                  <h4 className="text-xl font-bold text-cyan-300 mb-2">Result</h4>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-3xl font-bold text-yellow-400 mb-2"
                  >
                    {dropResult.multiplier}x
                  </motion.div>
                  <div className="text-lg">
                    Bet: {betAmount} ETH
                  </div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-green-400"
                  >
                    Payout: {dropResult.payout.toFixed(4)} ETH
                  </motion.div>
                </div>
                
                <NeonButton onClick={handleNewGame} className="w-full">
                  NEW GAME
                </NeonButton>
              </motion.div>
            )}

            {/* Multiplier Guide */}
            <div className="mt-8">
              <h4 className="text-lg font-bold text-cyan-300 mb-3">Multipliers</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {multipliers.map((mult, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`p-2 rounded text-center cursor-pointer transition-all duration-200 ${
                      mult >= 10 ? 'bg-red-900 text-red-300 shadow-lg shadow-red-500/30' :
                      mult >= 2 ? 'bg-green-900 text-green-300 shadow-lg shadow-green-500/30' :
                      'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {mult}x
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Higher multipliers are less likely but more rewarding
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaussianDrop;