import { cache } from "react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or, ilike } from "drizzle-orm";
import type { CVData, WorkExperience, Education, Project } from "@/types/cv";
import type { DbCVWithRelations } from "@/types/db";

// The row fetch is cached on username alone, deliberately: `showContractors`
// only changes how the rows are projected, not which rows are read. Keying the
// cache on it too meant generateMetadata (which passes `true`) and the page
// (which passes the user's preference) issued the same query twice per request.
const findCVRow = cache(async (username: string) =>
  db.query.users.findFirst({
    where: eq(users.username, username),
    with: {
      workExperience: {
        orderBy: (workExperience, { asc }) => [asc(workExperience.sortOrder)],
        with: {
          company: true,
          contractor: true,
        },
      },
      education: {
        orderBy: (education, { asc }) => [asc(education.sortOrder)],
        with: {
          institution: true,
        },
      },
      projects: {
        orderBy: (projects, { asc }) => [asc(projects.sortOrder)],
      },
      technologies: {
        orderBy: (technologies, { asc }) => [asc(technologies.sortOrder)],
      },
      languages: {
        orderBy: (languages, { asc }) => [asc(languages.sortOrder)],
      },
      skills: {
        orderBy: (skills, { asc }) => [asc(skills.sortOrder)],
      },
      personalValues: {
        orderBy: (personalValues, { asc }) => [asc(personalValues.sortOrder)],
      },
    },
  })
);

export class CVService {
  async getCVByUsername(username: string, showContractors: boolean = true): Promise<CVData | null> {
    const cv = await findCVRow(username.toLowerCase());

    if (!cv) return null;

    // Transform database result to CVData format
    return this.transformToCVData(cv, showContractors);
  }

  async searchCVs(query: string) {
    if (!query.trim()) {
      return [];
    }

    // `%` and `_` are LIKE wildcards: without escaping, a search for "100%"
    // matches everything. `\` is the default LIKE escape character.
    const escaped = query.trim().replace(/[\\%_]/g, (char) => `\\${char}`);
    const pattern = `%${escaped}%`;

    const results = await db.query.users.findMany({
      where: or(
        ilike(users.username, pattern),
        ilike(users.fullName, pattern),
        ilike(users.title, pattern)
      ),
      columns: {
        username: true,
        fullName: true,
        title: true,
        avatar: true,
      },
      limit: 20,
    });

    return results.map(r => ({
      username: r.username,
      fullName: r.fullName,
      title: r.title,
      avatar: r.avatar ?? undefined,
    }));
  }

  async getTopResults() {
    const results = await db.query.users.findMany({
      columns: {
        username: true,
        fullName: true,
        title: true,
        avatar: true,
      },
      // LIMIT without ORDER BY lets Postgres return a different five rows run to
      // run, which makes the empty-query dropdown flicker between renders.
      orderBy: (user, { asc }) => [asc(user.createdAt)],
      limit: 5,
    });

    return results.map(r => ({
      username: r.username,
      fullName: r.fullName,
      title: r.title,
      avatar: r.avatar ?? undefined,
    }));
  }

  private transformToCVData(cv: DbCVWithRelations, showContractors: boolean = true): CVData {
    const workExperience: WorkExperience[] = cv.workExperience.map((work) => ({
      id: work.id,
      title: work.title,
      company: {
        id: work.company.id,
        name: work.company.name,
        website: work.company.website ?? undefined,
        logo: work.company.logo ?? undefined,
      },
      contractor: showContractors && work.contractor
        ? {
            id: work.contractor.id,
            name: work.contractor.name,
            website: work.contractor.website ?? undefined,
            logo: work.contractor.logo ?? undefined,
          }
        : undefined,
      period: {
        start: new Date(work.startDate),
        end: work.endDate ? new Date(work.endDate) : "Present",
      },
      description: work.description,
      responsibilitiesHtml: work.responsibilitiesHtml,
    }));

    const education: Education[] = cv.education.map((edu) => ({
      degree: edu.degree,
      institution: {
        id: edu.institution.id,
        name: edu.institution.name,
        website: edu.institution.website ?? undefined,
        logo: edu.institution.logo ?? undefined,
      },
      period: {
        start: new Date(edu.startDate),
        end: new Date(edu.endDate),
      },
      description: edu.description,
    }));

    const projects: Project[] = cv.projects.map((proj) => ({
      title: proj.title,
      description: proj.description,
      link: proj.link ?? undefined,
      comingSoon: proj.comingSoon ?? undefined,
    }));

    return {
      username: cv.username,
      fullName: cv.fullName,
      title: cv.title,
      avatar: cv.avatar ?? undefined,
      about: cv.about,
      contact: {
        phone: cv.phone ?? undefined,
        email: cv.email,
        location: cv.location ?? undefined,
      },
      technologies: cv.technologies.map((t) => t.name),
      languages: cv.languages.map((l) => l.name),
      skills: cv.skills.map((s) => s.name),
      workExperience,
      education,
      projects,
      personalValues: cv.personalValues.map((v) => v.value),
    };
  }
}

export const cvService = new CVService();

// Per-request deduplication: multiple server components/generateMetadata
// calling this with the same args within one request share one DB query.
export const getCVByUsername = cache(
  async (username: string, showContractors: boolean = true): Promise<CVData | null> =>
    cvService.getCVByUsername(username, showContractors)
);
