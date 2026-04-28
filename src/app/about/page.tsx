import FadeContent from "@/components/FadeContent";
import CircularGallery from "@/components/CircularGallery";
import { HeroStage } from "@/components/portfolio/hero-stage";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";

const aboutGalleryItems = [
  { image: "/assets/about-gallery/about-01.jpg", text: "Orlando" },
  { image: "/assets/about-gallery/about-02.jpg", text: "Knight Hacks" },
  { image: "/assets/about-gallery/about-03.jpg", text: "Hacklytics" },
  { image: "/assets/about-gallery/about-04.jpg", text: "Late build" },
  { image: "/assets/about-gallery/about-05.jpg", text: "Campus" },
  { image: "/assets/about-gallery/about-06.jpg", text: "Winners" },
  { image: "/assets/about-gallery/about-07.jpg", text: "Team" },
  { image: "/assets/about-gallery/about-08.jpg", text: "Work session" },
  { image: "/assets/about-gallery/about-09.jpg", text: "Community" },
  { image: "/assets/about-gallery/about-10.jpg", text: "Demo day" },
  { image: "/assets/about-gallery/about-11.jpg", text: "UCF" },
];

const bioPoints = [
  {
    label: "Where I am",
    value:
      "Computer science student at UCF with a 4.0 GPA, focused on full-stack products and applied AI.",
  },
  {
    label: "What I build",
    value:
      "Web apps, research tools, and hackathon products that turn messy problems into usable workflows.",
  },
  {
    label: "Where I work",
    value:
      "Knight Hacks software, ISUE Lab speech-feedback research, and CrisisLens, a Hacklytics 2026 first-place project.",
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
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_24%,rgba(47,111,237,0.16),transparent_28rem),radial-gradient(circle_at_82%_18%,rgba(141,183,255,0.11),transparent_28rem)]" />

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <FadeContent blur duration={900} threshold={0.16}>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">
                Biography
              </p>
              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-tight text-white md:text-6xl">
                Building with people, research, and pressure-tested ideas.
              </h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72 md:text-xl md:leading-9">
                I am Aziz Umarov, a UCF computer science student working across
                software engineering, applied AI research, and hackathon-driven
                product building. I like projects where the interface matters as
                much as the model or backend behind it.
              </p>
            </FadeContent>

            <div className="mt-10 grid gap-3">
              {bioPoints.map((detail, index) => (
                <FadeContent
                  key={detail.label}
                  blur
                  duration={850}
                  delay={index * 100}
                  threshold={0.18}
                >
                  <article className="group rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:bg-white/[0.055] md:p-6">
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/42">
                      {detail.label}
                    </p>
                    <p className="mt-3 text-base leading-7 text-white/76 md:text-lg">
                      {detail.value}
                    </p>
                  </article>
                </FadeContent>
              ))}
            </div>
          </div>

          <FadeContent blur duration={1000} delay={120} threshold={0.16}>
            <div className="relative h-[34rem] overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.035] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:h-[42rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(141,183,255,0.16),transparent_24rem)]" />
              <div className="relative h-full overflow-hidden rounded-[1.8rem] bg-[#081a31]/70">
                <CircularGallery
                  items={aboutGalleryItems}
                  bend={2.2}
                  borderRadius={0.075}
                  scrollEase={0.035}
                  scrollSpeed={1.65}
                  textColor="#f8fbff"
                  font="600 28px Geist, sans-serif"
                />
              </div>
            </div>
          </FadeContent>
        </div>
      </section>

      <section className="relative isolate bg-[#061427] px-5 pb-32 sm:px-8 lg:px-10 lg:pb-44">
        <div className="mx-auto max-w-7xl">
          <FadeContent blur duration={850} threshold={0.18}>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">
                  Technical skills
                </p>
                <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-tight text-white md:text-5xl">
                  The tools I reach for when I am building.
                </h2>
              </div>
              <p className="max-w-md text-base leading-7 text-white/60">
                A compact view of the stack behind my projects, research work,
                and team builds.
              </p>
            </div>
          </FadeContent>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {skillGroups.map((group, index) => (
              <FadeContent
                key={group.title}
                blur
                duration={850}
                delay={index * 90}
                threshold={0.16}
              >
                <article className="h-full rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:bg-white/[0.055]">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/42">
                    {group.title}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      >
                        <span className="grid size-6 place-items-center rounded-full bg-white/8 font-mono text-[0.62rem] uppercase text-white">
                          {skill.slice(0, 2)}
                        </span>
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              </FadeContent>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
