import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { ResumeData } from "../types";

export async function exportToDocx(resume: ResumeData): Promise<Blob> {
  const { personalInfo, education, workExperience, skills, certifications, projects, professionalSummary, careerObjective, references } = resume;

  const primaryColor = resume.customization?.accentColor?.replace("#", "") || "2563EB";

  const children: any[] = [];

  // Header Title Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${personalInfo.firstName} ${personalInfo.middleName || ""} ${personalInfo.lastName}`.trim().toUpperCase(),
          bold: true,
          size: 32, // 16pt
          color: primaryColor,
        }),
      ],
    })
  );

  // Subtitle / Job Title
  if (personalInfo.jobTitle || resume.targetJobTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: personalInfo.jobTitle || resume.targetJobTitle,
            size: 22,
            bold: true,
            color: "475569",
          }),
        ],
      })
    );
  }

  // Contact info line
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phoneNumber) contactParts.push(personalInfo.phoneNumber);
  
  const fullAddress = [
    personalInfo.address,
    personalInfo.district,
    personalInfo.region,
    personalInfo.digitalAddress ? `GPS: ${personalInfo.digitalAddress}` : null
  ].filter(Boolean).join(", ");
  if (fullAddress) contactParts.push(fullAddress);

  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo.github) contactParts.push(personalInfo.github);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: contactParts.join("  |  "),
            size: 18,
            color: "64748B",
          }),
        ],
      })
    );
  }

  // Divider
  children.push(createSectionHeading("PROFESSIONAL SUMMARY", primaryColor));

  // Summary
  if (professionalSummary) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: professionalSummary,
            size: 20,
          }),
        ],
      })
    );
  }

  // Career Objective
  if (careerObjective) {
    children.push(createSectionHeading("CAREER OBJECTIVE", primaryColor));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: careerObjective,
            size: 20,
          }),
        ],
      })
    );
  }

  // Experience
  if (workExperience && workExperience.length > 0) {
    children.push(createSectionHeading("WORK EXPERIENCE", primaryColor));

    for (const exp of workExperience) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 22,
              color: "1E293B",
            }),
            new TextRun({
              text: `  —  ${exp.companyName}${exp.location ? ` (${exp.location})` : ""}`,
              italics: true,
              size: 20,
            }),
            new TextRun({
              text: `\t${exp.startDate} - ${exp.isCurrentJob ? "Present" : exp.endDate}`,
              bold: true,
              size: 18,
              color: primaryColor,
            }),
          ],
        })
      );

      if (exp.responsibilities && exp.responsibilities.length > 0) {
        for (const resp of exp.responsibilities) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [
                new TextRun({
                  text: resp,
                  size: 20,
                }),
              ],
            })
          );
        }
      }

      if (exp.achievements) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Key Accomplishment: ",
                bold: true,
                size: 19,
                color: primaryColor,
              }),
              new TextRun({
                text: exp.achievements,
                italics: true,
                size: 19,
              }),
            ],
          })
        );
      }
    }
  }

  // Education
  if (education && education.length > 0) {
    children.push(createSectionHeading("EDUCATION", primaryColor));

    for (const edu of education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.degree ? `${edu.degree} in ${edu.fieldOfStudy}` : edu.programme || edu.fieldOfStudy,
              bold: true,
              size: 22,
              color: "1E293B",
            }),
            new TextRun({
              text: `  —  ${edu.institutionName}${edu.country ? `, ${edu.country}` : ""}`,
              italics: true,
              size: 20,
            }),
            new TextRun({
              text: `\t${edu.startYear} - ${edu.isCurrentStudent ? "Present" : edu.completionYear}`,
              bold: true,
              size: 18,
              color: primaryColor,
            }),
          ],
        })
      );

      if (edu.gradeGpa) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "GPA / Grade: ", bold: true, size: 19 }),
              new TextRun({ text: edu.gradeGpa, size: 19 }),
            ],
          })
        );
      }

      if (edu.relevantCoursework) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Relevant Coursework: ", bold: true, size: 19 }),
              new TextRun({ text: edu.relevantCoursework, size: 19 }),
            ],
          })
        );
      }
    }
  }

  // Skills
  if (skills && skills.length > 0) {
    children.push(createSectionHeading("SKILLS & COMPETENCIES", primaryColor));

    const skillList = skills.map((s) => `${s.name} (${s.level})`).join("   •   ");
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: skillList,
            size: 20,
          }),
        ],
      })
    );
  }

  // Projects
  if (projects && projects.length > 0) {
    children.push(createSectionHeading("PROJECTS", primaryColor));

    for (const proj of projects) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: proj.projectName,
              bold: true,
              size: 22,
              color: "1E293B",
            }),
            proj.technologiesUsed
              ? new TextRun({
                  text: ` [${proj.technologiesUsed}]`,
                  italics: true,
                  size: 19,
                  color: primaryColor,
                })
              : new TextRun({ text: "" }),
          ],
        })
      );

      if (proj.description) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: proj.description,
                size: 20,
              }),
            ],
          })
        );
      }
    }
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    children.push(createSectionHeading("CERTIFICATIONS", primaryColor));

    for (const cert of certifications) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.certificationName,
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: ` — ${cert.institution} (${cert.issueDate}${cert.expiryDate ? ` - ${cert.expiryDate}` : ""})`,
              size: 19,
              color: "475569",
            }),
          ],
        })
      );
    }
  }

  // References
  if (references) {
    children.push(createSectionHeading("REFERENCES", primaryColor));
    if (references.type === "none") {
      // omit
    } else if (references.type === "available_upon_request") {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Professional references available upon request.",
              italics: true,
              size: 20,
            }),
          ],
        })
      );
    } else if (references.customReferences && references.customReferences.length > 0) {
      for (const ref of references.customReferences) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: ref.name, bold: true, size: 20 }),
              new TextRun({ text: ` — ${ref.position} at ${ref.company}`, size: 19 }),
              new TextRun({ text: ` (${ref.email} | ${ref.phone})`, size: 18, color: "64748B" }),
            ],
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

function createSectionHeading(title: string, colorHex: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: {
      before: 240,
      after: 120,
    },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 24, // 12pt
        color: colorHex,
      }),
    ],
    border: {
      bottom: {
        color: colorHex,
        space: 4,
        style: BorderStyle.SINGLE,
        size: 8,
      },
    },
  });
}
