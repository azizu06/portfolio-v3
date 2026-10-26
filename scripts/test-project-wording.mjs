import assert from "node:assert/strict";
import test from "node:test";
import { projects } from "../src/data/projects.ts";
import { experiences } from "../src/data/experience.ts";
import { skillGroups } from "../src/data/skills.ts";

// Portfolio copy describes real systems. Words that make the work read as fake,
// test-only, or unfinished belong in repository docs, not on the site or in the
// voice guide built from this data.
const UNREAL_WORDING =
  /\b(planted|mock(?:ed|s)?|seeded|hard-coded|synthetic|sandbox(?:ed|es)?|testnet|fake|dummy|toy|demo|proof of concept|test data|prototype|experimental|not validated|has not been validated|not production)\b/i;
// "software-in-the-loop simulation" names a real simulator and stays allowed.
const SIMULATED_WORDING = /\bsimulat(?:ed|ion|ions|or)\b/i;
const ALLOWED_SIMULATION = /software-in-the-loop simulation/gi;
const STAGED_WORDING = /\bstaged\b(?! (?:rollout|release|deploy))/i;

const sources = [
  ...projects.map((project) => [`project ${project.title}`, project]),
  ...experiences.map((experience, index) => [`experience ${index}`, experience]),
  ["skills", skillGroups],
];

test("portfolio copy never frames the work as fake or test-only", () => {
  for (const [label, value] of sources) {
    const text = JSON.stringify(value);
    assert.doesNotMatch(text, UNREAL_WORDING, `${label} uses self-undermining wording`);
    assert.doesNotMatch(text, STAGED_WORDING, `${label} uses "staged"`);
    assert.doesNotMatch(
      text.replace(ALLOWED_SIMULATION, ""),
      SIMULATED_WORDING,
      `${label} calls its work simulated`,
    );
  }
});
