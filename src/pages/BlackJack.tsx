import { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="neon-scan-bg min-h-screen relative">
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-neon">
          Welcome to Neon World
        </h1>
        <p className="text-xl mt-6 text-cyan-200 text-neon-soft">
          Feel the glow, embrace the night
        </p>
        <a
          onClick={() => setShowModal(true)}
          className="mt-8 px-8 py-3 border-2 border-cyan-400 rounded-xl text-cyan-300 font-medium text-lg hover:bg-cyan-400 hover:text-black transition text-neon-soft"
        >
          Explore
        </a>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-30 flex flex-col items-center justify-center">
          <TypeAnimation
            sequence={["Which part are you interested in?", 1500]}
            speed={50}
            wrapper="div"
            className="text-xl md:text-3xl text-cyan-300 mb-6 text-neon-soft"
          />
          <div className="flex space-x-6">
            <a
              onClick={() => navigate("/contract")}
             className="mt-8 px-8 py-3 border-2 border-cyan-400 rounded-xl text-cyan-300 font-medium text-lg hover:bg-cyan-400 hover:text-black transition text-neon-soft"
            >
              Frontend
            </a>
            <a
              onClick={() => navigate("/blackjackTable")}
              className="mt-8 px-8 py-3 border-2 border-cyan-400 rounded-xl text-cyan-300 font-medium text-lg hover:bg-cyan-400 hover:text-black transition text-neon-soft"
            >
              Smart Contract
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;