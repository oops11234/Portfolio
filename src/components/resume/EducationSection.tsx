import SectionTitle from "./SectionTitle";

type Education = {
  school: string;
  department: string;
  degree: string;
  period: string;
};

export default function EducationSection({ education }: { education: Education[] }) {
  return (
    <section className="space-y-6">
      <SectionTitle>Education</SectionTitle>
      <div className="space-y-4">
        {education.map((edu, i) => (
          <div
            key={i}
            className="border border-cyan-500/40 rounded-xl p-5 bg-cyan-950/10
                       shadow-[0_0_15px_#06b6d415] flex flex-col md:flex-row md:items-center md:justify-between gap-2"
          >
            <div>
              <h3 className="text-lg font-bold text-white">{edu.school}</h3>
              <p className="text-cyan-300 text-sm">{edu.degree} · {edu.department}</p>
            </div>
            <p className="text-cyan-400/70 text-sm shrink-0">{edu.period}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
