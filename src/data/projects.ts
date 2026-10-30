export type Project = {
  title: string;
  date: string;
  sortDate?: string;
  image?: string;
  imageAlt?: string;
  previewVideo?: string;
  description: string;
  details?: string;
  keyFeatures?: string[];
  technologies: string[];
  githubHref?: string;
  liveHref?: string;
  devpostHref?: string;
  award?: string;
  category: string;
};

export const projects: Project[] = [
  {
    title: "Backrooms",
    date: "Cal Hacks 13.0",
    sortDate: "October 25, 2026",
    image: "/assets/project-previews/backrooms.jpg",
    imageAlt: "Backrooms 3D office with labeled finance agents passing invoice cases between desks",
    previewVideo: "/assets/project-previews/backrooms.mp4",
    description:
      "Agentic back office where Claude agents hand finance work to each other.",
    details:
      "Each Claude agent owns one finance job, from reading invoices and paying vendors to calling clients about overdue invoices through a Cartesia voice agent, and the agents hand work to each other through the Claude Agent SDK. Every money decision goes through our TypeScript policy engine, and anything outside the rules waits for the owner to approve it with a passkey. Most of the model work runs locally on an NVIDIA Grace Blackwell GX10. My team of four built it at Cal Hacks 13.0, where it won a Hyphenate sponsor track prize, and I worked across the whole stack.",
    keyFeatures: [
      "Claude Agent SDK agents each own a finance function and pass checked handoffs through one dispatcher in a live 3D office.",
      "Collections calls clients through a Cartesia voice agent, with each tool call checked on the server.",
      "A 28-rule policy engine blocked 100% of 320 attack cases and holds risky payments for passkey approval.",
      "99% of model work runs on a local NVIDIA Grace Blackwell GX10, reading invoices 3x faster at 99.7% accuracy.",
    ],
    technologies: [
      "TypeScript",
      "Next.js",
      "React Three Fiber",
      "Three.js",
      "Claude Agent SDK",
      "SpacetimeDB",
      "Cartesia",
      "WebAuthn",
      "NVIDIA Grace Blackwell GX10",
      "Coinbase x402",
    ],
    githubHref: "https://github.com/azizu06/backrooms",
    devpostHref: "https://devpost.com/software/backrooms-h4o783",
    award: "a Hyphenate sponsor track prize",
    category: "Hackathon",
  },
  {
    title: "Farsight",
    date: "KnightHacks IX",
    sortDate: "October 2026",
    image: "/assets/project-previews/farsight.jpg",
    previewVideo: "/assets/project-previews/farsight.mp4",
    description:
      "VR-controlled rover with on-device person detection and spoken answers, plus a post-run 3D room walkthrough with face sightings.",
    details:
      "Farsight is a search-and-rescue rover that an operator drives from a Meta Quest headset, and after each run it rebuilds the room in 3D for review. I owned rover-side integration, connecting Quest driving and local voice AI to the Jetson's camera perception and the automatic post-run room build. I also wired and mounted the hardware and tested it on the floor. Our team won sponsor tracks from Hugging Face, NVIDIA, Encompass and Full Sail. From the headset, the operator can switch the rover into autonomous Explore mode and press one button to stop it and take back manual control.",
    keyFeatures: [
      "Meta Quest driving through WebXR, with onboard person detection and operator stop controls.",
      "Local Whisper, Qwen3-VL and Piper voice pipeline for camera questions and English/Spanish survivor phrases.",
      "Rover-mounted iPhone RGB, LiDAR depth and ARKit poses feed an automatic post-run Brush room reconstruction on the Mac.",
      "Browser walkthrough with face sightings linked to source photos, plus a separate Quest splat viewer.",
    ],
    technologies: [
      "Python",
      "TypeScript",
      "WebXR",
      "NVIDIA Jetson",
      "TensorRT",
      "ROS 2 / Nav2",
      "Whisper",
      "Qwen3-VL",
      "ARKit",
      "Gaussian Splatting / Brush",
    ],
    githubHref: "https://github.com/azizu06/farsight",
    devpostHref: "https://devpost.com/software/farsight-t4qyli",
    award: "4 sponsor tracks: Hugging Face, NVIDIA, Encompass and Full Sail",
    category: "Hackathon",
  },
  {
    title: "PIP",
    date: "ShellHacks 2026",
    sortDate: "September 2026",
    image: "/assets/project-previews/pip.jpg",
    previewVideo: "/assets/project-previews/pip.mp4",
    description:
      "iPhone LiDAR rover that maps indoor spaces in 3D, remembers observed objects, and plans routes through mapped floor.",
    details:
      "PIP (Personal Intelligent Pathfinder) is an indoor mapping robot built from an iPhone sensing app, a perception and navigation backend, a 3D dashboard, and Scout, a small rover. My part was autonomy, including frontier-based exploration, route planning, obstacle replanning, and operator-controlled movement. The dashboard preserves observed geometry and candidate person detections to help inspect unfamiliar indoor spaces. On the physical rover, Scout followed a laptop-planned route and stopped on its own when the updated map showed the path was blocked.",
    keyFeatures: [
      "Synchronized iPhone camera, LiDAR depth, and pose capture through SwiftUI and ARKit.",
      "Persistent colored 3D reconstruction with object history and a top-down occupancy map.",
      "Frontier-based exploration and route planning with obstacle replanning and explicit Arm/Stop controls.",
      "Optional Gemini and ElevenLabs voice interface grounded in observed scene evidence.",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Three.js",
      "Swift",
      "SwiftUI",
      "ARKit",
      "SQLite",
      "Google Gemini",
      "ElevenLabs",
    ],
    githubHref: "https://github.com/azizu06/pip-scout",
    category: "Hackathon",
  },
  {
    title: "SnapList",
    date: "Shipaton 2026",
    sortDate: "August 2026",
    image: "/assets/project-previews/snaplist.png",
    previewVideo: "/assets/project-previews/snaplist.mp4",
    description:
      "Native iOS app that turns item photos into priced, editable resale listings with seller review before publishing.",
    details:
      "SnapList is an iOS-first resale assistant for turning item photos into ready-to-review listings. Sellers confirm the item facts, price, and copy before publishing to eBay or preparing a draft for another marketplace. Durable queues and saved checkpoints let interrupted AI runs continue without repeating completed work.",
    keyFeatures: [
      "Photo-to-listing workflow using multimodal models and seller-confirmed item facts.",
      "Pricing support built around market evidence and clear confidence checks.",
      "Durable Supabase queues and checkpoints for recovering interrupted AI runs.",
      "eBay publishing with assisted handoffs for Depop, Mercari, and Facebook Marketplace.",
    ],
    technologies: [
      "Swift",
      "SwiftUI",
      "TypeScript",
      "Next.js",
      "OpenAI",
      "Supabase",
      "eBay APIs",
    ],
    githubHref: "https://github.com/azizu06/snaplist",
    liveHref: "https://snaplist.dev/",
    category: "Product engineering",
  },
  {
    title: "Rehearse",
    date: "Jul 2026 - Present",
    sortDate: "July 2026",
    image: "/assets/project-previews/rehearse-architecture.webp",
    imageAlt: "Rehearse recovery architecture: restic backups, an isolated Docker Compose environment, application probes, and evidence reports",
    description:
      "Local backup-recovery tool for Docker Compose, with isolated environments, application probes, and durable evidence reports.",
    details:
      "Rehearse is an open-source recovery-testing project for Docker Compose applications. Its architecture combines a read-only restic adapter, an isolated Docker Compose environment, typed application probes, and redacted evidence reports. Each part has its own Go tests, including Docker and restic integration tests. A SQLite journal preserves run history, while optional Prometheus metrics and a provisioned Grafana dashboard support observability.",
    keyFeatures: [
      "Read-only restic recovery-point listing and acquisition adapter.",
      "Isolated Docker Compose environment with ownership-aware cleanup.",
      "Typed probes and immutable, redacted evidence reports.",
      "Durable SQLite run journal and optional Prometheus/Grafana observability.",
    ],
    technologies: [
      "Go",
      "React",
      "Docker",
      "SQLite",
      "Prometheus",
      "Grafana",
    ],
    githubHref: "https://github.com/azizu06/rehearse",
    category: "Infrastructure",
  },
  {
    title: "Shields.io",
    date: "Jun 2026 - Present",
    sortDate: "June 2026",
    image: "/assets/project-previews/shields.png",
    previewVideo: "/assets/project-previews/shields.mp4",
    description:
      "Open-source contributions improving badge services, private-project support, and safer self-hosting controls.",
    details:
      "I shipped three merged pull requests to the Shields.io badge platform. The work restored authenticated Azure DevOps queries for private projects, added draft filtering to GitHub pull-request badges, and blocked caller-supplied URL fetching by default across Dynamic and Endpoint routes.",
    keyFeatures: [
      "Authenticated Azure DevOps build, stage, and job queries for private projects.",
      "Draft filtering across four GitHub pull-request badge routes.",
      "Safer defaults for caller-supplied URL fetching with a self-hosting opt-out.",
      "Regression coverage across service tests and the core test suite.",
    ],
    technologies: [
      "JavaScript",
      "Node.js",
      "REST APIs",
      "Mocha",
      "Chai",
      "Nock",
      "GitHub Actions",
    ],
    githubHref:
      "https://github.com/badges/shields/pulls?q=is%3Apr+author%3Aazizu06",
    liveHref: "https://github.com/badges/shields",
    category: "Open source",
  },
  {
    title: "CrisisLens",
    date: "Hacklytics 2026",
    image: "/assets/project-previews/crisislens.png",
    previewVideo: "/assets/project-previews/crisislens.mp4",
    description:
      "Humanitarian intelligence platform for exploring crisis risk, funding gaps, and country-level signals on a 3D globe.",
    details:
      "CrisisLens is a team-built humanitarian intelligence platform. I worked on the frontend, the interactive 3D analyst dashboard, and the Databricks Genie integration that turns natural-language questions into SQL-backed insights. My teammates owned the machine-learning models behind the country-level neglect scores.",
    keyFeatures: [
      "Interactive Three.js globe with country-level crisis exploration.",
      "Dashboard views for risk, funding coverage, and people-in-need signals.",
      "Databricks Genie questions backed by SQL Warehouse data.",
      "Country briefs and AI explanations through geo-insight endpoints.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Three.js",
      "Databricks",
      "SQL Warehouse",
    ],
    githubHref: "https://github.com/azizu06/CrisisLensV2",
    liveHref: "https://crisis-lens-v2-web.vercel.app",
    award: "1st Place Winner",
    category: "Hackathon",
  },
  {
    title: "CapCheck",
    date: "BloomKnights 2026",
    sortDate: "July 2026",
    image: "/assets/project-previews/capcheck.png",
    previewVideo: "/assets/project-previews/capcheck.mp4",
    description:
      "Financial-video fact-checker that turns influencer claims into a cited score, evidence trail, and next steps.",
    details:
      "CapCheck is a collaborative hackathon project for checking factual and predictive claims in short-form financial videos. Users paste a video URL or upload a file, follow the analysis, and inspect a scorecard with timestamped claims, sources, confidence, hype-language signals, and actions to consider before trusting the advice.",
    keyFeatures: [
      "Gemini video understanding for extracting timestamped financial claims.",
      "Google Search grounding and Finnhub data for claim verification.",
      "Claim-level confidence, citations, and hype-language signals.",
      "Searchable verified-video feed stored in Supabase.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Google Gemini",
      "Finnhub",
      "Supabase",
    ],
    githubHref: "https://github.com/azizu06/CapChecker",
    liveHref: "https://capcheck-sigma.vercel.app/",
    category: "Hackathon",
  },
  {
    title: "FinBridge",
    date: "KnightHacks 2025",
    sortDate: "October 2025",
    image: "/assets/project-previews/finbridge.png",
    previewVideo: "/assets/project-previews/finbridge.mp4",
    description:
      "Multilingual finance dashboard that explains account activity and turns spending questions into visuals.",
    details:
      "FinBridge is a team-built financial literacy platform for people learning the U.S. financial system. It combines multilingual guidance, document translation, Plaid-connected account activity, spending visuals, and an AI assistant that explains transactions and finance terms in plain language.",
    keyFeatures: [
      "Multilingual finance guidance and document translation.",
      "Plaid-connected account activity for spending context.",
      "Google Gemini assistance for transaction and finance questions.",
      "Firebase-backed history with Chart.js visualizations.",
    ],
    technologies: [
      "React",
      "Node.js",
      "Express",
      "Google Gemini",
      "Plaid API",
      "Chart.js",
    ],
    githubHref: "https://github.com/GridGxly/FinBridgeV2",
    liveHref: "https://d34qgf2s4sj5t3.cloudfront.net",
    category: "Hackathon",
  },
];
