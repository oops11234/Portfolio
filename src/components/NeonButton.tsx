
type NeonButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
};

const NeonButton = ({
  children,
  onClick,
  className = "",
  type = "button",
}: NeonButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-8 py-3 border-2 border-cyan-400 rounded-xl text-cyan-300 font-medium text-lg hover:bg-cyan-400 hover:text-black transition text-neon-soft inline-block cursor-pointer ${className}`}
    >
      {children}
    </button>
);
};

export default NeonButton;