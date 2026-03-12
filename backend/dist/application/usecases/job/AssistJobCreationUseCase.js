"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistJobCreationUseCase = void 0;
class AssistJobCreationUseCase {
    constructor(aiProvider) {
        this.aiProvider = aiProvider;
    }
    async suggestSkills(description) {
        if (!description || description.trim().length < 10)
            return [];
        return this.aiProvider.suggestSkills(description);
    }
    async improveDescription(description) {
        if (!description || description.trim().length < 10)
            return description;
        return this.aiProvider.improveJobDescription(description);
    }
    async generateQuestions(description, requirements) {
        if (!description || description.trim().length < 10)
            return [];
        return this.aiProvider.generateQuestions(description, requirements);
    }
}
exports.AssistJobCreationUseCase = AssistJobCreationUseCase;
