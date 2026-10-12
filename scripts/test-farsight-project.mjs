import assert from "node:assert/strict";
import { statSync } from "node:fs";
import test from "node:test";
import { projects } from "../src/data/projects.ts";

test("Farsight is the newest standalone project with accurate awards and submission links", () => {
  const project = projects.find(({ title }) => title === "Farsight");
  assert.ok(project, "Farsight must appear in the project catalog");
  assert.equal(projects[0], project);
  assert.equal(projects[1].title, "PIP");
  assert.equal(project.date, "KnightHacks IX");
  assert.equal(project.sortDate, "October 2026");
  assert.equal(project.category, "Hackathon");
  assert.equal(project.devpostHref, "https://devpost.com/software/farsight-t4qyli");
  assert.equal(project.githubHref, "https://github.com/azizu06/farsight");
  assert.equal(project.awardBadge, "Won 4 tracks");
  for (const sponsor of ["Hugging Face", "NVIDIA", "Encompass", "Full Sail"]) {
    assert.ok(project.award.includes(sponsor));
  }
  assert.equal(project.keyFeatures.length, 4);
  assert.ok(project.technologies.length <= 11);
  assert.doesNotMatch(JSON.stringify(project), /\bPIP\b|1st place|zero collisions/i);
  assert.match(project.details, /I owned rover-side integration/);
  assert.match(project.details, /not validated for emergency response/);
  const mediaBytes = [project.image, project.previewVideo].reduce(
    (sum, path) => sum + statSync(new URL(`../public${path}`, import.meta.url)).size,
    0,
  );
  assert.ok(mediaBytes < 3_000_000, "Preview and poster must stay under 3 MB");
});
