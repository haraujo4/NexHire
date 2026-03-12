import { IAIProvider } from "../../../core/interfaces/IAIProvider";

export class AssistJobCreationUseCase {
    constructor(private readonly aiProvider: IAIProvider) { }

    async suggestSkills(description: string): Promise<string[]> {
        if (!description || description.trim().length < 10) return [];
        return this.aiProvider.suggestSkills(description);
    }

    async improveDescription(description: string): Promise<string> {
        if (!description || description.trim().length < 10) return description;
        return this.aiProvider.improveJobDescription(description);
    }

    async generateQuestions(description: string, requirements: string[]): Promise<any[]> {
        if (!description || description.trim().length < 10) return [];
        return this.aiProvider.generateQuestions(description, requirements);
    }
}
