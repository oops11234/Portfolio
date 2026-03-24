import SectionTitle from "./SectionTitle";

type ContactData = {
  github: string;
  linkedin: string;
  email: string;
};

function ContactLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 border-2 border-cyan-400 rounded-xl text-cyan-300 font-medium
                 hover:bg-cyan-400 hover:text-black transition-all duration-200
                 text-neon-soft shadow-[0_0_10px_#22d3ee30] hover:shadow-[0_0_20px_#22d3ee]"
    >
      {label}
    </a>
  );
}

export default function ContactSection({ contact }: { contact: ContactData }) {
  return (
    <section className="space-y-6">
      <SectionTitle>Contact</SectionTitle>
      <div className="flex flex-wrap gap-4">
        {contact.github && <ContactLink href={contact.github} label="GitHub" />}
        {contact.linkedin && <ContactLink href={contact.linkedin} label="LinkedIn" />}
        {contact.email && <ContactLink href={`mailto:${contact.email}`} label={contact.email} />}
      </div>
    </section>
  );
}
