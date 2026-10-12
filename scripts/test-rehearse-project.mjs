import assert from "node:assert/strict";
import { statSync } from "node:fs";
import test from "node:test";
import { projects } from "../src/data/projects.ts";

test("Rehearse uses a lightweight architecture cover without implying a live dashboard", () => {
  const project = projects.find(({ title }) => title === "Rehearse");
  assert.ok(project);
  assert.equal(project.image, "/assets/project-previews/rehearse-architecture.webp");
  assert.match(project.imageAlt, /Rehearse recovery architecture/);
  assert.equal(project.previewVideo, undefined, "Do not imply an interactive demo exists");
  assert.equal(project.liveHref, undefined);
  assert.equal(project.githubHref, "https://github.com/azizu06/rehearse");
  assert.match(project.description, /backup-recovery/i);
  assert.match(project.details, /component boundaries/i);
  assert.doesNotMatch(project.details, /live dashboard|end-to-end drill execution|measured recovery time/i);
  assert.doesNotMatch(project.keyFeatures.join(" "), /AWS|Terraform|React report/);
  assert.ok(statSync(new URL(`../public${project.image}`, import.meta.url)).size < 200_000);
});
