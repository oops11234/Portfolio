export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 text-neon-soft shrink-0">
        {children}
      </h2>
      <div className="flex-1 h-px bg-cyan-500/30" />
    </div>
  );
}
