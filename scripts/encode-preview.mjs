import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Encode timestamped Chrome captures; omit time spent between recording segments.
const [directory, output] = process.argv.slice(2);
if (!directory || !output) throw new Error("Usage: node scripts/encode-preview.mjs <capture-directory> <output.mp4>");
const frames = JSON.parse(readFileSync(`${directory}/frames.json`, "utf8"));
const playlist = frames.map((frame, index) => {
  const duration = Math.min(0.25, Math.max(1 / 30, (frames[index + 1]?.time ?? frame.time + 0.1) - frame.time));
  return `file 'file:${frame.path.replaceAll("'", "'\\''")}'\nduration ${duration}`;
}).join("\n");
const result = spawnSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-protocol_whitelist", "file,pipe", "-f", "concat", "-safe", "0", "-i", "pipe:0", "-vf", "fps=30,scale=1280:800", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", output], { input: playlist, encoding: "utf8" });
if (result.status !== 0) throw new Error(result.stderr || "Video encoding failed");
console.log(`Encoded ${frames.length} browser frames to ${output}`);
