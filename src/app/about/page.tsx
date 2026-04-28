import FadeContent from "@/components/FadeContent";
import CircularGallery from "@/components/CircularGallery";
import GradientText from "@/components/GradientText";
import { HeroStage } from "@/components/portfolio/hero-stage";
import { profile } from "@/data/profile";

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

        <div className="mx-auto max-w-[96rem]">
          <div className="relative z-10 mx-auto max-w-6xl text-center">
            <FadeContent blur duration={900} threshold={0.16}>
              <h2 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl">
                Welcome to my{" "}
                <span className="bg-gradient-to-r from-[#dbeafe] via-[#8db7ff] to-[#2f6fed] bg-clip-text text-transparent">
                  Portfolio!
                </span>
              </h2>
              <p className="mx-auto mt-9 max-w-6xl text-2xl leading-[1.55] text-white/78 md:text-[2rem] md:leading-[1.55]">
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
                . I am a software developer for{" "}
                <a
                  href="https://knighthacks.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8db7ff] underline decoration-[#8db7ff]/70 underline-offset-4 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
                >
                  Knight Hacks
                </a>
                , a computer science student community at UCF. Being involved
                there lets me build with like-minded students, support the
                campus tech community, and stay close to people who care about
                making things. I am also a hackathon enthusiast; I love
                competing, building under pressure, and working alongside people
                who care about turning ideas into real products. I also
                contribute to Ph.D. student-led
                AI-assisted speech feedback research at{" "}
                <a
                  href="https://www.isuelab.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8db7ff] underline decoration-[#8db7ff]/70 underline-offset-4 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
                >
                  ISUE Lab
                </a>
                , working with LLMs and machine learning.
              </p>
            </FadeContent>
          </div>

          <FadeContent blur duration={1000} delay={120} threshold={0.16}>
            <div className="relative -mx-5 mt-20 h-[28rem] sm:-mx-8 md:h-[34rem] lg:-mx-10 lg:h-[40rem] xl:-mx-16 xl:h-[44rem]">
              <CircularGallery
                items={aboutGalleryItems}
                bend={0.9}
                borderRadius={0.055}
                scrollEase={0.03}
                scrollSpeed={1.35}
                textColor="#f8fbff"
                font="600 30px Geist, sans-serif"
              />
            </div>
          </FadeContent>
        </div>
      </section>

      <section className="relative isolate bg-[#061427] px-5 pb-32 pt-6 sm:px-8 lg:px-10 lg:pb-44">
        <div className="mx-auto max-w-7xl text-center">
          <FadeContent blur duration={900} threshold={0.16}>
            <div className="inline-flex w-fit flex-col items-center">
              <GradientText
                colors={["#eaf2ff", "#8db7ff", "#2f6fed", "#dbeafe"]}
                animationSpeed={9}
                direction="horizontal"
                className="w-fit text-center text-5xl font-semibold leading-none tracking-tight md:text-7xl"
              >
                Skills
              </GradientText>
              <span className="mt-2 h-[2px] w-full rounded-full bg-gradient-to-r from-[#eaf2ff] via-[#8db7ff] to-[#2f6fed] opacity-85" />
            </div>
          </FadeContent>
        </div>
      </section>
    </main>
  );
}
