import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or, ilike } from "drizzle-orm";
import type { CVData, WorkExperience, Education, Project } from "@/types/cv";
import type { DbCVWithRelations } from "@/types/db";

export class CVService {
  async getCVByUsername(username: string): Promise<CVData | null> {
    const cv = await db.query.users.findFirst({
      where: eq(users.username, username.toLowerCase()),
      with: {
        workExperience: {
          orderBy: (workExperience, { asc }) => [asc(workExperience.sortOrder)],
          with: {
            company: true,
            contractor: true,
            responsibilities: {
              orderBy: (responsibilities, { asc }) => [asc(responsibilities.sortOrder)],
            },
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
    });

    if (!cv) return null;

    // Transform database result to CVData format
    return this.transformToCVData(cv);
  }

  async searchCVs(query: string) {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = `%${query.toLowerCase()}%`;
    
    const results = await db.query.users.findMany({
      where: or(
        ilike(users.username, lowerQuery),
        ilike(users.fullName, lowerQuery),
        ilike(users.title, lowerQuery)
      ),
      columns: {
        username: true,
        fullName: true,
        title: true,
        avatar: true,
      },
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
      limit: 5,
    });

    return results.map(r => ({
      username: r.username,
      fullName: r.fullName,
      title: r.title,
      avatar: r.avatar ?? undefined,
    }));
  }

  private transformToCVData(cv: DbCVWithRelations): CVData {
    const workExperience: WorkExperience[] = cv.workExperience.map((work) => ({
      title: work.title,
      company: {
        id: work.company.id,
        name: work.company.name,
        website: work.company.website ?? undefined,
        logo: work.company.logo ?? undefined,
      },
      contractor: work.contractor
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
      responsibilities: work.responsibilities.map((r) => r.responsibility),
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
