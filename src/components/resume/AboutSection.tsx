import SectionTitle from "./SectionTitle";

export default function AboutSection({ about }: { about: string[] }) {
  return (
    <section className="space-y-4">
      <SectionTitle>About Me</SectionTitle>
      <div className="border border-cyan-500/50 rounded-xl p-6 bg-cyan-950/10 shadow-[0_0_20px_#06b6d420] space-y-4">
        {about.map((paragraph, i) => (
          <p key={i} className="text-cyan-100 leading-relaxed text-lg text-left">{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
