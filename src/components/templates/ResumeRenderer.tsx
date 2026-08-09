import React from "react";
import { ResumeData } from "../../types";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Award,
  Briefcase,
  GraduationCap,
  FolderGit2,
  UserCheck,
  Code2,
  Sparkles,
} from "lucide-react";

interface ResumeRendererProps {
  resume: ResumeData;
  scale?: number;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ resume, scale = 1 }) => {
  const {
    personalInfo,
    education,
    workExperience,
    skills,
    certifications,
    projects,
    professionalSummary,
    careerObjective,
    references,
    customization,
  } = resume;

  const accentColor = customization?.accentColor || customization?.themeColor || "#2563eb";
  const fontColor = customization?.fontColor || "#0f172a";
  const headingColor = customization?.headingColor || "#1e293b";
  const showPhoto = false;
  const showIcons = customization?.showIcons ?? true;
  const layoutMode = customization?.layoutMode || "header-accent";

  // Section order
  const getStageDefaultSections = (stage?: string) => {
    if (stage === "student") {
      return ["education", "projects", "skills", "experience", "certifications", "summary", "references"];
    }
    if (stage === "recent_graduate") {
      return ["education", "projects", "experience", "skills", "certifications", "summary", "references"];
    }
    return ["summary", "experience", "education", "skills", "projects", "certifications", "references"];
  };

  const defaultSections = getStageDefaultSections(resume.careerStage);
  const sectionOrder = customization?.sectionOrder?.length ? customization.sectionOrder : defaultSections;

  // Font class
  const getFontFamilyStyle = () => {
    switch (customization?.fontFamily) {
      case "merriweather":
      case "playfair":
      case "lora":
        return { fontFamily: "'Georgia', 'Times New Roman', serif" };
      case "space":
        return { fontFamily: "'Courier New', monospace" };
      case "jakarta":
      case "poppins":
      case "outfit":
      case "sourcesans":
      case "roboto":
      case "inter":
      default:
        return { fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" };
    }
  };

  // Font size multiplier
  const getFontSizeClass = () => {
    switch (customization?.fontSize) {
      case "sm":
        return "text-[12px] leading-relaxed";
      case "lg":
        return "text-[15px] leading-relaxed";
      case "md":
      default:
        return "text-[13.5px] leading-relaxed";
    }
  };

  // Margin padding
  const getMarginClass = () => {
    switch (customization?.margins) {
      case "compact":
        return "p-5 md:p-6 space-y-4";
      case "spacious":
        return "p-10 md:p-12 space-y-6";
      case "normal":
      default:
        return "p-8 md:p-10 space-y-5";
    }
  };

  // Border style
  const getBorderStyle = () => {
    switch (customization?.borderStyle) {
      case "double":
        return { borderBottom: `4px double ${accentColor}` };
      case "dashed":
        return { borderBottom: `2px dashed ${accentColor}` };
      case "top-bar":
        return { borderTop: `6px solid ${accentColor}` };
      case "solid":
      default:
        return { borderBottom: `2px solid ${accentColor}` };
    }
  };

  // Section Component Map
  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        return (professionalSummary || careerObjective) ? (
          <div key="summary" className="space-y-2">
            <SectionHeader title="PROFESSIONAL SUMMARY" icon={<Sparkles className="w-4 h-4" />} accentColor={accentColor} headingColor={headingColor} showIcons={showIcons} borderStyle={getBorderStyle()} />
            {professionalSummary && <p className="text-gray-700 whitespace-pre-line text-justify">{professionalSummary}</p>}
            {careerObjective && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <span className="font-semibold text-gray-900">Career Objective: </span>
                <span className="text-gray-700">{careerObjective}</span>
              </div>
            )}
          </div>
        ) : null;

      case "experience":
        return workExperience && workExperience.length > 0 ? (
          <div key="experience" className="space-y-3">
            <SectionHeader title="WORK EXPERIENCE" icon={<Briefcase className="w-4 h-4" />} accentColor={accentColor} headingColor={headingColor} showIcons={showIcons} borderStyle={getBorderStyle()} />
            <div className="space-y-4">
              {workExperience.map((exp) => (
                <div key={exp.id} className="relative pl-1">
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <div>
                      <h4 className="font-bold text-[15px]" style={{ color: headingColor }}>
                        {exp.position}
                      </h4>
                      <p className="font-medium text-gray-700">
                        {exp.companyName} {exp.location && <span className="text-gray-500 font-normal">• {exp.location}</span>}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                      {exp.startDate} – {exp.isCurrentJob ? "Present" : exp.endDate}
                    </span>
                  </div>

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="mt-1.5 list-disc list-outside ml-4 space-y-1 text-gray-700">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="pl-0.5">{resp}</li>
                      ))}
                    </ul>
                  )}

                  {exp.achievements && (
                    <div className="mt-1.5 p-2 rounded bg-gray-50 border-l-2" style={{ borderColor: accentColor }}>
                      <span className="font-bold text-xs" style={{ color: accentColor }}>Key Accomplishment: </span>
                      <span className="text-xs text-gray-800">{exp.achievements}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return education && education.length > 0 ? (
          <div key="education" className="space-y-3">
            <SectionHeader title="EDUCATION" icon={<GraduationCap className="w-4 h-4" />} accentColor={accentColor} headingColor={headingColor} showIcons={showIcons} borderStyle={getBorderStyle()} />
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <div>
                      <h4 className="font-bold text-[14.5px]" style={{ color: headingColor }}>
                        {edu.degree ? `${edu.degree} in ${edu.fieldOfStudy}` : edu.programme || edu.fieldOfStudy}
                      </h4>
                      <p className="text-gray-700 font-medium">
                        {edu.institutionName} {edu.country && <span className="text-gray-500 font-normal">({edu.country})</span>}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">
                      {edu.startYear} – {edu.isCurrentStudent ? "Present" : edu.completionYear}
                    </span>
                  </div>
                  {edu.gradeGpa && (
                    <p className="text-xs text-gray-600 mt-0.5">
                      <span className="font-semibold text-gray-900">GPA / Grade:</span> {edu.gradeGpa}
                    </p>
                  )}
                  {edu.relevantCoursework && (
                    <p className="text-xs text-gray-600 mt-0.5">
                      <span className="font-semibold text-gray-900">Relevant Coursework:</span> {edu.relevantCoursework}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return skills && skills.length > 0 ? (
          <div key="skills" className="space-y-2.5">
            <SectionHeader title="SKILLS & COMPETENCIES" icon={<Code2 className="w-4 h-4" />} accentColor={accentColor} headingColor={headingColor} showIcons={showIcons} borderStyle={getBorderStyle()} />
            <div className="flex flex-wrap gap-1.5">
              {skills.map((sk) => (
                <span
                  key={sk.id}
                  className="px-2.5 py-1 text-xs rounded-md font-medium border border-gray-200"
                  style={{ backgroundColor: `${accentColor}0A`, color: headingColor }}
                >
                  <strong style={{ color: accentColor }}>{sk.name}</strong> <span className="text-gray-500">({sk.level})</span>
                </span>
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return projects && projects.length > 0 ? (
          <div key="projects" className="space-y-3">
            <SectionHeader title="KEY PROJECTS" icon={<FolderGit2 className="w-4 h-4" />} accentColor={accentColor} headingColor={headingColor} showIcons={showIcons} borderStyle={getBorderStyle()} />
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <h4 className="font-bold text-[14px]" style={{ color: headingColor }}>
                      {proj.projectName}
                    </h4>
                    {proj.technologiesUsed && (
                      <span className="text-xs font-mono px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        {proj.technologiesUsed}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{proj.description}</p>
                  {(proj.projectLink || proj.githubLink) && (
                    <div className="flex gap-3 text-xs text-blue-600">
                      {proj.projectLink && <a href={proj.projectLink} target="_blank" rel="noreferrer" className="underline hover:text-blue-800">{proj.projectLink}</a>}
                      {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="underline hover:text-blue-800">{proj.githubLink}</a>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return certifications && certifications.length > 0 ? (
          <div key="certifications" className="space-y-2.5">
            <SectionHeader title="CERTIFICATIONS & LICENSES" icon={<Award className="w-4 h-4" />} accentColor={accentColor} headingColor={headingColor} showIcons={showIcons} borderStyle={getBorderStyle()} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-2 border border-gray-100 rounded bg-gray-50/60">
                  <h5 className="font-semibold text-xs" style={{ color: headingColor }}>{cert.certificationName}</h5>
                  <p className="text-[11.5px] text-gray-600">{cert.institution} • {cert.issueDate}</p>
                  {cert.credentialId && <p className="text-[10px] text-gray-500 font-mono">ID: {cert.credentialId}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "references":
        return references ? (
          <div key="references" className="space-y-2">
            <SectionHeader title="REFERENCES" icon={<UserCheck className="w-4 h-4" />} accentColor={accentColor} headingColor={headingColor} showIcons={showIcons} borderStyle={getBorderStyle()} />
            {references.type === "available_upon_request" && (
              <p className="text-gray-600 italic">Professional references available upon request.</p>
            )}
            {references.type === "custom" && references.customReferences?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {references.customReferences.map((ref) => (
                  <div key={ref.id} className="text-xs">
                    <p className="font-bold text-gray-900">{ref.name}</p>
                    <p className="text-gray-700">{ref.position} — {ref.company}</p>
                    <p className="text-gray-500">{ref.email} | {ref.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  // Two Column Sidebar Mode vs Header Accent Mode
  if (layoutMode === "two-column-left" || layoutMode === "sidebar-dark") {
    const isDark = layoutMode === "sidebar-dark";
    return (
      <div
        id="resume-printable-area"
        className={`w-full max-w-[800px] mx-auto bg-white shadow-xl rounded-sm overflow-hidden text-gray-900 transition-all ${getFontSizeClass()}`}
        style={{ ...getFontFamilyStyle(), transform: scale !== 1 ? `scale(${scale})` : "none", transformOrigin: "top center" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[1050px]">
          {/* Left Sidebar */}
          <div className={`md:col-span-4 p-6 space-y-6 ${isDark ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900 border-r border-slate-200"}`}>
            {/* Photo */}
            {showPhoto && personalInfo.photoUrl && (
              <div className="flex justify-center">
                <img src={personalInfo.photoUrl} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 shadow-md" style={{ borderColor: accentColor }} />
              </div>
            )}

            {/* Name & Title */}
            <div>
              <h1 className="text-xl font-extrabold tracking-tight" style={{ color: isDark ? "#ffffff" : headingColor }}>
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
              <p className="text-xs font-semibold mt-1" style={{ color: accentColor }}>
                {personalInfo.jobTitle || resume.targetJobTitle}
              </p>
            </div>

              {/* Contact Details */}
              <div className="space-y-2 text-xs opacity-90">
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                    <span className="truncate">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                    <span>{personalInfo.phoneNumber}</span>
                  </div>
                )}
                {(personalInfo.address || personalInfo.district || personalInfo.region || personalInfo.digitalAddress) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                    <span>
                      {[personalInfo.address, personalInfo.district, personalInfo.region, personalInfo.digitalAddress ? `GPS: ${personalInfo.digitalAddress}` : null].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                  <span className="truncate">{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                  <span className="truncate">{personalInfo.github}</span>
                </div>
              )}
            </div>

            {/* Skills in Sidebar */}
            {skills && skills.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200/20">
                <h3 className="font-bold text-xs uppercase tracking-wider" style={{ color: accentColor }}>Key Skills</h3>
                <div className="space-y-1.5">
                  {skills.map((sk) => (
                    <div key={sk.id} className="text-xs">
                      <div className="flex justify-between font-medium">
                        <span>{sk.name}</span>
                        <span className="opacity-75">{sk.level}</span>
                      </div>
                      <div className="w-full bg-gray-200/30 h-1.5 rounded-full mt-0.5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: getSkillWidth(sk.level), backgroundColor: accentColor }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-8 p-6 md:p-8 space-y-6">
            {sectionOrder.map((key) => renderSection(key))}
          </div>
        </div>
      </div>
    );
  }

  // Standard Header Accent Layout
  return (
    <div
      id="resume-printable-area"
      className={`w-full max-w-[800px] mx-auto bg-white shadow-xl rounded-sm overflow-hidden text-gray-900 ${getFontSizeClass()} ${getMarginClass()}`}
      style={{ ...getFontFamilyStyle(), transform: scale !== 1 ? `scale(${scale})` : "none", transformOrigin: "top center" }}
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 pb-4 border-b border-gray-200" style={{ borderBottomColor: `${accentColor}40` }}>
        <div className="space-y-1 text-center md:text-left flex-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: headingColor }}>
            {personalInfo.firstName} {personalInfo.middleName} {personalInfo.lastName}
          </h1>
          <p className="text-sm font-bold uppercase tracking-wide" style={{ color: accentColor }}>
            {personalInfo.jobTitle || resume.targetJobTitle}
          </p>

          {/* Contact Line */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-gray-600 pt-2">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                {showIcons && <Mail className="w-3 h-3 text-gray-400" />} {personalInfo.email}
              </span>
            )}
            {personalInfo.phoneNumber && (
              <span className="flex items-center gap-1">
                {showIcons && <Phone className="w-3 h-3 text-gray-400" />} {personalInfo.phoneNumber}
              </span>
            )}
            {(personalInfo.address || personalInfo.district || personalInfo.region || personalInfo.digitalAddress) && (
              <span className="flex items-center gap-1">
                {showIcons && <MapPin className="w-3 h-3 text-gray-400" />}
                {[personalInfo.address, personalInfo.district, personalInfo.region, personalInfo.digitalAddress ? `GPS: ${personalInfo.digitalAddress}` : null].filter(Boolean).join(", ")}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                {showIcons && <Linkedin className="w-3 h-3 text-gray-400" />} {personalInfo.linkedin}
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                {showIcons && <Github className="w-3 h-3 text-gray-400" />} {personalInfo.github}
              </span>
            )}
          </div>
        </div>

        {/* Profile Photo */}
        {showPhoto && personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 shadow-sm flex-shrink-0"
            style={{ borderColor: accentColor }}
          />
        )}
      </div>

      {/* Dynamic Rendered Sections */}
      {sectionOrder.map((key) => renderSection(key))}
    </div>
  );
};

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  accentColor: string;
  headingColor: string;
  showIcons: boolean;
  borderStyle: any;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon, accentColor, headingColor, showIcons, borderStyle }) => (
  <div className="pb-1 mb-2" style={borderStyle}>
    <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: headingColor }}>
      {showIcons && icon && <span style={{ color: accentColor }}>{icon}</span>}
      {title}
    </h3>
  </div>
);

function getSkillWidth(level: string): string {
  switch (level) {
    case "Beginner": return "35%";
    case "Intermediate": return "60%";
    case "Advanced": return "85%";
    case "Expert": return "100%";
    default: return "70%";
  }
}
