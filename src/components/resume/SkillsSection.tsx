import SectionTitle from "./SectionTitle";
import SkillTag, { type SkillItem } from "./SkillTag";

type SkillGroup = {
  category: string;
  items: SkillItem[];
};

export default function SkillsSection({ skills }: { skills: SkillGroup[] }) {
  return (
    <section className="space-y-6">
      <SectionTitle>Skills</SectionTitle>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-white/50">
        <span><span className="text-cyan-400">■</span> Expert (85+)</span>
        <span><span className="text-purple-400">■</span> Proficient (70–84)</span>
        <span><span className="text-orange-400">■</span> Familiar (&lt;70)</span>
      </div>

      <div className="space-y-5">
        {skills.map((group) => (
          <div key={group.category}>
            <p className="text-white/40 text-xs font-semibold mb-3 tracking-widest uppercase">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <SkillTag key={item.name} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
