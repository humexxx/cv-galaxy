import type { CVData } from "@/types/cv";
import type { CVHighlight, CVSection } from "@/types/chat";

export class CVMatcher {
  private static extractTerms(cvData: CVData): Map<string, { section: CVSection; color: string }> {
    const terms = new Map<string, { section: CVSection; color: string }>();

    cvData.technologies.forEach(tech => {
      terms.set(tech.toLowerCase(), { section: "technologies", color: "yellow" });
    });

    cvData.skills.forEach(skill => {
      terms.set(skill.toLowerCase(), { section: "skills", color: "green" });
    });

    cvData.workExperience.forEach(exp => {
      terms.set(exp.company.name.toLowerCase(), { section: "workExperience", color: "blue" });
      terms.set(exp.title.toLowerCase(), { section: "workExperience", color: "blue" });
      if (exp.contractor) {
        terms.set(exp.contractor.name.toLowerCase(), { section: "workExperience", color: "blue" });
      }
    });

    cvData.projects.forEach(project => {
      terms.set(project.title.toLowerCase(), { section: "projects", color: "purple" });
    });

    return terms;
  }

  private static extractBacktickQuotes(text: string): string[] {
    const backtickRegex = /`([^`]+)`/g;
    const matches: string[] = [];
    let match;

    while ((match = backtickRegex.exec(text)) !== null) {
      matches.push(match[1]);
    }

    return matches;
  }

  private static findSectionAndColor(quotedText: string, cvData: CVData): { section: CVSection; color: string } | null {
    const lowerText = quotedText.toLowerCase();

    if (cvData.technologies.some(t => t.toLowerCase() === lowerText)) {
      return { section: "technologies", color: "yellow" };
    }

    if (cvData.skills.some(s => s.toLowerCase() === lowerText)) {
      return { section: "skills", color: "green" };
    }

    for (const exp of cvData.workExperience) {
      if (exp.company.name.toLowerCase() === lowerText || exp.title.toLowerCase() === lowerText) {
        return { section: "workExperience", color: "blue" };
      }
      if (exp.contractor && exp.contractor.name.toLowerCase() === lowerText) {
        return { section: "workExperience", color: "blue" };
      }
      const descLower = exp.description.toLowerCase();
      if (descLower.includes(lowerText)) {
        return { section: "workExperience", color: "blue" };
      }
    }

    for (const project of cvData.projects) {
      if (project.title.toLowerCase() === lowerText) {
        return { section: "projects", color: "purple" };
      }
      const descLower = project.description.toLowerCase();
      if (descLower.includes(lowerText)) {
        return { section: "projects", color: "purple" };
      }
    }

    const aboutLower = cvData.about.toLowerCase();
    if (aboutLower.includes(lowerText)) {
      return { section: "about", color: "green" };
    }

    return { section: "technologies", color: "yellow" };
  }

  static findHighlights(text: string, cvData: CVData): CVHighlight[] {
    const highlights: CVHighlight[] = [];
    const quotedTexts = this.extractBacktickQuotes(text);
    const seenTexts = new Set<string>();

    quotedTexts.forEach(quotedText => {
      if (!seenTexts.has(quotedText.toLowerCase())) {
        seenTexts.add(quotedText.toLowerCase());
        const metadata = this.findSectionAndColor(quotedText, cvData);
        
        if (metadata) {
          highlights.push({
            text: quotedText,
            section: metadata.section,
            color: metadata.color as "yellow" | "blue" | "green" | "purple"
          });
        }
      }
    });

    return highlights;
  }
}
