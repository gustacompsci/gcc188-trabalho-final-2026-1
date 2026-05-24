# Decisões de Projeto — ExtraUFLA

## 1. Introdução

Este documento consolida as decisões de projeto da Sprint 4 (02/05/2026 a 09/05/2026) do ExtraUFLA, com foco em:
- princípios de projeto adotados;
- decomposição da solução em módulos;
- justificativas técnicas das principais escolhas;
- análise de alternativas;
- alinhamento entre requisitos funcionais (RF01-RF15) e estrutura da solução.

Escopo desta sprint: documentação arquitetural e de decisões. A implementação de novas funcionalidades permanece nas sprints seguintes.

## 2. Princípios de projeto adotados

| Princípio | Aplicação no ExtraUFLA |
|---|---|
| Coesão | Cada módulo NestJS possui responsabilidade clara: `DatabaseModule` centraliza schema e acesso a dados; `AuthModule` encapsula autenticação; `CoursesModule` centraliza lógica de cursos. |
| Baixo acoplamento | Apps (`apps/web`, `apps/server`) são unidades independentes; o frontend depende apenas da API HTTP; o backend expõe contratos via controllers NestJS. |
| SRP (Single Responsibility Principle) | `AuthModule` cuida apenas de autenticação; cada controller NestJS orquestra rotas de uma única feature; componentes de formulário no frontend concentram UI e validação da interação. |
| Separação de preocupações | Camada de apresentação (React), aplicação (NestJS/módulos/controllers), domínio (tipos e regras em schema/validação) e persistência (Drizzle + libSQL/SQLite). |
| Modularidade | Monorepo com workspaces (`apps/web`, `apps/server`) e pacotes reutilizáveis (`packages/ui`, `packages/config`) para evolução incremental e padronizada. |

## 3. Decomposição da solução em módulos

| Módulo | Responsabilidade principal | RFs atendidos (atual/plano) | Dependências diretas |
|---|---|---|---|
| `apps/web` | Interface do usuário, rotas, formulários, sessão no cliente, feedback visual | RF01, RF02, RF03, RF04, RF05, RF06, RF07, RF08, RF11, RF12, RF13, RF14, RF15 | `@extraufla/ui`, `better-auth`, `@tanstack/react-router`, `@tanstack/react-form` |
| `apps/server` | API NestJS, CORS, módulos de autenticação/banco/cursos, bootstrap e seeding de dados | RF01, RF02, RF03, RF04, RF05, RF06, RF09, RF10, RF11, RF14 | `@nestjs/core`, `@nestjs/platform-express`, `better-auth`, `drizzle-orm`, `@libsql/client`, `zod` |
| `apps/server` — `DatabaseModule` | Modelagem relacional, conexão e migrações (Drizzle + SQLite/libSQL) | RF01, RF02, RF03, RF04, RF05, RF06, RF09, RF10, RF12, RF13, RF14 | `drizzle-orm`, `@libsql/client` |
| `apps/server` — `AuthModule` | Configuração da autenticação (Better Auth), políticas de sessão e restrição de domínio | RF01, RF02, RF14 | `better-auth`, `DatabaseModule` |
| `apps/server` — `CoursesModule` | CRUD de cursos, seeding e endpoint `GET /courses` | RF03, RF04 | `DatabaseModule` |
| `packages/ui` | Biblioteca de componentes reutilizáveis e estilos compartilhados | RF01, RF02, RF03, RF04, RF05, RF06, RF07, RF08, RF12, RF13, RF15 | `react`, `tailwindcss`, `shadcn`, `sonner` |
| `packages/config` | Configuração base compartilhada de TypeScript/ambiente de build | Suporte transversal a todos os RFs (padronização de desenvolvimento) | `typescript` |

## 4. Decisões de projeto e justificativas

### Decisão 1 — Monorepo com workspaces
- Contexto: o projeto possui frontend, backend e bibliotecas compartilhadas evoluindo em paralelo.
- Decisão: adotar monorepo com workspaces (`apps/*` e `packages/*`) orquestrado por Turbo.
- Justificativa: melhora reuso de código, reduz divergência de versões e facilita rastreabilidade entre camadas.

### Decisão 2 — Arquitetura cliente-servidor em camadas
- Contexto: necessidade de separar responsabilidades e facilitar manutenção incremental.
- Decisão: organizar solução em apresentação, aplicação, domínio e persistência.
- Justificativa: aumenta clareza estrutural, reduz acoplamento e favorece testes/evolução por camada. O NestJS reforça essa separação com a divisão nativa em Module/Controller/Service.

### Decisão 3 — NestJS como framework backend
- Contexto: necessidade de um framework com arquitetura bem definida, suporte nativo a injeção de dependências, módulos e decoradores.
- Alternativas consideradas: Express (framework minimalista, sem convenções), Fastify + NestJS (adapter), Hono (moderno mas sem DI nativo).
- Decisão: NestJS sobre `@nestjs/platform-express`, pois oferece Module/Controller/Service nativos, DI integrada, e arquitetura explícita e diagramável.
- Consequências: os pacotes separados `packages/db`, `packages/auth` e `packages/env` foram absorvidos como módulos NestJS dentro de `apps/server`, simplificando o monorepo.

### Decisão 4 — SQLite/libSQL com Drizzle ORM
- Contexto: fase acadêmica com foco em simplicidade de setup e baixo custo operacional.
- Decisão: usar SQLite (via libSQL) com Drizzle para schema e migrações tipadas, encapsulado no `DatabaseModule` de `apps/server/src/database/`.
- Justificativa: bootstrap rápido, boa integração com TypeScript e menor sobrecarga para o estágio atual.

### Decisão 5 — Better Auth para autenticação
- Contexto: RF01/RF02 exigem cadastro/login/sessão com segurança e integração ao banco.
- Decisão: centralizar autenticação no `AuthModule` de `apps/server` com Better Auth + adapter Drizzle.
- Justificativa: acelera entrega de autenticação básica, padroniza sessão e permite políticas como domínio institucional.

### Decisão 6 — Frontend com React + TanStack Router
- Contexto: necessidade de SPA com rotas protegidas e fluxo de navegação claro.
- Decisão: usar React com TanStack Router no `apps/web`.
- Justificativa: rotas tipadas, hooks consistentes de navegação e controle simples de guardas de autenticação.

### Decisão 7 — UI com Tailwind + componentes compartilhados (`packages/ui`)
- Contexto: necessidade de consistência visual e velocidade de desenvolvimento.
- Decisão: adotar Tailwind e componentes reutilizáveis baseados em shadcn/ui.
- Justificativa: reduz duplicação de estilos, acelera montagem de telas e melhora padronização da interface.

### Decisão 8 — Validação de ambiente no bootstrap do NestJS
- Contexto: falhas de configuração de `.env` afetam execução e debugging.
- Decisão: validar variáveis no `ConfigModule` do NestJS com Zod no bootstrap de `apps/server`.
- Justificativa: fail-fast em configuração inválida, contratos explícitos e menor risco de erro em runtime.

### Decisão 9 — Padronização com Biome
- Contexto: equipe múltipla precisa reduzir ruído de estilo e inconsistências.
- Decisão: usar Biome (`bun run check`) para lint/format.
- Justificativa: aumenta consistência de código/documentação técnica e reduz custo de revisão.

## 5. Análise de alternativas

### 5.1 Banco de dados

| Alternativa | Vantagens | Desvantagens | Decisão no contexto atual |
|---|---|---|---|
| SQLite/libSQL | Setup simples, baixo custo, ótimo para MVP acadêmico, integração direta com Drizzle | Escalabilidade horizontal limitada e concorrência de escrita menor | Escolhida |
| PostgreSQL | Robustez, recursos avançados, melhor para alta concorrência | Maior complexidade operacional para fase atual | Pode ser migração futura |
| MongoDB | Flexibilidade de documentos e evolução de schema flexível | Menor aderência ao modelo relacional atual e regras transacionais mais complexas no domínio | Não escolhida para esta fase |

### 5.2 Frontend

| Alternativa | Vantagens | Desvantagens | Decisão no contexto atual |
|---|---|---|---|
| React + Vite | Ecossistema maduro, flexibilidade, integração forte com bibliotecas escolhidas | Requer decisões manuais de arquitetura | Escolhida |
| Next.js | SSR/SSG nativos e estrutura opinativa | Complexidade adicional não necessária para escopo atual | Não escolhida agora |
| Vue | Curva amigável e boa DX | Mudaria stack já adotada no projeto e na base atual | Não escolhida |

### 5.3 Arquitetura de deploy e organização

| Alternativa | Vantagens | Desvantagens | Decisão no contexto atual |
|---|---|---|---|
| Monolito modular (apps + pacotes) | Simples de operar, baixo overhead, boa velocidade de entrega | Escalabilidade de times/serviços menor que microsserviços | Escolhida |
| Microsserviços | Escala organizacional e técnica independente | Alta complexidade operacional (rede, observabilidade, deploy) para projeto acadêmico | Não escolhida |

### 5.4 ORM

| Alternativa | Vantagens | Desvantagens | Decisão no contexto atual |
|---|---|---|---|
| Drizzle | SQL tipado, leve, transparente, bom controle de schema | Ecossistema menor que concorrentes mais antigos | Escolhida |
| Prisma | Excelente DX e ecossistema amplo | Abstração maior e overhead adicional para o escopo atual | Não escolhida nesta fase |

### 5.5 Autenticação

| Alternativa | Vantagens | Desvantagens | Decisão no contexto atual |
|---|---|---|---|
| Better Auth | Boa integração com TypeScript, sessão/cookies e adapter Drizzle | Biblioteca ainda em evolução | Escolhida |
| Passport.js | Muito consolidada e extensível | Mais código de integração e boilerplate | Não escolhida |
| Auth.js | Forte em ecossistemas específicos | Ajuste adicional para stack atual e fluxo escolhido | Não escolhida |

## 6. Alinhamento requisitos x módulos

| RF | Módulo principal | Arquivo-chave | Status em 09/05/2026 |
|---|---|---|---|
| RF01 Cadastro de aluno | `AuthModule` (apps/server) + `apps/web` | `apps/server/src/auth/` / `apps/web/src/components/sign-up-form.tsx` | Implementado |
| RF02 Autenticação de usuário | `AuthModule` + `apps/web` + `apps/server` | `apps/web/src/components/sign-in-form.tsx` / `apps/server/src/main.ts` | Implementado |
| RF03 Seleção de curso no perfil | `DatabaseModule` (apps/server) + `apps/web` | `apps/server/src/database/schema/auth.ts` (campo `courseId`) | Parcial (modelo pronto) |
| RF04 Catálogo de organizações | `apps/web` + `apps/server` | `apps/web/src/routes/index.tsx` | Planejado |
| RF05 Detalhes da organização | `apps/web` + `apps/server` | `apps/web/src/routes/index.tsx` (rota base a evoluir) | Planejado |
| RF06 Processos seletivos e prazos | `apps/web` + `apps/server` | `docs/04_requisitos.md` (critérios e fluxo definidos) | Planejado |
| RF07 Filtro por tipo de organização | `apps/web` | `docs/04_requisitos.md` | Planejado |
| RF08 Busca no catálogo | `apps/web` | `docs/04_requisitos.md` | Planejado |
| RF09 Cadastro de organização pelo líder | `apps/server` + `apps/web` | `docs/04_requisitos.md` | Planejado |
| RF10 Criação de processo seletivo | `apps/server` + `apps/web` | `docs/04_requisitos.md` | Planejado |
| RF11 Notificação de prazos próximos | `apps/server` + `apps/web` | `docs/04_requisitos.md` | Planejado |
| RF12 Edição de perfil do aluno | `apps/web` + `DatabaseModule` (apps/server) | `apps/server/src/database/schema/auth.ts` | Planejado |
| RF13 Dashboard do aluno | `apps/web` | `apps/web/src/routes/dashboard.tsx` | Parcial (estrutura inicial) |
| RF14 Recuperação de senha | `AuthModule` (apps/server) + `apps/web` | `apps/server/src/auth/` | Planejado |
| RF15 Acesso público ao catálogo | `apps/web` | `apps/web/src/routes/index.tsx` | Parcial (acesso público inicial) |

## 7. Conclusão

As decisões de projeto da Sprint 4 estabelecem uma base técnica coerente com o estado atual do código e com os requisitos já definidos. O monorepo modular, a arquitetura em camadas e a padronização dos pacotes compartilhados reduzem risco de retrabalho e preparam a Sprint 5 para evolução funcional (catálogo, organizações, processos seletivos e refinamentos de perfil/dashboard) com maior previsibilidade.
