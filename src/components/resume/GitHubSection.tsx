import SectionTitle from "./SectionTitle";

export default function GitHubSection({ username }: { username: string }) {
  return (
    <section className="space-y-6">
      <SectionTitle>GitHub Activity</SectionTitle>
      <div className="border border-cyan-500/40 rounded-xl p-4 bg-cyan-950/10 shadow-[0_0_20px_#06b6d420] overflow-x-auto">
        <img
          src={`https://ghchart.ssh.surf/${username}`}
          alt="GitHub contribution chart"
          className="w-full min-w-[600px]"
        />
      </div>
    </section>
  );
}
