import { useState, useEffect, useRef } from "react";
import SectionTitle from "./SectionTitle";

type Experience = {
  company: string;
  role: string;
  period: string;
  description: string | string[];
};

function ExperienceCard({
  exp,
  side,
  index,
}: {
  exp: Experience;
  side: "left" | "right";
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const descriptions = Array.isArray(exp.description)
    ? exp.description
    : [exp.description];

  const isLeft = side === "left";

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : `translateX(${isLeft ? "24px" : "-24px"})`,
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div
        className={`
          border border-cyan-500/30 rounded-lg p-4 cursor-pointer
          bg-black/50 backdrop-blur-sm
          hover:border-cyan-400/60 hover:shadow-[0_0_24px_#22d3ee18]
          transition-all duration-300
          ${isLeft ? "text-right" : "text-left"}
        `}
        onClick={() => setOpen((v) => !v)}
      >
        <p className="text-cyan-400/50 text-xs tracking-widest mb-1">{exp.period}</p>
        <h3 className="text-white font-bold text-base leading-snug">{exp.role}</h3>
        <p className="text-cyan-300 text-sm mb-2">{exp.company}</p>

        {/* Expand hint */}
        <p className={`text-cyan-500/40 text-xs transition-all duration-200 ${open ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
          {isLeft ? "← " : ""}expand{!isLeft ? " →" : ""}
        </p>

        {/* Description */}
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: open ? "600px" : "0px" }}
        >
          <ul className={`mt-3 space-y-2 ${isLeft ? "text-right" : "text-left"}`}>
            {descriptions.map((line, j) => (
              <li
                key={j}
                className={`flex gap-2 text-cyan-100/70 text-sm leading-relaxed ${isLeft ? "flex-row-reverse" : "flex-row"}`}
              >
                <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceSection({ experience }: { experience: Experience[] }) {
  return (
    <section className="space-y-6">
      <SectionTitle>Experience</SectionTitle>

      <div className="relative">

        {/* Mobile: left-border timeline */}
        <div className="md:hidden relative pl-6 space-y-8">
          {experience.map((exp, i) => (
            <div key={i} className="relative">
              {/* Dot */}
              <span className="absolute -left-[31px] top-2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] border-2 border-black z-10" />
              {/* Connecting line (not for last item) */}
              {i < experience.length - 1 && (
                <span
                  className="absolute w-0.5 bg-cyan-500/30"
                  style={{ left: "-25px", top: "14px", height: "calc(100% + 32px)" }}
                />
              )}
              <ExperienceCard exp={exp} side="right" index={i} />
            </div>
          ))}
        </div>

        {/* Desktop: alternating layout */}
        <div className="hidden md:flex flex-col gap-10">
          {experience.map((exp, i) => {
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <div key={i} className="grid grid-cols-[1fr_48px_1fr] items-start">
                {/* Left slot */}
                <div className="pr-4">
                  {side === "left" && <ExperienceCard exp={exp} side="left" index={i} />}
                </div>

                {/* Center dot */}
                <div className="relative flex justify-center pt-5 self-stretch">
                  {i < experience.length - 1 && (
                    <div
                      className="absolute w-px bg-cyan-500/25 left-1/2 -translate-x-1/2"
                      style={{ top: "27px", height: "calc(100% + 40px)" }}
                    />
                  )}
                  <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] border-2 border-black shrink-0 relative z-10" />
                </div>

                {/* Right slot */}
                <div className="pl-4">
                  {side === "right" && <ExperienceCard exp={exp} side="right" index={i} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
