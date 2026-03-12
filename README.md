# NexHire - Plataforma Inteligente de Recrutamento

O **NexHire** (anteriormente RhLegal) é um sistema moderno de *Applicant Tracking System* (ATS) focado em simplificar o recrutamento tanto para o lado das empresas (B2B) quanto para os candidatos (B2C). A plataforma se destaca pelo uso de Inteligência Artificial para extrair dados de currículos e gerar resumos inteligentes de perfis.

## 🚀 Principais Funcionalidades

- **Múltiplos Perfis:** Autenticação segregada para Empresas (anunciantes de vagas) e Candidatos.
- **Integração com IA (Gemini/OpenAI):** Extração automatizada de dados de currículos em PDF e sumarização inteligente do perfil do candidato.
- **Gestão de Vagas:** Empresas podem criar vagas, gerenciar aplicações e aprovar/reprovar candidatos.
- **Módulo de Aplicação:** Candidatos podem buscar e aplicar para vagas abertas, gerenciando o status de cada processo.
- **Notificações por Email:** Disparo automatizado (via Nodemailer) de e-mails de boas-vindas e atualizações de processos seletivos.
- **Painel de Bordo (Dashboard):** Visualização fácil das métricas chave de recrutamento.

---

## 💻 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS (v4), Zustand (Gerenciamento de Estado), React Router v7.
- **Backend:** Node.js (Express), TypeScript, Prisma ORM.
- **Banco de Dados:** PostgreSQL 15.
- **Serviços de IA:** `@google/generative-ai` (Gemini) e `openai`.
- **Infraestrutura:** Docker e Docker Compose (Produção).

---

## 🛠️ Como Executar o Projeto Localmente (Desenvolvimento)

Siga os passos abaixo para rodar a aplicação em seu ambiente local sem os containers de produção:

### 1. Pré-requisitos
- Node.js (v20+)
- PostgreSQL rodando localmente (ou use a imagem fornecida no Docker Compose)

### 2. Configurando o Banco de Dados
Na raiz do projeto, você pode subir apenas o banco de dados via Docker:
```bash
docker-compose up -d db
```

### 3. Configurando o Backend
Navegue até o diretório `backend` e instale as dependências:
```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend` vazando-se no modelo. (Use o arquivo `backend/.env.example` como guia).

Execute as migrações do Prisma e inicie o servidor de desenvolvimento:
```bash
npx prisma generate
npx prisma db push
npm run dev
```
> O backend rodará na porta **3000**.

### 4. Configurando o Frontend
Abra um novo terminal, navegue até a pasta `frontend` e instale as dependências:
```bash
cd frontend
npm install
```

Crie o arquivo `.env.local` contendo a rota da API (veja o arquivo `frontend/.env.example` para referência). Em seguida, inicie o Vite:
```bash
npm run dev
```
> O frontend rodará no seu navegador, usualmente em `http://localhost:5173/`.

---

## 🐳 Deploy para Produção (Docker)

O projeto está totalmente conteinerizado e pronto para servidores de produção usando `docker-compose`. A arquitetura empacota o Frontend com um servidor Nginx.

### Passo a Passo

1. **Configuração de Variáveis de Ambiente:**
   Certifique-se de preencher corretamente *todos os arquivos*. O arquivo `docker-compose.yml` lerá o arquivo `backend/.env`.

2. **Build & Up:**
   Em um servidor Linux com o Docker engine instalado, vá até a raiz do projeto e execute:
   ```bash
   docker-compose up -d --build
   ```

3. **Como funciona a Arquitetura Docker:**
   - **Banco de Dados:** Container PostgreSQL exposto na `5432`, com dados persistidos no Docker volume `pgdata`.
   - **Backend:** Construído a partir do repositório, roda a transpilação do TypeScript `npm run build` e é servido na porta `3000`.
   - **Frontend:** Usa build Multi-Stage para gerar a pasta estática `/dist` com Vite (passando em tempo de build a `VITE_API_URL`) e hospedando o resultado via Nginx. A porta servida é a `80`.

### Reconstruindo o App
Se houver alguma modificação de código no Repositório, force a construção novamente:
```bash
docker-compose up -d --build --force-recreate
```

---

*© 2026 Desenvolvido pela Softnexus para o NexHire.*
