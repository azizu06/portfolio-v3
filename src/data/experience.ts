export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  image: string;
  summary: string;
  highlights: string[];
  technologies: string[];
};

export const experiences: Experience[] = [
  {
    company: "ISUE Lab",
    role: "Undergraduate Research Assistant",
    period: "October 2025 - Present",
    location: "University of Central Florida",
    image: "/assets/isue.png",
    summary:
      "Developing AI-driven feedback systems for dysarthric speech with a focus on usable, clinically aligned feedback.",
    highlights: [
      "Helped build and label a speech-error dataset for therapeutic feedback research.",
      "Contributed to PyTorch-based modeling work for personalized speech feedback.",
      "Participated in pilot evaluations with dysarthric speakers and clinicians.",
    ],
    technologies: [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "PyTorch",
      "Matplotlib",
      "Seaborn",
    ],
  },
];
