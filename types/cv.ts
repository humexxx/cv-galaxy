export interface Company {
  id: string;
  name: string;
  website?: string;
  logo?: string;
}

export interface WorkExperience {
  title: string;
  company: Company;
  contractor?: Company; // Contracting company if working as contractor
  period: {
    start: Date;
    end: Date | "Present";
  };
  description: string;
  responsibilities: string[];
}

export interface Project {
  title: string;
  description: string;
  link?: string;
  comingSoon?: boolean;
}

export interface Institution {
  id: string;
  name: string;
  website?: string;
  logo?: string;
}

export interface Education {
  degree: string;
  institution: Institution;
  period: {
    start: Date;
    end: Date;
  };
  description: string;
}

export interface ContactInfo {
  phone?: string;
  email: string;
  location?: string;
}

export interface CVData {
  username: string;
  fullName: string;
  title: string;
  avatar?: string;
  about: string;
  contact: ContactInfo;
  technologies: string[];
  languages: string[];
  skills: string[];
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  personalValues: string[];
}

export interface CVSearchResult {
  username: string;
  fullName: string;
  title: string;
  avatar?: string;
}
