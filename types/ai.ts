export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: "openai";
}

export interface AIModelsResponse {
  models: AIModel[];
}
