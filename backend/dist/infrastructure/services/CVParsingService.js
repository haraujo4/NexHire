"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CVParsingService = void 0;
const pdf_parse_1 = require("pdf-parse");
const mammoth_1 = __importDefault(require("mammoth"));
class CVParsingService {
    async parsePDF(buffer) {
        try {
            console.log('[DEBUG] Parsing PDF, buffer size:', buffer.length);
            // pdf-parse v2.4.5+ uses a class based API
            const parser = new pdf_parse_1.PDFParse({
                data: buffer
            });
            const data = await parser.getText();
            if (!data || !data.text) {
                console.warn('[DEBUG] PDF parsed but no text found');
                return '';
            }
            console.log('[DEBUG] PDF Parsed successfully, text length:', data.text.length);
            return data.text;
        }
        catch (error) {
            console.error('[CRITICAL] Error parsing PDF:', error.message);
            console.error('[CRITICAL] Error stack:', error.stack);
            throw new Error(`Falha ao processar arquivo PDF: ${error.message}`);
        }
    }
    async parseDOCX(buffer) {
        try {
            const result = await mammoth_1.default.extractRawText({ buffer });
            return result.value;
        }
        catch (error) {
            console.error('Error parsing DOCX:', error);
            throw new Error('Falha ao processar arquivo DOCX.');
        }
    }
    async extractText(buffer, mimetype) {
        if (mimetype === 'application/pdf') {
            return this.parsePDF(buffer);
        }
        else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimetype === 'application/msword') {
            return this.parseDOCX(buffer);
        }
        else {
            throw new Error('Formato de arquivo não suportado. Use PDF ou DOCX.');
        }
    }
}
exports.CVParsingService = CVParsingService;
