# Modelagem — ExtraUFLA

> Produzido na Sprint 3 (25/04–02/05/2026). Diagramas em MermaidJS, versionados no repositório.

---

## 1. Visão geral

Esta documentação apresenta a modelagem do sistema ExtraUFLA, cobrindo:

- **Estrutura estática** — diagrama de classes/domínio com entidades, atributos e relacionamentos
- **Interação com o usuário** — diagrama de casos de uso com atores e funcionalidades
- **Comportamento dinâmico** — diagramas de sequência para os fluxos principais
- **Rastreabilidade** — vínculo entre requisitos (RF, RNF, RN) e os modelos produzidos

A modelagem foi derivada dos requisitos definidos na Sprint 2 (`04_requisitos.md`) e inclui funcionalidades ainda não implementadas (RF04, RF05, RF11) para garantir cobertura completa do escopo planejado.

---

## 2. Atores do sistema

| Ator | Descrição | Autenticação |
|------|-----------|-------------|
| **Visitante** | Qualquer pessoa que acessa a plataforma sem login | Nenhuma |
| **Aluno** | Estudante autenticado com e-mail @ufla.br | Obrigatória (RF01, RF02) |
| **Admin Organização** | Aluno que criou ou foi adicionado como administrador de uma organização | Obrigatória + papel de admin da org (RN03) |
| **Admin Plataforma** | Usuário com role `admin` no better-auth para gerenciar toda a plataforma | Obrigatória + role admin (RF05) |

Herança entre atores: Admin Plataforma ⊃ Admin Organização ⊃ Aluno ⊃ Visitante (cada nível herda as permissões do anterior).

---

## 3. Diagrama de Casos de Uso

```mermaid
flowchart LR
    subgraph ExtraUFLA["Sistema ExtraUFLA"]
        CU01["CU01 — Cadastrar-se"]
        CU02["CU02 — Autenticar-se"]
        CU03["CU03 — Navegar no catálogo"]
        CU04["CU04 — Filtrar organizações"]
        CU05["CU05 — Buscar organizações"]
        CU06["CU06 — Ver detalhes da organização"]
        CU07["CU07 — Ver processos seletivos"]
        CU08["CU08 — Cadastrar organização"]
        CU09["CU09 — Gerenciar admins da organização"]
        CU10["CU10 — Criar processo seletivo"]
        CU11["CU11 — Gerenciar plataforma"]
        CU12["CU12 — Editar perfil"]
        CU13["CU13 — Recuperar senha"]
    end

    Visitante(["Visitante"])
    Aluno(["Aluno"])
    AdminOrg(["Admin Organização"])
    AdminPlat(["Admin Plataforma"])

    Visitante --> CU01
    Visitante --> CU02
    Visitante --> CU03
    Visitante --> CU13

    Aluno --> CU03
    Aluno --> CU06
    Aluno --> CU08
    Aluno --> CU12

    AdminOrg --> CU09
    AdminOrg --> CU10

    AdminPlat --> CU11

    CU03 --- CU04
    CU03 --- CU05
    CU06 --- CU07
    CU02 -.->|extend| CU13
```

### Mapeamento casos de uso → requisitos

| Caso de uso | Requisito(s) | Descrição |
|-------------|-------------|-----------|
| CU01 | RF01 | Cadastro de aluno com e-mail @ufla.br |
| CU02 | RF02 | Login/logout com sessão persistida |
| CU03 | RF06, RF16 | Navegação pública no catálogo de organizações |
| CU04 | RF09 | Filtro por tipo (EJ, Extensão, Núcleo) |
| CU05 | RF10 | Busca textual por nome ou palavra-chave |
| CU06 | RF07 | Página de detalhes da organização |
| CU07 | RF08 | Visualização de processos seletivos abertos |
| CU08 | RF04 | Criação de organização (criador vira admin — RN03) |
| CU09 | RN03 | Adicionar/remover administradores da organização |
| CU10 | RF11 | Criação de processo seletivo pelo admin da org |
| CU11 | RF05 | Gerenciamento completo da plataforma (CRUD usuários, orgs, sessões) |
| CU12 | RF13 | Edição de perfil (nome, curso, avatar) |
| CU13 | RF15 | Recuperação de senha via link por e-mail |

### Observações

- **RF03** (seleção de curso) e **RF14** (dashboard) não aparecem como casos de uso separados: RF03 é parte do fluxo de CU12 (editar perfil) e RF14 é o redirecionamento pós-CU02.
- **RF12** (notificação de prazos) é um requisito transversal (background job) e não tem interação direta com ator — aparece na rastreabilidade como requisito não funcional relacionado.
- CU04 e CU05 são funcionalidades incluídas em CU03 (filtra e busca dentro do catálogo).
- CU07 é acessível a partir de CU06 (detalhes da organização mostram processos seletivos).

---

## 4. Diagrama de Classes / Domínio

```mermaid
classDiagram
    direction TB

    class User {
        +id: string
        +name: string
        +email: string
        +emailVerified: boolean
        +image: string
        +role: Role
        +courseId: string
        +createdAt: Date
        +updatedAt: Date
    }

    class Session {
        +id: string
        +token: string
        +expiresAt: Date
        +ipAddress: string
        +userAgent: string
        +createdAt: Date
        +updatedAt: Date
    }

    class Account {
        +id: string
        +providerId: string
        +accountId: string
        +password: string
        +createdAt: Date
        +updatedAt: Date
    }

    class Verification {
        +id: string
        +identifier: string
        +value: string
        +expiresAt: Date
        +createdAt: Date
        +updatedAt: Date
    }

    class Organization {
        +id: string
        +name: string
        +type: OrgType
        +description: string
        +area: string
        +contact: string
        +socialMedia: string
        +logo: string
        +status: OrgStatus
        +creatorId: string
        +createdAt: Date
        +updatedAt: Date
    }

    class OrganizationAdmin {
        +id: string
        +addedAt: Date
    }

    class SelectiveProcess {
        +id: string
        +title: string
        +description: string
        +vacancies: int
        +startDate: Date
        +endDate: Date
        +requirements: string
        +status: ProcessStatus
        +createdAt: Date
        +updatedAt: Date
    }

    class Course {
        +id: string
        +name: string
        +code: string
        +department: string
    }

    class Role {
        <<enumeration>>
        user
        admin
    }

    class OrgType {
        <<enumeration>>
        Empresa_Junior
        Projeto_Extensao
        Nucleo_Estudo
    }

    class OrgStatus {
        <<enumeration>>
        Ativa
        Inativa
    }

    class ProcessStatus {
        <<enumeration>>
        Aberto
        Encerrado
        Agendado
    }

    User "1" --> "*" Session : possui
    User "1" --> "*" Account : possui
    User "*" --> "0..1" Course : matriculado em
    User "1" --> "*" OrganizationAdmin : gerencia
    Organization "*" --> "1" User : criado por
    Organization "1" --> "*" OrganizationAdmin : possui
    Organization "1" --> "*" SelectiveProcess : oferece
    OrganizationAdmin "*" --> "1" Organization : administra
    OrganizationAdmin "*" --> "1" User : referência
    SelectiveProcess --> ProcessStatus : status
    Organization --> OrgType : tipo
    Organization --> OrgStatus : status
    User --> Role : role
```

### Descrição das entidades

| Entidade | Descrição | Requisitos relacionados |
|----------|-----------|------------------------|
| **User** | Usuário do sistema (aluno ou admin). E-mail institucional @ufla.br obrigatório (RN01) | RF01, RF02, RF04, RF05, RF13 |
| **Session** | Sessão ativa do usuário. Controlada pelo better-auth | RF02 |
| **Account** | Credenciais de autenticação (senha hasheada) | RF01, RF02, RNF03 |
| **Verification** | Tokens de verificação de e-mail e recuperação de senha | RF01, RF15 |
| **Organization** | Organização extracurricular (EJ, extensão ou núcleo). Classificação obrigatória por tipo (RN04) | RF04, RF06, RF07, RF09 |
| **OrganizationAdmin** | Entidade associativa entre User e Organization. Suporta múltiplos admins por org (RN03) | RF04, RN03 |
| **SelectiveProcess** | Processo seletivo com status automático derivado das datas (RN02) | RF08, RF11 |
| **Course** | Curso de graduação para personalização (RF03 — adiado) | RF03 |

---

## 5. Diagramas de Sequência

### 5.1 Cadastro e Autenticação (RF01 + RF02 + RN01)

```mermaid
sequenceDiagram
    actor Aluno
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Note over Aluno,DB: Cadastro (RF01)

    Aluno->>FE: Acessa página de cadastro
    FE->>Aluno: Exibe formulário (nome, email, senha)
    Aluno->>FE: Preenche e envia dados
    FE->>BE: POST /api/auth/sign-up {name, email, password}

    alt E-mail não é @ufla.br (RN01)
        BE->>FE: 400 "Utilize seu e-mail @ufla.br"
        FE->>Aluno: Exibe erro de validação
    else E-mail já cadastrado
        BE->>FE: 409 "E-mail já cadastrado"
        FE->>Aluno: Exibe "Faça login ou recupere sua senha"
    else Senha < 8 caracteres
        BE->>FE: 400 "Senha deve ter no mínimo 8 caracteres"
        FE->>Aluno: Exibe erro de validação
    else Dados válidos
        BE->>DB: INSERT User {name, email, password_hash}
        DB->>BE: User created
        BE->>FE: 200 Success
        FE->>Aluno: Redireciona para login
    end

    Note over Aluno,DB: Autenticação (RF02)

    Aluno->>FE: Insere credenciais no login
    FE->>BE: POST /api/auth/sign-in {email, password}
    BE->>DB: SELECT User WHERE email
    DB->>BE: User record

    alt Credenciais inválidas
        BE->>FE: 401 "Credenciais inválidas"
        FE->>Aluno: Exibe erro
    else Credenciais válidas
        BE->>BE: Verifica senha (bcrypt)
        BE->>DB: INSERT Session {userId, token, expiresAt}
        DB->>BE: Session created
        BE->>FE: 200 {session token, user}
        FE->>FE: Armazena cookie de sessão
        FE->>Aluno: Redireciona para /dashboard
    end
```

### 5.2 Criação de Organização e Gerenciamento de Admins (RF04 + RN03)

```mermaid
sequenceDiagram
    actor Aluno
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Note over Aluno,DB: Cadastro de Organização (RF04)

    Aluno->>FE: Acessa "Criar Organização"
    FE->>BE: GET /api/auth/session
    BE->>FE: {session valid, user}
    FE->>Aluno: Exibe formulário (nome, tipo, descrição, área, contato, logo)

    Aluno->>FE: Preenche e envia dados
    FE->>BE: POST /api/organizations {name, type, description, area, contact, logo}

    alt Nome já existe
        BE->>FE: 409 "Já existe organização com esse nome"
        FE->>Aluno: Exibe erro
    else Dados válidos
        BE->>DB: INSERT Organization {creatorId: currentUser, ...}
        DB->>BE: Organization created (orgId)
        BE->>DB: INSERT OrganizationAdmin {userId: currentUser, organizationId: orgId}
        DB->>BE: Admin assigned
        BE->>FE: 201 {organization}
        FE->>Aluno: Redireciona para página da organização
    end

    Note over Aluno,DB: Adicionar Admin à Organização (RN03)

    Aluno->>FE: Busca usuário por nome ou e-mail
    FE->>BE: GET /api/users?search=xxx
    BE->>DB: SELECT Users WHERE name LIKE OR email LIKE
    DB->>BE: Resultados
    BE->>FE: Lista de usuários
    FE->>Aluno: Exibe resultados

    Aluno->>FE: Seleciona usuário e confirma
    FE->>BE: POST /api/organizations/:id/admins {userId}

    BE->>BE: Verifica se requisitante é admin da org (RN03)

    alt Requisitante não é admin
        BE->>FE: 403 "Acesso negado"
        FE->>Aluno: Exibe erro
    else Usuário já é admin
        BE->>FE: 409 "Usuário já é administrador"
        FE->>Aluno: Exibe aviso
    else Dados válidos
        BE->>DB: INSERT OrganizationAdmin {userId, organizationId}
        DB->>BE: Success
        BE->>FE: 201
        FE->>Aluno: Exibe confirmação
    end
```

---

## 6. Vínculo entre requisitos e modelos

### 6.1 Requisitos Funcionais → Modelos

| Requisito | Caso(s) de Uso | Diagrama(s) | Classe(s) |
|-----------|---------------|-------------|-----------|
| RF01 | CU01 | Seq 5.1 | User, Account |
| RF02 | CU02 | Seq 5.1 | User, Session |
| RF03 | CU12 (parcial) | Classes | User, Course |
| RF04 | CU08 | Seq 5.2 | Organization, OrganizationAdmin |
| RF05 | CU11 | Classes | User (role=admin) |
| RF06 | CU03 | Casos de Uso | Organization |
| RF07 | CU06 | Casos de Uso | Organization |
| RF08 | CU07 | Casos de Uso | SelectiveProcess |
| RF09 | CU04 | Casos de Uso | Organization (OrgType) |
| RF10 | CU05 | Casos de Uso | Organization |
| RF11 | CU10 | Seq 5.2 | SelectiveProcess |
| RF12 | — | — | SelectiveProcess |
| RF13 | CU12 | Casos de Uso | User |
| RF14 | — | Classes | User, SelectiveProcess |
| RF15 | CU13 | Seq 5.1 | User, Verification |
| RF16 | CU03, CU06 | Casos de Uso | Organization |

### 6.2 Requisitos Não Funcionais → Aplicabilidade

| Requisito | Categoria | Aplicável a |
|-----------|-----------|-------------|
| RNF01 | Usabilidade | Todos os diagramas (responsividade afeta toda a UI) |
| RNF02 | Desempenho | Seq 5.1, 5.2 (LCP < 3s nos fluxos críticos) |
| RNF03 | Segurança | Seq 5.1 (bcrypt, JWT, HTTPS no fluxo de autenticação) |
| RNF04 | Acessibilidade | Casos de Uso (interação com todos os atores) |
| RNF05 | Compatibilidade | Transversal (todos os fluxos em browsers suportados) |
| RNF06 | Confiabilidade | Infraestrutura (deploy, CI/CD) |
| RNF07 | Usabilidade | Seq 5.1, 5.2 (feedback visual em loading, sucesso, erro) |

### 6.3 Regras de Negócio → Diagramas

| Regra | Diagrama(s) | Classe(s) | Descrição |
|-------|-------------|-----------|-----------|
| RN01 | Seq 5.1 | User | Validação @ufla.br no cadastro |
| RN02 | Classes | SelectiveProcess (ProcessStatus) | Status automático derivado das datas |
| RN03 | Seq 5.2, Classes | OrganizationAdmin | Múltiplos admins por organização |
| RN04 | Classes | Organization (OrgType) | Classificação obrigatória em um de três tipos |
| RN05 | Casos de Uso, Classes | User (role), OrganizationAdmin | Visibilidade de dados por papel |
