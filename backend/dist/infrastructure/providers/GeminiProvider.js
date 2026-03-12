"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
class GeminiProvider {
    constructor(apiKey) {
        this.apiKey = (apiKey || process.env.GEMINI_API_KEY || "").trim();
        this.modelName = (process.env.GEMINI_MODEL || "gemini-1.5-flash").trim();
        if (!this.apiKey) {
            throw new Error("GEMINI_API_KEY is not defined");
        }
        console.log(`[Gemini] Inicializando Provedor com o modelo: ${this.modelName}`);
    }
    async analyzeCandidate(input) {
        const prompt = `
      Você é um especialista em recrutamento de alta performance. Analise a compatibilidade entre a vaga e o candidato.
      
      Vaga:
      - Título/Descrição: ${input.jobDescription}
      - Requisitos: ${input.jobRequirements.join(', ')}

      Candidato:
      - Habilidades: ${input.candidateProfile.skills.join(', ')}
      - Resumo de Experiência: ${input.candidateProfile.experience}
      - Resumo de Formação: ${input.candidateProfile.education}
      - Detalhes Acadêmicos: ${JSON.stringify(input.candidateProfile.academicInfo || {})}
      - Detalhes Profissionais: ${JSON.stringify(input.candidateProfile.professionalInfo || {})}
      
      Respostas ao Formulário Customizado da Vaga (SE HOUVER):
      ${JSON.stringify(input.formResponses || {})}

      INSTRUÇÕES IMPORTANTES:
      1. Avalie as respostas do formulário customizado. Se o RH definiu critérios eliminatórios (implícitos ou explícitos no contexto da vaga) e as respostas do candidato forem FLAGRANTEMENTE incompatíveis, defina "incompatible_by_form" como true.
      2. O "compatibility_score" deve refletir a média de aderência técnica e comportamental (0 a 100).

      Retorne APENAS um JSON válido nesta estrutura:
      {
        "compatibility_score": number,
        "strengths": string[],
        "weaknesses": string[],
        "recommended_roles": string[],
        "incompatible_by_form": boolean
      }
    `;
        // We use v1 instead of v1beta to ensure compatibility with all model types
        const url = `https://generativelanguage.googleapis.com/v1/models/${this.modelName}:generateContent?key=${this.apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Gemini API Error details:", JSON.stringify(errorData));
                throw new Error(`Gemini API returned ${response.status}: ${errorData.error?.message || response.statusText}`);
            }
            const data = await response.json();
            let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) {
                throw new Error("Gemini returned an empty response. Check if model supports generateContent.");
            }
            // Cleanup in case of markdown wrapping
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);
        }
        catch (error) {
            console.error("Gemini AI Analysis Error:", error.message);
            throw new Error(`Falha na análise da IA: ${error.message}`);
        }
    }
    async extractDataFromCV(text) {
        const prompt = `
      Você é um assistente de recrutamento especializado em extração de dados. 
      Analise o texto extraído de um currículo abaixo e transforme-o em um JSON estruturado.
      
      Currículo:
      ${text}

      INSTRUÇÕES:
      0. Extraia o nome completo do candidato (name).
      1. Extraia habilidades (skills) como uma lista de strings.
      2. Resuma a experiência geral e a formação acadêmica em parágrafos curtos.
      3. Extraia o histórico acadêmico detalhado (academicInfo) com instituição, curso (degree) e ano de conclusão.
      4. Extraia o histórico profissional detalhado (professionalInfo) com empresa, cargo (role), período e uma breve descrição.
      5. Procure por links de redes sociais (LinkedIn, GitHub) e URLs de portfolio.
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
        const url = `https://generativelanguage.googleapis.com/v1/models/${this.modelName}:generateContent?key=${this.apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Gemini API returned ${response.status}: ${errorData.error?.message || response.statusText}`);
            }
            const data = await response.json();
            let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!responseText) {
                throw new Error("Gemini returned an empty response.");
            }
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(responseText);
        }
        catch (error) {
            console.error("Gemini CV Extraction Error:", error.message);
            throw new Error(`Falha na extração de dados do currículo: ${error.message}`);
        }
    }
    async suggestSkills(description) {
        const prompt = `
          Você é um recrutador técnico. Com base na descrição da vaga abaixo, extraia ou sugira uma lista de até 10 competências (skills) fundamentais.
          Retorne APENAS um JSON com o seguinte formato: { "skills": ["skill1", "skill2"] }

          Descrição:
          ${description}
        `;
        const url = `https://generativelanguage.googleapis.com/v1/models/${this.modelName}:generateContent?key=${this.apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text)
                return [];
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(text);
            return parsed.skills || [];
        }
        catch (error) {
            console.error("Gemini Suggest Skills Error:", error);
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
        const url = `https://generativelanguage.googleapis.com/v1/models/${this.modelName}:generateContent?key=${this.apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            return text ? text.trim() : description;
        }
        catch (error) {
            console.error("Gemini Improve Description Error:", error);
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
        const url = `https://generativelanguage.googleapis.com/v1/models/${this.modelName}:generateContent?key=${this.apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text)
                return [];
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(text);
            return (parsed.questions || []).map((q) => ({
                id: Math.random().toString(36).substr(2, 9),
                ...q
            }));
        }
        catch (error) {
            console.error("Gemini Generate Questions Error:", error);
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
        const url = `https://generativelanguage.googleapis.com/v1/models/${this.modelName}:generateContent?key=${this.apiKey}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text)
                throw new Error("Empty response from AI");
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(text);
            return {
                general: parsed.general || "",
                experience: parsed.experience || "",
                academic: parsed.academic || ""
            };
        }
        catch (error) {
            console.error("Gemini Summarize Profile Error:", error);
            return { general: "", experience: "", academic: "" };
        }
    }
}
exports.GeminiProvider = GeminiProvider;
