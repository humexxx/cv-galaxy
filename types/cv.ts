export interface WorkExperience {
  title: string;
  company: string;
  companyWebsite?: string; // Company website URL
  contractor?: string; // Name of the contracting company if working as contractor
  contractorWebsite?: string; // Contractor company website URL
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
