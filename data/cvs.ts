import { CVData } from "@/types/cv";

// TODO: Move this data to a database in the future
// This is temporary data storage for CV information

export interface CVSearchResult {
  username: string;
  fullName: string;
  title: string;
  avatar?: string;
}

export const cvDatabase: Record<string, CVData> = {
  humexxx: {
    username: "humexxx",
    fullName: "Jason Hume González",
    title: "Software Engineer",
    avatar: "/avatars/humexxx.jpg",
    about:
      "I am a person with very good logical, creative and self-taught potential. The union of these characteristics have helped me become a software developer since this area is always in constant change. I am also a parent with great aptitudes for good teamwork.",
    contact: {
      phone: "+1 (809) 393 381",
      email: "jahumexx@gmail.com",
      address: "Santa Cecilia de San Francisco de Heredia",
    },
    technologies: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Angular",
      "Node.js",
      "HTML",
      "CSS",
      "jQuery",
      "Material UI",
      "Ionic",
      "React Native",
      "Redux",
      "Firebase",
      "NetCA",
      "Java",
      "SQL",
      "NoSQL",
      "Postgres",
      "Docker",
      "Kendo UI",
      "LINQ",
      "C#",
      ".NET",
      "Entity Framework",
      "REST APIs",
    ],
    languages: ["Spanish", "English"],
    skills: [
      "Creative problem solving",
      "Ability to work under pressure",
      "Self-taught person",
      "Excellent teamwork",
    ],
    workExperience: [
      {
        title: "Senior Frontend Software Developer",
        company: "Intell",
        period: {
          start: "May 2022",
          end: "Jan 2024",
        },
        description: "Led frontend development using modern web technologies",
        responsibilities: [
          "Migrated an Angular-written project to Vue",
          "Created reusable components and tested them in isolation using Storybook",
          "Incorporated various services, such as Google Maps, to enhance the user experience",
        ],
      },
      {
        title: "Senior Fullstack Developer",
        company: "Slac",
        period: {
          start: "Mar 2021",
          end: "May 2022",
        },
        description: "Full-stack development with focus on policy management systems",
        responsibilities: [
          "Extended the VueJS web app of administrative use, allowing the creation and management of policies",
          "Redesigned and expanded the project to enable clients and agents to view the performance of their policies over time",
          "Enhanced functionality when performing calculations based on the selected product in a policy",
          "Developed an intuitive and user-friendly interface for both administrative users and clients/agents",
          "Utilized Java in the backend to implement controls, validations, and APIs for accurate calculations. Additionally, developed middleware to handle cross-cutting concerns like authentication and logging, ensuring a robust and scalable system architecture",
          "Implemented additional controls and validations to ensure the accuracy of the calculations performed",
        ],
      },
      {
        title: "Senior Software Developer",
        company: "PayPal",
        period: {
          start: "Mar 2020",
          end: "Mar 2021",
        },
        description: "Provided technical support and enhanced PayPal's help software",
        responsibilities: [
          "Provided support for the PayPal help software",
          "Added functionalities to enhance the user experience",
          "Monitored the software's performance to ensure smooth operation",
          "Resolved issues and errors reported by users to improve software stability",
        ],
      },
      {
        title: "Fullstack Developer",
        company: "Freelancer",
        period: {
          start: "Mar 2018",
          end: "Mar 2020",
        },
        description: "Developed diverse web applications for various clients",
        responsibilities: [
          "Developed applications for vehicle fleet monitoring and management",
          "Created applications using React with TypeScript, Node, HTML, JS, CSS and Firebase",
          "Built group management systems for medical offices",
          "Migrated legacy applications using React, Java, and Postgres",
          "Developed hybrid applications with React Native and cloud functions",
          "Created applications using Firebase combined with various frontend technologies",
          "Worked with Angular, Material UI, and multiple REST APIs for scraping data",
          "Developed cross-browser compatible applications using Chrome and Firefox extensions",
          "Built employee management applications using Angular, jQuery, and various SQL databases",
        ],
      },
      {
        title: ".Net Developer C#",
        company: "Intel (Praxis)",
        period: {
          start: "Nov 2016",
          end: "Feb 2018",
        },
        description: "Backend development for internal Intel projects",
        responsibilities: [
          "Developed internal projects using Angular.js, Kendo UI, jQuery, .Net C#, LINQ, EF, SQL Server, HTML, JS, and CSS",
          "Applied logical techniques to parse PDF files with specific patterns",
          "Developed multiple storage procedures for data optimization",
        ],
      },
      {
        title: "Junior Software Developer",
        company: "Abacus (6 months internship + 3 months employment)",
        period: {
          start: "Jan 2016",
          end: "Sept 2016",
        },
        description: "Started professional career developing macros and aircraft maintenance systems",
        responsibilities: [
          "Developed macros with Visual Basic for automating various functionalities",
          "Maintained and updated several drivers for aircraft use",
          "Created database queries for information requests using SQL",
          "Built web application modules using JavaScript, CSS and HTML",
        ],
      },
    ],
    projects: [
      {
        title: "Educational YouTube Channel Development",
        description:
          "I started creating a YouTube channel to show and document my learning process with new technologies from scratch. I feel that even though it is a great way to offer valuable content to the community, I learn a lot each way. I create clones of famous applications and websites and document them so that I can measure my progress when it comes to outlining and preparing the creation of an application. I feel that it is a clever way of putting the acquired knowledge into practice.",
        link: "https://www.youtube.com/channel/UCVPyJ_B7yjbdsPsWkVhd4wg",
      },
      {
        title: "EAs Development for Trading",
        description:
          "I have developed 2 robots for trading and although they have not been successful, when developing them I tested many logical skills. I am currently developing a third in my spare time.",
      },
    ],
    personalValues: [
      'You will never hear a "I can\'t do that" from me - I believe that in terms of the engineering area (especially to the software development) we refer there is a world of infinite knowledge so it is impossible to know everything, however, the important thing is not knowing the solution to any problem, knowing this and even better putting it into practice, I have the kind of thinking that whatever the problem that presents itself to me, I will not stop looking for the solution.',
      "Excellent teamwork - Although I have worked as a freelancer for a long time, I have developed many projects with different people and I know how to create a good working environment. I can also identify when someone is losing motivation and I can turn the situation around to be able to achieve the goal together as planned. I feel that it is a very important quality because most of the time you have to make decisions together.",
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
  // For now, always return humexxx as top result
  // In the future, this could be based on popularity, recent views, etc.
  return [
    {
      username: "humexxx",
      fullName: "Jason Hume González",
      title: "Software Engineer",
      avatar: "/avatars/humexxx.jpg",
    },
  ];
}
