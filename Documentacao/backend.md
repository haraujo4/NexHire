# Backend

Stack utilizada:

- Node.js
- Express
- TypeScript
- PostgreSQL

---

# Estrutura de Pastas

src/

core/
entities
interfaces

application/
services
usecases

infrastructure/
database
repositories
providers

interfaces/
controllers
routes
middlewares

config/

container/

---

# Exemplo de Entidade

Candidate

- id
- name
- email
- phone
- location
- salary_expectation
- created_at

---

# Exemplo de Interface de Repositório

```ts
export interface ICandidateRepository {
  findById(id: string): Promise<Candidate | null>
  create(data: CreateCandidateDTO): Promise<Candidate>
}


Exemplo de Service
export interface ICandidateService {
  register(data: RegisterCandidateDTO): Promise<Candidate>
}
Controllers

Controllers não possuem lógica de negócio.

Responsáveis apenas por:

receber requisição

validar

chamar service

retornar resposta

Segurança

JWT Authentication

bcrypt para senha

rate limiting

helmet

validação com Zod


---

# 📄 docs/frontend.md

```markdown
# Frontend

Stack:

- React
- Vite
- Zustand
- Zod
- Axios
- TailwindCSS

Arquitetura baseada em **feature folders**.

---

# Estrutura de Pastas

src/

features/
auth
jobs
candidates
applications

components/

hooks/

services/

store/

layouts/

pages/

---

# Gerenciamento de Estado

Utilizando Zustand.

Stores:

authStore
jobStore
candidateStore
applicationStore

---

# Validação

Formulários utilizam Zod.

Exemplo:

```ts
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})
API Client

Axios centralizado.

services/api.ts

Layouts

Aplicação terá dois layouts principais:

Layout Empresa

Layout Candidato


---

# 📄 docs/ai_system.md

```markdown
# Sistema de IA

A IA será usada para análise inicial de compatibilidade.

Não haverá modelo próprio inicialmente.

Integrações:

- OpenAI
- Gemini

---

# Configuração

Cada empresa poderá configurar:

OpenAI

- apiKey
- modelo

Gemini

- apiKey
- modelo

---

# Interface do Provider

```ts
export interface IAIProvider {
  analyzeCandidate(input: AIInput): Promise<AIResult>
}
Input da IA

Dados enviados:

descrição da vaga

requisitos

perfil do candidato

experiência

skills

formação

Output esperado
{
  "compatibility_score": 82,
  "strengths": [],
  "weaknesses": [],
  "recommended_roles": []
}
Objetivo da IA

Auxiliar o RH na triagem inicial.

A decisão final sempre será humana.


---

# 📄 docs/database.md

```markdown
# Banco de Dados

Banco utilizado:

PostgreSQL

---

# Estratégia Multi-Tenant

Cada registro possui:

company_id

---

# Tabelas principais

companies

- id
- name
- email
- password_hash

---

candidates

- id
- name
- email
- phone
- location

---

candidate_profiles

- id
- candidate_id
- skills
- education
- experience

---

jobs

- id
- company_id
- title
- description
- requirements
- salary_range
- location

---

applications

- id
- candidate_id
- job_id
- compatibility_score
- status

---

# Status da aplicação

- applied
- screening
- interview
- offer
- hired
- rejected