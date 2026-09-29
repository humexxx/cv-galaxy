import type { CVData, WorkExperience, Project, Education } from "@/types/cv";
import { formatMonthYear } from "@/lib/utils/date";

// Print-tuned translation of the iOS design language. Everything here is
// measured for A4 with the 18/16/16/16mm margins the PDF route prints with:
// hairline rules instead of borders, generous but not wasteful whitespace,
// and ink kept low so the document stays legible in greyscale.
const SPACING = {
  xxs: "2px",
  xs: "4px",
  sm: "6px",
  md: "9px",
  lg: "13px",
  xl: "18px",
  xxl: "24px",
} as const;

const COLORS = {
  // systemBlue, used sparingly: role subtitle and links only.
  accent: "#007AFF",
  text: {
    // label / secondaryLabel / tertiaryLabel
    primary: "#1C1C1E",
    secondary: "#3C3C43",
    // secondaryLabel at 60% is an on-screen value; on paper it prints too
    // faint at 9pt, so body copy uses a slightly denser mix.
    secondaryMuted: "rgba(60, 60, 67, 0.6)",
    body: "rgba(60, 60, 67, 0.78)",
    tertiary: "#8E8E93",
  },
  separator: {
    // Hairlines. `strong` closes the header, `hairline` divides list rows.
    strong: "#D1D1D6",
    hairline: "#E5E5EA",
  },
  fill: "#F2F2F7", // systemGroupedBackground, used for chips
  marker: "#AEAEB2",
  background: "#ffffff",
} as const;

// No webfonts: Puppeteer's Chromium renders offline, so this must resolve
// against whatever the host has installed.
const FONT_STACK = `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

/**
 * Escapes plain-text CV fields before they are interpolated into the HTML
 * string. Do NOT run this over `responsibilitiesHtml`: that field is real
 * HTML and is sanitized with `sanitize-html` on write.
 */
function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

/**
 * Only emit an href for schemes that cannot execute script. An unchecked
 * project link could otherwise carry `javascript:` into the document.
 */
function isSafeUrl(url: string): boolean {
  return /^(https?:\/\/|mailto:)/i.test(url.trim());
}

export function generateCVHTML(cv: CVData, showContractors: boolean = true): string {
  const technologies = cv.technologies
    .map((tech) => `<span class="chip">${escapeHtml(tech)}</span>`)
    .join("");

  const skills = cv.skills
    .map((skill) => `<li>${escapeHtml(skill)}</li>`)
    .join("");

  const languages = cv.languages
    .map((lang) => `<span class="chip">${escapeHtml(lang)}</span>`)
    .join("");

  const workExperience = cv.workExperience
    .map((exp: WorkExperience) => {
      const responsibilities = exp.responsibilitiesHtml ?? "";
      const hasResponsibilities = responsibilities.trim().length > 0;
      const contractorInfo =
        showContractors && exp.contractor
          ? ` <span class="via-text">via</span> ${escapeHtml(exp.contractor.name)}`
          : "";

      return `
        <article class="entry">
          <div class="entry-row">
            <h3 class="entry-title">${escapeHtml(exp.title)}</h3>
            <span class="entry-period">${formatMonthYear(exp.period.start)} – ${formatMonthYear(exp.period.end)}</span>
          </div>
          <div class="entry-subtitle">${escapeHtml(exp.company.name)}${contractorInfo}</div>
          <p class="entry-description">${escapeHtml(exp.description)}</p>
          ${hasResponsibilities ? `<div class="rich-text">${responsibilities}</div>` : ""}
        </article>
      `;
    })
    .join("");

  const education = cv.education
    .map(
      (edu: Education) => `
      <article class="entry">
        <div class="entry-row">
          <h3 class="entry-title">${escapeHtml(edu.degree)}</h3>
          <span class="entry-period">${formatMonthYear(edu.period.start)} – ${formatMonthYear(edu.period.end)}</span>
        </div>
        <div class="entry-subtitle">${escapeHtml(edu.institution.name)}</div>
        <p class="entry-description">${escapeHtml(edu.description)}</p>
      </article>
    `
    )
    .join("");

  const projects = cv.projects
    .map((project: Project) => {
      const link = project.link
        ? isSafeUrl(project.link)
          ? `<a href="${escapeHtml(project.link)}" class="project-link">View Project →</a>`
          : `<span class="project-link">View Project →</span>`
        : "";

      return `
      <article class="entry entry--compact">
        <h4 class="entry-title entry-title--small">${escapeHtml(project.title)}</h4>
        <p class="entry-description">${escapeHtml(project.description)}</p>
        ${link}
      </article>
    `;
    })
    .join("");

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
          font-family: ${FONT_STACK};
          font-size: 9.5pt;
          line-height: 1.5;
          color: ${COLORS.text.primary};
          background: ${COLORS.background};
          -webkit-font-smoothing: antialiased;
          max-width: 210mm;
          margin: 0 auto;
          orphans: 2;
          widows: 2;
        }

        h1, h2, h3, h4 {
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }

        a {
          color: ${COLORS.accent};
          text-decoration: none;
        }

        /* ---------- Header ---------- */

        .header {
          padding-bottom: ${SPACING.lg};
          margin-bottom: ${SPACING.xl};
          border-bottom: 0.5pt solid ${COLORS.separator.strong};
        }

        .name {
          font-size: 25pt;
          font-weight: 700;
          letter-spacing: -0.024em;
          line-height: 1.08;
          color: ${COLORS.text.primary};
        }

        .job-title {
          margin-top: ${SPACING.xs};
          font-size: 12pt;
          font-weight: 500;
          letter-spacing: -0.012em;
          color: ${COLORS.accent};
        }

        .contact {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          margin-top: ${SPACING.md};
          font-size: 8.5pt;
          color: ${COLORS.text.secondaryMuted};
        }

        .contact-item + .contact-item::before {
          content: "·";
          margin: 0 7px;
          color: ${COLORS.marker};
        }

        /* ---------- Sections (iOS grouped-list headers) ---------- */

        .section {
          margin-bottom: ${SPACING.xl};
        }

        .section:last-of-type {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 8pt;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: ${COLORS.text.tertiary};
          margin-bottom: ${SPACING.md};
          padding-bottom: ${SPACING.xs};
          border-bottom: 0.5pt solid ${COLORS.separator.hairline};
          break-after: avoid;
          page-break-after: avoid;
        }

        .about {
          color: ${COLORS.text.secondary};
          line-height: 1.55;
        }

        /* ---------- Entries: work, education, projects ---------- */

        .entry {
          padding-bottom: ${SPACING.lg};
          margin-bottom: ${SPACING.lg};
          border-bottom: 0.5pt solid ${COLORS.separator.hairline};
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .entry--compact {
          padding-bottom: ${SPACING.md};
          margin-bottom: ${SPACING.md};
        }

        .entry:last-child {
          padding-bottom: 0;
          margin-bottom: 0;
          border-bottom: 0;
        }

        .entry-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: ${SPACING.lg};
        }

        .entry-title {
          flex: 1;
          font-size: 11pt;
          font-weight: 600;
          color: ${COLORS.text.primary};
        }

        .entry-title--small {
          font-size: 10pt;
        }

        .entry-period {
          font-size: 8.5pt;
          font-weight: 400;
          color: ${COLORS.text.tertiary};
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }

        .entry-subtitle {
          margin-top: ${SPACING.xxs};
          font-size: 9.5pt;
          font-weight: 500;
          color: ${COLORS.text.secondary};
        }

        .via-text {
          font-weight: 400;
          color: ${COLORS.text.tertiary};
        }

        .entry-description {
          margin-top: ${SPACING.xs};
          font-size: 9pt;
          line-height: 1.5;
          color: ${COLORS.text.body};
        }

        /* ---------- Sanitized rich text (responsibilities) ---------- */

        .rich-text {
          margin-top: ${SPACING.sm};
          font-size: 9pt;
          line-height: 1.5;
          color: ${COLORS.text.secondary};
        }

        .rich-text p {
          margin-bottom: ${SPACING.xs};
        }

        .rich-text p:last-child {
          margin-bottom: 0;
        }

        .rich-text ul {
          list-style: none;
          margin: ${SPACING.xs} 0;
          padding: 0;
        }

        .rich-text ul li {
          position: relative;
          padding-left: ${SPACING.lg};
          margin-bottom: ${SPACING.xxs};
        }

        .rich-text ul li::before {
          content: "";
          position: absolute;
          left: 3px;
          top: 0.55em;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: ${COLORS.marker};
        }

        .rich-text ol {
          margin: ${SPACING.xs} 0 ${SPACING.xs} ${SPACING.xl};
          padding: 0;
          list-style: decimal;
        }

        .rich-text ol li {
          margin-bottom: ${SPACING.xxs};
        }

        .rich-text li:last-child {
          margin-bottom: 0;
        }

        .rich-text strong {
          font-weight: 600;
          color: ${COLORS.text.primary};
        }

        .rich-text em {
          font-style: italic;
        }

        .rich-text h2,
        .rich-text h3 {
          font-size: 9.5pt;
          font-weight: 600;
          color: ${COLORS.text.primary};
          margin: ${SPACING.sm} 0 ${SPACING.xxs};
          break-after: avoid;
          page-break-after: avoid;
        }

        .rich-text a {
          text-decoration: underline;
        }

        /* ---------- Chips: technologies and languages ---------- */

        .chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .chip {
          font-size: 8.5pt;
          line-height: 1.3;
          color: ${COLORS.text.secondary};
          background: ${COLORS.fill};
          border: 0.5pt solid ${COLORS.separator.hairline};
          border-radius: 10px;
          padding: 3px 9px;
          break-inside: avoid;
        }

        /* ---------- Two-column bulleted list ---------- */

        .skills-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: ${SPACING.xs} ${SPACING.xxl};
          font-size: 9pt;
        }

        .skills-list li {
          position: relative;
          padding-left: ${SPACING.lg};
          color: ${COLORS.text.secondary};
          line-height: 1.45;
          break-inside: avoid;
        }

        .skills-list li::before {
          content: "";
          position: absolute;
          left: 3px;
          top: 0.55em;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: ${COLORS.marker};
        }

        /* ---------- Projects ---------- */

        .project-link {
          display: inline-block;
          margin-top: ${SPACING.xs};
          font-size: 8.5pt;
          font-weight: 500;
          color: ${COLORS.accent};
        }

        /* A link we refused to make clickable should not look clickable. */
        span.project-link {
          color: ${COLORS.text.tertiary};
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
        <div class="chip-group">${technologies}</div>
      </section>

      <section class="section">
        <h2 class="section-title">Core Competencies</h2>
        <ul class="skills-list">${skills}</ul>
      </section>

      <section class="section">
        <h2 class="section-title">Languages</h2>
        <div class="chip-group">${languages}</div>
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
