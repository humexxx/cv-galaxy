import { db } from "./index";
import {
  users,
  companies,
  institutions,
  workExperience,
  workResponsibilities,
  education,
  projects,
  technologies,
  languages,
  skills,
  personalValues,
} from "./schema";
import { cvDatabase, companiesData, institutionsData } from "./seed-data.js";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // 1. Seed companies
    console.log("📦 Seeding companies...");
    const companyMap = new Map<string, string>(); // old id -> new uuid
    
    for (const [key, company] of Object.entries(companiesData)) {
      const [inserted] = await db
        .insert(companies)
        .values({
          name: company.name,
          website: company.website,
          logo: company.logo,
        })
        .returning();
      
      companyMap.set(key, inserted.id);
      console.log(`  ✓ ${company.name}`);
    }

    // 2. Seed institutions
    console.log("🏫 Seeding institutions...");
    const institutionMap = new Map<string, string>(); // old id -> new uuid
    
    for (const [key, institution] of Object.entries(institutionsData)) {
      const [inserted] = await db
        .insert(institutions)
        .values({
          name: institution.name,
          website: institution.website,
          logo: institution.logo,
        })
        .returning();
      
      institutionMap.set(key, inserted.id);
      console.log(`  ✓ ${institution.name}`);
    }

    // 3. Seed users and their CV data
    for (const cv of Object.values(cvDatabase)) {
      console.log(`\n👤 Seeding user: ${cv.fullName}...`);
      
      // Insert user
      const [user] = await db
        .insert(users)
        .values({
          supabaseUserId: `seed-${cv.username}`,
          username: cv.username,
          email: cv.contact.email,
          fullName: cv.fullName,
          title: cv.title,
          avatar: cv.avatar,
          about: cv.about,
          phone: cv.contact.phone,
          location: cv.contact.location,
        })
        .returning();

      console.log(`  ✓ User created`);

      // Insert technologies
      for (let i = 0; i < cv.technologies.length; i++) {
        await db.insert(technologies).values({
          userId: user.id,
          name: cv.technologies[i],
          sortOrder: i,
        });
      }
      console.log(`  ✓ ${cv.technologies.length} technologies`);

      // Insert languages
      for (let i = 0; i < cv.languages.length; i++) {
        await db.insert(languages).values({
          userId: user.id,
          name: cv.languages[i],
          sortOrder: i,
        });
      }
      console.log(`  ✓ ${cv.languages.length} languages`);

      // Insert skills
      for (let i = 0; i < cv.skills.length; i++) {
        await db.insert(skills).values({
          userId: user.id,
          name: cv.skills[i],
          sortOrder: i,
        });
      }
      console.log(`  ✓ ${cv.skills.length} skills`);

      // Insert personal values
      for (let i = 0; i < cv.personalValues.length; i++) {
        await db.insert(personalValues).values({
          userId: user.id,
          value: cv.personalValues[i],
          sortOrder: i,
        });
      }
      console.log(`  ✓ ${cv.personalValues.length} personal values`);

      // Insert work experience
      for (let i = 0; i < cv.workExperience.length; i++) {
        const work = cv.workExperience[i];
        const companyId = companyMap.get(work.company.id);
        const contractorId = work.contractor ? companyMap.get(work.contractor.id) : null;

        if (!companyId) {
          console.error(`  ✗ Company not found: ${work.company.id}`);
          continue;
        }

        const endDate = work.period.end === "Present" ? null : work.period.end.toISOString().split("T")[0];

        const [workExp] = await db
          .insert(workExperience)
          .values({
            userId: user.id,
            title: work.title,
            companyId: companyId,
            contractorId: contractorId,
            startDate: work.period.start.toISOString().split("T")[0],
            endDate: endDate,
            description: work.description,
            sortOrder: i,
          })
          .returning();

        // Insert responsibilities
        for (let j = 0; j < work.responsibilities.length; j++) {
          await db.insert(workResponsibilities).values({
            workExperienceId: workExp.id,
            responsibility: work.responsibilities[j],
            sortOrder: j,
          });
        }
      }
      console.log(`  ✓ ${cv.workExperience.length} work experiences`);

      // Insert education
      for (let i = 0; i < cv.education.length; i++) {
        const edu = cv.education[i];
        const institutionId = institutionMap.get(edu.institution.id);

        if (!institutionId) {
          console.error(`  ✗ Institution not found: ${edu.institution.id}`);
          continue;
        }

        await db.insert(education).values({
          userId: user.id,
          degree: edu.degree,
          institutionId: institutionId,
          startDate: edu.period.start.toISOString().split("T")[0],
          endDate: edu.period.end.toISOString().split("T")[0],
          description: edu.description,
          sortOrder: i,
        });
      }
      console.log(`  ✓ ${cv.education.length} education entries`);

      // Insert projects
      for (let i = 0; i < cv.projects.length; i++) {
        const project = cv.projects[i];
        await db.insert(projects).values({
          userId: user.id,
          title: project.title,
          description: project.description,
          link: project.link,
          comingSoon: project.comingSoon || false,
          sortOrder: i,
        });
      }
      console.log(`  ✓ ${cv.projects.length} projects`);
    }

    console.log("\n✅ Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log("✨ Seed process finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seed process failed:", error);
      process.exit(1);
    });
}

export { seed };
