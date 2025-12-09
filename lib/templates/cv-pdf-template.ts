import type { CVData, WorkExperience, Project, Education } from "@/types/cv";

const SPACING = {
  xs: '4px',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  xxl: '22px',
  xxxl: '28px',
} as const;

const COLORS = {
  primary: '#2d3748',
  text: {
    primary: '#1a202c',
    secondary: '#4a5568',
    tertiary: '#718096',
  },
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e0',
    dark: '#2d3748',
  },
  background: '#ffffff',
} as const;

function formatDate(date: Date | "Present"): string {
  if (date === "Present") return "Present";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export function generateCVHTML(cv: CVData, showContractors: boolean = true): string {
  const technologies = cv.technologies
    .map((tech) => `<span class="tech-badge">${escapeHtml(tech)}</span>`)
    .join("");
  
  const skills = cv.skills
    .map((skill) => `<li>${escapeHtml(skill)}</li>`)
    .join("");
  
  const languages = cv.languages
    .map((lang) => `<span class="language-item">${escapeHtml(lang)}</span>`)
    .join("");

  const workExperience = cv.workExperience
    .map((exp: WorkExperience) => {
      const responsibilities = exp.responsibilities
        .map((resp) => `<li>${escapeHtml(resp)}</li>`)
        .join("");
      
      const contractorInfo = showContractors && exp.contractor
        ? ` <span class="via-text">via</span> ${escapeHtml(exp.contractor.name)}`
        : '';
      
      return `
        <div class="work-item">
          <div class="work-header">
            <div class="work-title-row">
              <h3 class="work-title">${escapeHtml(exp.title)}</h3>
              <span class="work-period">${formatDate(exp.period.start)} – ${formatDate(exp.period.end)}</span>
            </div>
            <div class="work-company">${escapeHtml(exp.company.name)}${contractorInfo}</div>
          </div>
          <div class="work-description">${escapeHtml(exp.description)}</div>
          ${responsibilities ? `<ul class="responsibilities-list">${responsibilities}</ul>` : ''}
        </div>
      `;
    }).join("");

  const education = cv.education
    .map((edu: Education) => `
      <div class="education-item">
        <div class="education-header">
          <div class="education-title-row">
            <h3 class="education-degree">${escapeHtml(edu.degree)}</h3>
            <span class="education-period">${formatDate(edu.period.start)} – ${formatDate(edu.period.end)}</span>
          </div>
          <div class="education-institution">${escapeHtml(edu.institution.name)}</div>
        </div>
        <div class="education-description">${escapeHtml(edu.description)}</div>
      </div>
    `).join("");

  const projects = cv.projects
    .map((project: Project) => `
      <div class="project-item">
        <h4 class="project-title">${escapeHtml(project.title)}</h4>
        <p class="project-description">${escapeHtml(project.description)}</p>
        ${project.link ? `<a href="${escapeHtml(project.link)}" class="project-link">View Project →</a>` : ''}
      </div>
    `).join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(cv.fullName)} - CV</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @page {
          size: A4;
          margin: 18mm 16mm 16mm 16mm;
        }

        html {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                       "Helvetica Neue", Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.6;
          color: ${COLORS.text.primary};
          background: ${COLORS.background};
          padding: 0;
          max-width: 210mm;
          margin: 0 auto;
        }

        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
          line-height: 1.3;
        }

        .header {
          margin-bottom: ${SPACING.xxl};
          padding-bottom: ${SPACING.lg};
          border-bottom: 2px solid ${COLORS.primary};
        }

        .name {
          font-size: 28pt;
          font-weight: 700;
          color: ${COLORS.primary};
          margin-bottom: ${SPACING.xs};
          letter-spacing: -0.5px;
        }

        .job-title {
          font-size: 14pt;
          color: ${COLORS.text.secondary};
          font-weight: 500;
          margin-bottom: ${SPACING.md};
        }

        .contact {
          display: flex;
          flex-wrap: wrap;
          gap: ${SPACING.lg};
          font-size: 9pt;
          color: ${COLORS.text.secondary};
        }

        .contact-item {
          display: flex;
          align-items: center;
        }

        .contact-item::before {
          content: "•";
          margin-right: ${SPACING.sm};
          color: ${COLORS.primary};
          font-weight: bold;
        }

        .contact-item:first-child::before {
          content: "";
          margin-right: 0;
        }

        .section {
          margin-bottom: ${SPACING.xl};
        }

        .section-title {
          font-size: 13pt;
          font-weight: 700;
          color: ${COLORS.primary};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: ${SPACING.md};
          padding-bottom: ${SPACING.sm};
          border-bottom: 1px solid ${COLORS.border.medium};
        }

        .about {
          font-size: 10pt;
          line-height: 1.7;
          color: ${COLORS.text.secondary};
          text-align: justify;
        }

        .tech-badges {
          display: flex;
          flex-wrap: wrap;
          gap: ${SPACING.sm};
          line-height: 1.8;
        }

        .tech-badge {
          font-size: 9pt;
          color: ${COLORS.text.secondary};
          background: #f7fafc;
          padding: 2px ${SPACING.sm};
          border-radius: 3px;
          border: 1px solid ${COLORS.border.light};
        }

        .languages {
          display: flex;
          flex-wrap: wrap;
          gap: ${SPACING.md};
          font-size: 10pt;
        }

        .language-item {
          color: ${COLORS.text.secondary};
          padding: ${SPACING.xs} ${SPACING.md};
          background: #f7fafc;
          border-radius: 3px;
          border: 1px solid ${COLORS.border.light};
        }

        .skills-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: ${SPACING.sm};
          font-size: 9pt;
        }

        .skills-list li {
          padding-left: ${SPACING.md};
          position: relative;
          color: ${COLORS.text.secondary};
          line-height: 1.6;
        }

        .skills-list li::before {
          content: "▸";
          color: ${COLORS.primary};
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        .work-item {
          margin-bottom: ${SPACING.lg};
        }

        .work-item:not(:last-child) {
          padding-bottom: ${SPACING.md};
          border-bottom: 1px solid ${COLORS.border.light};
        }

        .work-header {
          margin-bottom: ${SPACING.sm};
        }

        .work-title-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: ${SPACING.xs};
          gap: ${SPACING.md};
        }

        .work-title {
          font-size: 11pt;
          color: ${COLORS.text.primary};
          font-weight: 600;
          flex: 1;
        }

        .work-period {
          font-size: 9pt;
          color: ${COLORS.text.tertiary};
          font-weight: 500;
          white-space: nowrap;
          font-style: italic;
        }

        .work-company {
          font-size: 10pt;
          color: ${COLORS.text.secondary};
          font-weight: 500;
          margin-bottom: ${SPACING.xs};
        }

        .via-text {
          color: ${COLORS.text.tertiary};
          font-weight: 400;
          font-style: italic;
        }

        .work-description {
          font-size: 9pt;
          line-height: 1.6;
          color: ${COLORS.text.secondary};
          margin-bottom: ${SPACING.sm};
          font-style: italic;
        }

        .responsibilities-list {
          list-style: none;
          margin-top: ${SPACING.sm};
          font-size: 9pt;
        }

        .responsibilities-list li {
          padding-left: ${SPACING.md};
          position: relative;
          color: ${COLORS.text.secondary};
          line-height: 1.6;
          margin-bottom: ${SPACING.xs};
        }

        .responsibilities-list li::before {
          content: "•";
          color: ${COLORS.primary};
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        .education-item {
          margin-bottom: ${SPACING.lg};
        }

        .education-item:not(:last-child) {
          padding-bottom: ${SPACING.md};
          border-bottom: 1px solid ${COLORS.border.light};
        }

        .education-header {
          margin-bottom: ${SPACING.sm};
        }

        .education-title-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: ${SPACING.xs};
          gap: ${SPACING.md};
        }

        .education-degree {
          font-size: 11pt;
          color: ${COLORS.text.primary};
          font-weight: 600;
          flex: 1;
        }

        .education-period {
          font-size: 9pt;
          color: ${COLORS.text.tertiary};
          font-weight: 500;
          white-space: nowrap;
          font-style: italic;
        }

        .education-institution {
          font-size: 10pt;
          color: ${COLORS.text.secondary};
          font-weight: 500;
          margin-bottom: ${SPACING.xs};
        }

        .education-description {
          font-size: 9pt;
          line-height: 1.6;
          color: ${COLORS.text.secondary};
          font-style: italic;
        }

        .project-item {
          margin-bottom: ${SPACING.md};
        }

        .project-item:not(:last-child) {
          padding-bottom: ${SPACING.sm};
          border-bottom: 1px solid ${COLORS.border.light};
        }

        .project-title {
          font-size: 10pt;
          color: ${COLORS.text.primary};
          font-weight: 600;
          margin-bottom: ${SPACING.xs};
        }

        .project-description {
          font-size: 9pt;
          line-height: 1.6;
          color: ${COLORS.text.secondary};
          margin-bottom: ${SPACING.sm};
        }

        .project-link {
          font-size: 9pt;
          color: ${COLORS.primary};
          text-decoration: none;
          font-weight: 500;
        }

        .personal-values-list {
          list-style: none;
          font-size: 9pt;
        }

        .personal-values-list li {
          padding-left: ${SPACING.md};
          position: relative;
          color: ${COLORS.text.secondary};
          line-height: 1.7;
          margin-bottom: ${SPACING.xs};
        }

        .personal-values-list li::before {
          content: "✓";
          color: ${COLORS.primary};
          position: absolute;
          left: 0;
          font-weight: bold;
          font-size: 10pt;
        }

        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <header class="header">
        <h1 class="name">${escapeHtml(cv.fullName)}</h1>
        <div class="job-title">${escapeHtml(cv.title)}</div>
        <div class="contact">
          ${cv.contact.email ? `<div class="contact-item">${escapeHtml(cv.contact.email)}</div>` : ''}
          ${cv.contact.phone ? `<div class="contact-item">${escapeHtml(cv.contact.phone)}</div>` : ''}
          ${cv.contact.location ? `<div class="contact-item">${escapeHtml(cv.contact.location)}</div>` : ''}
        </div>
      </header>

      <section class="section">
        <h2 class="section-title">Professional Summary</h2>
        <div class="about">${escapeHtml(cv.about)}</div>
      </section>

      <section class="section">
        <h2 class="section-title">Work Experience</h2>
        ${workExperience}
      </section>

      <section class="section">
        <h2 class="section-title">Education</h2>
        ${education}
      </section>

      <section class="section">
        <h2 class="section-title">Technical Skills</h2>
        <div class="tech-badges">${technologies}</div>
      </section>

      <section class="section">
        <h2 class="section-title">Core Competencies</h2>
        <ul class="skills-list">${skills}</ul>
      </section>

      <section class="section">
        <h2 class="section-title">Languages</h2>
        <div class="languages">${languages}</div>
      </section>

      ${cv.projects.length > 0 ? `
      <section class="section">
        <h2 class="section-title">Personal Projects</h2>
        ${projects}
      </section>
      ` : ''}
    </body>
    </html>
  `;
}
