export type Project = {
  title: string;
  date: string;
  sortDate?: string;
  image?: string;
  previewVideo?: string;
  description: string;
  details?: string;
  keyFeatures?: string[];
  technologies: string[];
  githubHref?: string;
  liveHref?: string;
  award?: string;
  category: string;
};

export const projects: Project[] = [
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
    image: "/assets/project-previews/rehearse.png",
    description:
      "Open-source recovery drill that restores real backups in Docker, verifies the app, and records evidence.",
    details:
      "Rehearse is a self-hosted recovery-testing tool for applications backed up with restic and other supported sources. It restores a backup into an isolated Docker environment, starts the recovered application, runs HTTP, TCP, and database checks, records recovery time and failures, and removes the temporary environment when the drill ends.",
    keyFeatures: [
      "Automated recovery drills for real application backups.",
      "Isolated Docker environments with cleanup after success, failure, or interruption.",
      "HTTP, TCP, and database probes with a readable React report.",
      "AWS and Terraform recovery path with Prometheus and Grafana metrics.",
    ],
    technologies: [
      "Go",
      "React",
      "Docker",
      "SQLite",
      "Terraform",
      "AWS",
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
    date: "Knight Hacks 2025",
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
