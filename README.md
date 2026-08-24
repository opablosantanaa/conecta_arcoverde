# 🌐 Conecta Arcoverde

**Plataforma de Empregabilidade da Prefeitura Municipal de Arcoverde-PE**

[![Deploy Status](https://img.shields.io/badge/Deploy-Live-success)](https://conecta-arco.vercel.app/)
[![React](https://img.shields.io/badge/React-18-blue)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)]()

O **Conecta Arcoverde** é uma plataforma web completa desenvolvida para conectar talentos locais a oportunidades de emprego, promovendo a empregabilidade no município de Arcoverde-PE. O sistema conta com portais dedicados para Candidatos, Empresas, ACA (Agência de Cidadania e Assistência), Prefeitura e Administradores, garantindo isolamento de dados, validação de currículos e transparência nos processos seletivos.

### 🔗 Links
- **🌍 Site em Produção:** [https://conecta-arco.vercel.app/](https://conecta-arco.vercel.app/)
- **📚 API Backend:** Hospedada no Render
- **🎨 Frontend:** Hospedado no Vercel

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 17** & **Spring Boot 3.2**
- **Spring Security** com autenticação stateless via **JWT**
- **Spring Data JPA** & **Hibernate 6**
- **MySQL 8.0** (via Docker ou MySQL Cloud)
- **Bean Validation** (Jakarta Validation)
- **SpringDoc OpenAPI** (Swagger UI)
- **Lombok** (Redução de boilerplate)

### Frontend
- **React 18** com **TypeScript 5**
- **Vite** (Build tool ultrarrápido)
- **Tailwind CSS** (Design system responsivo com Dark/Light mode)
- **Zustand** (Gerenciamento de estado leve)
- **TanStack Query** (React Query para cache e requisições)
- **React Router DOM v6** (Rotas protegidas por perfil)
- **React Hook Form** & **Zod** (Formulários e validação tipada)
- **Lucide React** (Ícones minimalistas)
- **Axios** (Cliente HTTP)

### Infraestrutura
- **Docker** & **Docker Compose** (Desenvolvimento local)
- **Vercel** (Deploy do Frontend)
- **Render** (Deploy do Backend e Banco de Dados)

---

## 🚀 Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:
- [Java JDK 17+](https://adoptium.net/)
- [Maven 3.9+](https://maven.apache.org/)
- [Node.js 18+ e npm](https://nodejs.org/)
- [Docker e Docker Compose](https://www.docker.com/)

---

## ⚙️ Configuração e Execução Local

### 1. Clonar o Repositório

```bash
git clone https://github.com/opablosantanaa/conecta_arcoverde.git
cd conecta_arcoverde
```

### 2. Configurar Variáveis de Ambiente

Na pasta `backend/`, copie o arquivo de exemplo:

```bash
cd backend
cp .env.example .env
```

### 3. Iniciar o Banco de Dados (Docker)

```powershell
.\docker-up.ps1
# Ou: docker compose up -d
```

### 4. Iniciar o Backend

```powershell
.\run.ps1
# Ou: mvn spring-boot:run
```
Backend disponível em `http://localhost:8080`

### 5. Iniciar o Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend disponível em `http://localhost:3000`

---

## 👤 Usuários Padrão (Seed)

| Perfil | E-mail | Senha | Acesso |
|---|---|---|---|
| **ADMIN** | `admin@conecta.arcoverde` | `Admin@123` | Gestão de usuários, permissões e auditoria |
| **PREFEITURA** | `prefeitura@conecta.arcoverde` | `Prefeitura@123` | Indicadores, cursos e gestão de vagas |
| **ACA** | `aca@conecta.arcoverde` | `Aca@1234` | Validação de currículos, cadastro assistido |
| **EMPRESA** | `empresa@conecta.arcoverde` | `Empresa@123` | Publicação de vagas e gestão de candidatos |

---

## 🎯 Principais Funcionalidades

### 🌍 Portal Público
- Busca de vagas e cursos com filtros avançados
- Visualização de detalhes de vagas
- Cadastro e login de candidatos

### 👤 Portal do Candidato
- **Editor de currículo dinâmico** com validação de campos obrigatórios
- **Submissão para validação** pela ACA/Prefeitura
- **Acompanhamento de candidaturas** em tempo real
- Inscrição em cursos livres
- Notificações de vagas por área de interesse

### 🏢 Portal da Empresa
- **Gestão de vagas** com **Regra das 12h** (edição direta em até 12h após criação)
- **Criação de empresas** diretamente no cadastro de vagas
- Visualização isolada de candidatos por vaga
- Solicitação de alterações em candidaturas

### 🏛️ Portal ACA/Prefeitura
- **Moderação de vagas** (aprovar/rejeitar com motivo)
- **Validação de currículos** de candidatos
- **Cadastro assistido** (LGPD) para cidadãos sem acesso digital
- Gestão de cursos livres

### 🔧 Portal Admin
- CRUD completo de usuários
- **Matriz de permissões granulares** (RBAC)
- Logs de auditoria de todas as ações

---

## 📖 Documentação da API

Com o backend rodando, acesse:
- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🚀 Deploy em Produção

### Frontend (Vercel)
- **URL:** [https://conecta-arco.vercel.app/](https://conecta-arco.vercel.app/)

### Backend (Render)
- Dockerfile configurado para build de produção
- Health check configurado em `/health`

---

## 🔒 Segurança e LGPD

- Senhas armazenadas com hash **BCrypt**
- Credenciais isoladas em variáveis de ambiente
- **Logs de auditoria** para rastreamento
- **Ocultação opcional** de nomes de empresas
- **Consentimento explícito** no cadastro
- **Isolamento de dados** entre empresas

---

## ✍️ Autoria

Projeto criado por **Pablo Santana** ([@opablosantanaa](https://github.com/opablosantanaa)) em colaboração com a **AESA-CESA** para apresentação à **Prefeitura de Arcoverde**.