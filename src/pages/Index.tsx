import { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";
import NeonButton from "../components/NeonButton";
import NeonFace from "../components/NeonFace";

const Index = () => {
  const [phase, setPhase] = useState<"intro" | "name" | "question" | "frontendMessage">("intro");
  const [name, setName] = useState("");
  const [confirmedName, setConfirmedName] = useState("");
  const navigate = useNavigate();

  return (
    <div className="neon-scan-bg min-h-screen relative flex items-center justify-center px-4 text-center">
      {phase === "intro" && (
        <div className="z-10 space-y-6 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-neon">
            Welcome to Cyber Park
          </h1>
          <p className="text-xl text-cyan-200 text-neon-soft">
            Feel the glow, embrace the night
          </p>
          <NeonButton onClick={() => setPhase("name")}>Explore</NeonButton>
        </div>
      )}

      {phase === "name" && (
        <div className="z-10 space-y-10 animate-fadeIn px-4 text-center">
          <TypeAnimation
            sequence={["What's your name, explorer?", 800]}
            speed={50}
            wrapper="p"
            className="text-2xl md:text-4xl text-cyan-300 text-neon-soft"
          />
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-3 w-[280px] md:w-[320px] rounded-lg bg-black border-2 border-cyan-400 text-cyan-300 text-center text-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 mx-auto"
          />

          <div className="flex flex-col items-center space-y-4">
            <NeonButton
              onClick={() => {
                setConfirmedName(name || "Explorer");
                setPhase("question");
              }}
            >
              Confirm
            </NeonButton>
          </div>
        </div>
      )}

      {phase === "question" && (
        <div className="z-10 animate-fadeIn space-y-8">
          <TypeAnimation
            sequence={[`Hello ${confirmedName}, which part are you interested in?`, 1200]}
            speed={55}
            wrapper="div"
            className="text-2xl md:text-4xl text-cyan-300 text-neon-soft"
          />
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <NeonButton onClick={() => setPhase("frontendMessage")}>Frontend</NeonButton>
            <NeonButton onClick={() => navigate("/blackjackTable")}>Smart Contract</NeonButton>
          </div>
        </div>
      )}
      {phase === "frontendMessage" && (
        <div className="z-10 space-y-10 animate-fadeIn text-center px-4">
          <TypeAnimation
            sequence={["Sorry... Frontend is still under construction.", 1200]}
            speed={50}
            wrapper="div"
            className="text-2xl md:text-4xl text-cyan-300 text-neon-soft"
          />

          <NeonFace />

          <div className="flex justify-center">
            <NeonButton onClick={() => navigate("/blackjackTable")}>
              Go to Blackjack instead
            </NeonButton>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Index;