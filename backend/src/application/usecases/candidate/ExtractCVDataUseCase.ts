import { IAIProvider } from "../../../core/interfaces/IAIProvider";
import { CVParsingService } from "../../../infrastructure/services/CVParsingService";

export class ExtractCVDataUseCase {
    constructor(
        private aiProvider: IAIProvider,
        private cvParsingService: CVParsingService
    ) { }

    async execute(fileBuffer: Buffer, mimetype: string) {
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
