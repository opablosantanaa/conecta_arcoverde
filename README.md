# 🌐 Conecta Arcoverde

**Plataforma de Empregabilidade da Prefeitura Municipal de Arcoverde-PE**

O **Conecta Arcoverde** é uma plataforma web completa desenvolvida para conectar talentos locais a oportunidades de emprego, promovendo a empregabilidade no município. O sistema conta com portais dedicados para Candidatos, Empresas, ACA (Agência de Cidadania e Assistência), Prefeitura e Administradores, garantindo isolamento de dados, validação de currículos e transparência nos processos seletivos.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 17** & **Spring Boot 3.2**
- **Spring Security** com autenticação stateless via **JWT**
- **Spring Data JPA** & **Hibernate**
- **MySQL 8.0** (via Docker)
- **Bean Validation** (Jakarta Validation)
- **SpringDoc OpenAPI** (Swagger UI)
- **Lombok** & **ModelMapper**

### Frontend
- **React 18** com **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Design system responsivo com Dark/Light mode)
- **Zustand** (Gerenciamento de estado)
- **TanStack Query** (React Query para cache e requisições)
- **React Router DOM v6** (Rotas protegidas por perfil)
- **React Hook Form** & **Zod** (Formulários e validação)
- **Lucide React** (Ícones minimalistas)

### Infraestrutura
- **Docker** & **Docker Compose**

---

## 🚀 Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
- [Java JDK 17+](https://adoptium.net/)
- [Maven 3.9+](https://maven.apache.org/)
- [Node.js 18+ e npm](https://nodejs.org/)
- [Docker e Docker Compose](https://www.docker.com/)

---

## ⚙️ Configuração e Execução

### 1. Configurar Variáveis de Ambiente
O projeto utiliza um arquivo `.env` para proteger credenciais e configurações sensíveis.
Na pasta `backend/`, copie o arquivo de exemplo e preencha com seus dados:

```bash
cd backend
cp .env.example .env
```
*Edite o arquivo `.env` e defina a senha do banco de dados, segredos JWT e configurações de e-mail.*

### 2. Iniciar o Banco de Dados (Docker)
Utilize o script PowerShell fornecido ou o comando padrão do Docker Compose:

```powershell
# Via script (carrega o .env automaticamente)
.\docker-up.ps1

# Ou via Docker Compose tradicional
docker compose up -d
```
*Aguarde cerca de 15 segundos para o MySQL inicializar completamente.*

### 3. Iniciar o Backend (Spring Boot)
Em um novo terminal, na pasta `backend/`:

```powershell
# Via script (recomendado)
.\run.ps1

# Ou via Maven
mvn spring-boot:run
```
O backend estará disponível em `http://localhost:8080`.

### 4. Iniciar o Frontend (React)
Em um novo terminal, na pasta `frontend/`:

```bash
npm install
npm run dev
```
O frontend estará disponível em `http://localhost:3000`.

---

## 👤 Usuários Padrão (Seed)

Na primeira execução, o sistema cria automaticamente os seguintes usuários para teste:

| Perfil | E-mail | Senha | Acesso |
|---|---|---|---|
| **ADMIN** | `admin@conecta.arcoverde` | `Admin@123` | Gestão de usuários, permissões e auditoria |
| **PREFEITURA** | `prefeitura@conecta.arcoverde` | `Prefeitura@123` | Indicadores, cursos e gestão de vagas |
| **ACA** | `aca@conecta.arcoverde` | `Aca@1234` | Validação de currículos, cadastro assistido |
| **EMPRESA** | `empresa@conecta.arcoverde` | `Empresa@123` | Publicação de vagas e gestão de candidatos |

*Candidatos são criados dinamicamente através da tela de registro (`/registro`).*

---

## 📁 Estrutura do Projeto

```text
conecta_arcoverde/
├── backend/                    # API REST (Spring Boot)
│   ├── .env                    # Variáveis de ambiente (NÃO versionar)
│   ├── .env.example            # Template de variáveis
│   ├── run.ps1                 # Script de inicialização
│   ├── pom.xml                 # Dependências Maven
│   └── src/main/java/...       # Código-fonte Java
├── frontend/                   # SPA (React + Vite)
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis (UI, Layout)
│   │   ├── pages/              # Páginas divididas por portal (public, candidato, empresa, aca, prefeitura, admin)
│   │   ├── hooks/              # Hooks customizados (useTheme, useNotificacoes)
│   │   ├── store/              # Zustand (AuthStore)
│   │   └── lib/                # Utilitários e helpers
│   └── package.json
├── docker-compose.yml          # Orquestração do MySQL
├── docker-up.ps1               # Script de inicialização do Docker
└── README.md                   # Este arquivo
```

---

## 📖 Documentação da API

A API está totalmente documentada com **Swagger / OpenAPI**.
Com o backend rodando, acesse:
- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🎯 Principais Funcionalidades (MVP)

- **Portal Público:** Busca de vagas e cursos com filtros avançados.
- **Portal do Candidato:** Editor de currículo dinâmico, submissão para validação e acompanhamento de candidaturas.
- **Portal da Empresa:** Gestão de vagas com **Regra das 12h** (edição direta), visualização isolada de candidatos e solicitação de alterações.
- **Portal ACA/Prefeitura:** Moderação de vagas, validação de currículos, cadastro assistido (LGPD) e gestão de cursos.
- **Portal Admin:** CRUD de usuários, matriz de permissões granulares e logs de auditoria.
- **Sistema de Notificações:** Alertas de currículo validado, novas vagas por área de interesse e novas candidaturas.
- **Segurança:** JWT, BCrypt, CORS configurado, proteção de rotas por perfil (RBAC) e isolamento de dados entre empresas.

---

## 🧪 Testes

Para executar a suíte de testes unitários do backend:

```bash
cd backend
mvn test
```

---

## 🔒 Segurança e LGPD

O projeto foi desenhado seguindo as diretrizes da **Lei Geral de Proteção de Dados (LGPD)**:
- Senhas armazenadas com hash **BCrypt**.
- Credenciais e segredos isolados em variáveis de ambiente (`.env`).
- Logs de auditoria para rastreamento de ações administrativas.
- Ocultação opcional de nomes de empresas em vagas públicas.
- Consentimento explícito no cadastro e direito ao esquecimento (desativação de conta).

---

## ✍️ Autoria

Projeto criado por **Pablo Santana** ([@opablosantanaa](https://github.com/opablosantanaa)) em colaboração com a **AESA-CESA** para apresentação à **Prefeitura de Arcoverde**.

---

## 📄 Licença e Contato

Projeto desenvolvido para a **Prefeitura Municipal de Arcoverde-PE**.
Para dúvidas, suporte ou questões relacionadas à privacidade de dados, entre em contato com a equipe de TI ou o Encarregado de Dados (DPO) do município.
