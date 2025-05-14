const NeonChartWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full max-w-4xl h-[400px] mx-auto p-4 bg-black rounded-xl border w-full border-cyan-500 shadow-[0_0_20px_#0ff] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none neon-scan-bg z-10" />
      <div className="relative z-20 w-full h-full">{children}</div>
    </div>
  );
};

export default NeonChartWrapper;