import type { Role } from "./types";

export const experience: Role[] = [
  {
    title: "AI/ML Engineer",
    company: "Imperative Business Ventures",
    period: "Aug 2025 – Present",
    current: true,
    highlights: [
      "Built LangGraph RAG apps with Gemini Live, FAISS, MySQL, and MongoDB, improving accuracy by 90%.",
      "Built FastAPI services and WebSocket/Plivo voice workflows, improving customer response time by 60% vs. manual handling.",
      "Integrated document intelligence and liveness checks, reducing document-processing time by 85%.",
    ],
    stack: ["LangGraph", "Gemini Live", "FAISS", "FastAPI", "WebSockets", "Plivo", "MySQL", "MongoDB"],
  },
  {
    title: "AI/ML Intern",
    company: "Imperative Business Ventures",
    period: "Feb 2025 – Aug 2025",
    highlights: [
      "Built Python/FastAPI AI apps with MySQL and MongoDB, streamlining backend workflows and speeding AI-feature integration.",
      "Developed FAISS RAG pipelines; internal tests estimated 15–20% fewer incorrect or inconsistent LLM responses.",
      "Implemented structured outputs, function calling, and validation to improve LLM response consistency.",
    ],
    stack: ["Python", "FastAPI", "FAISS", "MySQL", "MongoDB", "Function calling"],
  },
  {
    title: "AI Prompt Engineer",
    company: "Outlier",
    period: "Oct 2024 – Jun 2025",
    highlights: [
      "Integrated GPT-4o, Llama, and Mistral into NLP workflows; prompt optimization cut problematic outputs 10–15% in internal tests.",
      "Benchmarked model versions and evaluated safety to identify problematic responses and refine prompts and model behavior.",
    ],
    stack: ["GPT-4o", "Llama", "Mistral", "Prompt engineering", "LLM evaluation"],
  },
  {
    title: "Research Analyst Intern",
    company: "IGurus Consultancy Services LLP (ICS)",
    period: "Jan 2023 – May 2023",
    highlights: [
      "Developed and tested an NLP-based Hindi transliteration module, improving conversion consistency and reducing errors.",
    ],
    stack: ["NLP", "Python", "Transliteration"],
  },
  {
    title: "Web Developer Intern",
    company: "Aller Technologies",
    period: "Jan 2023 – Feb 2023",
    highlights: [
      "Built a Society Management System with Flask/Django and React.js, digitizing routine community workflows to reduce manual coordination and improve resident-management communication.",
    ],
    stack: ["Flask", "Django", "React.js"],
  },
];
