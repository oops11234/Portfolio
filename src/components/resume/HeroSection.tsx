import { TypeAnimation } from "react-type-animation";
import photoImg from "../../assets/images/photo.jpg";

type HeroData = {
  name: string;
  SurName: string;
  title: string;
  subtitle: string;
  photo: string;
};

export default function HeroSection({ hero }: { hero: HeroData }) {
  return (
    <section className="pt-10">
      <div className="flex flex-col md:flex-row items-center gap-10">

        {/* 照片 — 圓形 + 掃描線 */}
        {hero.photo && (
          <div className="shrink-0 neon-scan-bg rounded-full w-40 h-40 md:w-52 md:h-52
                          border-4 border-cyan-400 shadow-[0_0_30px_#22d3ee80] overflow-hidden">
            <img
              src={photoImg}
              alt={`${hero.name} ${hero.SurName}`}
              className="w-full h-full object-cover block"
            />
          </div>
        )}

        {/* 文字 */}
        <div className={`space-y-4 ${hero.photo ? "text-left" : "text-center mx-auto"}`}>
          <h1 className="text-5xl md:text-7xl font-bold text-neon">
            {hero.name} {hero.SurName}
          </h1>
          <TypeAnimation
            sequence={[hero.title, 1000, hero.subtitle, 1000]}
            speed={50}
            repeat={Infinity}
            wrapper="p"
            className="text-xl md:text-2xl text-cyan-300 text-neon-soft"
          />
          <div className={`w-24 h-px bg-cyan-400 shadow-[0_0_8px_#22d3ee] ${hero.photo ? "" : "mx-auto"}`} />
        </div>

      </div>
    </section>
  );
}
