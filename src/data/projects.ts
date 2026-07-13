export type Project = {
  title: string;
  date: string;
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
    title: "CapCheck",
    date: "July 2026",
    image: "/assets/project-previews/capcheck.png",
    previewVideo: "/assets/project-previews/capcheck.mp4",
    description:
      "AI financial-video fact-checker that turns influencer claims into a cited Cap Score, evidence trail, and concrete next steps.",
    details:
      "CapCheck is a collaborative BloomKnights 2026 project for checking factual and predictive claims in short-form financial videos. Users can paste a video URL or upload a file, follow the streamed analysis stages, and inspect a verdict-first scorecard. Gemini watches the video and extracts timestamped claims, Google Search grounding and Finnhub market data verify them, and the final Cap Score explains supported, contradicted, and unverifiable claims alongside citations, hype-language signals, and actions to take before trusting the advice. The preserved deployment keeps the verified feed and evidence pages live while the paid analysis pipeline remains archived.",
    keyFeatures: [
      "Gemini video understanding extracts timestamped financial claims from URLs and uploads.",
      "Google Search grounding and Finnhub function calls verify narrative and quantitative claims with cited evidence.",
      "Verdict-first scorecards combine a 0–100 Cap Score with claim-level confidence, sources, hype language, and next actions.",
      "Searchable, category-filtered Verified Feed persists vetted YouTube videos in Supabase for a durable read-only showcase.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Google Gemini",
      "Finnhub",
      "Supabase",
      "Zod",
    ],
    githubHref: "https://github.com/azizu06/CapChecker",
    liveHref: "https://capcheck-sigma.vercel.app/",
    category: "AI product",
  },
  {
    title: "CrisisLens",
    date: "Hacklytics 2026",
    image: "/assets/project-previews/crisislens.png",
    previewVideo: "/assets/project-previews/crisislens.mp4",
    description:
      "Command-center dashboard for mapping crisis risk, funding gaps, and AI insights across live humanitarian signals.",
    details:
      "CrisisLens is a humanitarian intelligence command center built as a monorepo with a Next.js App Router web app and a Python ML workspace. The web app centers on a Three.js globe, crisis KPI layers, country search, analytics views, and geo-insight API routes, while the ML side generates country-level neglect scores from features like fragility, crisis metrics, funding coverage, people-in-need rates, anomaly signals, and model ensembles.",
    keyFeatures: [
      "Interactive Three.js globe with country-level crisis exploration and layer controls.",
      "KPI panels for severity, funding coverage, in-need rates, and priority country signals.",
      "ML workspace and generated country metrics connected to the command-center UI.",
      "Geo-insight endpoints for country briefs, AI explanations, and natural-language crisis queries.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Three.js",
      "PyTorch",
      "Python",
      "pandas",
      "NumPy",
    ],
    githubHref: "https://github.com/azizu06/CrisisLensV2",
    liveHref: "https://crisis-lens-v2-web.vercel.app",
    award: "1st Place Winner",
    category: "AI product",
  },
  {
    title: "FinBridge",
    date: "October 2025",
    image: "/assets/project-previews/finbridge.png",
    previewVideo: "/assets/project-previews/finbridge.mp4",
    description:
      "Finance dashboard that explains account activity, translates guidance, and turns spending questions into visuals.",
    details:
      "FinBridge is a multilingual financial literacy platform for immigrants, bilingual students, families, and communities learning the U.S. financial system. The repo combines a React and Vite frontend with an Express backend that handles translation history, document translation, finance advice, Plaid account linking, transaction routes, generated graph data, Firebase-backed history, and AI assistance through Google Gemini and chat service routes.",
    keyFeatures: [
      "Multilingual finance guidance for English, Mandarin, Hindi, French, Tagalog, Vietnamese, Arabic, Haitian Creole, and German.",
      "Document translation and summarization flow for turning financial language into plain explanations.",
      "Plaid-connected account insights for live spending and banking context.",
      "Google Gemini assistant for contextual answers about transactions, finance terms, and next steps.",
    ],
    technologies: [
      "JavaScript",
      "React",
      "Tailwind",
      "Google Gemini",
      "Express",
      "Node.js",
      "Plaid API",
      "Chart.js",
    ],
    githubHref: "https://github.com/GridGxly/FinBridgeV2",
    liveHref: "https://d34qgf2s4sj5t3.cloudfront.net",
    category: "Full-stack",
  },
  {
    title: "Meridian",
    date: "June 2026",
    image: "/assets/project-previews/travel-agent.png",
    previewVideo: "/assets/project-previews/travel-agent.mp4",
    description:
      "AI travel agent that turns a short trip form into a shareable itinerary — agent-planned flights, hotels, and activities with real destination weather.",
    details:
      "Meridian is a Next.js 16 app that turns a short trip form into a complete, shareable itinerary in about 30 seconds. A Vercel AI SDK agent calls a live OpenWeatherMap tool, then returns a structured plan — two to three flight and hotel options with prices, a weather summary, and weather-aware activities — while a gpt-image-1 destination photo is generated in parallel and stored. User-entered facts like origin, destination, and dates are merged server-side so the model can't overwrite them, and each trip is saved by id in Upstash Redis with a 30-day TTL behind IP rate limiting and Zod validation.",
    keyFeatures: [
      "Tool-calling agent (Vercel AI SDK) that fetches live weather before drafting the plan.",
      "Structured LLM output rendered as flight, hotel, and activity cards through Zod schemas.",
      "AI-generated destination photo created in parallel with gpt-image-1 and stored on Vercel Blob.",
      "Stateless, shareable trip pages in Upstash Redis with IP rate limiting and prompt-injection hardening.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Vercel AI SDK",
      "OpenAI",
      "Zod",
      "Upstash Redis",
      "Tailwind CSS",
    ],
    githubHref: "https://github.com/azizu06/travel-agent",
    liveHref: "https://travel-agent-phi-lac.vercel.app",
    category: "AI product",
  },
  {
    title: "PopChoice",
    date: "June 2026",
    image: "/assets/project-previews/pop-choice.png",
    previewVideo: "/assets/project-previews/pop-choice.mp4",
    description:
      "Group movie picker that turns everyone's taste into one semantic search and streams back AI-explained recommendations.",
    details:
      "PopChoice is a Next.js 16 App Router app that helps a group decide what to watch. It collects each viewer's preferences, combines them into a single query, creates an OpenAI embedding, and runs vector similarity search over a Supabase pgvector movie database. Matches are enriched with TMDB poster art and OpenAI-written explanations, then streamed back one movie at a time, with Upstash Redis rate limiting and Zod validation protecting the recommendation route.",
    keyFeatures: [
      "Per-person preference flow combined into a single semantic search query.",
      "OpenAI embeddings with Supabase pgvector similarity search for retrieval.",
      "Streamed recommendations enriched with TMDB posters and AI-written reasons.",
      "Upstash Redis rate limiting and Zod-validated API routes.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "OpenAI",
      "Supabase",
      "pgvector",
      "Zod",
      "Tailwind CSS",
    ],
    githubHref: "https://github.com/azizu06/pop-choice",
    liveHref: "https://pop-choice-kappa.vercel.app",
    category: "AI product",
  },
  {
    title: "Dream Catcher",
    date: "June 2026",
    image: "/assets/project-previews/dream-catcher.png",
    previewVideo: "/assets/project-previews/dream-catcher.mp4",
    description:
      "Dream journal that records entries and returns AI-generated interpretations, kept in a persistent Postgres timeline.",
    details:
      "Dream Catcher is a full-stack journaling app with an Express REST backend, PostgreSQL storage, and a vanilla JavaScript frontend. Users write a dream, request an AI interpretation, and build a persistent journal of past entries with timestamps, expandable interpretations, and delete controls. The backend exposes RESTful routes and wraps the AI call in dedicated validation and helper utilities.",
    keyFeatures: [
      "Record dreams and generate AI interpretations on demand.",
      "Persistent PostgreSQL journal with timestamps and delete actions.",
      "Express REST API with dedicated routes and validation helpers.",
      "Expandable interpretation cards in a lightweight vanilla-JS UI.",
    ],
    technologies: ["JavaScript", "Node.js", "Express", "PostgreSQL", "OpenAI", "REST APIs"],
    githubHref: "https://github.com/azizu06/dream-catcher",
    liveHref: "https://dream-catcher-0ts7.onrender.com",
    category: "Full-stack",
  },
  {
    title: "PollyGlot",
    date: "May 2026",
    image: "/assets/project-previews/pollyglot.png",
    previewVideo: "/assets/project-previews/pollyglot.mp4",
    description:
      "AI translation chat that converts text into French, Spanish, or Japanese while preserving tone, formatting, and emoji.",
    details:
      "PollyGlot is an OpenAI-powered translation app with a React and Vite frontend and an Express API. Users pick a target language, type a message, and receive a translation rendered in a chat-style interface. The server corrects obvious spelling and grammar before translating, preserves the user's tone, punctuation, formatting, and emoji, keeps API credentials server-side, and enforces strict rate and input limits around the public endpoint.",
    keyFeatures: [
      "Translates into French, Spanish, or Japanese in a chat-style UI.",
      "Pre-translation spelling and grammar fixes with tone and emoji preserved.",
      "Server-held API credentials instead of browser-exposed keys.",
      "Rate limiting, input caps, and daily limits on the public endpoint.",
    ],
    technologies: ["React", "Vite", "Express", "Node.js", "OpenAI", "Tailwind CSS"],
    githubHref: "https://github.com/azizu06/PollyGlot",
    liveHref: "https://pollyglot-qzxe.onrender.com",
    category: "AI product",
  },
  {
    title: "Tiny Library",
    date: "May 2026",
    image: "/assets/project-previews/tiny-library.png",
    previewVideo: "/assets/project-previews/tiny-library.mp4",
    description:
      "Typed Next.js App Router catalog with a styled landing page, category routes, book search, and detail pages.",
    details:
      "Tiny Library is a book-browsing app built to practice the Next.js App Router with TypeScript. A styled hero landing page leads into a /books catalog with category routes, a search field, and individual book detail pages. TypeScript types are shared across the app, and the UI is styled with Tailwind CSS on a recent Next.js release.",
    keyFeatures: [
      "Next.js App Router with a styled hero landing page.",
      "Category routes and search across a hand-picked catalog.",
      "Individual book detail pages addressed by id.",
      "Shared TypeScript types and Tailwind CSS styling.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    githubHref: "https://github.com/azizu06/tiny-library",
    liveHref: "https://tiny-library-ivory.vercel.app",
    category: "React",
  },
  {
    title: "File Uploader",
    date: "May 2026",
    image: "/assets/project-previews/file-uploader.png",
    previewVideo: "/assets/project-previews/file-uploader.mp4",
    description:
      "Personal cloud storage with session auth, nested folders, and uploads persisted to object storage through Prisma.",
    details:
      "File Uploader is an Express app for personal cloud storage, built to practice Prisma ORM. Users sign in with Passport (local strategy) and bcrypt, create nested folders, and upload files handled by multer and stored in Supabase storage. Data is modeled and queried through Prisma over PostgreSQL, sessions are persisted with a Prisma-backed store, and the top-level folder is protected from deletion.",
    keyFeatures: [
      "Passport local-strategy auth with bcrypt-hashed passwords.",
      "Nested folder creation with sortable, detailed file tables.",
      "File uploads via multer persisted to Supabase object storage.",
      "Prisma ORM over PostgreSQL with Prisma-backed session storage.",
    ],
    technologies: ["Express", "Node.js", "Prisma", "PostgreSQL", "Supabase", "EJS", "Tailwind CSS"],
    githubHref: "https://github.com/azizu06/file-uploader",
    liveHref: "https://file-uploader-seven-rho.vercel.app",
    category: "Full-stack",
  },
  {
    title: "Members Only",
    date: "May 2026",
    image: "/assets/project-previews/members-only.png",
    previewVideo: "/assets/project-previews/members-only.mp4",
    description:
      "Anonymous clubhouse board where membership tiers and passcodes gate who can see authors and delete posts.",
    details:
      "Members Only is an Express clubhouse message board built to practice authentication and authorization. Anyone can read posts, but author names stay masked until a user upgrades to a member tier with a passcode, and only admins can delete messages. It uses Passport local auth with bcrypt, role-based membership tiers, PostgreSQL-backed users and messages, and connect-pg-simple session storage.",
    keyFeatures: [
      "Passport local auth with bcrypt password hashing.",
      "Passcode-gated member and admin tiers controlling visibility and actions.",
      "Anonymous posts whose authors are revealed only to members.",
      "Admin-only deletion with PostgreSQL-backed sessions and data.",
    ],
    technologies: ["Express", "Node.js", "Passport", "PostgreSQL", "EJS", "Tailwind CSS"],
    githubHref: "https://github.com/azizu06/members-only",
    liveHref: "https://members-only-blue.vercel.app",
    category: "Full-stack",
  },
  {
    title: "Inventory App",
    date: "April 2026",
    image: "/assets/project-previews/inventory-app.png",
    previewVideo: "/assets/project-previews/inventory-app.mp4",
    description:
      "Inventory catalog with product filters, detailed item pages, protected actions, image URLs, and SQL-backed records.",
    details:
      "Inventory App is an Express and EJS inventory manager backed by PostgreSQL queries, category and product controllers, and validation middleware. It supports category browsing, product filtering through query parameters, detailed product pages, new and edit forms, image URL fields, server-side validation, and password-protected delete confirmation so destructive inventory actions require an admin pass before records are removed.",
    keyFeatures: [
      "Category and product controllers for browsing inventory by grouped records.",
      "PostgreSQL-backed queries for persistent products, categories, and item details.",
      "Create and edit flows with server-side validation and reusable EJS views.",
      "Protected delete confirmation flow for safer destructive actions.",
    ],
    technologies: ["Express", "PostgreSQL", "EJS", "Node.js"],
    githubHref: "https://github.com/azizu06/inventory-app",
    liveHref: "https://inventory-app-rho-ivory.vercel.app",
    category: "Full-stack",
  },
  {
    title: "Message Board",
    date: "April 2026",
    image: "/assets/project-previews/message-board.png",
    previewVideo: "/assets/project-previews/message-board.mp4",
    description:
      "Shared message board with post detail pages, server validation, hosted Postgres data, and Vercel routing.",
    details:
      "Message Board is a server-rendered Express and EJS app that stores posts in PostgreSQL instead of temporary in-memory state. Its controller validates author and message input, renders a reusable message feed, supports a dedicated new-message form, shows individual message detail pages by id, and includes Vercel-oriented routing so the same Express app can run locally or as a hosted serverless deployment.",
    keyFeatures: [
      "Message feed with reusable EJS card partials and individual detail pages.",
      "Post creation form wired through Express routes, controllers, and validation handling.",
      "PostgreSQL data layer for persistent messages across sessions.",
      "Vercel serverless entry point and routing setup for hosted deployment.",
    ],
    technologies: ["Express", "PostgreSQL", "EJS", "Node.js"],
    githubHref: "https://github.com/azizu06/message-board",
    liveHref: "https://message-board-six-sigma.vercel.app",
    category: "Full-stack",
  },
  {
    title: "Shopping Cart",
    date: "March 2026",
    image: "/assets/project-previews/shopping-cart.png",
    previewVideo: "/assets/project-previews/shopping-cart.mp4",
    description:
      "Space-shop interface with routed product browsing, quantity steppers, cart totals, and checkout review state.",
    details:
      "Shopping Cart is a React and Vite storefront built around routed home, shop, and cart pages. The app uses React Router for navigation, TanStack React Query for product loading, a cart context provider for shared quantities and totals, local product fallbacks, Space Devs launcher and spacecraft data shaping, dropdown filtering, quantity steppers, cart item removal, and responsive product cards for a complete shop flow.",
    keyFeatures: [
      "Routed home, shop, and cart pages built with React Router.",
      "Product fetching and cached shop data through TanStack React Query.",
      "Cart context for shared item state, totals, and quantity updates.",
      "Reusable shop item, cart item, dropdown, and stepper components.",
    ],
    technologies: ["React", "Vite", "JavaScript", "React Router", "React Query", "Tailwind CSS"],
    githubHref: "https://github.com/azizu06/shopping-cart",
    liveHref: "https://shopping-cart-iota-woad.vercel.app",
    category: "React",
  },
  {
    title: "Memory Card",
    date: "February 2026",
    image: "/assets/project-previews/memory-card.png",
    previewVideo: "/assets/project-previews/memory-card.mp4",
    description:
      "Memory game with shuffled card rounds, flip feedback, score tracking, best-score state, and sound toggles.",
    details:
      "Memory Card is a React game built to practice hooks, fetched/static card data, and stateful play loops. The main app tracks flipped card ids, current score, best score, win/loss feedback, sound state, and randomized card order, while dedicated score, grid, card, and sound components create the arena-style board, flip animation, audio feedback, mute control, and round-by-round memory challenge.",
    keyFeatures: [
      "Card grid that shuffles each round to keep the memory challenge active.",
      "Score and best-score tracking for repeated play sessions.",
      "Sound controls with flip, shuffle, success, and miss feedback assets.",
      "Visual card states tied to character artwork and game-result responses.",
    ],
    technologies: ["React", "Vite", "JavaScript", "Tailwind CSS"],
    githubHref: "https://github.com/azizu06/memory-card",
    liveHref: "https://memory-card-eight-sepia.vercel.app",
    category: "Game",
  },
  {
    title: "Resume Builder",
    date: "February 2026",
    image: "/assets/project-previews/resume-builder.png",
    previewVideo: "/assets/project-previews/resume-builder.mp4",
    description:
      "Resume editor with sidebar panels, structured forms, live document preview, reusable sections, and skills editing.",
    details:
      "Resume Builder is a React resume editor with a split editing workspace and live document preview. It keeps the resume as structured state, uses sidebar panels for personal information, education, work experience, projects, and skills, drafts form edits before saving, supports adding and removing repeated sections, and renders the finished resume as a clean document preview from the same data model.",
    keyFeatures: [
      "Sidebar-driven editing flow for moving between resume sections quickly.",
      "Structured form panels for personal info, experience, education, projects, and skills.",
      "Live resume preview that updates as fields change.",
      "Reusable constants and section components for keeping resume content organized.",
    ],
    technologies: ["React", "Vite", "JavaScript", "Tailwind CSS"],
    githubHref: "https://github.com/azizu06/resume-builder",
    liveHref: "https://resume-builder-ashy-tau.vercel.app",
    category: "Tool",
  },
  {
    title: "Battleship",
    date: "January 2026",
    image: "/assets/project-previews/battleship.png",
    previewVideo: "/assets/project-previews/battleship.mp4",
    description:
      "Test-driven Battleship game with random placement, dual boards, CPU turns, hit markers, and modular game logic.",
    details:
      "Battleship is a vanilla JavaScript and Webpack game built around separated game logic and DOM rendering. The repo includes board, ship, player, ship-placement, turn-flow, controller, and CPU-hunt modules, plus Jest tests for board and ship behavior. The UI lets the player place ships, randomize placement, attack the computer grid, see hit and miss markers, and progress through a complete player-versus-computer match.",
    keyFeatures: [
      "Modular board, ship, player, placement, and turn-flow logic.",
      "CPU hunt behavior for automated opponent turns.",
      "Dual-grid UI rendering for player and computer boards.",
      "Jest coverage for core board and ship behavior.",
    ],
    technologies: ["JavaScript", "HTML", "CSS", "Jest", "Webpack"],
    githubHref: "https://github.com/azizu06/Battleship",
    liveHref: "https://battleship-one-sandy.vercel.app/",
    category: "Game",
  },
  {
    title: "To-Do List",
    date: "December 2025",
    image: "/assets/project-previews/todo-list.png",
    previewVideo: "/assets/project-previews/todo-list.mp4",
    description:
      "Task manager with project groups, dated todos, priority badges, localStorage persistence, and editable state.",
    details:
      "To-Do List is an object-oriented JavaScript task manager structured around project, todo, all-projects, storage, form, renderer, and update-form modules. It supports multiple project groups, active project switching, dated todo items, priority and note fields, create and update forms, deletion flows, date-fns sorting helpers, and localStorage persistence so restored projects and todos survive refreshes.",
    keyFeatures: [
      "Object-oriented project and todo models for structured task data.",
      "Project grouping with separate renderers for projects and todo items.",
      "Update forms for editing task titles, dates, priorities, and notes.",
      "localStorage persistence so projects and todos survive page refreshes.",
    ],
    technologies: ["JavaScript", "HTML", "CSS", "Webpack", "localStorage"],
    githubHref: "https://github.com/azizu06/todo-list",
    liveHref: "https://todo-list-nine-sooty-39.vercel.app/",
    category: "JavaScript",
  },
  {
    title: "Tic Tac Toe",
    date: "October 2025",
    image: "/assets/project-previews/tic-tac-toe.png",
    previewVideo: "/assets/project-previews/tic-tac-toe.mp4",
    description:
      "Classic Tic Tac Toe with player setup, turn messages, board state, win detection, and modular JavaScript flow.",
    details:
      "Tic Tac Toe is a vanilla JavaScript game built with module-pattern state management. The script separates the board store from the game controller, creates player objects from the setup flow, tracks the active marker, updates turn and result messages, prevents invalid moves, clears state for replay, and checks the classic three-by-three win and draw conditions after each move.",
    keyFeatures: [
      "Module-pattern game flow for board state, players, and round control.",
      "Player setup before the match begins.",
      "Turn messaging that reflects the current player and game result.",
      "Win and draw detection for the classic three-by-three board.",
    ],
    technologies: ["JavaScript", "HTML", "CSS", "Webpack"],
    githubHref: "https://github.com/azizu06/tic-tac-toe",
    liveHref: "https://tic-tac-toe-alpha-ruddy-38.vercel.app/",
    category: "Game",
  },
  {
    title: "Weather App",
    date: "December 2025",
    image: "/assets/project-previews/weather.png",
    previewVideo: "/assets/project-previews/weather.mp4",
    description:
      "Weather search app that fetches forecast data, renders city results, toggles units, and handles async UI states.",
    details:
      "Weather App is a Webpack-based JavaScript app for practicing API calls and asynchronous rendering. It reads API configuration from environment-backed values, fetches weather data for a searched location, maps the response into display-ready fields, renders address, temperature, feels-like temperature, wind, humidity, and condition icons, initializes with Orlando weather, and includes Fahrenheit/Celsius conversion controls.",
    keyFeatures: [
      "Weather API data fetching separated from display rendering.",
      "City search flow with async loading and result updates.",
      "Condition-specific weather icons for clear, cloudy, rain, snow, wind, fog, and storm states.",
      "Config-driven setup for API values and bundled Webpack deployment.",
    ],
    technologies: ["JavaScript", "HTML", "CSS", "Webpack"],
    githubHref: "https://github.com/azizu06/weather",
    liveHref: "https://weather-eight-umber.vercel.app/",
    category: "JavaScript",
  },
  {
    title: "Restaurant Page",
    date: "November 2025",
    image: "/assets/project-previews/restaurant.png",
    previewVideo: "/assets/project-previews/restaurant.mp4",
    description:
      "Restaurant page with module-driven tabs, menu sections, contact content, and bundled DOM rendering through Webpack.",
    details:
      "Restaurant Page is a modular DOM-rendered site bundled with Webpack. The app imports separate home, menu, about, and contact modules, swaps sections through tab-style navigation without page reloads, includes an order button that jumps from the hero into the menu, uses image assets for food and chef content, and builds contact rows for location, phone, email, social, and hours information.",
    keyFeatures: [
      "Module-driven home, menu, about, and contact sections.",
      "Tabbed navigation that swaps page content without a full reload.",
      "Menu rendering backed by real food imagery and section-specific assets.",
      "Webpack bundling for modular DOM rendering and static asset handling.",
    ],
    technologies: ["JavaScript", "HTML", "CSS", "Webpack"],
    githubHref: "https://github.com/azizu06/restaurant",
    liveHref: "https://restaurant-two-plum.vercel.app/",
    category: "JavaScript",
  },
  {
    title: "Library",
    date: "October 2025",
    image: "/assets/project-previews/library.png",
    previewVideo: "/assets/project-previews/library.mp4",
    description:
      "Personal library app with book-entry forms, reading-status controls, stored object state, and class-based logic.",
    details:
      "Library is a vanilla JavaScript book collection app built around a Book class and an in-memory library array. Each book receives a generated id and stores cover, title, author, page count, publication year, description, and reading status, while the UI renders book cards, supports adding new entries through a form, toggles each book between reading and finished, and removes books from the collection.",
    keyFeatures: [
      "Book-entry form for adding titles, authors, page counts, and read status.",
      "Object-based library state for storing and rendering books.",
      "Read-status controls for updating each book after it is added.",
      "Remove-book actions for managing the collection directly from the UI.",
    ],
    technologies: ["JavaScript", "HTML", "CSS"],
    githubHref: "https://github.com/azizu06/Library",
    liveHref: "https://library-flame-ten.vercel.app/",
    category: "JavaScript",
  },
  {
    title: "Sign-Up Form",
    date: "November 2025",
    image: "/assets/project-previews/sign-up.png",
    previewVideo: "/assets/project-previews/sign-up.mp4",
    description:
      "Responsive sign-up form with semantic labels, focused field states, validation styling, and polished CSS layout.",
    details:
      "Sign-Up Form is a focused HTML and CSS form project for practicing client-side form structure and responsive layout. The repo centers on semantic account-creation fields, grouped labels and inputs, visual hierarchy between the image/brand area and the form area, focused and invalid field styling, password confirmation feedback, and a layout that adapts from a desktop two-column composition to narrower screens.",
    keyFeatures: [
      "Responsive two-column form layout that adapts down cleanly.",
      "Semantic input labels for accessible account creation fields.",
      "Focused and invalid field styling for clearer form feedback.",
      "Polished CSS treatment around spacing, imagery, and call-to-action hierarchy.",
    ],
    technologies: ["JavaScript", "HTML", "CSS"],
    githubHref: "https://github.com/azizu06/Sign-up",
    liveHref: "https://sign-up-one-liart.vercel.app/",
    category: "CSS",
  },
  {
    title: "Admin Dashboard",
    date: "November 2025",
    image: "/assets/project-previews/admin-dashboard.png",
    previewVideo: "/assets/project-previews/admin-dashboard.mp4",
    description:
      "Admin dashboard layout built with CSS Grid, sidebar navigation, project cards, announcements, and trending lists.",
    details:
      "Admin Dashboard is a static HTML and CSS dashboard composition built to reinforce CSS Grid. The page lays out a persistent sidebar, header controls, main project card grid, announcements panel, and trending panel, using dashboard-style icon and text hierarchy to practice dense product UI structure, repeated card sections, aligned content columns, and a clear administrative scanning layout.",
    keyFeatures: [
      "CSS Grid layout for sidebar, header, main project area, and secondary panels.",
      "Sidebar navigation with dashboard-style icon/text hierarchy.",
      "Project-card area for scanning multiple work items.",
      "Announcements and trending sections to practice dense dashboard composition.",
    ],
    technologies: ["HTML", "CSS"],
    githubHref: "https://github.com/azizu06/adminDash",
    liveHref: "https://admin-dash-xi.vercel.app/",
    category: "CSS",
  },
  {
    title: "Calculator",
    date: "September 2025",
    image: "/assets/project-previews/calculator.png",
    previewVideo: "/assets/project-previews/calculator.mp4",
    description:
      "Accessible calculator with chained operations, decimal input guards, delete controls, and divide-by-zero feedback.",
    details:
      "Calculator is a single-page vanilla JavaScript calculator that implements the core arithmetic functions directly in the browser. The script manages display state, button input, chained operations, decimal handling, repeated-operator protection, delete and clear behavior, equals evaluation, responsive layout, and edge-case feedback such as divide-by-zero handling so the UI behaves like a practical four-function calculator.",
    keyFeatures: [
      "Four-function arithmetic with chained operation support.",
      "Decimal input guards and repeated-operator handling.",
      "Delete and clear controls for correcting entries mid-calculation.",
      "Divide-by-zero feedback and responsive single-page layout.",
    ],
    technologies: ["JavaScript", "HTML", "CSS"],
    githubHref: "https://github.com/azizu06/Calculator",
    liveHref: "https://calculator-chi-three-10.vercel.app/",
    category: "JavaScript",
  },
  {
    title: "Etch-A-Sketch",
    date: "September 2025",
    image: "/assets/project-previews/etch-a-sketch.png",
    previewVideo: "/assets/project-previews/etch-a-sketch.mp4",
    description:
      "Browser sketchpad with adjustable grid sizing, color modes, pointer drawing, reset controls, and DOM rendering.",
    details:
      "Etch-A-Sketch is a browser sketchpad built with vanilla JavaScript DOM generation. The app creates its toolbar and drawing canvas in script, supports adjustable grid resolution, color mode, eraser mode, rainbow mode, darken behavior, clear/reset controls, and pointer-based drawing across generated cells, making it a focused exercise in event handling, dynamic element creation, and user-controlled canvas state.",
    keyFeatures: [
      "Adjustable grid generation for changing sketch resolution.",
      "Pointer drawing across cells for browser-based sketching.",
      "Color and reset controls for changing the drawing mode quickly.",
      "DOM-focused rendering that rebuilds the board based on user settings.",
    ],
    technologies: ["JavaScript", "HTML", "CSS"],
    githubHref: "https://github.com/azizu06/Etch-A-Sketch",
    liveHref: "https://etch-a-sketch-chi-azure.vercel.app/",
    category: "JavaScript",
  },
  {
    title: "Rock Paper Scissors",
    date: "September 2025",
    image: "/assets/project-previews/rock-paper-scissors.png",
    previewVideo: "/assets/project-previews/rock-paper-scissors.mp4",
    description:
      "Browser game with player choice buttons, computer rounds, image feedback, score tracking, and win-state logic.",
    details:
      "Rock Paper Scissors is a vanilla JavaScript browser game that handles player choice buttons, randomized computer choices, image updates for both sides, round comparison logic, score tracking, and game-result messaging. The project focuses on fundamental JavaScript functions and DOM updates by turning each user selection into a visible round with feedback for rock, paper, scissors, wins, losses, and ties.",
    keyFeatures: [
      "Player choice buttons for rock, paper, and scissors rounds.",
      "Computer selection logic for each matchup.",
      "Score tracking across repeated rounds.",
      "Round-result and win-state feedback with visual choices shown in the browser.",
    ],
    technologies: ["JavaScript", "HTML", "CSS"],
    githubHref: "https://github.com/azizu06/rock-paper-scissors",
    liveHref: "https://rock-paper-scissors-jet-mu.vercel.app/",
    category: "Game",
  },
];
