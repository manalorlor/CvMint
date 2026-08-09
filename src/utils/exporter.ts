import { ResumeData } from "../types";

export function exportToPlainText(resume: ResumeData): string {
  const { personalInfo, education, workExperience, skills, certifications, projects, professionalSummary, careerObjective } = resume;

  let text = `===========================================================\n`;
  text += `${personalInfo.firstName} ${personalInfo.middleName || ""} ${personalInfo.lastName}`.toUpperCase() + `\n`;
  if (personalInfo.jobTitle || resume.targetJobTitle) {
    text += `${personalInfo.jobTitle || resume.targetJobTitle}\n`;
  }
  text += `===========================================================\n`;
  text += `Email: ${personalInfo.email} | Phone: ${personalInfo.phoneNumber}\n`;
  if (personalInfo.address) text += `Address: ${personalInfo.address}\n`;
  if (personalInfo.linkedin) text += `LinkedIn: ${personalInfo.linkedin}\n`;
  if (personalInfo.github) text += `GitHub: ${personalInfo.github}\n`;
  text += `\n`;

  if (professionalSummary) {
    text += `--- PROFESSIONAL SUMMARY ---\n`;
    text += `${professionalSummary}\n\n`;
  }

  if (careerObjective) {
    text += `--- CAREER OBJECTIVE ---\n`;
    text += `${careerObjective}\n\n`;
  }

  if (workExperience && workExperience.length > 0) {
    text += `--- WORK EXPERIENCE ---\n`;
    for (const exp of workExperience) {
      text += `Position: ${exp.position}\n`;
      text += `Company: ${exp.companyName} (${exp.startDate} - ${exp.isCurrentJob ? "Present" : exp.endDate})\n`;
      if (exp.responsibilities) {
        for (const resp of exp.responsibilities) {
          text += `  * ${resp}\n`;
        }
      }
      if (exp.achievements) text += `  Accomplishment: ${exp.achievements}\n`;
      text += `\n`;
    }
  }

  if (education && education.length > 0) {
    text += `--- EDUCATION ---\n`;
    for (const edu of education) {
      text += `Degree: ${edu.degree} in ${edu.fieldOfStudy}\n`;
      text += `Institution: ${edu.institutionName} (${edu.startYear} - ${edu.isCurrentStudent ? "Present" : edu.completionYear})\n`;
      if (edu.gradeGpa) text += `GPA: ${edu.gradeGpa}\n`;
      if (edu.relevantCoursework) text += `Coursework: ${edu.relevantCoursework}\n`;
      text += `\n`;
    }
  }

  if (skills && skills.length > 0) {
    text += `--- SKILLS ---\n`;
    text += skills.map((s) => `${s.name} (${s.level})`).join(", ") + `\n\n`;
  }

  if (projects && projects.length > 0) {
    text += `--- PROJECTS ---\n`;
    for (const proj of projects) {
      text += `Project: ${proj.projectName} [${proj.technologiesUsed}]\n`;
      text += `${proj.description}\n`;
      if (proj.projectLink) text += `Link: ${proj.projectLink}\n`;
      text += `\n`;
    }
  }

  if (certifications && certifications.length > 0) {
    text += `--- CERTIFICATIONS ---\n`;
    for (const cert of certifications) {
      text += `${cert.certificationName} - ${cert.institution} (${cert.issueDate})\n`;
    }
  }

  return text;
}

export function exportToJson(resume: ResumeData): string {
  return JSON.stringify(resume, null, 2);
}

export function printResume(): void {
  window.print();
}

export function downloadFile(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  downloadBlob(blob, filename);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
