export type Project = {
  title: string;
  date: string;
  image: string;
  description: string;
  technologies: string[];
  githubHref: string;
  liveHref: string;
  featured?: boolean;
  category: "Full-stack" | "React" | "JavaScript" | "Game" | "CSS";
};

export const projects: Project[] = [
  {
    title: "FinBridge",
    date: "October 2025",
    image: "/assets/finbridge.png",
    description:
      "Full-stack finance platform that translates complex documents for non-English speakers and visualizes banking data.",
    technologies: [
      "React",
      "Tailwind",
      "Firebase",
      "Gemini",
      "Express",
      "Node.js",
      "Plaid API",
    ],
    githubHref: "https://github.com/GridGxly/FinBridgeV2",
    liveHref: "https://d34qgf2s4sj5t3.cloudfront.net",
    featured: true,
    category: "Full-stack",
  },
  {
    title: "Battleship",
    date: "January 2026",
    image: "/assets/battleship.png",
    description:
      "Test-driven Battleship game focused on game state, validation logic, and modular architecture.",
    technologies: ["JavaScript", "HTML", "CSS", "Jest", "Webpack"],
    githubHref: "https://github.com/azizu06/Battleship",
    liveHref: "https://battleship-one-sandy.vercel.app/",
    featured: true,
    category: "Game",
  },
  {
    title: "To-Do List",
    date: "December 2025",
    image: "/assets/todos.png",
    description:
      "Task manager with projects, priorities, localStorage persistence, and modular JavaScript structure.",
    technologies: ["JavaScript", "HTML", "CSS", "Webpack"],
    githubHref: "https://github.com/azizu06/todo-list",
    liveHref: "https://todo-list-nine-sooty-39.vercel.app/",
    featured: true,
    category: "JavaScript",
  },
  {
    title: "Tic Tac Toe",
    date: "October 2025",
    image: "/assets/tictac.png",
    description:
      "Interactive Tic Tac Toe with modular JavaScript and a Minimax AI.",
    technologies: ["JavaScript", "HTML", "CSS", "Webpack"],
    githubHref: "https://github.com/azizu06/tic-tac-toe",
    liveHref: "https://tic-tac-toe-alpha-ruddy-38.vercel.app/",
    category: "Game",
  },
  {
    title: "Weather App",
    date: "December 2025",
    image: "/assets/weather.png",
    description:
      "Weather interface that fetches live API data and renders dynamic forecast states.",
    technologies: ["JavaScript", "HTML", "CSS", "Webpack"],
    githubHref: "https://github.com/azizu06/weather",
    liveHref: "https://weather-eight-umber.vercel.app/",
    category: "JavaScript",
  },
  {
    title: "Restaurant Page",
    date: "November 2025",
    image: "/assets/uzbekfood.png",
    description:
      "Webpack-bundled restaurant site using ES modules to manage content sections.",
    technologies: ["JavaScript", "HTML", "CSS", "Webpack"],
    githubHref: "https://github.com/azizu06/restaurant",
    liveHref: "https://restaurant-two-plum.vercel.app/",
    category: "JavaScript",
  },
  {
    title: "Library",
    date: "October 2025",
    image: "/assets/lib.png",
    description:
      "Personal library app built to practice constructors, classes, and state updates.",
    technologies: ["JavaScript", "HTML", "CSS"],
    githubHref: "https://github.com/azizu06/Library",
    liveHref: "https://library-flame-ten.vercel.app/",
    category: "JavaScript",
  },
  {
    title: "Sign-Up Form",
    date: "November 2025",
    image: "/assets/signup.png",
    description:
      "Responsive sign-up form focused on semantics, validation feedback, and modern CSS.",
    technologies: ["JavaScript", "HTML", "CSS"],
    githubHref: "https://github.com/azizu06/Sign-up",
    liveHref: "https://sign-up-one-liart.vercel.app/",
    category: "CSS",
  },
  {
    title: "Admin Dashboard",
    date: "November 2025",
    image: "/assets/admin.png",
    description:
      "Dashboard layout built with CSS Grid to practice complex interface structure.",
    technologies: ["HTML", "CSS"],
    githubHref: "https://github.com/azizu06/adminDash",
    liveHref: "https://admin-dash-xi.vercel.app/",
    category: "CSS",
  },
  {
    title: "Calculator",
    date: "September 2025",
    image: "/assets/calc.png",
    description:
      "Interactive calculator for event handling and application state management.",
    technologies: ["JavaScript", "HTML", "CSS"],
    githubHref: "https://github.com/azizu06/Calculator",
    liveHref: "https://calculator-chi-three-10.vercel.app/",
    category: "JavaScript",
  },
  {
    title: "Etch-A-Sketch",
    date: "September 2025",
    image: "/assets/etch.png",
    description:
      "Browser drawing app using DOM manipulation, event handling, and drawing logic.",
    technologies: ["JavaScript", "HTML", "CSS"],
    githubHref: "https://github.com/azizu06/Etch-A-Sketch",
    liveHref: "https://etch-a-sketch-chi-azure.vercel.app/",
    category: "JavaScript",
  },
  {
    title: "Rock Paper Scissors",
    date: "September 2025",
    image: "/assets/rps.png",
    description:
      "Interactive browser game for core DOM events, scoring, and conditional logic.",
    technologies: ["JavaScript", "HTML", "CSS"],
    githubHref: "https://github.com/azizu06/rock-paper-scissors",
    liveHref: "https://rock-paper-scissors-jet-mu.vercel.app/",
    category: "Game",
  },
];
