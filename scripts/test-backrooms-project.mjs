import assert from "node:assert/strict";
import { statSync } from "node:fs";
import test from "node:test";
import { projects } from "../src/data/projects.ts";

test("Backrooms is the newest standalone project with sourced links and no award claim", () => {
  const project = projects.find(({ title }) => title === "Backrooms");
  assert.ok(project, "Backrooms must appear in the project catalog");
  assert.equal(projects[0], project);
  assert.equal(projects[1].title, "Farsight");
  assert.equal(project.date, "Cal Hacks 13.0");
  assert.equal(project.sortDate, "October 25, 2026");
  assert.equal(project.category, "Hackathon");
  assert.equal(project.githubHref, "https://github.com/azizu06/backrooms");
  assert.equal(project.devpostHref, "https://devpost.com/software/backrooms-h4o783");
  assert.equal(project.award, undefined, "Cal Hacks 13.0 winners are not announced");
  assert.equal(project.liveHref, undefined);
  assert.equal(project.keyFeatures.length, 4);
  assert.ok(project.technologies.length <= 11);
  assert.doesNotMatch(JSON.stringify(project), /[–—]|Farsight|winner|1st place/i);
  const mediaBytes = [project.image, project.previewVideo].reduce(
    (sum, path) => sum + statSync(new URL(`../public${path}`, import.meta.url)).size,
    0,
  );
  assert.ok(mediaBytes < 3_000_000, "Preview and poster must stay under 3 MB");
});
