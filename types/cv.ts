export interface WorkExperience {
  title: string;
  company: string;
  period: {
    start: string;
    end: string;
  };
  description: string;
  responsibilities: string[];
}

export interface Project {
  title: string;
  description: string;
  link?: string;
}

export interface ContactInfo {
  phone?: string;
  email: string;
  address?: string;
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
  projects: Project[];
  personalValues: string[];
}
