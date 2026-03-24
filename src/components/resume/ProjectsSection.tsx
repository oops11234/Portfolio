import SectionTitle from "./SectionTitle";

type Project = {
  name: string;
  description: string;
  tags: string[];
  github: string;
  demo: string;
};

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section className="space-y-6">
      <SectionTitle>Projects</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj, i) => (
          <div
            key={i}
            className="border border-cyan-500/40 rounded-xl p-5 bg-cyan-950/10
                       shadow-[0_0_15px_#06b6d415] hover:shadow-[0_0_25px_#22d3ee30]
                       hover:border-cyan-400/70 transition-all duration-300 flex flex-col gap-3"
          >
            <h3 className="text-lg font-bold text-neon-soft">{proj.name}</h3>
            <p className="text-cyan-100/80 text-sm leading-relaxed flex-1">{proj.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {proj.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-cyan-900/40 border border-cyan-500/30 rounded text-cyan-400 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-4 text-sm">
              {proj.github && (
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-200 underline underline-offset-2 transition"
                >
                  GitHub
                </a>
              )}
              {proj.demo && (
                <a
                  href={proj.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-200 underline underline-offset-2 transition"
                >
                  Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
