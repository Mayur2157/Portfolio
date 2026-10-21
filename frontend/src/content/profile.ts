import type { Metric } from "./types";

export const profile = {
  name: "Mayur Gadekar",
  title: "AI/ML Engineer",
  location: "Pune, Maharashtra, India",
  city: "Pune, India",
  email: "mayurgadekar2501@gmail.com",
  phone: { display: "+91 99757 11324", href: "tel:+919975711324" },
  linkedin: "https://www.linkedin.com/in/mayur-gadekar-a30619319",
  github: "https://github.com/Mayur2157",
  tagline:
    "I build production GenAI systems for enterprise automation — agentic workflows, RAG, multilingual voice agents and document intelligence.",
  summary:
    "AI/ML Engineer building production GenAI systems for enterprise automation, including agentic workflows, RAG, multilingual voice agents, and document intelligence. Delivered measurable impact: 90%+ improvement in response accuracy and 85% less manual document processing. M.Tech in Applied AI from VNIT Nagpur (2026), with research in multimodal vision-language systems and reinforcement learning.",
  /** Final line of the hero agent trace. */
  traceAnswer:
    "AI/ML Engineer at Imperative Business Ventures, shipping RAG, agentic and voice-AI systems to production. M.Tech in Applied AI, VNIT Nagpur.",
} as const;

export const impact: Metric[] = [
  {
    value: "90%+",
    label: "improvement in response accuracy",
    context: "LangGraph RAG apps with Gemini Live and FAISS",
  },
  {
    value: "85%",
    label: "less document-processing time",
    context: "Document intelligence and liveness checks",
  },
  {
    value: "60%",
    label: "faster customer response vs. manual handling",
    context: "Multilingual voice agents on FastAPI, WebSockets and Plivo",
  },
];
