import { PageShell } from "@/components/portfolio/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { skillGroups } from "@/data/skills";

export default function SkillsPage() {
  return (
    <PageShell eyebrow="Stack" title="Skills">
      <div className="mt-14 grid grid-flow-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
        {skillGroups.map((group, index) => (
          <Card
            key={group.title}
            className={`rounded-[1.25rem] border-ice/10 bg-navy/72 shadow-[0_18px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl ${
              index === 0 || index === 2 ? "lg:col-span-7" : "lg:col-span-5"
            }`}
          >
            <CardContent className="p-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-ice/44">
                {group.title}
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="h-8 rounded-full border-ice/12 bg-ice/6 px-3 text-ice/78"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
