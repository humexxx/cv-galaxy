import type { InferSelectModel } from "drizzle-orm";
import type { users } from "@/db/schema";

export type DbUser = InferSelectModel<typeof users>;

export type DbCompany = { 
  id: string; 
  name: string; 
  website: string | null; 
  logo: string | null;
};

export type DbInstitution = { 
  id: string; 
  name: string; 
  website: string | null; 
  logo: string | null;
};

export type DbResponsibility = { 
  responsibility: string;
};

export type DbWorkExperience = {
  title: string;
  startDate: string;
  endDate: string | null;
  description: string;
  company: DbCompany;
  contractor: DbCompany | null;
  responsibilities: DbResponsibility[];
};

export type DbEducation = {
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
  institution: DbInstitution;
};

export type DbProject = {
  title: string;
  description: string;
  link: string | null;
  comingSoon: boolean | null;
};

export type DbTechnology = { name: string };
export type DbLanguage = { name: string };
export type DbSkill = { name: string };
export type DbPersonalValue = { value: string };

export type DbCVWithRelations = DbUser & {
  workExperience: DbWorkExperience[];
  education: DbEducation[];
  projects: DbProject[];
  technologies: DbTechnology[];
  languages: DbLanguage[];
  skills: DbSkill[];
  personalValues: DbPersonalValue[];
};
