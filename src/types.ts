export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type SkillCategory =
  | "Technical Skills"
  | "Soft Skills"
  | "Languages"
  | "Computer Skills"
  | "Data Analysis"
  | "Programming"
  | "Design"
  | "Management"
  | "Communication"
  | "Leadership";

export interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
  digitalAddress?: string; // GhanaPost GPS (e.g., GA-183-9021)
  region?: string; // Ghana Region (e.g. Greater Accra Region)
  district?: string; // Ghana District / Municipality (e.g. Ayawaso West Municipal)
  phoneNumber: string;
  altPhoneNumber?: string;
  email: string;
  linkedin?: string;
  portfolio?: string;
  website?: string;
  github?: string;
  photoUrl?: string;
  jobTitle?: string;
}

export interface Education {
  id: string;
  institutionName: string;
  country: string;
  region?: string;
  programme?: string;
  fieldOfStudy: string;
  degree: string;
  startYear: string;
  completionYear: string;
  isCurrentStudent: boolean;
  gradeGpa?: string;
  relevantCoursework?: string;
  academicAchievements?: string;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  responsibilities: string[];
  achievements?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: SkillLevel;
  category: SkillCategory;
}

export interface Certification {
  id: string;
  certificationName: string;
  institution: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Project {
  id: string;
  projectName: string;
  description: string;
  technologiesUsed: string;
  projectLink?: string;
  githubLink?: string;
}

export type ReferenceType = "none" | "available_upon_request" | "custom";

export interface CustomReference {
  id: string;
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
}

export interface ReferenceData {
  type: ReferenceType;
  customReferences: CustomReference[];
}

export type FontFamily =
  | "inter"
  | "merriweather"
  | "playfair"
  | "roboto"
  | "jakarta"
  | "lora"
  | "poppins"
  | "space"
  | "outfit"
  | "sourcesans";

export type FontSize = "sm" | "md" | "lg";
export type LineSpacing = "tight" | "normal" | "relaxed";
export type MarginSize = "compact" | "normal" | "spacious";
export type PaperSize = "a4" | "letter";
export type LayoutMode =
  | "single-column"
  | "two-column-left"
  | "two-column-right"
  | "header-accent"
  | "sidebar-dark";

export type BorderStyle = "none" | "solid" | "double" | "dashed" | "top-bar";

export interface Customization {
  fontFamily: FontFamily;
  fontSize: FontSize;
  fontColor: string;
  headingColor: string;
  accentColor: string;
  lineSpacing: LineSpacing;
  margins: MarginSize;
  paperSize: PaperSize;
  sectionOrder: string[]; // e.g. ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'references']
  showProfilePicture: boolean;
  showIcons: boolean;
  layoutMode: LayoutMode;
  themeColor: string;
  borderStyle: BorderStyle;
}

export type CareerStage = "student" | "recent_graduate" | "professional";

export interface ResumeData {
  id: string;
  title: string;
  targetJobTitle: string;
  careerStage?: CareerStage;
  fieldOfStudy: string;
  yearsOfExperience: number;
  employmentStatus?: string;
  careerField?: string;
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  skills: SkillItem[];
  certifications: Certification[];
  projects: Project[];
  professionalSummary: string;
  careerObjective: string;
  references: ReferenceData;
  customization: Customization;
  createdAt: string;
  updatedAt: string;
  templateId: string;
}

export interface TemplateInfo {
  id: string;
  name: string;
  category:
    | "Modern"
    | "Executive"
    | "Corporate"
    | "Creative"
    | "Minimalist"
    | "Classic"
    | "Academic"
    | "Government"
    | "ATS Simple"
    | "Elegant"
    | "Tech"
    | "Medical"
    | "Finance"
    | "Engineering"
    | "Graduate";
  description: string;
  accentColor: string;
  layoutMode: LayoutMode;
  fontFamily: FontFamily;
  badge?: string;
}

export interface AtsAnalysisResult {
  score: number;
  missingKeywords: string[];
  formattingIssues: string[];
  suggestions: string[];
  strengthHighlights: string[];
  readabilityScore?: string;
  wordCount?: number;
}

export interface GrammarAuditResult {
  grammarIssues: { original: string; suggestion: string; reason: string }[];
  weakVerbs: { word: string; betterAlternatives: string[] }[];
  longSentences: string[];
  missingSections: string[];
  incompleteDates: string[];
}
