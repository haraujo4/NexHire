"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractCVDataUseCase = void 0;
class ExtractCVDataUseCase {
    constructor(aiProvider, cvParsingService) {
        this.aiProvider = aiProvider;
        this.cvParsingService = cvParsingService;
    }
    async execute(fileBuffer, mimetype) {
        // 1. Extract text from the file
        const text = await this.cvParsingService.extractText(fileBuffer, mimetype);
        if (!text || text.trim().length === 0) {
            throw new Error('Não foi possível extrair texto do currículo enviado.');
        }
        // 2. Extract structured data using AI
        const extractedData = await this.aiProvider.extractDataFromCV(text);
        return extractedData;
    }
}
exports.ExtractCVDataUseCase = ExtractCVDataUseCase;
