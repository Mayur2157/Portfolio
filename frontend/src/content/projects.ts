import type { Project, ProjectCategory } from "./types";

export const categories: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "genai", label: "GenAI & Agents" },
  { id: "vision", label: "Computer Vision" },
  { id: "ml-data", label: "ML & Data" },
  { id: "web", label: "Web" },
];

const projectList: Project[] = [
  {
    id: "vendor-comparison",
    title: "Vendor Comparison AI Platform",
    period: "Jan 2025 – Present",
    start: "2025-01",
    end: "present",
    category: "genai",
    kind: "private",
    summary:
      "An enterprise AI-powered tender analysis platform for processing technical and commercial procurement documents at scale.",
    highlights: [
      "Built BOQ-driven comparison pipelines using FastAPI, Gemini, FAISS, and semantic retrieval for automated vendor evaluation and scoring.",
      "Implemented AI-powered vendor scoring, technical compliance validation, and commercial benchmarking using RAG-based document intelligence workflows.",
      "Reduced manual tender comparison effort by over 80%, enabling faster and more accurate procurement decision-making.",
    ],
    stack: ["FastAPI", "Gemini", "FAISS", "RAG", "Semantic retrieval"],
  },
  {
    id: "voice-agent",
    title: "AI Voice Agent — Multilingual Inbound Call Automation",
    period: "Feb 2025 – Present",
    start: "2025-02",
    end: "present",
    category: "genai",
    kind: "private",
    summary:
      "Production-grade multilingual AI voice agents for real-time enterprise customer support automation.",
    highlights: [
      "Built voice agents using Gemini Live API, FastAPI, WebSockets, and Plivo telephony.",
      "Implemented real-time speech-to-text processing, LLM orchestration, tool/function calling, and dynamic conversation management with stateful agent memory.",
      "Developed context-aware identity verification workflows and multi-turn slot capture, maintaining session continuity across complex multi-step conversation flows.",
      "Optimized end-to-end latency and response quality, improving customer response time by 60% compared to manual handling benchmarks.",
    ],
    stack: ["Gemini Live API", "FastAPI", "WebSockets", "Plivo", "Function calling", "Agent memory"],
  },
  {
    id: "csat-nps",
    title: "CSAT/NPS Automation Platform",
    period: "Jan 2025 – Present",
    start: "2025-01",
    end: "present",
    category: "ml-data",
    kind: "private",
    summary:
      "An automated customer satisfaction and NPS survey platform with multi-channel distribution (email, WhatsApp, SMS), processing 10,000+ survey interactions.",
    highlights: [
      "Developed the platform using FastAPI, React, and MySQL with multi-channel survey distribution.",
      "Integrated HuggingFace transformer models — RoBERTa for sentiment analysis and BART for zero-shot categorization — with real-time dashboards, improving actionable CX insight delivery by 60%.",
    ],
    stack: ["FastAPI", "React", "MySQL", "RoBERTa", "BART", "HuggingFace"],
  },
  {
    id: "docextract-india",
    title: "DocExtract India — AI Document Intelligence",
    period: "Jan 2025 – Present",
    start: "2025-01",
    end: "present",
    category: "vision",
    kind: "private",
    summary:
      "A multimodal document intelligence pipeline for structured extraction from Indian government documents (Aadhaar, PAN, passports), achieving 95% extraction accuracy.",
    highlights: [
      "Architected the extraction pipeline using LayoutLMv3 and Tesseract OCR.",
      "Built a production-ready FastAPI backend with Pydantic v2 validation, robust error handling, and optimized API pipelines, reducing document processing time by 85%.",
    ],
    stack: ["LayoutLMv3", "Tesseract OCR", "FastAPI", "Pydantic v2"],
  },
  {
    id: "vision-language-rl",
    title: "Self-Improving Vision-Language Support System",
    period: "Jan 2025 – Jan 2026",
    start: "2025-01",
    end: "2026-01",
    category: "vision",
    kind: "research",
    summary:
      "A memory-augmented multimodal AI system combining BLIP-2 vision-language understanding with PPO-based reinforcement learning for iterative self-improvement, analogous to RLHF alignment in production LLM systems.",
    highlights: [
      "Built a retrieval-augmented memory architecture using FAISS for episodic cross-session retrieval, enabling grounded and contextually consistent agent responses.",
      "Achieved 73.8% accuracy on VQAv2 and 68.3% on GQA benchmarks through reward-shaped PPO training.",
      "Written up in IEEE conference format.",
    ],
    stack: ["BLIP-2", "PPO", "FAISS", "PyTorch", "Reinforcement learning"],
  },
  {
    id: "library-management",
    title: "Library Management System",
    period: "Apr 2025",
    start: "2025-04",
    end: "2025-04",
    category: "web",
    kind: "open-source",
    summary:
      "A Django application to manage library operations, including book management, admin registration, and a student view for accessing library resources, built with RESTful APIs using Django REST Framework.",
    highlights: [
      "Complete CRUD operations for books",
      "Admin and student role management",
      "RESTful API implementation",
      "Responsive web interface",
    ],
    stack: ["Python", "Django", "Django REST Framework", "SQLite", "Bootstrap"],
    repoUrl: "https://github.com/Mayur2157/Library-Management-System",
  },
  {
    id: "liveness-detection",
    title: "Face & Blink Detection for Liveness Verification",
    period: "Feb 2025",
    start: "2025-02",
    end: "2025-02",
    category: "vision",
    kind: "open-source",
    summary:
      "A computer vision system for face detection and blink detection to verify liveness in biometric authentication.",
    highlights: [
      "Real-time face detection",
      "Blink detection for liveness verification",
      "Biometric authentication flow",
    ],
    stack: ["Python", "OpenCV", "Computer vision", "Machine learning"],
    repoUrl: "https://github.com/Mayur2157/Face-detection-and-blink-detection-for-liveness-verification",
  },
  {
    id: "churn-champion",
    title: "ChurnChampion — Customer Churn Prediction",
    period: "Oct 2024",
    start: "2024-10",
    end: "2024-10",
    category: "ml-data",
    kind: "open-source",
    summary:
      "A predictive modeling project that forecasts customer churn, identifying customers likely to discontinue a service.",
    highlights: ["Customer churn prediction", "Retention strategy insights", "Proactive customer management"],
    stack: ["Python", "Jupyter", "Scikit-learn", "Customer analytics"],
    repoUrl: "https://github.com/Mayur2157/-ChurnChampion-Churn-Prediction-Modeling-Project",
  },
  {
    id: "electricity-forecasting",
    title: "Household Electricity Consumption Forecasting",
    period: "Jul 2024 – Oct 2024",
    start: "2024-07",
    end: "2024-10",
    category: "ml-data",
    kind: "open-source",
    summary:
      "Predicts household electricity consumption from historical smart-meter readings and weather data.",
    highlights: ["Smart meter data integration", "Weather data incorporation", "ARIMA and LSTM models"],
    stack: ["Python", "Jupyter", "ARIMA", "LSTM", "Pandas", "Scikit-learn"],
    repoUrl: "https://github.com/Mayur2157/Household-Electricity-Consumption-Forecasting",
  },
  {
    id: "predictive-maintenance",
    title: "Predictive Maintenance for Industrial Equipment",
    period: "Aug 2024 – Oct 2024",
    start: "2024-08",
    end: "2024-10",
    category: "ml-data",
    kind: "open-source",
    summary:
      "Predicts equipment failures before they occur, helping avoid downtime and improve maintenance scheduling.",
    highlights: [
      "Industrial sensor data analysis",
      "Predictive modelling with ML",
      "Anomaly detection",
      "Maintenance scheduling optimization",
    ],
    stack: ["Python", "Jupyter", "Pandas", "Scikit-learn"],
    repoUrl:
      "https://github.com/Mayur2157/Predictive-Maintenance-for-Industrial-Equipment-Using-Machine-Learning",
  },
  {
    id: "sports-retail",
    title: "Sports Retail Analytics & Forecasting",
    period: "Aug 2024 – Oct 2024",
    start: "2024-08",
    end: "2024-10",
    category: "ml-data",
    kind: "open-source",
    summary:
      "Analyzes sales data, forecasts trends, and segments customers to improve revenue strategy for an online sports retail store.",
    highlights: [
      "Sales data analysis",
      "Trend forecasting",
      "Customer segmentation",
      "Revenue optimization strategies",
    ],
    stack: ["Python", "Data analytics", "Forecasting", "Customer segmentation"],
    repoUrl: "https://github.com/Mayur2157/Sports-Retail-Analytics-Forecasting",
  },
  {
    id: "google-search-analysis",
    title: "Google Search Analysis with Python",
    period: "Jul 2024 – Oct 2024",
    start: "2024-07",
    end: "2024-10",
    category: "web",
    kind: "open-source",
    summary:
      "A Flask web application that runs Google searches and analyzes the results with sentiment analysis and interactive keyword-frequency charts.",
    highlights: [
      "Interactive charts with Plotly",
      "Sentiment analysis",
      "Keyword frequency visualization",
    ],
    stack: ["Python", "Flask", "Plotly", "NLP", "Sentiment analysis"],
    repoUrl: "https://github.com/Mayur2157/Google-Search-Analysis-with-Python",
  },
  {
    id: "hand-gesture",
    title: "Hand Gesture Recognition",
    period: "Jul 2024",
    start: "2024-07",
    end: "2024-07",
    category: "vision",
    kind: "open-source",
    summary: "A real-time hand gesture recognition system using computer vision and deep learning.",
    highlights: ["Real-time gesture detection", "Deep learning classification", "OpenCV integration"],
    stack: ["Python", "OpenCV", "TensorFlow", "Deep learning"],
    repoUrl: "https://github.com/Mayur2157/Hand-gesture-recognition",
  },
];

const endKey = (project: Project) => (project.end === "present" ? "9999-99" : project.end);

/** Most recent activity first: ongoing work, then by end date, then by start date. */
export const projects: Project[] = [...projectList].sort(
  (a, b) => endKey(b).localeCompare(endKey(a)) || b.start.localeCompare(a.start),
);
