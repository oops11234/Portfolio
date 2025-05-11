import { useState, useEffect } from "react";

const faces = ["(T_T)", "(ಥ﹏ಥ)", "(；＿；)", "(ಥ_ಥ)"];

const NeonFace = () => {
  const [faceIndex, setFaceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFaceIndex((prev) => (prev + 1) % faces.length);
    }, 2000); // 每 2 秒切換表情
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-4xl md:text-6xl text-cyan-300 text-neon-soft animate-pulse mt-6">
      {faces[faceIndex]}
    </div>
  );
};

export default NeonFace;