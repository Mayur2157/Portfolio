import type { Degree, SkillGroup } from "./types";

// Grouped and de-duplicated from the resume's skills section; nothing added.
export const skillGroups: SkillGroup[] = [
  {
    title: "LLMs & Generative AI",
    skills: [
      "LangChain",
      "LangGraph",
      "LlamaIndex",
      "Gemini API",
      "OpenAI API (GPT-4o)",
      "Anthropic API",
      "HuggingFace Transformers",
      "Llama",
      "Mistral",
      "Prompt engineering",
      "Instruction tuning",
      "Chain-of-thought reasoning",
      "Function / tool calling",
      "Structured LLM outputs",
    ],
  },
  {
    title: "Agents & Retrieval",
    skills: [
      "Agentic orchestration",
      "Multi-agent systems (LangGraph, CrewAI, AutoGen)",
      "Agent memory systems",
      "RAG pipelines",
      "Graph RAG",
      "Semantic search",
      "Embedding pipelines",
      "FAISS",
      "ChromaDB",
      "pgvector",
      "Pinecone",
    ],
  },
  {
    title: "Multimodal & Deep Learning",
    skills: [
      "BLIP-2",
      "LayoutLMv3",
      "CLIP",
      "RoBERTa",
      "BART",
      "Whisper",
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "OpenCV",
      "PPO",
      "RLHF",
      "PEFT",
      "LoRA",
    ],
  },
  {
    title: "Voice AI & NLP",
    skills: [
      "Plivo telephony",
      "Real-time STT",
      "Sentiment analysis",
      "Zero-shot classification",
      "NER",
      "Multilingual NLP",
    ],
  },
  {
    title: "Backend & APIs",
    skills: ["Python", "FastAPI", "Flask", "Django", "Async programming", "WebSockets", "Microservices", "REST APIs"],
  },
  {
    title: "LLMOps & MLOps",
    skills: [
      "MLflow",
      "Prompt evaluation",
      "Model monitoring",
      "Model versioning",
      "Experiment tracking",
      "Docker",
      "CI/CD",
      "API deployment",
    ],
  },
  {
    title: "Cloud & Databases",
    skills: [
      "AWS (EC2, S3)",
      "GCP (Vertex AI)",
      "Microsoft Azure",
      "Linux",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
    ],
  },
  {
    title: "Tools & Other",
    skills: [
      "Git",
      "Postman",
      "Power BI",
      "JavaScript",
      "SQL",
      "C++",
      "HTML",
      "CSS",
      "React.js",
      "Software testing",
      "Code review",
      "Agile",
    ],
  },
];

export const education: Degree[] = [
  {
    degree: "M.Tech, Applied Artificial Intelligence",
    institution: "Visvesvaraya National Institute of Technology (VNIT)",
    location: "Nagpur",
    period: "Aug 2024 – Sep 2026",
    note: "Completed September 2026",
  },
  {
    degree: "B.E., Artificial Intelligence and Data Science",
    institution: "Ajeenkya DY Patil University",
    location: "Pune",
    period: "Aug 2020 – Jun 2024",
  },
];

export const courses: string[] = [
  "Certification in Machine Learning and Python Programming",
  "Microsoft Power BI — Up & Running with Power BI Desktop",
  "Artificial Neural Networks (ANN) With Keras in Python",
  "Advanced: Generative AI for Developers Learning Path",
];
