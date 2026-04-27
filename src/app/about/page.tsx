import FadeContent from "@/components/FadeContent";
import { HeroStage } from "@/components/portfolio/hero-stage";
import { profile } from "@/data/profile";

const aboutDetails = [
  {
    label: "Education",
    value: "UCF computer science student with a 4.0 GPA.",
  },
  {
    label: "Research",
    value: "Undergraduate researcher at ISUE Lab working on AI-assisted speech feedback.",
  },
  {
    label: "Building",
    value: "Knight Hacks Software Developer and Hacklytics 2026 first-place builder for CrisisLens.",
  },
];

export default function AboutPage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden bg-deep-navy text-ice">
      <HeroStage name={profile.name} />
      <section
        id="about-more"
        className="relative isolate scroll-mt-0 bg-[#061427] px-5 py-28 sm:px-8 lg:px-10 lg:py-36"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ice/18 to-transparent" />
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.82fr_1.18fr] md:items-start">
          <FadeContent blur duration={900} threshold={0.18}>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/45">
              About
            </p>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.04] tracking-tight text-white md:text-6xl">
              Focused on useful software and applied AI.
            </h2>
          </FadeContent>

          <div className="grid gap-4">
            {aboutDetails.map((detail, index) => (
              <FadeContent
                key={detail.label}
                blur
                duration={850}
                delay={index * 120}
                threshold={0.18}
              >
                <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:bg-white/[0.055] md:p-8">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/42">
                    {detail.label}
                  </p>
                  <p className="mt-4 text-lg leading-8 text-white/78 md:text-xl">
                    {detail.value}
                  </p>
                </article>
              </FadeContent>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
