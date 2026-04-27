import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { skillGroups } from "@/data/skills";
import { SectionHeading } from "./section-heading";

export function SkillsSection() {
  return (
    <section id="skills" className="court-section px-5 py-24 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionHeading
          eyebrow="Poster wall"
          title="The toolkit shows up like posters around the court."
          description="Grouped by how the tools actually support research-backed, product-minded web work."
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.08}>
              <Card className="court-section-card h-full rounded-[1.35rem]">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{group.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-lime-200/10 text-lime-50">
                      {skill}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
