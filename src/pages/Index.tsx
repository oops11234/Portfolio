import React from "react";

const Index: React.FC = () => {
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
          href="#explore"
          className="mt-8 px-8 py-3 border-2 border-cyan-400 rounded-xl text-cyan-300 font-medium text-lg hover:bg-cyan-400 hover:text-black transition text-neon-soft"
        >
          Explore
        </a>
      </div>
    </div>
  );
};

export default Index;