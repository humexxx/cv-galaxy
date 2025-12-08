import { pgTable, text, timestamp, uuid, date, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table (main CV profile)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  title: text("title").notNull(),
  avatar: text("avatar"),
  about: text("about").notNull(),
  phone: text("phone"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Companies table (for work experience and contractors)
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  website: text("website"),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Institutions table (for education)
export const institutions = pgTable("institutions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  website: text("website"),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Work Experience table
export const workExperience = pgTable("work_experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id),
  contractorId: uuid("contractor_id").references(() => companies.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"), // null means "Present"
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Work Experience Responsibilities (many-to-one with work_experience)
export const workResponsibilities = pgTable("work_responsibilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  workExperienceId: uuid("work_experience_id").notNull().references(() => workExperience.id, { onDelete: "cascade" }),
  responsibility: text("responsibility").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Education table
export const education = pgTable("education", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  degree: text("degree").notNull(),
  institutionId: uuid("institution_id").notNull().references(() => institutions.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link"),
  comingSoon: boolean("coming_soon").default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Technologies table (for user's tech stack)
export const technologies = pgTable("technologies", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Languages table (spoken languages)
export const languages = pgTable("languages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Skills table
export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Personal Values table
export const personalValues = pgTable("personal_values", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  workExperience: many(workExperience),
  education: many(education),
  projects: many(projects),
  technologies: many(technologies),
  languages: many(languages),
  skills: many(skills),
  personalValues: many(personalValues),
}));

export const workExperienceRelations = relations(workExperience, ({ one, many }) => ({
  user: one(users, {
    fields: [workExperience.userId],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [workExperience.companyId],
    references: [companies.id],
  }),
  contractor: one(companies, {
    fields: [workExperience.contractorId],
    references: [companies.id],
  }),
  responsibilities: many(workResponsibilities),
}));

export const workResponsibilitiesRelations = relations(workResponsibilities, ({ one }) => ({
  workExperience: one(workExperience, {
    fields: [workResponsibilities.workExperienceId],
    references: [workExperience.id],
  }),
}));

export const educationRelations = relations(education, ({ one }) => ({
  user: one(users, {
    fields: [education.userId],
    references: [users.id],
  }),
  institution: one(institutions, {
    fields: [education.institutionId],
    references: [institutions.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export const technologiesRelations = relations(technologies, ({ one }) => ({
  user: one(users, {
    fields: [technologies.userId],
    references: [users.id],
  }),
}));

export const languagesRelations = relations(languages, ({ one }) => ({
  user: one(users, {
    fields: [languages.userId],
    references: [users.id],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
}));

export const personalValuesRelations = relations(personalValues, ({ one }) => ({
  user: one(users, {
    fields: [personalValues.userId],
    references: [users.id],
  }),
}));
