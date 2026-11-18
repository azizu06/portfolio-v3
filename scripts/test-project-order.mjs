import assert from "node:assert/strict";
import test from "node:test";
import { openSourceTools, projects } from "../src/data/projects.ts";

test("project list keeps its live order", () => {
  assert.deepEqual(
    projects.map(({ title }) => title),
    ["Backrooms", "Farsight", "PIP", "SnapList", "Rehearse", "Shields.io", "CrisisLens", "CapCheck", "FinBridge"],
  );
});

test("CrisisLens names its Databricks Challenge win and links its Devpost page", () => {
  const project = projects.find(({ title }) => title === "CrisisLens");
  assert.equal(project.award, "the Databricks Challenge at Georgia Tech's Hacklytics, out of 234 projects");
  assert.match(project.details, /won the Databricks Challenge at Georgia Tech's Hacklytics 2026, out of 234 projects/);
  assert.equal(project.devpostHref, "https://devpost.com/software/crisislens-rlebdw");
  assert.doesNotMatch(JSON.stringify(project), /1st place|first place/i);
});

test("open-source tools list the two public repos", () => {
  assert.deepEqual(
    openSourceTools.map(({ href }) => href),
    [
      "https://github.com/azizu06/ai-coding-interview-practice",
      "https://github.com/azizu06/hackathon-agent-board",
    ],
  );
  assert.doesNotMatch(JSON.stringify(openSourceTools), /[–—]|job-agent/);
});
