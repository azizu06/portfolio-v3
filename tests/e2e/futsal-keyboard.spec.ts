import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

type DebugState = {
  playerPosition: { x: number; z: number };
  cameraForward: { x: number; z: number };
};

declare global {
  interface Window {
    __futsalRuntime?: {
      getDebugState: () => DebugState;
    };
  }
}

const getDebugState = async (page: Page): Promise<DebugState> => {
  const state = await page.evaluate(() => window.__futsalRuntime?.getDebugState());
  if (!state) {
    throw new Error("Futsal runtime debug state is unavailable.");
  }
  return state;
};

const movementAlong = (from: DebugState, to: DebugState, direction: { x: number; z: number }) => {
  const dx = to.playerPosition.x - from.playerPosition.x;
  const dz = to.playerPosition.z - from.playerPosition.z;
  return dx * direction.x + dz * direction.z;
};

test("keyboard movement follows the current camera direction", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(window.__futsalRuntime));
  await page.waitForTimeout(1_000);

  const initial = await getDebugState(page);

  await page.keyboard.down("ArrowUp");
  await page.waitForTimeout(900);
  await page.keyboard.up("ArrowUp");

  const afterForward = await getDebugState(page);
  expect(movementAlong(initial, afterForward, initial.cameraForward)).toBeGreaterThan(0.55);

  await page.keyboard.down("ArrowDown");
  await page.waitForTimeout(900);
  await page.keyboard.up("ArrowDown");

  const afterBackward = await getDebugState(page);
  expect(movementAlong(afterForward, afterBackward, afterForward.cameraForward)).toBeLessThan(-0.55);
});

test("keyboard movement remains camera-relative after orbit rotation", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(window.__futsalRuntime));
  await page.waitForTimeout(1_000);

  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();

  await page.mouse.move(box!.x + box!.width * 0.55, box!.y + box!.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * 0.25, box!.y + box!.height * 0.5, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(500);

  const beforeMove = await getDebugState(page);

  await page.keyboard.down("ArrowUp");
  await page.waitForTimeout(900);
  await page.keyboard.up("ArrowUp");

  const afterMove = await getDebugState(page);
  expect(movementAlong(beforeMove, afterMove, beforeMove.cameraForward)).toBeGreaterThan(0.55);
});
