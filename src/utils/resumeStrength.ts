import { ResumeData, PersonalInfo } from "../types";

export interface ResumeStrengthResult {
  totalScore: number; // 0 - 100
  grade: "Needs Work" | "Fair" | "Good" | "Strong" | "Exceptional";
  color: string; // Tailwind color name / hex
  strokeColor: string;
  breakdown: {
    sectionScore: number; // Max 35
    maxSectionScore: number; // 35
    verbScore: number; // Max 30
    maxVerbScore: number; // 30
    atsScore: number; // Max 35
    maxAtsScore: number; // 35
  };
  details: {
    missingSections: string[];
    completedSections: string[];
    strongVerbsFound: string[];
    weakVerbsFound: string[];
    hasMetrics: boolean;
    metricsCount: number;
    hasLocation: boolean;
    hasContactInfo: boolean;
    skillsCount: number;
  };
  improvements: string[];
  strengths: string[];
}

const STRONG_VERBS = [
  "led",
  "engineered",
  "optimized",
  "architected",
  "implemented",
  "spearheaded",
  "delivered",
  "transformed",
  "pioneered",
  "automated",
  "managed",
  "designed",
  "developed",
  "accelerated",
  "orchestrated",
  "achieved",
  "increased",
  "reduced",
  "created",
  "launched",
  "resolved",
  "initiated",
  "built",
  "constructed",
  "expanded",
  "generated",
  "directed",
  "established",
  "formulated",
  "maximized",
  "streamlined",
];

const WEAK_PHRASES = [
  "responsible for",
  "worked on",
  "helped with",
  "handled",
  "assisted in", "assisted with",
  "tasks included",
  "duties included",
  "in charge of",
  "helped out",
  "participated in",
  "did",
  "made sure",
];

export function calculateResumeStrength(resume: ResumeData): ResumeStrengthResult {
  const missingSections: string[] = [];
  const completedSections: string[] = [];
  const improvements: string[] = [];
  const strengths: string[] = [];

  // --- 1. SECTION COMPLETENESS (Max 35 pts) ---
  let sectionScore = 0;

  // Personal Info (10 pts)
  const p: PersonalInfo = resume.personalInfo || {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  };
  if (p.firstName && p.lastName && p.email && p.phoneNumber) {
    sectionScore += 10;
    completedSections.push("Personal & Contact Details");
  } else {
    missingSections.push("Complete Contact Details (Name, Email, Phone)");
    improvements.push("Fill out all basic contact details in Personal Info.");
  }

  // Summary (5 pts)
  if (resume.professionalSummary && resume.professionalSummary.trim().length > 40) {
    sectionScore += 5;
    completedSections.push("Professional Summary");
  } else {
    missingSections.push("Professional Summary");
    improvements.push("Add a compelling 2-3 sentence Professional Summary.");
  }

  // Work Experience (10 pts)
  if (resume.workExperience && resume.workExperience.length > 0) {
    sectionScore += 10;
    completedSections.push("Work Experience");
  } else {
    missingSections.push("Work Experience");
    improvements.push("Add at least 1 work experience entry or relevant internship.");
  }

  // Education (5 pts)
  if (resume.education && resume.education.length > 0) {
    sectionScore += 5;
    completedSections.push("Education History");
  } else {
    missingSections.push("Education");
    improvements.push("Add your degree or tertiary institution details.");
  }

  // Skills (5 pts)
  const skillsCount = resume.skills?.length || 0;
  if (skillsCount >= 4) {
    sectionScore += 5;
    completedSections.push("Skills & Competencies");
  } else {
    missingSections.push("Skills (at least 4 core skills)");
    improvements.push("Add at least 4-6 key technical & soft skills.");
  }

  // --- 2. WEAK VERBS vs STRONG VERBS (Max 30 pts) ---
  let verbScore = 15; // Base score
  const strongVerbsFoundSet = new Set<string>();
  const weakVerbsFoundSet = new Set<string>();

  // Extract all text
  const expTexts = (resume.workExperience || [])
    .map((w) => (w.responsibilities ? w.responsibilities.join(" ") : "") + " " + (w.achievements || ""))
    .join(" ");
  const projTexts = (resume.projects || [])
    .map((proj) => proj.projectName + " " + proj.description + " " + proj.technologiesUsed)
    .join(" ");
  const fullText = (expTexts + " " + projTexts + " " + (resume.professionalSummary || "")).toLowerCase();

  STRONG_VERBS.forEach((verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, "i");
    if (regex.test(fullText)) {
      strongVerbsFoundSet.add(verb);
    }
  });

  WEAK_PHRASES.forEach((phrase) => {
    if (fullText.includes(phrase)) {
      weakVerbsFoundSet.add(phrase);
    }
  });

  const strongVerbsFound = Array.from(strongVerbsFoundSet);
  const weakVerbsFound = Array.from(weakVerbsFoundSet);

  // Score adjustments
  if (strongVerbsFound.length >= 5) {
    verbScore += 15;
    strengths.push(`Found ${strongVerbsFound.length} strong action verbs (e.g. ${strongVerbsFound.slice(0, 3).join(", ")})`);
  } else if (strongVerbsFound.length >= 2) {
    verbScore += 8;
    improvements.push("Use more action verbs like 'Spearheaded', 'Optimized', or 'Architected' in bullet points.");
  } else {
    improvements.push("Incorporate strong action verbs at the start of work bullet points.");
  }

  if (weakVerbsFound.length > 0) {
    verbScore = Math.max(0, verbScore - weakVerbsFound.length * 3);
    improvements.push(`Replace weak/passive phrases like "${weakVerbsFound.slice(0, 2).map((w) => `'${w}'`).join(", ")}" with active results.`);
  }

  verbScore = Math.min(30, Math.max(0, verbScore));

  // --- 3. ATS OPTIMIZATION & METRICS (Max 35 pts) ---
  let atsScore = 0;

  // Quantified Achievements (Check for numbers, %, $, k/m) (15 pts)
  const metricsRegex = /\b\d+(%|\+|\s?k|\s?m|x)?\b|\$\d+|\b(percent|million|thousand)\b/gi;
  const metricsMatches = fullText.match(metricsRegex) || [];
  const hasMetrics = metricsMatches.length >= 2;

  if (metricsMatches.length >= 4) {
    atsScore += 15;
    strengths.push(`Excellent quantification! Found ${metricsMatches.length} measurable metrics in your experience.`);
  } else if (metricsMatches.length >= 1) {
    atsScore += 8;
    improvements.push("Add more numbers, percentages, or metrics (e.g. 'Increased efficiency by 25%').");
  } else {
    improvements.push("Include measurable numbers or KPIs in work experience (e.g. 'Managed 5 projects', 'Grew reach by 40%').");
  }

  // Location & Ghana Post GPS / Region (10 pts)
  const hasLocation = Boolean(p.region || p.district || p.address);
  const hasDigitalAddress = Boolean(p.digitalAddress);
  if (hasLocation && hasDigitalAddress) {
    atsScore += 10;
    strengths.push("Includes Ghana region and GhanaPost GPS digital address.");
  } else if (hasLocation) {
    atsScore += 6;
    improvements.push("Add your Digital Address (GPS) for complete Ghana contact compliance.");
  } else {
    improvements.push("Specify your Administrative Region and Location in Personal Info.");
  }

  // Role Alignment & Target Job Title (10 pts)
  if (resume.targetJobTitle && resume.targetJobTitle.trim().length > 2) {
    atsScore += 10;
    strengths.push(`Targeted role clearly specified: "${resume.targetJobTitle}".`);
  } else {
    improvements.push("Define a clear Target Job Title in Personal Info or Header.");
  }

  const totalScore = Math.min(100, Math.max(0, Math.round(sectionScore + verbScore + atsScore)));

  let grade: ResumeStrengthResult["grade"] = "Needs Work";
  let color = "red";
  let strokeColor = "#ef4444";

  if (totalScore >= 90) {
    grade = "Exceptional";
    color = "emerald";
    strokeColor = "#10b981";
  } else if (totalScore >= 75) {
    grade = "Strong";
    color = "blue";
    strokeColor = "#3b82f6";
  } else if (totalScore >= 60) {
    grade = "Good";
    color = "amber";
    strokeColor = "#f59e0b";
  } else if (totalScore >= 40) {
    grade = "Fair";
    color = "orange";
    strokeColor = "#f97316";
  }

  return {
    totalScore,
    grade,
    color,
    strokeColor,
    breakdown: {
      sectionScore,
      maxSectionScore: 35,
      verbScore,
      maxVerbScore: 30,
      atsScore,
      maxAtsScore: 35,
    },
    details: {
      missingSections,
      completedSections,
      strongVerbsFound,
      weakVerbsFound,
      hasMetrics,
      metricsCount: metricsMatches.length,
      hasLocation,
      hasContactInfo: Boolean(p.email && p.phoneNumber),
      skillsCount,
    },
    improvements,
    strengths,
  };
}

