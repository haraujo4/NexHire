import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export class CVParsingService {
    async parsePDF(buffer: Buffer): Promise<string> {
        try {
            console.log('[DEBUG] Parsing PDF, buffer size:', buffer.length);

            // pdf-parse v2.4.5+ uses a class based API
            const parser = new PDFParse({
                data: buffer
            });

            const data = await parser.getText();

            if (!data || !data.text) {
                console.warn('[DEBUG] PDF parsed but no text found');
                return '';
            }

            console.log('[DEBUG] PDF Parsed successfully, text length:', data.text.length);
            return data.text;
        } catch (error: any) {
            console.error('[CRITICAL] Error parsing PDF:', error.message);
            console.error('[CRITICAL] Error stack:', error.stack);
            throw new Error(`Falha ao processar arquivo PDF: ${error.message}`);
        }
    }

    async parseDOCX(buffer: Buffer): Promise<string> {
        try {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        } catch (error) {
            console.error('Error parsing DOCX:', error);
            throw new Error('Falha ao processar arquivo DOCX.');
        }
    }

    async extractText(buffer: Buffer, mimetype: string): Promise<string> {
        if (mimetype === 'application/pdf') {
            return this.parsePDF(buffer);
        } else if (
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimetype === 'application/msword'
        ) {
            return this.parseDOCX(buffer);
        } else {
            throw new Error('Formato de arquivo não suportado. Use PDF ou DOCX.');
        }
    }
}
