# Arquitetura do Sistema

A arquitetura segue princípios de engenharia modernos:

- SOLID
- Clean Architecture
- Dependency Injection
- Inversion of Control
- Separação de camadas

---

# Estrutura Geral

Frontend

React + Vite

↓

API

Node.js + Express

↓

Banco de dados

PostgreSQL

↓

Integração IA

OpenAI ou Gemini

---

# Camadas da Arquitetura

## Domain (Core)

Contém:

- Entidades
- Interfaces
- Regras de negócio puras

---

## Application

Contém:

- UseCases
- Services

---

## Infrastructure

Contém:

- Repositories
- Integrações externas
- Banco de dados
- Providers

---

## Interface Layer

Contém:

- Controllers
- Routes
- Middlewares

---

# Dependency Injection

Nenhum controller depende de implementação concreta.

Controllers dependem de interfaces.

Services dependem de interfaces de repositório.

Repositories implementam essas interfaces.

---

# Vantagens

- Testabilidade
- Baixo acoplamento
- Alta escalabilidade
- Fácil troca de tecnologia