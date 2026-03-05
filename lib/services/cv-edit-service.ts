import type { WorkExperienceUpdate, TechnologiesUpdate } from "@/schemas/cv";

export class CVEditService {
  static async updateWorkExperience(
    username: string,
    id: string,
    data: WorkExperienceUpdate
  ): Promise<void> {
    const response = await fetch(
      `/api/users/${encodeURIComponent(username)}/work-experience/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "Failed to update work experience");
    }
  }

  static async updateTechnologies(
    username: string,
    data: TechnologiesUpdate
  ): Promise<void> {
    const response = await fetch(
      `/api/users/${encodeURIComponent(username)}/technologies`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "Failed to update technologies");
    }
  }
}
