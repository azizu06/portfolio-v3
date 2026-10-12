import assert from "node:assert/strict";
import { statSync } from "node:fs";
import test from "node:test";
import { projects } from "../src/data/projects.ts";

test("Rehearse uses a lightweight real interface capture and describes the shipped MVP honestly", () => {
  const project = projects.find(({ title }) => title === "Rehearse");
  assert.ok(project);
  assert.equal(project.image, "/assets/project-previews/rehearse-cover.webp");
  assert.match(project.imageAlt, /Running Rehearse localhost connection screen/);
  assert.equal(project.previewVideo, undefined, "Do not imply an interactive demo exists");
  assert.equal(project.liveHref, undefined);
  assert.equal(project.githubHref, "https://github.com/azizu06/rehearse");
  assert.match(project.description, /in development/i);
  assert.match(project.details, /end-to-end drill workflow is still being integrated/i);
  assert.match(project.details, /connection status/i);
  assert.doesNotMatch(project.keyFeatures.join(" "), /AWS|Terraform|React report/);
  assert.ok(statSync(new URL(`../public${project.image}`, import.meta.url)).size < 200_000);
});
