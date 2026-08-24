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

## 📦 Módulos e Funcionalidades Detalhadas

Além dos portais básicos, o sistema conta com diversos módulos avançados no backend para garantir transparência, acessibilidade e conformidade com a LGPD:

### 👥 Perfis de Acesso
- **Candidato:** Portal dedicado para cidadãos de Arcoverde criarem seus currículos, buscarem vagas, candidatarem-se a empregos, inscreverem-se em cursos de capacitação e acompanharem o status de suas candidaturas.
- **Empresa:** Painel para empresas locais publicarem vagas, gerenciarem as candidaturas recebidas, solicitarem validações e comunicarem-se com candidatos e a ACA.
- **ACA (Agência de Cidadania e Assistência):** Módulo focado em inclusão digital e assistencial. Permite o cadastro assistido de cidadãos que não possuem acesso à internet e validação de currículos.
- **Prefeitura:** Visão estratégica com indicadores macro do município, gestão de cursos de capacitação e acompanhamento geral do ecossistema de empregabilidade.
- **Administrador:** Controle total do sistema, incluindo logs de auditoria, gestão de permissões (ACL) e manutenção de usuários.

### ⚙️ Funcionalidades Transversais (Backend)
- **Autenticação e Recuperação de Senha:** Fluxo seguro de "Esqueci minha senha" e redefinição via e-mail, com retornos genéricos para evitar *User Enumeration* (em conformidade com a LGPD).
- **Sistema de Solicitações ACA:** Permite que candidatos solicitem alterações em seus cadastros ou currículos, passando por um fluxo de aprovação e resposta por parte dos agentes da ACA.
- **Histórico de Comunicação:** Rastreamento de todas as interações e mensagens trocadas entre candidatos, empresas e a plataforma durante os processos seletivos.
- **Painel de Indicadores:** Dashboard analítico exclusivo para a Prefeitura extrair dados estruturados sobre a geração de emprego e impacto social no município.
- **Auditoria de Ações:** Logs estruturados de todas as ações críticas de usuários administrativos, garantindo rastreabilidade e segurança.
- **Cadastro Assistido e Vagas da ACA:** Rotas dedicadas para que agentes da ACA possam cadastrar cidadãos presencialmente e vinculá-los a oportunidades de emprego específicas.

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
*Nota: Preencha o arquivo `.env` com as credenciais do seu banco de dados local, chaves JWT e configurações do servidor SMTP para envio de e-mails.*

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

> ⚠️ **Atenção por Segurança:** Para evitar a exposição de credenciais em repositórios públicos e evitar más práticas de segurança, **as senhas dos usuários padrão não são mais listadas neste documento**. 
> Caso esteja configurando o ambiente de desenvolvimento local, consulte o arquivo `DataSeeder.java` no backend para visualizar as senhas iniciais (que são criptografadas com BCrypt ao rodar o projeto), ou utilize o fluxo de "Esqueci minha senha" na tela de login para redefini-las através do seu e-mail.

| Perfil | E-mail Padrão | Função / Acesso |
|---|---|---|
| **ADMIN** | `admin@conecta.arcoverde` | Gestão de usuários, permissões e auditoria do sistema |
| **PREFEITURA** | `prefeitura@conecta.arcoverde` | Indicadores, cursos de capacitação e gestão estratégica |
| **ACA** | `aca@conecta.arcoverde` | Validação de currículos, cadastro assistido e análise de solicitações |
| **EMPRESA** | `empresa@conecta.arcoverde` | Publicação de vagas e gestão de candidatos |
| **CANDIDATO** | *(Criado via registro)* | Busca de vagas, candidaturas, cursos e perfil profissional |

---

## 🔒 Segurança e LGPD

- Senhas armazenadas com hash **BCrypt**
- Credenciais isoladas em variáveis de ambiente (`.env`)
- **Logs de auditoria** para rastreamento de ações críticas
- **Ocultação opcional** de nomes de empresas em processos seletivos
- **Consentimento explícito** no cadastro de candidatos
- **Isolamento de dados** rigoroso entre empresas concorrentes
- Prevenção contra *User Enumeration* no fluxo de recuperação de senha