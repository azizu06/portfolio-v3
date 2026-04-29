import type { Metadata } from "next";
import { HomeModelStage } from "@/components/portfolio/home-model-stage";

export const metadata: Metadata = {
  title: {
    absolute: "Home | Aziz Umarov",
  },
};

export default function Home() {
  return <HomeModelStage />;
}
