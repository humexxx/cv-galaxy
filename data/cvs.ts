import { CVData, Company } from "@/types/cv";

// TODO: Move this data to a database in the future
// This is temporary data storage for CV information

export interface CVSearchResult {
  username: string;
  fullName: string;
  title: string;
  avatar?: string;
}

// Company database
export const companies: Record<string, Company> = {
  intel: {
    id: "intel",
    name: "Intel",
    website: "https://www.intel.com/content/www/us/en/homepage.html",
    logo: "/images/companies/intel.svg",
  },
  paypal: {
    id: "paypal",
    name: "PayPal",
    website: "https://www.paypal.com/us/home",
    logo: "/images/companies/paypal.svg",
  },
  silac: {
    id: "silac",
    name: "Silac",
    website: "https://www.silacins.com/",
    logo: "/images/companies/silac.png",
  },
  tech9: {
    id: "tech9",
    name: "Tech9",
    website: "https://www.tech9.com/",
    logo: "/images/companies/tech9.svg",
  },
  altimetrik: {
    id: "altimetrik",
    name: "Altimetrik",
    website: "https://www.altimetrik.com/",
    logo: "/images/companies/altimetrik.png",
  },
  avionyx: {
    id: "avionyx",
    name: "Avionyx (6 months internship + 3 months employment)",
    website: "https://www.avionyx.com/",
    logo: "/images/companies/avionyx.avif",
  },
  justserve: {
    id: "justserve",
    name: "JustServe",
    website: "https://www.justserve.org/",
    logo: "/images/companies/justserve.svg",
  },
  prestige: {
    id: "prestige",
    name: "Prestige Financial Services",
    website: "https://www.myprestige.com/",
    logo: "/images/companies/prestige.svg",
  },
  praxis: {
    id: "praxis",
    name: "Praxis",
  },
  smash: {
    id: "smash",
    name: "Smash",
    website: "https://smashcr.com/",
    logo: "/images/companies/smash.png",
  },
  freelancer: {
    id: "freelancer",
    name: "Freelancer",
  },
  gigster: {
    id: "gigster",
    name: "Gigster",
    website: "https://gigster.com/",
    logo: "/images/companies/gigster.webp",
  }
};

export const cvDatabase: Record<string, CVData> = {
  jason_hume: {
    username: "jason_hume",
    fullName: "Jason Hume González",
    title: "Senior Fullstack Developer",
    avatar: "/images/users/jason_hume.jpg",
    about:
      "Senior Fullstack Developer with solid experience building web applications end-to-end using modern JavaScript/TypeScript frameworks and .NET backends. I combine strong logical thinking, creativity and a self-taught mindset to quickly understand complex domains and deliver high-quality, maintainable solutions. I actively leverage AI tools and integrate AI-powered features into applications to accelerate development and provide smarter user experiences. Comfortable working in distributed teams, collaborating with stakeholders, and taking ownership from design to production.",
    contact: {
      phone: "+506 8939 3381",
      email: "jahume92@gmail.com",
      location: "Heredia, Costa Rica",
    },
    technologies: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Storybook",
      "NestJS",
      "Angular",
      "Blazor",
      "Node.js",
      "HTML",
      "CSS",
      "React Native",
      "Ionic",
      "Firebase",
      "C#",
      ".NET",
      "Java",
      "SQL",
      "NoSQL",
      "Docker",
      "REST APIs",
    ],
    languages: ["Spanish (Native)", "English (Fluent)"],
    skills: [
      "Creative problem solving",
      "Ability to work under pressure",
      "Fast self-learner / self-taught mindset",
      "Excellent teamwork and communication",
      "Continuously learning and leveraging AI tools to improve productivity and code quality",
    ],
    workExperience: [
      {
        title: "Senior Frontend Developer / Tech Lead",
        company: companies.prestige,
        contractor: companies.tech9,
        period: {
          start: new Date(2024, 0), // Jan 2024
          end: "Present",
        },
        description:
          "Leading frontend development and technical direction for internal and external-facing applications.",
        responsibilities: [
          "Use Blazor and .NET to design and implement multiple internal tools and customer-facing applications.",
          "Integrate AI capabilities into internal applications to improve task assignment, triage and overall efficiency for internal agents.",
          "Maintain and evolve shared NuGet packages and service libraries to ensure scalability, reusability and consistent integrations across applications, including those built with Angular and other technologies.",
          "Quickly ramped up on Blazor within a few weeks and was promoted to tech lead for a key project, delivering on time while defining improved patterns for DTO usage, data mapping, error handling and view model design.",
        ],
      },
      {
        title: "Senior Fullstack Developer",
        company: companies.justserve,
        contractor: companies.tech9,
        period: {
          start: new Date(2022, 3), // Apr 2022
          end: new Date(2023, 6), // Jul 2023
        },
        description:
          "Migrated and enhanced a volunteer opportunity platform from AngularJS to Next.js with a focus on performance, SEO and user experience.",
        responsibilities: [
          "Implemented core features of the main landing and search pages so visitors could discover and filter volunteer opportunities.",
          "Used Next.js as the primary framework, leveraging server-side rendering and static generation to improve SEO and ensure rich link previews when projects were shared via chat or social media.",
          "Integrated Google Maps APIs to provide advanced location and area-based filters for volunteer projects.",
          "Contributed to internal shared libraries consumed by multiple projects, promoting consistency and reducing duplicated logic.",
        ],
      },
      {
        title: "Senior Frontend and Technical Lead",
        company: companies.intel,
        period: {
          start: new Date(2021, 3),
          end: new Date(2022, 3),
        },
        description:
          "Led a frontend team to build internal applications.",
        responsibilities: [
          "Migrated an Angular-based project to React to improve maintainability and developer experience.",
          "Created a lot of integration tests to ensure stability during the migration and future feature additions.",
          "Mentored junior developers and conducted code reviews to maintain high code quality standards.",
        ],
      },
      {
        title: "Senior Fullstack Developer",
        company: companies.silac,
        contractor: companies.smash,
        period: {
          start: new Date(2020, 3),
          end: new Date(2021, 3),
        },
        description:
          "Full-stack development focused on policy management systems.",
        responsibilities: [
          "Using React and Python/Django, developed features for an insurance policy management system.",
          "Created a component library with Storybook and React to ensure consistency across multiple applications.",
          "Redesigned and expanded the project to allow clients and agents to visualise policy performance over time.",
          "Enhanced calculations based on selected products within policies, ensuring accuracy and reliability.",
        ],
      },
      {
        title: "Senior Back-end Developer",
        company: companies.gigster,
        contractor: companies.altimetrik,
        period: {
          start: new Date(2019, 0),
          end: new Date(2020, 3),
        },
        description:
          "Develop the main mobile app and add integrations with 3rd party apps.",
        responsibilities: [
          "Using React Native and NestJS, created the main mobile application for requesting gigs and managing the payment process.",
          "Integrated multiple 3rd party services such as Stripe for payments, various integrations with already existing platforms and identity providers for authentication.",
          "Collaborated closely with UX designers to implement a smooth and intuitive user experience.",
          "Eventhough my focus was more in the backend using NestJS, I also helped the frontend team with complex features and bug fixes in the React Native app.",
        ],
      },
      {
        title: "Senior Software Developer",
        company: companies.paypal,
        contractor: companies.altimetrik,
        period: {
          start: new Date(2018, 6),
          end: new Date(2019, 6),
        },
        description:
          "Provided technical support and enhancements for PayPal helpcenter micro frontend.",
        responsibilities: [
          "Supported and maintained PayPal's help platform used by millions of customers.",
          "Implemented new features and UX improvements to enhance user experience.",
          "Monitored performance and resolved issues to keep the platform stable and responsive.",
          "Redesign of the Help Center's micro frontend using React, improving maintainability and user experience.",
        ],
      },
      {
        title: "Fullstack Developer",
        company: companies.freelancer,
        period: {
          start: new Date(2017, 10),
          end: new Date(2019, 0), 
        },
        description:
          "Delivered diverse web applications for various clients across different domains.",
        responsibilities: [
          "Developed web applications for vehicle fleet monitoring and management using React, Node.js and SQL/NoSQL databases.",
          "Built systems for medical office group management, integrating multiple REST APIs and third-party services.",
          "Created hybrid and mobile-ready solutions with React Native and Ionic.",
          "Closely coollaborated with a Intel manager to build some applications for international clients.",
        ],
      },
      {
        title: "AngularJs and .NET Developer",
        company: companies.intel,
        contractor: companies.praxis,
        period: {
          start: new Date(2016, 10), 
          end: new Date(2017, 10), 
        },
        description:
          "Backend and internal tool development for Intel projects.",
        responsibilities: [
          "Developed internal tools using AngularJS, .NET C#, SQL Server and related technologies.",
          "Implemented logical parsing of PDF files with specific patterns for data extraction.",
          "Used a lot of LINQ queries + Entity Framework + Kendo UI + JQuery for frontend components.",
        ],
      },
      {
        title: "Junior Software Developer",
        company: companies.avionyx,
        period: {
          start: new Date(2016, 0), 
          end: new Date(2016, 6), 
        },
        description:
          "Started professional career working on macros and aircraft maintenance systems.",
        responsibilities: [
          "Developed macros with Visual Basic to automate repetitive tasks.",
          "Maintained and updated drivers used in aircraft-related systems.",
          "Created queries and small web modules using JavaScript, CSS and HTML.",
        ],
      },
    ],
    projects: [
      {
        title: "Champions – Personal Growth & Financial Wellness Platform",
        description:
          "Designing and building a personal growth platform that helps users organize their finances, track investments, build healthy habits, plan workouts and maintain balanced entertainment. The product combines social sharing features with 3D animations and gamification elements to create a motivating and healthy environment for friends and communities. Built with React and Firebase, currently approaching beta release.",
        link: "TBD",
      },
      {
        title: "Trim Success – Business Performance Analytics",
        description:
          "Developing a private analytics tool to measure company performance using multiple financial and operational metrics. The system provides dashboards and visualisations to understand profitability and growth over time. Implemented with React and Firebase, designed for iterative refinement and potential onboarding of test accounts.",
        link: "TBD",
      },
      {
        title: "AI-Driven Micro Projects",
        description:
          "Building a series of small projects and experiments focused on integrating AI into everyday development workflows and applications. These include prototypes that use modern AI APIs and concepts to improve developer productivity, enhance user experiences and stay up to date with the latest trends in AI-driven software development.",
      },
    ],
    personalValues: [
      "Continuous learning mindset – I actively study new technologies, especially AI trends, to stay ahead of the curve and bring modern solutions to the teams I work with.",
      "Ownership and accountability – I treat the products I work on as if they were my own, taking responsibility from design through delivery and ongoing improvement.",
      "Team-first collaboration – I focus on clear communication, knowledge sharing and creating a positive environment where the whole team can succeed.",
      "Resilience and perseverance – I don't stop at the first obstacle; I iterate, test and refine until the solution is solid.",
    ],
  },
};

export function getCVByUsername(username: string): CVData | null {
  return cvDatabase[username.toLowerCase()] || null;
}

export function searchCVs(query: string): CVSearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const results: CVSearchResult[] = [];

  Object.values(cvDatabase).forEach((cv) => {
    if (
      cv.username.toLowerCase().includes(lowerQuery) ||
      cv.fullName.toLowerCase().includes(lowerQuery) ||
      cv.title.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        username: cv.username,
        fullName: cv.fullName,
        title: cv.title,
        avatar: cv.avatar,
      });
    }
  });

  return results;
}

export function getTopResults(): CVSearchResult[] {
  // For now, always return jason_hume as top result
  // In the future, this could be based on popularity, recent views, etc.
  const cv = cvDatabase.jason_hume;

  if (!cv) {
    return [];
  }

  return [
    {
      username: cv.username,
      fullName: cv.fullName,
      title: cv.title,
      avatar: cv.avatar,
    },
  ];
}
