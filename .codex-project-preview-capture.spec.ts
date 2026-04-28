import { test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";

const outputDir = "public/assets/project-previews";
const viewport = { width: 1440, height: 810 };
const captureMs = 10_000;

type ProjectCapture = {
  slug: string;
  url: string;
  captureMs?: number;
  init?: (page: Page) => Promise<void>;
  prepare?: (page: Page) => Promise<void>;
  action: (page: Page, durationMs: number) => Promise<void>;
  showCursor?: boolean;
};

const ignore = async (action: () => Promise<unknown>) => {
  await action().catch(() => {});
};

const moveInArc = async (
  page: Page,
  fromX: number,
  fromY: number,
  width: number,
  height: number,
  steps = 22,
) => {
  for (let index = 0; index < steps; index += 1) {
    const t = index / Math.max(steps - 1, 1);
    await page.mouse.move(
      fromX + width * t,
      fromY + Math.sin(t * Math.PI * 2) * height,
    );
    await page.waitForTimeout(34);
  }
};

const runFor = async (
  page: Page,
  durationMs: number,
  step: (iteration: number) => Promise<void>,
) => {
  const deadline = Date.now() + durationMs;
  let iteration = 0;

  while (Date.now() < deadline) {
    await step(iteration);
    iteration += 1;
  }
};

const clickAtGridPoint = async (
  page: Page,
  selector: string,
  col: number,
  row: number,
  cols = 10,
  rows = 10,
) => {
  const box = await page.locator(selector).first().boundingBox().catch(() => null);

  if (!box) {
    return;
  }

  await page.mouse.click(
    box.x + box.width * ((col + 0.5) / cols),
    box.y + box.height * ((row + 0.5) / rows),
  );
};

const installPreviewCursor = async (page: Page) => {
  await page.evaluate(() => {
    const existing = document.getElementById("codex-preview-cursor");
    existing?.remove();

    const cursor = document.createElement("div");
    cursor.id = "codex-preview-cursor";
    cursor.innerHTML = `
      <svg width="30" height="34" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M3 3L3.6 28.1L10.7 20.9L15.4 31.2L20.2 29L15.5 18.9H26.1L3 3Z" fill="white" stroke="#071225" stroke-width="2.2" stroke-linejoin="round"/>
      </svg>
    `;
    cursor.style.position = "fixed";
    cursor.style.left = "0";
    cursor.style.top = "0";
    cursor.style.width = "30px";
    cursor.style.height = "34px";
    cursor.style.filter = "drop-shadow(0 5px 9px rgba(0,0,0,0.55)) drop-shadow(0 0 4px rgba(141,183,255,0.45))";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "2147483647";
    cursor.style.transform = "translate3d(-50px, -50px, 0)";
    cursor.style.transition = "transform 90ms cubic-bezier(0.32, 0.72, 0, 1), opacity 160ms ease";
    cursor.style.opacity = "0";
    document.body.append(cursor);

    const moveCursor = (event: MouseEvent) => {
      cursor.style.opacity = "1";
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    const pulseCursor = (event: MouseEvent) => {
      moveCursor(event);
      cursor.animate(
        [
          {
            transform: `translate3d(${event.clientX}px, ${event.clientY}px, 0) scale(1)`,
          },
          {
            transform: `translate3d(${event.clientX}px, ${event.clientY}px, 0) scale(0.9)`,
          },
          {
            transform: `translate3d(${event.clientX}px, ${event.clientY}px, 0) scale(1)`,
          },
        ],
        { duration: 180, easing: "cubic-bezier(0.32, 0.72, 0, 1)" },
      );
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mousedown", pulseCursor, { passive: true });
  });
};

const projects: ProjectCapture[] = [
  {
    slug: "crisislens",
    url: "https://crisis-lens-v2-web.vercel.app/dashboard",
    prepare: async (page) => {
      await page.mouse.click(1368, 36);
      await page.waitForTimeout(900);
    },
    action: async (page, durationMs) => {
      const dragGlobe = async (
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        steps = 28,
      ) => {
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        for (let index = 0; index <= steps; index += 1) {
          const t = index / steps;
          await page.mouse.move(
            startX + (endX - startX) * t,
            startY + (endY - startY) * t + Math.sin(t * Math.PI) * 34,
          );
          await page.waitForTimeout(22);
        }
        await page.mouse.up();
      };

      const click = async (x: number, y: number, wait = 220) => {
        await page.mouse.click(x, y);
        await page.waitForTimeout(wait);
      };

      const typeCountry = async (country: string) => {
        await page.mouse.click(1158, 176);
        await page.keyboard.press("Meta+A").catch(() => {});
        await page.keyboard.press("Control+A").catch(() => {});
        await page.keyboard.type(country, { delay: 36 });
        await page.waitForTimeout(180);
        await page.mouse.click(1382, 176);
        await page.waitForTimeout(480);
      };

      const startedAt = Date.now();

      await dragGlobe(760, 390, 470, 335, 34);
      await click(1087, 250, 300);
      await click(612, 350, 280);
      await dragGlobe(500, 420, 820, 365, 34);
      await click(1087, 286, 300);
      await click(1118, 584, 300);
      await click(1295, 286, 300);
      await dragGlobe(820, 335, 540, 455, 34);
      await click(1215, 584, 300);
      await click(1086, 322, 300);
      await typeCountry("Sudan");
      await click(1019, 584, 240);
      await dragGlobe(560, 350, 820, 390, 34);
      await click(645, 320, 220);
      await page.waitForTimeout(Math.max(0, durationMs - (Date.now() - startedAt)));
    },
  },
  {
    slug: "finbridge",
    url: "https://d34qgf2s4sj5t3.cloudfront.net/dashboard",
    prepare: async (page) => {
      await ignore(() => page.locator("textarea, input").first().fill(""));
    },
    action: async (page, durationMs) => {
      const prompts = [
        "Explain this month's grocery spending in simple terms",
        "Show the biggest budget change this week",
        "Translate this finance insight into Arabic",
      ];

      await runFor(page, durationMs, async (iteration) => {
        const input = page.locator("textarea, input").first();
        await ignore(() => input.fill(prompts[iteration % prompts.length]));
        await page.keyboard.press("Enter").catch(() => {});
        await page.waitForTimeout(520);
        await page.mouse.wheel(0, iteration % 2 === 0 ? 180 : -120);
        await moveInArc(page, 520, 260, 480, 70, 10);
      });
    },
  },
  {
    slug: "inventory-app",
    url: "https://inventory-app-rho-ivory.vercel.app/products",
    action: async (page, durationMs) => {
      const terms = ["monitor", "desk", "chair", "laptop"];

      await runFor(page, durationMs, async (iteration) => {
        await ignore(() => page.locator('input[name="search"]').fill(terms[iteration % terms.length]));
        await ignore(() => page.getByText(/apply filters/i).click({ timeout: 1200 }));
        await page.waitForTimeout(350);
        await ignore(() => page.locator(".product-card").nth(iteration % 4).hover({ timeout: 1200 }));
        await page.mouse.wheel(0, iteration % 2 === 0 ? 260 : -230);
        await page.waitForTimeout(220);
      });
    },
  },
  {
    slug: "message-board",
    url: "https://message-board-six-sigma.vercel.app/",
    prepare: async (page) => {
      await ignore(() => page.locator("a[href^='/msgs/']").first().click({ timeout: 2500 }));
      await page.waitForTimeout(400);
    },
    action: async (page, durationMs) => {
      await runFor(page, durationMs, async (iteration) => {
        await moveInArc(page, 390, 235, 620, 60, 14);
        await page.mouse.wheel(0, iteration % 2 === 0 ? 220 : -180);
        await page.waitForTimeout(250);
        await ignore(() => page.getByRole("link").nth(iteration % 3).hover({ timeout: 800 }));
      });
    },
  },
  {
    slug: "shopping-cart",
    url: "https://shopping-cart-iota-woad.vercel.app/shop",
    action: async (page, durationMs) => {
      await runFor(page, durationMs, async (iteration) => {
        await ignore(() => page.getByRole("button", { name: /\+/ }).first().click({ timeout: 1200 }));
        await page.waitForTimeout(200);
        await ignore(() => page.getByRole("button", { name: /add|cart/i }).nth(iteration % 3).click({ timeout: 1600 }));
        await page.waitForTimeout(260);
        await page.mouse.wheel(0, iteration % 2 === 0 ? 360 : -300);
        await ignore(() => page.getByRole("link", { name: /cart|checkout/i }).first().hover({ timeout: 1000 }));
        await page.waitForTimeout(160);
      });
    },
  },
  {
    slug: "memory-card",
    url: "https://memory-card-eight-sepia.vercel.app",
    action: async (page, durationMs) => {
      await runFor(page, durationMs, async (iteration) => {
        await ignore(() => page.locator("button, [role='button'], .group").nth((iteration % 8) + 1).click({ timeout: 1400 }));
        await page.waitForTimeout(360);
        await ignore(() => page.locator("button, [role='button'], .group").nth(((iteration + 3) % 8) + 1).click({ timeout: 1400 }));
        await moveInArc(page, 460, 260, 520, 110, 8);
      });
    },
  },
  {
    slug: "resume-builder",
    url: "https://resume-builder-ashy-tau.vercel.app",
    prepare: async (page) => {
      await ignore(() => page.getByRole("button").nth(1).click({ timeout: 1800 }));
    },
    action: async (page, durationMs) => {
      const values = ["Aziz U", "Software Developer", "UCF Computer Science", "React dashboards"];

      await runFor(page, durationMs, async (iteration) => {
        await ignore(() => page.locator("input").nth(iteration % 4).fill(values[iteration % values.length]));
        await page.waitForTimeout(320);
        await page.mouse.wheel(0, iteration % 2 === 0 ? 240 : -210);
        await moveInArc(page, 380, 285, 690, 60, 8);
      });
    },
  },
  {
    slug: "battleship",
    url: "https://battleship-one-sandy.vercel.app/",
    prepare: async (page) => {
      await ignore(() => page.getByRole("button", { name: /random/i }).click({ timeout: 2500 }));
      await ignore(() => page.getByRole("button", { name: /start/i }).click({ timeout: 2500 }));
      await page.waitForTimeout(400);
    },
    action: async (page, durationMs) => {
      const shots = [
        [3, 2],
        [5, 4],
        [7, 3],
        [1, 8],
        [8, 7],
        [4, 6],
        [6, 1],
        [2, 5],
      ];

      await runFor(page, durationMs, async (iteration) => {
        const [col, row] = shots[iteration % shots.length];
        await clickAtGridPoint(page, ".grid2", col, row);
        await page.waitForTimeout(520);
        await moveInArc(page, 800, 220, 300, 45, 8);
      });
    },
  },
  {
    slug: "todo-list",
    url: "https://todo-list-nine-sooty-39.vercel.app/",
    prepare: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem(
          "projects",
          JSON.stringify([
            {
              id: "portfolio-project",
              name: "Portfolio Launch",
              active: true,
              project: [
                {
                  id: "preview-task",
                  title: "Capture feature videos",
                  description: "Replace landing-page thumbnails with real app workflow previews.",
                  dueDate: "2026-05-04",
                  priority: "High",
                  status: false,
                },
                {
                  id: "copy-task",
                  title: "Normalize project copy",
                  description: "Keep every project card stable with equal-length descriptions.",
                  dueDate: "2026-05-06",
                  priority: "Medium",
                  status: true,
                },
              ],
            },
          ]),
        );
      });
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
    },
    action: async (page, durationMs) => {
      await runFor(page, durationMs, async (iteration) => {
        await ignore(() => page.locator(".todo").nth(iteration % 2).click({ timeout: 1200 }));
        await page.waitForTimeout(300);
        await ignore(() => page.locator(".todo .icon").nth(iteration % 2).click({ timeout: 1200 }));
        await page.waitForTimeout(260);
        await page.mouse.wheel(0, iteration % 2 === 0 ? 180 : -160);
      });
    },
  },
  {
    slug: "tic-tac-toe",
    url: "https://tic-tac-toe-alpha-ruddy-38.vercel.app/",
    prepare: async (page) => {
      await ignore(() => page.locator(".player1").fill("Aziz"));
      await ignore(() => page.locator(".player2").fill("Opponent"));
      await ignore(() => page.locator(".form").evaluate((form: HTMLFormElement) => form.requestSubmit()));
      await page.waitForTimeout(400);
    },
    action: async (page, durationMs) => {
      const cells = ["0", "4", "8", "2", "6", "1", "3", "5"];

      await runFor(page, durationMs, async (iteration) => {
        await ignore(() => page.locator(`.cell[data-index="${cells[iteration % cells.length]}"]`).click({ timeout: 1200 }));
        await page.waitForTimeout(540);
        await moveInArc(page, 500, 230, 420, 50, 8);
      });
    },
  },
  {
    slug: "weather",
    url: "https://weather-eight-umber.vercel.app/",
    action: async (page, durationMs) => {
      const cities = ["London", "Orlando", "Tokyo", "Dubai"];

      await runFor(page, durationMs, async (iteration) => {
        await ignore(() => page.locator("input").first().fill(cities[iteration % cities.length]));
        await page.keyboard.press("Enter").catch(() => {});
        await ignore(() => page.getByRole("button").first().click({ timeout: 1200 }));
        await page.waitForTimeout(780);
        await page.mouse.wheel(0, iteration % 2 === 0 ? 200 : -180);
      });
    },
  },
  {
    slug: "restaurant",
    url: "https://restaurant-two-plum.vercel.app/",
    prepare: async (page) => {
      await ignore(() => page.getByText(/menu/i).first().click({ timeout: 2500 }));
      await page.waitForTimeout(400);
    },
    action: async (page, durationMs) => {
      await runFor(page, durationMs, async (iteration) => {
        await page.mouse.wheel(0, iteration % 2 === 0 ? 360 : -300);
        await page.waitForTimeout(260);
        await ignore(() => page.getByText(/home|menu|contact/i).nth(iteration % 3).hover({ timeout: 900 }));
        await moveInArc(page, 430, 250, 580, 80, 8);
      });
    },
  },
  {
    slug: "library",
    url: "https://library-flame-ten.vercel.app/",
    prepare: async (page) => {
      await ignore(() => page.getByRole("button", { name: /add|new/i }).first().click({ timeout: 2500 }));
    },
    action: async (page, durationMs) => {
      const titles = ["Design Systems", "Readable Code", "Data Products"];
      const authors = ["Aziz U", "Sarah Drasner", "Andy Hunt"];

      await runFor(page, durationMs, async (iteration) => {
        await ignore(() => page.locator("input").nth(0).fill(titles[iteration % titles.length]));
        await ignore(() => page.locator("input").nth(1).fill(authors[iteration % authors.length]));
        await page.waitForTimeout(420);
        await ignore(() => page.locator("button, input[type='checkbox']").nth((iteration % 3) + 1).click({ timeout: 1000 }));
        await moveInArc(page, 465, 235, 450, 75, 8);
      });
    },
  },
  {
    slug: "sign-up",
    url: "https://sign-up-one-liart.vercel.app/",
    action: async (page, durationMs) => {
      const values = ["Aziz", "U", "aziz@example.com", "SecurePass42", "SecurePass42"];

      await runFor(page, durationMs, async (iteration) => {
        const field = page.locator("input").nth(iteration % values.length);
        await ignore(() => field.fill(values[iteration % values.length]));
        await page.waitForTimeout(300);
        await ignore(() => field.press("Tab"));
        await moveInArc(page, 430, 230, 430, 55, 6);
      });
    },
  },
  {
    slug: "admin-dashboard",
    url: "https://admin-dash-xi.vercel.app/",
    action: async (page, durationMs) => {
      await runFor(page, durationMs, async (iteration) => {
        await page.mouse.wheel(0, iteration % 2 === 0 ? 300 : -260);
        await page.waitForTimeout(250);
        await ignore(() => page.locator("a, button, .card, .project").nth(iteration % 8).hover({ timeout: 900 }));
        await moveInArc(page, 360, 245, 720, 70, 9);
      });
    },
  },
  {
    slug: "calculator",
    url: "https://calculator-chi-three-10.vercel.app/",
    action: async (page, durationMs) => {
      const keys = ["7", "+", "8", "=", "C", "9", "-", "4", "=", "C", "6", "x", "3", "="];

      await runFor(page, durationMs, async (iteration) => {
        const label = keys[iteration % keys.length];
        await ignore(() => page.getByRole("button", { name: label }).click({ timeout: 1200 }));
        await ignore(() => page.getByText(label, { exact: true }).click({ timeout: 1200 }));
        await page.waitForTimeout(260);
      });
    },
  },
  {
    slug: "etch-a-sketch",
    url: "https://etch-a-sketch-chi-azure.vercel.app/",
    prepare: async (page) => {
      await ignore(() =>
        page.locator(".gridPicker").evaluate((input: HTMLInputElement) => {
          input.value = "32";
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }),
      );
      await ignore(() => page.getByRole("button", { name: /^color$/i }).click({ timeout: 2000 }));
    },
    action: async (page, durationMs) => {
      await runFor(page, durationMs, async (iteration) => {
        const box = await page.locator(".canvas").first().boundingBox().catch(() => null);

        if (box) {
          for (let index = 0; index < 18; index += 1) {
            const t = index / 17;
            await page.mouse.move(
              box.x + box.width * (0.18 + 0.58 * t),
              box.y + box.height * (0.2 + 0.52 * ((Math.sin(t * Math.PI * 2 + iteration) + 1) / 2)),
            );
            await page.waitForTimeout(26);
          }
        }

        await page.waitForTimeout(80);
      });
    },
  },
  {
    slug: "rock-paper-scissors",
    url: "https://rock-paper-scissors-jet-mu.vercel.app/",
    captureMs: 18_000,
    init: async (page) => {
      await page.addInitScript(() => {
        const choices = [0.82, 0.5, 0.82, 0.12, 0.5, 0.5, 0.5, 0.12];
        let index = 0;
        Math.random = () => choices[index++ % choices.length];
      });
    },
    action: async (page, durationMs) => {
      const startedAt = Date.now();
      const rounds = ["rock", "paper", "scissors", "paper", "scissors", "rock", "scissors", "paper"];

      for (const choice of rounds) {
        const button = page.locator(".playerButton").filter({ hasText: choice });
        const box = await button.boundingBox().catch(() => null);

        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.waitForTimeout(260);
        }

        await button.click({ timeout: 1400 });
        await page.waitForTimeout(850);
        await moveInArc(page, 382, 285, 630, 38, 9);
      }

      await page.waitForTimeout(Math.max(0, durationMs - (Date.now() - startedAt)));
    },
  },
];

test("capture project previews", async ({ browser }) => {
  mkdirSync(outputDir, { recursive: true });

  const selectedProjectSlug = process.env.PROJECT_SLUG;
  const selectedProjects = selectedProjectSlug
    ? projects.filter((project) => project.slug === selectedProjectSlug)
    : projects;

  if (selectedProjectSlug && selectedProjects.length === 0) {
    throw new Error(`No project capture found for ${selectedProjectSlug}`);
  }

  for (const project of selectedProjects) {
    const context = await browser.newContext({
      viewport,
      recordVideo: {
        dir: outputDir,
        size: viewport,
      },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);

    await project.init?.(page).catch(() => {});
    await page.goto(project.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
    await project.prepare?.(page).catch(() => {});
    await page.screenshot({
      path: `${outputDir}/${project.slug}.png`,
      fullPage: false,
      animations: "disabled",
    });
    if (project.showCursor !== false) {
      await installPreviewCursor(page).catch(() => {});
    }
    await project.action(page, project.captureMs ?? captureMs).catch(() => {});
    const video = page.video();
    await page.close();
    await context.close();
    if (video) {
      await video.saveAs(`${outputDir}/${project.slug}-raw.webm`);
      await video.delete().catch(() => {});
    }
  }
});
