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

export default function AboutPage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden bg-deep-navy text-ice">
      <HeroStage name={profile.name} />
      <section
        id="about-more"
        className="relative isolate scroll-mt-0 bg-[#061427] px-5 py-28 sm:px-8 lg:px-10 lg:py-40"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ice/18 to-transparent" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_24%,rgba(47,111,237,0.16),transparent_28rem),radial-gradient(circle_at_82%_18%,rgba(141,183,255,0.11),transparent_28rem)]" />

        <div className="mx-auto grid max-w-[96rem] gap-12 lg:grid-cols-[minmax(28rem,0.8fr)_minmax(0,1.45fr)] lg:items-center xl:gap-16">
          <div className="relative z-10 max-w-3xl">
            <FadeContent blur duration={900} threshold={0.16}>
              <h2 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl">
                Welcome to my{" "}
                <span className="bg-gradient-to-r from-[#dbeafe] via-[#8db7ff] to-[#2f6fed] bg-clip-text text-transparent">
                  Portfolio!
                </span>
              </h2>
              <p className="mt-9 text-2xl leading-[1.55] text-white/78 md:text-[2rem] md:leading-[1.55]">
                My name is Aziz Umarov, and I am a software engineer and
                computer science student at the{" "}
                <a
                  href="https://www.ucf.edu/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8db7ff] underline decoration-[#8db7ff]/70 underline-offset-4 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
                >
                  University of Central Florida
                </a>
                . I work as a software developer for{" "}
                <a
                  href="https://knighthacks.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8db7ff] underline decoration-[#8db7ff]/70 underline-offset-4 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
                >
                  Knight Hacks
                </a>
                , contribute to AI-assisted speech feedback research at ISUE
                Lab, and build products at hackathons. My recent work includes
                CrisisLens, a Hacklytics 2026 first-place project built around
                crisis analysis workflows.
              </p>
            </FadeContent>
          </div>

          <FadeContent blur duration={1000} delay={120} threshold={0.16}>
            <div className="relative h-[34rem] md:h-[48rem] lg:h-[58rem] xl:-mr-28 xl:h-[64rem]">
              <CircularGallery
                items={aboutGalleryItems}
                bend={1.65}
                borderRadius={0.055}
                scrollEase={0.032}
                scrollSpeed={1.55}
                textColor="#f8fbff"
                font="600 30px Geist, sans-serif"
              />
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
