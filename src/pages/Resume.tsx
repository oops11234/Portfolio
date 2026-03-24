import resumeData from "../data/resume.json";
import HeroSection from "../components/resume/HeroSection";
import ContactSection from "../components/resume/ContactSection";
import AboutSection from "../components/resume/AboutSection";
import SkillsSection from "../components/resume/SkillsSection";
import ExperienceSection from "../components/resume/ExperienceSection";

export default function Resume() {
  const { hero, about, skills, experience, contact } = resumeData;

  return (
    <div className="min-h-screen bg-black text-white pt-[90px] pb-20 px-4 md:px-10">
      <div className="max-w-4xl mx-auto space-y-20">
        <HeroSection hero={hero} />
        <ContactSection contact={contact} />
        <AboutSection about={about} />
        <SkillsSection skills={skills} />
        <ExperienceSection experience={experience} />
        {/* <EducationSection education={education} /> */}
        {/* <ProjectsSection projects={projects} /> */}
        {/* <GitHubSection username={github.username} /> */}
      </div>
    </div>
  );
}
