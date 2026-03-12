"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIProvider {
    constructor(apiKey) {
        this.openai = new openai_1.default({
            apiKey: apiKey || process.env.OPENAI_API_KEY
        });
    }
    async analyzeCandidate(input) {
        const prompt = `
      Você é um especialista em recrutamento. Análise o grau de compatibilidade entre a vaga e o candidato.
      
      Vaga:
      - Descrição: ${input.jobDescription}
      - Requisitos: ${input.jobRequirements.join(', ')}

      Candidato:
      - Habilidades: ${input.candidateProfile.skills.join(', ')}
      - Experiência: ${input.candidateProfile.experience}
      - Formação: ${input.candidateProfile.education}

      Retorne APENAS um JSON válido seguindo a estrutura:
      {
        "compatibility_score": number (0 a 100),
        "strengths": string[],
        "weaknesses": string[],
        "recommended_roles": string[]
      }
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });
            const content = response.choices[0].message.content;
            if (!content)
                throw new Error("No content received from OpenAI");
            return JSON.parse(content);
        }
        catch (error) {
            console.error("Error analyzing candidate with OpenAI:", error);
            throw new Error("Failed to analyze candidate");
        }
    }
    async extractDataFromCV(text) {
        const prompt = `
          Você é um assistente especializado em recrutamento e seleção. 
          Sua tarefa é ler o texto bruto extraído de um currículo e estruturar as informações importantes em um formato JSON específico.

          Texto do Currículo:
          ---
          ${text}
          ---

          Extraia as informações e retorne APENAS um JSON com o seguinte formato:
          {
            "name": "nome completo",
            "skills": ["habilidade 1", "habilidade 2"],
            "experience": "resumo conciso da experiência profissional",
            "education": "resumo conciso da formação acadêmica",
            "birthDate": "DD/MM/AAAA ou vazio",
            "cpf": "apenas números ou vazio",
            "phone2": "telefone secundário ou vazio",
            "gender": "gênero ou vazio",
            "address": {
              "street": "logradouro",
              "number": "número",
              "complement": "complemento",
              "neighborhood": "bairro",
              "city": "cidade",
              "state": "UF",
              "zipCode": "CEP apenas números"
            },
            "academicInfo": [
              { "institution": "Nome", "degree": "Curso/Grau", "year": "Ano" }
            ],
            "professionalInfo": [
              { "company": "Empresa", "role": "Cargo", "period": "Período", "description": "Resumo das atividades" }
            ],
            "socialLinks": {
              "linkedin": "url ou vazio",
              "github": "url ou vazio"
            },
            "portfolioUrl": "url ou vazio"
          }
        `;
        try {
            const response = await this.openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });
            const content = response.choices[0].message.content;
            if (!content)
                throw new Error("No content received from OpenAI");
            return JSON.parse(content);
        }
        catch (error) {
            console.error("Error extracting data from CV with OpenAI:", error);
            throw new Error("Failed to extract data from CV");
        }
    }
    async suggestSkills(description) {
        const prompt = `
      Você é um recrutador técnico. Com base na descrição da vaga abaixo, extraia ou sugira uma lista de até 10 competências (skills) fundamentais.
      Retorne APENAS um JSON com o seguinte formato: { "skills": ["skill1", "skill2"] }

      Descrição:
      ${description}
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });
            const content = response.choices[0].message.content;
            if (!content)
                return [];
            const parsed = JSON.parse(content);
            return parsed.skills || [];
        }
        catch (error) {
            console.error("OpenAI Suggest Skills Error:", error);
            return [];
        }
    }
    async improveJobDescription(description) {
        const prompt = `
      Você é um redator especializado em RH. Melhore a descrição de vaga abaixo para torná-la mais profissional e atraente. 
      Use Markdown. Retorne APENAS o texto da descrição melhorada.

      Descrição Original:
      ${description}
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }]
            });
            const text = response.choices[0].message.content;
            return text ? text.trim() : description;
        }
        catch (error) {
            console.error("OpenAI Improve Description Error:", error);
            return description;
        }
    }
    async generateQuestions(description, requirements) {
        const prompt = `
      Você é um recrutador técnico experiente. Com base na descrição da vaga e competências abaixo, crie de 3 a 5 perguntas estratégicas para filtrar os candidatos.
      
      Descrição: ${description}
      Competências: ${requirements.join(', ')}

      Para cada pergunta, defina:
      1. label: O enunciado da pergunta.
      2. type: O tipo de resposta ('text', 'number' ou 'boolean').
      3. expectedAnswer: Uma breve descrição em texto do que o RH espera como resposta ideal para que a IA possa julgar depois.

      Retorne APENAS um JSON no formato:
      { "questions": [ { "label": "...", "type": "...", "expectedAnswer": "..." } ] }
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });
            const content = response.choices[0].message.content;
            if (!content)
                return [];
            const parsed = JSON.parse(content);
            return (parsed.questions || []).map((q) => ({
                id: Math.random().toString(36).substr(2, 9),
                ...q
            }));
        }
        catch (error) {
            console.error("OpenAI Generate Questions Error:", error);
            return [];
        }
    }
    async summarizeProfile(profileData) {
        const prompt = `
          Você é um recrutador executivo. Crie três resumos profissionais distintos e impactantes para o candidato abaixo, em Português do Brasil.
          1. "general": Um resumo geral focado em competências técnicas e trajetória (máximo 400 caracteres).
          2. "experience": Um resumo focado exclusivamente na trajetória profissional e conquistas (máximo 400 caracteres).
          3. "academic": Um resumo focado na formação, certificações e base teórica (máximo 400 caracteres).

          Dados:
          - Habilidades: ${profileData.skills?.join(', ') || 'N/A'}
          - Resumo Experiência: ${profileData.experience || 'N/A'}
          - Resumo Educação: ${profileData.education || 'N/A'}
          - Detalhes Profissionais: ${JSON.stringify(profileData.professionalInfo || [])}
          - Detalhes Acadêmicos: ${JSON.stringify(profileData.academicInfo || [])}

          Retorne APENAS um JSON válido no formato:
          {
            "general": "...",
            "experience": "...",
            "academic": "..."
          }
        `;
        try {
            const response = await this.openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });
            const content = response.choices[0].message.content;
            if (!content)
                throw new Error("Empty response from OpenAI");
            const parsed = JSON.parse(content);
            return {
                general: parsed.general || "",
                experience: parsed.experience || "",
                academic: parsed.academic || ""
            };
        }
        catch (error) {
            console.error("OpenAI Summarize Profile Error:", error);
            return { general: "", experience: "", academic: "" };
        }
    }
}
exports.OpenAIProvider = OpenAIProvider;
