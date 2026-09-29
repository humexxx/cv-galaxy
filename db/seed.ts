import { db } from "./index";
import {
  users,
  companies,
  institutions,
  workExperience,
  education,
  projects,
  technologies,
  languages,
  skills,
  personalValues,
} from "./schema";
import { cvDatabase, companiesData, institutionsData } from "./seed-data.js";
import { toDateOnlyString } from "@/lib/utils/date";

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

        // seed-data builds these with `new Date(2026, 2)` — local midnight. Going
        // through toISOString() would shift them into the previous month west of
        // Greenwich, so read the calendar fields directly instead.
        const endDate = work.period.end === "Present" ? null : toDateOnlyString(work.period.end);

        await db.insert(workExperience).values({
          userId: user.id,
          title: work.title,
          companyId: companyId,
          contractorId: contractorId,
          startDate: toDateOnlyString(work.period.start),
          endDate: endDate,
          description: work.description,
          responsibilitiesHtml: work.responsibilitiesHtml,
          sortOrder: i,
        });
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
          startDate: toDateOnlyString(edu.period.start),
          endDate: toDateOnlyString(edu.period.end),
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
