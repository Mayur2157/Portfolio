export type ProjectCategory = "genai" | "vision" | "ml-data" | "web";

/** "private" = no public repository; "research" = academic work; "open-source" = public GitHub repo. */
export type ProjectKind = "private" | "research" | "open-source";

export interface Project {
  id: string;
  title: string;
  /** Display period, as written on the resume. */
  period: string;
  /** YYYY-MM, used for ordering. */
  start: string;
  /** YYYY-MM, or "present". */
  end: string;
  category: ProjectCategory;
  kind: ProjectKind;
  summary: string;
  highlights: string[];
  stack: string[];
  repoUrl?: string;
}

export interface Role {
  title: string;
  company: string;
  period: string;
  current?: boolean;
  highlights: string[];
  stack: string[];
}

export interface Metric {
  value: string;
  label: string;
  context: string;
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

export interface Degree {
  degree: string;
  institution: string;
  location: string;
  period: string;
  note?: string;
}
